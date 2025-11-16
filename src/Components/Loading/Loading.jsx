import { Fragment } from 'react'
import { 
      BallTriangle , 
      Oval ,
      InfinitySpin ,
      Watch, 
      Audio , 
      Bars , 
      Blocks , 
      CirclesWithBar ,
      Circles  , 
      Discuss , 
      DNA ,
      Comment
} from 'react-loader-spinner' ;
import style from "./loading.module.css" ;
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';


export default function Loading({
      type = "oval",
      color = "#4fa94d",
      height  = 60 ,
      width = 60 ,
      count = 5 ,
      visible = true,
      strokeWidth = "5",
      wrapperStyle = {    
         // width: "150px",          // عرض الحاوية
         // height: "150px",         // ارتفاع الحاوية
         // border: "px solid red", // حدود (border)
         // borderRadius: "10px",    // تقويس الزوايا
         // backgroundColor: "#f0f0f0", // لون خلفية
         // padding: "10px",         // حشوة داخلية
         // display: "flex",         // عشان نقدر نستخدم justifyContent
         // justifyContent: "center",
         // alignItems: "center"
      }
   }) {

      if (!visible) return null ; // لو مش ظاهر، ما يرندرش أي حاجة
      // https://mhnpd.github.io/react-loader-spinner/docs/components/oval



      const renderLoader = () => {
         switch (type.toLowerCase()) {
            case "watch":
            return  <Watch
                        visible={visible}
                        height={height}
                        width={width}
                        color={color}
                        radius="48"
                        ariaLabel="watch-loading"
                        wrapperStyle={wrapperStyle}
                        wrapperClass=""
                     />;


            case "infinitySpin":
            return   <InfinitySpin
                        visible={visible}
                        width={width}
                        color={color}
                        wrapperStyle={wrapperStyle}
                        ariaLabel="infinity-spin-loading"
                     />;



            case "ballTriangle":
            return    <BallTriangle
                        height={height}
                        width={width}
                        radius={5}
                        color={color}
                        ariaLabel="ball-triangle-loading"
                        wrapperStyle={wrapperStyle}
                        wrapperClass=""
                        visible={visible}
                     />;



            case "audio":
            return    <Audio
                        height={height}
                        width={width}
                        color={color}
                        ariaLabel="audio-loading"
                        wrapperStyle={wrapperStyle}
                        wrapperClass="wrapper-class"
                        visible={visible}
                     />;



            case "bars":
            return    <Bars
                        height={height}
                        width={width}
                        color={color}
                        ariaLabel="bars-loading"
                        wrapperStyle={wrapperStyle}
                        wrapperClass=""
                        visible={visible}
                     />;



            case "blocks":
            return    <Blocks
                        height={height}
                        width={width}
                        color={color}
                        ariaLabel="blocks-loading"
                        wrapperStyle={wrapperStyle}
                        wrapperClass="blocks-wrapper"
                        visible={visible}
                     />;



            case "circlesWithBar":
            return    <CirclesWithBar
                        height={height}
                        width={width}
                        color={color}
                        outerCircleColor={color}
                        innerCircleColor={color}
                        barColor={color}
                        ariaLabel="circles-with-bar-loading"
                        wrapperStyle={wrapperStyle}
                        wrapperClass=""
                        visible={visible}
                     />;



            case "circles":
            return    <Circles
                        height={height}
                        width={width}
                        color={color}
                        ariaLabel="circles-loading"
                        wrapperStyle={wrapperStyle}
                        wrapperClass=""
                        visible={visible}
                     />;


            case "comment":
            return    <Comment
                        visible={visible}
                        height={height}
                        width={width}
                        ariaLabel="comment-loading"
                        wrapperStyle={wrapperStyle}
                        wrapperClass="comment-wrapper"
                        color={color}                      
                        backgroundColor={color}
                     />;



            case "discuss":
            return    <Discuss
                        visible={visible}
                        width={width}
                        height={height}
                        color={color}                      
                        ariaLabel="discuss-loading"
                        wrapperStyle={wrapperStyle}
                        wrapperClass="discuss-wrapper"
                        backgroundColor={color}
                     />;



            case "dna":
            return    <DNA
                        visible={visible}
                        height={height}
                        width={width}
                        ariaLabel="dna-loading"
                        wrapperStyle={wrapperStyle}
                        wrapperClass="dna-wrapper"
                        />;

                        
            case "btn":
            return <i className={`${style.spinnerBtn} spinner-border`} style={{color:color}}></i>
                        
            case "icon":
            return <i className={`${style.spinnerIcon} spinner-border`} style={{color:color}}></i>
         

            case "large":
            return <i className={`${style.spinnerLarge} spinner-border`} style={{color:color}}></i>
         

            case "skeleton":
            return ( <div style={{ width: "600px" }}>
                        <SkeletonTheme baseColor="#c31111ff" highlightColor="#1338c0ff">
                           <Skeleton height={20} count={count} />
                        </SkeletonTheme>
                     </div>
                  )



            default:
            return   <Oval
                        visible={visible}
                        width={width}
                        height={height}
                        strokeWidth={strokeWidth}                        
                        color={color}
                        ariaLabel="oval-loading"
                        wrapperStyle={wrapperStyle}
                        wrapperClass=""
                     />

         };
      } 




   return (
      <Fragment>
         <div className='container d-flex justify-content-center align-items-center'>
               {renderLoader()}
         </div>
      </Fragment>
   )
} ;
