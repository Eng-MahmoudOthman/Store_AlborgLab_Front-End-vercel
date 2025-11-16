
   
   //& Show a welcome message at different times of the day :
   export default function getGreeting() {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
      return "❤صباح الخير - نهارك سعيد ☀️";
      } else if (hour >= 12 && hour < 18) {
      return " 😉مساء الخير - يومك جميل ⛅";
      } else {
      return "مساء الخير 🌙";
      }
   }