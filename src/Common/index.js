let url = [
  "http://192.168.1.19:3005",
  "http://localhost:3005",
  "https://node-ccoplnfjedo.onrender.com",
];

let webUrl = url[1];

const apiStatusConstants = {
  initial: "INITIAL",
  in_progress: "INPROGRSS",
  success: "SUCCESS",
  failure: "FAILURE",
};

function timestampToDateTime(timestamp) {
  const secondsPerDay = 24 * 60 * 60;
  const days = Math.floor(timestamp / secondsPerDay);
  const remainingSeconds = timestamp % secondsPerDay;
  const referenceDate = new Date("1970-01-01");
  const targetDate = new Date(
    referenceDate.getTime() + days * 1000 * secondsPerDay
  );
  let hours = Math.floor(remainingSeconds / 3600);
  let minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  let currentDate = new Date();
  let isDateMatched =
    currentDate.getDate() === targetDate.getDate() &&
    currentDate.getMonth() === targetDate.getMonth() &&
    currentDate.getFullYear() === targetDate.getFullYear();

  if (hours < 10) {
    hours = "0" + hours.toString();
  }
  if (minutes < 10) {
    minutes = "0" + minutes.toString();
  }
  let formattedDateTime = `${hours}:${minutes}`;
  if (isDateMatched) {
    formattedDateTime = `Today ${hours}:${minutes}`;
  }

  return formattedDateTime;
}

export { apiStatusConstants, webUrl, timestampToDateTime };
