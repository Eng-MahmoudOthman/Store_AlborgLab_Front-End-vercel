import { useState, useEffect, useContext, useRef, Fragment } from "react";
import { UserContext } from "../../Context/UserContext.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import style from "./clientChatting.module.css";
import axios from "axios";

export default function ClientChatting() {
  const { receiver } = useParams();
  const {
    loggedUser,
    chats,
    setChats,
    currentPage,
    userToken,
    socket,
    usersOnline,
    setUsersOnline,
    role,
  } = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const closeBtnRef = useRef(null);

  const header = {
    token: `${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`,
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  const chatRoom = (userId) => {
    navigate(`/clientChat/${userId}`);
  };
  const handleClose = () => {
    if (closeBtnRef.current) {
      closeBtnRef.current.click();
    }
  };

  // Send message
  const sendMessage = () => {
    if (!message.trim()) return;
    // emit message to server; server will reply with receive_message + status computed
    socket.emit("private_message", { sender: loggedUser._id.toString(), receiver, message });
    setMessage("");
    scrollToBottom();
  };

  // typing events
  const typing = () => {
    if (!loggedUser) return;
    socket.emit("typing", { sender: loggedUser._id.toString(), receiver, user: loggedUser });
  };
  const stopTyping = () => {
    if (!loggedUser) return;
    socket.emit("stopTyping", { sender: loggedUser._id.toString(), receiver });
  };

  // Fetch messages (unchanged logic)
  const fetchMessages = async () => {
    if (!loggedUser) {
      console.log("User Not Exist");
      return;
    }
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/message/getLoggedUserMessages/${receiver}?limit=200&sort=-createdAt&page=${currentPage}`,
        { headers: header }
      );
      if (data.message === "success" && data.messages.length > 0) {
        const updatedChats = { ...chats };
        data.messages.forEach((msg) => {
          const otherUser =
            msg.sender._id.toString() === loggedUser._id.toString()
              ? msg.receiver._id.toString()
              : msg.sender._id.toString();
          updatedChats[otherUser] = [...(updatedChats[otherUser] || []), msg];
        });
        setChats(updatedChats);
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  // Socket events
  useEffect(() => {
    if (!loggedUser || !socket) return;

    // update_online
    socket.on("update_online", (users) => {
      setUsersOnline(users);
    });

    // receive_message -> add or replace by _id
    const handleReceive = (data) => {
      if (!data || !data._id) return;
      const otherUser =
        data.sender._id.toString() === loggedUser._id.toString()
          ? data.receiver._id.toString()
          : data.sender._id.toString();

      setChats((prev) => {
        const old = prev[otherUser] || [];
        const filtered = old.filter((m) => m._id.toString() !== data._id.toString());
        return { ...prev, [otherUser]: [...filtered, data] };
      });
      scrollToBottom();
    };
    socket.on("receive_message", handleReceive);

    // update_message_status => messages is an array
    const handleUpdateStatus = ({ userId, messages }) => {
      if (!messages || messages.length === 0) return;
      messages.forEach((m) => {
        const otherUser =
          m.sender._id.toString() === loggedUser._id.toString()
            ? m.receiver._id.toString()
            : m.sender._id.toString();

        setChats((prev) => ({
          ...prev,
          [otherUser]: (prev[otherUser] || []).map((msg) =>
            msg._id.toString() === m._id.toString() ? { ...msg, ...m } : msg
          ),
        }));
      });
    };
    socket.on("update_message_status", handleUpdateStatus);

    // message_seen_update -> single message object or array
    const handleMessageSeen = (data) => {
      const arr = Array.isArray(data) ? data : [data];
      arr.forEach((m) => {
        if (!m || !m._id) return;
        const otherUser =
          m.sender._id.toString() === loggedUser._id.toString()
            ? m.receiver._id.toString()
            : m.sender._id.toString();

        setChats((prev) => ({
          ...prev,
          [otherUser]: (prev[otherUser] || []).map((msg) =>
            msg._id.toString() === m._id.toString() ? { ...msg, ...m } : msg
          ),
        }));
      });
      scrollToBottom();
    };
    socket.on("message_seen_update", handleMessageSeen);

    // typing
    socket.on("userTyping", (data) => {
      if (data?.user?._id?.toString() === loggedUser._id.toString()) return;
      setTypingMessage(data?.message || "");
    });
    socket.on("stopUserTyping", () => setTypingMessage(""));

    // cleanup
    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("update_message_status", handleUpdateStatus);
      socket.off("message_seen_update", handleMessageSeen);
      socket.off("userTyping");
      socket.off("stopUserTyping");
      socket.off("update_online");
    };
  }, [loggedUser, socket]);

  // fetch messages on receiver change
  useEffect(() => {
    if (!receiver) return;
    fetchMessages();
    // join the chat room so server knows this socket is viewing the chat
    if (socket && loggedUser) {
      socket.emit("join_chat", { senderId: loggedUser._id.toString(), receiverId: receiver });
      // Also ensure registering user with server (if not done) so server can track device
      socket.emit("register_user", { userId: loggedUser._id.toString(), user: loggedUser });
    }
    scrollToBottom();
  }, [receiver, loggedUser]);

  // when chats for this receiver change -> mark unseen messages as seen locally by informing server
  useEffect(() => {
    const arr = chats[receiver] || [];
    if (!arr || arr.length === 0) return;

    // find messages where I'm the receiver and not 'seen' (if any)
    arr.forEach((m) => {
      // if this client is the receiver of a message and status !== 'seen', emit message_seen
      if (m.receiver._id.toString() === loggedUser._id.toString() && m.status !== "seen") {
        socket.emit("message_seen", { _id: m._id, sender: m.sender, receiver: m.receiver });
      }
    });
  }, [chats[receiver]]); // run whenever the conversation updates

  // auto scroll on new messages in this conversation
  useEffect(() => {
    scrollToBottom();
  }, [chats[receiver]]);

  // remove room on unmount
  useEffect(() => {
    return () => {
      if (socket && loggedUser) {
        socket.emit("removeRoom", { senderId: loggedUser._id, receiverId: receiver });
      }
    };
  }, []);

  return (
    <Fragment>
      <div className="my-5 py-5">
        <div className="container my-5 py-5" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
          <div className="fixed-top w-100 bg-white px-4 py-5 my-5" style={{ zIndex: 10 }}>
            <h1>Hello Socket Io</h1>
            <Link to={`/${role}`} className="text-primary mx-2">Home Page</Link>
            <button className="btn btn-success btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">Online User</button>
            <p className="ms-4">User Name : {loggedUser?.name} </p>
            <p style={{ color: "gray", margin: "0 10px" }}>{typingMessage}</p>
          </div>

          <div className={`${style.chatBox} flex-grow-1 overflow-y-auto my-5`} style={{ paddingTop: "100px", paddingBottom: "70px" }} ref={containerRef}>
            {(chats[receiver] || []).map((ele, i) => (
              <div key={ele._id || i} className={`${style.messageRow} ${ele.sender._id === loggedUser._id ? `${style.mine}` : `${style.theirs}`}`}>
                <div className={`${style.messageBubble}`}>
                  <div className={`${style.messageText}`}>
                    {ele.message}
                    {ele.sender._id === loggedUser._id && (
                      <>
                        {ele.status === "sent" && " ✔"}
                        {ele.status === "delivered" && " ✔✔"}
                        {ele.status === "seen" && <span style={{ color: "blue" }}> ✔✔</span>}
                      </>
                    )}
                  </div>

                  <div className={`${style.messageTime}`}>
                    {new Date(ele.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} style={{ height: "70px" }} />
          </div>

          <div className="" style={{ zIndex: 10 }}>
            <div className="d-flex fixed-bottom bg-white p-2 pb-5 mb-5">
              <input
                type="text"
                placeholder="اكتب رسالة"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onInput={typing}
                onBlur={stopTyping}
                className="form-control"
              />
              <button className="btn btn-success mx-2" onClick={sendMessage}>إرسال</button>
            </div>
          </div>
        </div>

        <div className="offcanvas offcanvas-start my-5 py-5" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Backdrop with scrolling</h5>
            <button ref={closeBtnRef} type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <div className="bg-white p-4" style={{ zIndex: 10 }}>
              <h1>🟢 Online User</h1>
              {usersOnline.length < 2 ? <h3>Online User Empty...</h3> : usersOnline.map((ele) =>
                ele._id === loggedUser?._id ? null : (
                  <p key={ele._id} style={{ margin: "0 5px" }} onClick={() => { chatRoom(ele._id); handleClose(); }}>
                    🟢 Receiver {ele.name} {ele._id === receiver ? <span className="text-danger"> Current Receiver</span> : null}
                  </p>
                )
              )}
              <p className="ms-4">User Name : {loggedUser?.name} </p>
              <p style={{ color: "gray", margin: "0 10px" }}>{typingMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
} ;






































































// import React, { useState, useEffect, useContext, useRef, Fragment } from "react";
// import { UserContext } from "../../Context/UserContext.js";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import style from "./clientChatting.module.css";
// import axios from "axios";

// export default function ClientChatting() {
// 	const { receiver } = useParams();
// 	const {
// 		loggedUser,
// 		chats,
// 		messageCount,
// 		setChats,
// 		getLoggedUserMessages,
// 		currentPage,
// 		userToken,
// 		socket,
// 		usersOnline,
// 		setUsersOnline,
// 		role,
// 	} = useContext(UserContext);

// 	const [limit, setLimit] = useState(200);
// 	const [pageNumber, setPageNumber] = useState(1);
// 	const [message, setMessage] = useState("");
// 	const [typingMessage, setTypingMessage] = useState("");
// 	const messagesEndRef = useRef(null);
// 	const containerRef = useRef(null);
// 	const navigate = useNavigate();
// 	const closeBtnRef = useRef(null);

// 	const header = {
// 		token: `${process.env.REACT_APP_BEARER_TOKEN} ${
// 			userToken || localStorage.getItem("token")
// 		}`,
// 	};

// 	// Scroll to bottom
// 	const scrollToBottom = () => {
// 		if (messagesEndRef.current) {
// 			messagesEndRef.current?.scrollIntoView({
// 				behavior: "smooth",
// 				block: "end",
// 			});
// 		}
// 	};

// 	const chatRoom = (userId) => {
// 		navigate(`/clientChat/${userId}`);
// 	};

// 	const handleClose = () => {
// 		if (closeBtnRef.current) {
// 			closeBtnRef.current.click();
// 		}
// 	};

// 	// ✍️ Send Message :
// 	const sendMessage = () => {
// 		if (!message.trim()) return;
// 		socket.emit("private_message", {
// 			sender: loggedUser._id.toString(),
// 			receiver,
// 			message,
// 		});
// 		setMessage("");
// 		scrollToBottom();
// 	};

// 	// ✍️ Typing Events :
// 	const typing = () => {
// 		socket.emit("typing", {
// 			sender: loggedUser._id.toString(),
// 			receiver,
// 			user: loggedUser,
// 			message: `${loggedUser.name} is typing...`,
// 		});
// 	};

// 	const stopTyping = () => {
// 		socket.emit("stopTyping", {
// 			sender: loggedUser._id.toString(),
// 			receiver,
// 		});
// 	};

// 	// 📩 Fetch all messages between sender & receiver
// 	const fetchMessages = async () => {
// 		if (!loggedUser) return console.log("User Not Exist");

// 		try {
// 			const { data } = await axios.get(
// 				`${process.env.REACT_APP_BASE_URL}/api/v1/message/getLoggedUserMessages/${receiver}?limit=${limit}&sort=-createdAt&page=${currentPage}`,
// 				{ headers: header }
// 			);

// 			if (data.message === "success" && data.messages.length > 0) {
// 				const updatedChats = { ...chats };
// 				data.messages.forEach((msg) => {
// 					const otherUser =
// 						msg.sender._id.toString() === loggedUser._id.toString()
// 							? msg.receiver._id.toString()
// 							: msg.sender._id.toString();
// 					updatedChats[otherUser] = [
// 						...(updatedChats[otherUser] || []),
// 						msg,
// 					];
// 				});
// 				setChats(updatedChats);
// 			}
// 		} catch (error) {
// 			console.error(error.response?.data?.message || error.message);
// 		}
// 	};

// 	// 🟢 SOCKET EVENT HANDLING
// 	useEffect(() => {
// 		if (!loggedUser || !socket) return;

// 		const handleReceiveMessage = (data) => {
// 			const otherUser =
// 				data.sender._id.toString() === loggedUser._id.toString()
// 					? data.receiver._id.toString()
// 					: data.sender._id.toString();

// 			setChats((prev) => {
// 				const oldMessages = prev[otherUser] || [];
// 				const filteredMessages = oldMessages.filter(
// 					(msg) => msg._id.toString() !== data._id.toString()
// 				);
// 				return {
// 					...prev,
// 					[otherUser]: [...filteredMessages, data],
// 				};
// 			});

// 			scrollToBottom();
// 		};

// 		socket.on("update_online", setUsersOnline);
// 		socket.on("receive_message", handleReceiveMessage);
// 		socket.on("update_message_status", ({ userId: senderId, messages }) => {
// 			const otherUser = senderId === loggedUser._id ? receiver : senderId;
// 			setChats((prev) => ({
// 				...prev,
// 				[otherUser]: (prev[otherUser] || []).map(
// 					(msg) => messages.find((m) => m._id === msg._id) || msg
// 				),
// 			}));
// 		});

// 		socket.on("message_seen_update", (data) => {
// 			const otherUser =
// 				data.sender._id.toString() === loggedUser._id.toString()
// 					? data.receiver._id
// 					: data.sender._id;
// 			setChats((prev) => ({
// 				...prev,
// 				[otherUser]: (prev[otherUser] || []).map((msg) =>
// 					msg._id.toString() === data._id.toString()
// 						? { ...msg, ...data }
// 						: msg
// 				),
// 			}));
// 			scrollToBottom();
// 		});

// 		socket.on("userTyping", (data) => {
// 			if (data.user._id.toString() !== loggedUser._id.toString()) {
// 				setTypingMessage(data.message);
// 			}
// 		});

// 		socket.on("stopUserTyping", () => setTypingMessage(""));

// 		// Join room
// 		socket.emit("join_chat", {
// 			senderId: loggedUser._id,
// 			receiverId: receiver,
// 		});

// 		// Cleanup
// 		return () => {
// 			socket.off("receive_message", handleReceiveMessage);
// 			socket.off("update_online", setUsersOnline);
// 			socket.off("update_message_status");
// 			socket.off("message_seen_update");
// 			socket.off("userTyping");
// 			socket.off("stopUserTyping");
// 		};
// 	}, [loggedUser?._id, receiver, socket]);

// 	// Fetch messages on receiver change
// 	useEffect(() => {
// 		if (!receiver) return;
// 		fetchMessages();
// 		scrollToBottom();
// 	}, [receiver, pageNumber, loggedUser]);

// 	// 📩 Update messages to seen
// 	useEffect(() => {
// 		const unseen = (chats[receiver] || []).filter(
// 			(m) =>
// 				m.receiver._id.toString() === loggedUser._id.toString() &&
// 				m.status !== "seen"
// 		);
// 		if (unseen.length > 0) {
// 			socket.emit("message_seen", unseen);
// 		}
// 	}, [chats[receiver]]);

// 	// Auto scroll on new messages
// 	useEffect(() => {
// 		scrollToBottom();
// 	}, [chats[receiver]]);

// 	// Remove chat room on unmount
// 	useEffect(() => {
// 		if (socket) {
// 			return () => {
// 				socket.emit("removeRoom", {
// 					senderId: loggedUser?._id,
// 					receiverId: receiver,
// 				});
// 				console.log("Remove Chat Room");
// 			};
// 		}
// 	}, []);

// 	return (
// 		<Fragment>
// 			<div className="my-5 py-5">
// 				<div
// 					className="container my-5 py-5"
// 					style={{
// 						height: "100vh",
// 						display: "flex",
// 						flexDirection: "column",
// 					}}
// 				>
// 					{/* Header ثابت */}
// 					<div
// 						className="fixed-top w-100 bg-white px-4 py-5 my-5"
// 						style={{ zIndex: 10 }}
// 					>
// 						<h1>Hello Socket Io</h1>
// 						<Link to={`/${role}`} className="text-primary mx-2">
// 							Home Page
// 						</Link>
// 						<button
// 							className="btn btn-success btn-sm"
// 							type="button"
// 							data-bs-toggle="offcanvas"
// 							data-bs-target="#offcanvasWithBothOptions"
// 							aria-controls="offcanvasWithBothOptions"
// 						>
// 							Online User
// 						</button>
// 						<p className="ms-4">
// 							User Name : {loggedUser?.name}{" "}
// 						</p>

// 						{/* Typing indicator */}
// 						<p style={{ color: "gray", margin: "0 10px" }}>
// 							{typingMessage}
// 						</p>
// 					</div>

// 					{/* Chat container */}
// 					<div
// 						className={`${style.chatBox} flex-grow-1 overflow-y-auto my-5`}
// 						style={{
// 							paddingTop: "100px",
// 							paddingBottom: "70px",
// 						}}
// 						ref={containerRef}
// 					>
// 						{(chats[receiver] || []).map((ele, i) => (
// 							<div
// 								key={i}
// 								className={`${style.messageRow} ${
// 									ele.sender._id === loggedUser._id
// 										? `${style.mine}`
// 										: `${style.theirs}`
// 								}`}
// 							>
// 								<div className={`${style.messageBubble}`}>
// 									<div className={`${style.messageText}`}>
// 										{ele.message}
// 										{ele.sender._id === loggedUser._id && (
// 											<>
// 												{ele.status === "sent" && "✔"}
// 												{ele.status === "delivered" &&
// 													"✔✔"}
// 												{ele.status === "seen" && (
// 													<span
// 														style={{
// 															color: "blue",
// 														}}
// 													>
// 														✔✔
// 													</span>
// 												)}
// 											</>
// 										)}
// 									</div>

// 									<div className={`${style.messageTime}`}>
// 										{new Date(
// 											ele.createdAt
// 										).toLocaleTimeString([], {
// 											hour: "2-digit",
// 											minute: "2-digit",
// 										})}
// 									</div>
// 								</div>
// 							</div>
// 						))}
// 						<div ref={messagesEndRef} style={{ height: "70px" }} />
// 					</div>

// 					{/* Footer ثابت */}
// 					<div className="" style={{ zIndex: 10 }}>
// 						<div className="d-flex fixed-bottom bg-white p-2 pb-5 mb-5">
// 							<input
// 								type="text"
// 								placeholder="اكتب رسالة"
// 								value={message}
// 								onChange={(e) => setMessage(e.target.value)}
// 								onInput={typing}
// 								onBlur={stopTyping}
// 								className="form-control"
// 							/>
// 							<button
// 								className="btn btn-success mx-2"
// 								onClick={sendMessage}
// 							>
// 								إرسال
// 							</button>
// 						</div>
// 					</div>
// 				</div>

// 				{/* Offcanvas for online users */}
// 				<div
// 					className="offcanvas offcanvas-start my-5 py-5"
// 					data-bs-scroll="true"
// 					tabIndex="-1"
// 					id="offcanvasWithBothOptions"
// 					aria-labelledby="offcanvasWithBothOptionsLabel"
// 				>
// 					<div className="offcanvas-header">
// 						<h5
// 							className="offcanvas-title"
// 							id="offcanvasWithBothOptionsLabel"
// 						>
// 							Backdrop with scrolling
// 						</h5>
// 						<button
// 							ref={closeBtnRef}
// 							type="button"
// 							className="btn-close"
// 							data-bs-dismiss="offcanvas"
// 							aria-label="Close"
// 						></button>
// 					</div>
// 					<div className="offcanvas-body">
// 						<div className="bg-white p-4" style={{ zIndex: 10 }}>
// 							<h1>🟢 Online User</h1>
// 							{usersOnline.length < 2 ? (
// 								<h3>Online User Empty...</h3>
// 							) : (
// 								usersOnline.map((ele) =>
// 									ele._id === loggedUser._id ? null : (
// 										<p
// 											key={ele._id}
// 											style={{ margin: "0 5px" }}
// 											onClick={() => {
// 												chatRoom(ele._id);
// 												handleClose();
// 											}}
// 										>
// 											🟢 Receiver {ele.name}{" "}
// 											{ele._id === receiver ? (
// 												<span className="text-danger">
// 													Current Receiver
// 												</span>
// 											) : null}
// 										</p>
// 									)
// 								)
// 							)}
// 							<p className="ms-4">
// 								User Name : {loggedUser?.name}{" "}
// 							</p>
// 							<p
// 								style={{
// 									color: "gray",
// 									margin: "0 10px",
// 								}}
// 							>
// 								{typingMessage}
// 							</p>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</Fragment>
// 	);
// }





































































// import React, { useState, useEffect, useContext, useRef, Fragment } from "react" ;
// import { UserContext } from "../../Context/UserContext.js" ;
// import { Link, useNavigate, useParams } from "react-router-dom" ;
// import style from "./clientChatting.module.css" ;
// import axios from "axios";


// // clientChatting.module.css






// 	export default function ClientChatting() {
// 	const {receiver} = useParams() ;
// 	const { loggedUser , chats, messageCount , setChats , getLoggedUserMessages , currentPage  , userToken , socket ,usersOnline, setUsersOnline , role} = useContext(UserContext);
// 	const [limit, setLimit] = useState(200);
// 	const [pageNumber, setPageNumber] = useState(1);
// 	const [message, setMessage] = useState("");
// 	const [typingMessage, setTypingMessage] = useState("");
// 	const messagesEndRef = useRef(null);
// 	const containerRef = useRef(null);
// 	const navigate = useNavigate() ;
// 	const closeBtnRef = useRef(null);
//    const header = {
//       token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
//    }


// 		const scrollToBottom = () => {
// 			if (messagesEndRef.current) {
// 				messagesEndRef.current?.scrollIntoView({ behavior: "smooth" , block: "end"}) ;
// 			}
// 		};
// 		const chatRoom = (userId)=>{
// 			navigate(`/clientChat/${userId}`) ;
// 		}
// 		const handleClose = () => {
// 			if (closeBtnRef.current) {
// 				closeBtnRef.current.click();
// 			}
// 		};



		

//       // ✍️ Send Message :
// 		const sendMessage = () => {
// 			if (!message.trim()) return ;
// 			socket.emit("private_message", { sender: loggedUser._id.toString() , receiver , message }) ;
// 			setMessage("") ;
// 			scrollToBottom();
// 		};


// 		// ✍️ Typing Events :
// 		const typing = () => {
// 			socket.emit("typing", { sender:  loggedUser._id.toString()  , receiver  , user:loggedUser});
// 		};



// 		// ✍️ Stop Typing Events :
// 		const stopTyping = () => {
// 			socket.emit("stopTyping", { sender:  loggedUser._id.toString()  , receiver });
// 		};







// 		// Create Scroll When Get All Messages and Send New Message :
// 		useEffect(() => {
// 			if (chats[receiver]?.length > 0) {
// 				scrollToBottom();
// 			}
// 		}, [chats, receiver]);
// 		useEffect(() => {
// 			requestAnimationFrame(scrollToBottom);
// 		}, [chats, receiver]);




// 		// Connection and Register User Successfully and Join user in room by roomId :
// 		useEffect(() => {
// 			if (loggedUser && socket) {
// 				socket.on("update_online", (users)=>{
// 					setUsersOnline(users) ;
// 				});
				


// 				// انضمام روم خاص باليوزر
// 				socket.emit("join_chat", {senderId:loggedUser._id ,receiverId:receiver });
// 				socket.on("receive_message", (data) => {
// 					const otherUser =
// 						data.sender._id.toString() === loggedUser._id.toString()
// 							? data.receiver._id.toString()
// 							: data.sender._id.toString() ;

// 					setChats((prev) => {
// 						const oldMessages = prev[otherUser] || [] ;

// 						// شيل أي رسالة قديمة بنفس الـ _id
// 						const filteredMessages = oldMessages.filter(
// 							(msg) => msg._id.toString() !== data._id.toString()
// 						) ;

// 						return {
// 							...prev,
// 							[otherUser]: [...filteredMessages, data],
// 						} ;
// 					}) ;


// 					scrollToBottom() ;
// 				});


// 				socket.on("update_message_status", ({ userId: senderId , messages }) => {
// 					const otherUser = senderId === loggedUser._id ? receiver : senderId ;
// 					// تحديث الـ state لكل محادثة
// 					setChats(prev => ({
// 					...prev,
// 					[otherUser]: (prev[otherUser] || []).map(msg =>
// 						// لو الرسالة موجودة بنفس الـ _id يبقى نحدثها
// 						messages.find(m => m._id === msg._id) || msg
// 					)
// 					}));

// 					// scrollToBottom();
// 				});


// 				socket.on("message_seen_update", ((data) =>{
// 					const otherUser = data.sender._id.toString() === loggedUser._id.toString() ? data.receiver._id : data.sender._id ;
// 					setChats(prev => ({
// 					...prev,
// 					[otherUser]: (prev[otherUser] || []).map(msg =>
// 						msg._id.toString() === data._id.toString() ? { ...msg , ...data } : msg
// 					)
// 					}));
// 					scrollToBottom();
// 				}));


// 				// استقبال typing
// 				socket.on("userTyping", (data) => data.user._id.toString() === loggedUser._id.toString()? "" : setTypingMessage(data.message));
// 				socket.on("stopUserTyping", () => setTypingMessage(""));

// 				return () => {
// 				socket.off("private_message");
// 				socket.off("receive_message");
// 				socket.off("userTyping");
// 				socket.off("stopUserTyping");
// 				socket.off("message_seen_update");
// 				socket.off("update_online");
// 				};
// 			}
// 		}, [loggedUser , socket]);


// 		// جلب كل الرسائل بين المستخدم الحالي والمستلم
// 		const fetchMessages = async () => {
// 			if(!loggedUser) {console.log("User Not Exist");
// 			} ;
// 			await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/message/getLoggedUserMessages/${receiver}?limit=${limit}&sort=-createdAt&page=${currentPage}` ,  {headers:header} )
// 			.then(({data})=>{
// 				if(data.message === "success"){
// 					// console.log("data" , data.messages);
// 					// setPageCount(data.metadata.numberOfPages) ;

// 					if (data.messages.length > 0) {
// 						data.messages.forEach((ele) => {
// 							const otherUser = ele.sender._id.toString() === loggedUser?._id.toString() ? ele.receiver._id.toString() : ele.sender._id.toString() ;
// 							setChats((prev) => ({
// 								...prev,
// 								[otherUser]: [...(prev[otherUser] || []) , ele] ,
// 							}));
// 						});
// 					}
// 				}
// 			})
// 			.catch((error)=>{
// 				console.log(error);
// 				// console.log(error.response?.data.message);
// 			})	
// 		};



//       // Get all messages in this room :
// 		useEffect(() => {
// 			if (!receiver) return;
// 			fetchMessages() ;
// 			scrollToBottom() ;
// 		}, [receiver, pageNumber , loggedUser]);



// 		// 📩 Update Status to Message Seen :
// 		useEffect(() => {
// 			if((chats[receiver] || []).length > 0 ){
// 				chats[receiver].forEach((m)=>{
// 					if(m.receiver._id.toString() === loggedUser._id.toString() && m.status !== "seen"){
// 						socket.emit("message_seen" , m) ;
// 					}
// 				})
// 			}
// 		}, [chats])




// 		// Remove Chat room by roomId :
// 		useEffect(() => {
// 			if(socket){
// 				return () => {
// 					socket.emit("removeRoom" , {senderId:loggedUser?._id , receiverId:receiver } )
// 					console.log("Remove Chat Room");
// 				};
// 			}
// 		}, [])


// 	return (
// 		<Fragment>
// 		{console.log(chats)
// 		}
// 			<div className="my-5 py-5">
// 				<div className="container my-5 py-5" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
// 					{/* Header ثابت */}
// 					<div className="fixed-top w-100 bg-white px-4 py-5 my-5" style={{ zIndex: 10 }}>
// 						<h1>Hello Socket Io</h1>
// 						<Link to={`/${role}`} className="text-primary mx-2">Home Page</Link>
// 						<button class="btn btn-success btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">Online User</button>
// 						<p className="ms-4">User Name : {loggedUser?.name} </p>
						
// 						{/* Typing indicator */}
// 						<p style={{ color: "gray", margin: "0 10px" }}>{typingMessage}</p>
// 					</div>
// 					{/* Chat container */}
// 					<div className= {`${style.chatBox} flex-grow-1 overflow-y-auto my-5`}  style={{ paddingTop: "100px", paddingBottom: "70px" }} ref={containerRef}>
// 						{(chats[receiver] || []).map((ele, i) => (
// 							<div key={i} className={`${style.messageRow} ${ele.sender._id === loggedUser._id ? `${style.mine}` : `${style.theirs}`}`}>
// 								<div className={`${style.messageBubble}`}>
// 									<div className={`${style.messageText}`}>
// 										{ele.message}
// 										{ele.sender._id === loggedUser._id ? (
// 										<>
// 											{ele.status === "sent" && "✔"}
// 											{ele.status === "delivered" && "✔✔"}
// 											{ele.status === "seen" && <span style={{ color: "blue" }}>✔✔</span>}
// 										</>
// 										) : (
// 										""
// 										)}
// 									</div>

// 									<div className={`${style.messageTime}`}>
// 										{new Date(ele.createdAt).toLocaleTimeString([], {
// 										hour: "2-digit",
// 										minute: "2-digit",
// 										})}
// 									</div>
// 								</div>
// 							</div>
// 						))}
// 						<div ref={messagesEndRef} style={{ height: "70px" }} />
// 					</div>


// 					{/* Footer ثابت */}
// 					<div className="" style={{ zIndex: 10 }}>
// 						<div className="d-flex fixed-bottom bg-white p-2 pb-5 mb-5">
// 							<input
// 								type="text"
// 								placeholder="اكتب رسالة"
// 								value={message}
// 								onChange={(e) => setMessage(e.target.value)}
// 								onInput={typing}
// 								onBlur={stopTyping}
// 								className="form-control"
// 							/>
// 							<button className="btn btn-success mx-2" onClick={sendMessage}>
// 								إرسال
// 							</button>
// 						</div>
// 					</div>
// 				</div>

// 				<div class="offcanvas offcanvas-start my-5 py-5" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
// 					<div class="offcanvas-header">
// 						<h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Backdrop with scrolling</h5>
// 						<button  ref={closeBtnRef} type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
// 					</div>
// 					<div class="offcanvas-body">
// 						<div className="bg-white p-4" style={{ zIndex: 10 }}>
// 							<h1>🟢 Online User</h1>
// 								{usersOnline.length < 2 ? <h3>Online User Empty...</h3> : usersOnline.map((ele) =>
// 									ele._id === loggedUser._id ? null : (
// 										<p key={ele._id} style={{ margin: "0 5px" }} onClick={()=>{chatRoom(ele._id) ; handleClose()}}>
// 											🟢 Receiver {ele.name} {ele._id === receiver? <span className="text-danger">  Current Receiver</span> : null}
// 										</p>
// 									)
// 								)}
// 							<p className="ms-4">User Name : {loggedUser?.name} </p>
							
// 							{/* Typing indicator */}
// 							<p style={{ color: "gray", margin: "0 10px" }}>{typingMessage}</p>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 		</Fragment>
// 	);
// };
