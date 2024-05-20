import { fromUnixTime } from "date-fns";

let url = [
  "http://192.168.1.19:3005",
  "http://localhost:3005",
  "https://node-ccoplnfjedo.onrender.com",
];

let webUrl = url[2];

const apiStatusConstants = {
  initial: "INITIAL",
  in_progress: "INPROGRSS",
  success: "SUCCESS",
  failure: "FAILURE",
};

function timestampToDateTime(timestamp) {
  const ISTOffset = 5.5 * 60 * 60;
  const additionalOffset = 5 * 60 * 60 + 30 * 60; // Additional 5 hours and 30 minutes in seconds
  const secondsPerDay = 24 * 60 * 60;
  const days = Math.floor(timestamp / secondsPerDay);
  const remainingSeconds = timestamp % secondsPerDay;
  const referenceDate = new Date("1970-01-01");
  const targetDate = new Date(
    referenceDate.getTime() + days * 1000 * secondsPerDay
  );

  // Convert UTC time to IST
  targetDate.setTime(targetDate.getTime() + ISTOffset * 1000);

  let hours = Math.floor(remainingSeconds / 3600);
  let minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  let currentDate = new Date();
  let isDateMatched =
    currentDate.getDate() === targetDate.getDate() &&
    currentDate.getMonth() === targetDate.getMonth() &&
    currentDate.getFullYear() === targetDate.getFullYear();

  // Add additional offset if date is matched or tomorrow
  if (isDateMatched || (currentDate.getDate() + 1 === targetDate.getDate())) {
    targetDate.setTime(targetDate.getTime() + additionalOffset * 1000);
  }

  // Convert hours to 12-hour format and determine AM or PM
  let amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  if (hours < 10) {
    hours = "0" + hours.toString();
  }
  if (minutes < 10) {
    minutes = "0" + minutes.toString();
  }

  let formattedDateTime;

  if (isDateMatched) {
    formattedDateTime = `Today ${hours}:${minutes} ${amPm}`;
  } else {
    // Check if targetDate is tomorrow
    let tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    tomorrowDate.setTime(tomorrowDate.getTime() + ISTOffset * 1000);

    if (
      targetDate.getDate() === tomorrowDate.getDate() &&
      targetDate.getMonth() === tomorrowDate.getMonth() &&
      targetDate.getFullYear() === tomorrowDate.getFullYear()
    ) {
      formattedDateTime = `Tomorrow ${hours}:${minutes} ${amPm}`;
    } else {
      // For other dates
      let month = targetDate.getMonth() + 1;
      let formattedMonth = month < 10 ? "0" + month : month;
      let formattedDate =
        targetDate.getDate() < 10
          ? "0" + targetDate.getDate()
          : targetDate.getDate();
      formattedDateTime = `${formattedDate}/${formattedMonth}/${targetDate.getFullYear()} ${hours}:${minutes} ${amPm}`;
    }
  }

  return formattedDateTime;
}

// function timestampToDateTime(timestamp) {
//   let dateObj = fromUnixTime(timestamp);
//   let [hour, minute, date, month, year] = [
//     dateObj.getHours(),
//     dateObj.getMinutes(),
//     dateObj.getDate(),
//     dateObj.getMonth(),
//     dateObj.getFullYear(),
//   ];
//   console.log(hour, minute, date, month, year);

//   const currentDateObj = new Date();
//   let [currentHour, currentMinute, currentDate, currentMonth, currentYear] = [
//     currentDateObj.getHours(),
//     currentDateObj.getMinutes(),
//     currentDateObj.getDate(),
//     currentDateObj.getMonth(),
//     currentDateObj.getFullYear(),
//   ];
   
  
//   let condition =
//     year === currentYear && date === currentDate && month === currentMonth;
//   if (condition) return `Today ${hour}:${minute}` 
//   return "working";
// }

function checkSingleEmoji(text) {
  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  if (text.length === 2 && emojiRegex.test(text)){
      return true
  }
  return false;
}

console.log(timestampToDateTime(1715518996));

export { apiStatusConstants, webUrl, timestampToDateTime, checkSingleEmoji };
