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

// const { fromUnixTime } = require("date-fns");

// function timestampToDateTime(timestamp) {
//   const ISTOffset = 5.5 * 60 * 60; // 5.5 hours offset for IST timezone

//   const targetDate = fromUnixTime(timestamp);

//   // Convert UTC time to IST
//   targetDate.setTime(targetDate.getTime());

//   let hours = targetDate.getHours();
//   let minutes = targetDate.getMinutes();
//   const seconds = targetDate.getSeconds();
//   let currentDate = new Date();
//   let isDateMatched =
//     currentDate.getDate() === targetDate.getDate() &&
//     currentDate.getMonth() === targetDate.getMonth() &&
//     currentDate.getFullYear() === targetDate.getFullYear();

//   // Convert hours to 12-hour format and determine AM or PM
//   let amPm = hours >= 12 ? 'PM' : 'AM';
//   hours = hours % 12;
//   hours = hours ? hours : 12; // Handle midnight (0 hours)

//   if (hours < 10) {
//     hours = "0" + hours.toString();
//   }
//   if (minutes < 10) {
//     minutes = "0" + minutes.toString();
//   }

//   let formattedDateTime;

//   if (isDateMatched) {
//     formattedDateTime = `${hours}:${minutes} ${amPm}`;
//   } else {
//     let tomorrowDate = new Date(currentDate);
//     tomorrowDate.setDate(tomorrowDate.getDate() + 1);
//     tomorrowDate.setTime(tomorrowDate.getTime() + ISTOffset * 1000);

//     if (
//       targetDate.getDate() === tomorrowDate.getDate() &&
//       targetDate.getMonth() === tomorrowDate.getMonth() &&
//       targetDate.getFullYear() === tomorrowDate.getFullYear()
//     ) {
//       formattedDateTime = `Tomorrow ${hours}:${minutes} ${amPm}`;
//     } else {
//       // For other dates
//       let month = targetDate.getMonth() + 1;
//       let formattedMonth = month < 10 ? "0" + month : month;
//       let formattedDate =
//         targetDate.getDate() < 10
//           ? "0" + targetDate.getDate()
//           : targetDate.getDate();
//       formattedDateTime = `${formattedDate}/${formattedMonth}/${targetDate.getFullYear()} ${hours}:${minutes} ${amPm}`;
//     }
//   }

//   return formattedDateTime;
// }

function timestampToDateTime(timestamp) {
  const ISTOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours offset for IST timezone in milliseconds

  // Create a Date object from the Unix timestamp (in seconds) and apply IST offset
  const targetDate = new Date((timestamp * 1000) + ISTOffset);

  // Get the current date and time in IST
  const currentDate = new Date(new Date().getTime() + ISTOffset);

  // Format the target date time
  let hours = targetDate.getHours();
  let minutes = targetDate.getMinutes();
  const seconds = targetDate.getSeconds();
  
  // Check if the date matches today
  const isDateMatched =
    currentDate.getDate() === targetDate.getDate() &&
    currentDate.getMonth() === targetDate.getMonth() &&
    currentDate.getFullYear() === targetDate.getFullYear();

  // Convert hours to 12-hour format and determine AM or PM
  let amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // Pad hours and minutes with leading zeros if necessary
  if (hours < 10) {
    hours = "0" + hours.toString();
  }
  if (minutes < 10) {
    minutes = "0" + minutes.toString();
  }

  let formattedDateTime;

  if (isDateMatched) {
    formattedDateTime = `${hours}:${minutes} ${amPm}`;
  } else {
    // Create a Date object for yesterday in IST
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);
    yesterdayDate.setHours(0, 0, 0, 0);

    if (
      targetDate.getDate() === yesterdayDate.getDate() &&
      targetDate.getMonth() === yesterdayDate.getMonth() &&
      targetDate.getFullYear() === yesterdayDate.getFullYear()
    ) {
      formattedDateTime = `Yesterday ${hours}:${minutes} ${amPm}`;
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


function checkSingleEmoji(text) {
  const emojiRegex =
    /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  if (text.length === 2 && emojiRegex.test(text)) {
    return true;
  }
  return false;
}

// console.log(timestampToDateTime(1715518996));

export { apiStatusConstants, webUrl, timestampToDateTime, checkSingleEmoji };
