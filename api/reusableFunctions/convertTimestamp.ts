import { Timestamp } from "firebase/firestore";

export const getTime = (seconds: number, nanoseconds: number) => {
  let ms = new Timestamp(seconds, nanoseconds).toMillis();

  let timeExt = new Date(ms).getHours() > 12 ? "PM" : "AM";

  let minutes = new Date(ms).getMinutes();
  let minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${new Date(ms).getHours()}:${minutesString} ${timeExt}`;
};

export const getDate = (seconds: number, nanoseconds: number) => {
  const ms = new Timestamp(seconds, nanoseconds).toMillis();

  const date = new Date(ms);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthIndex = date.getMonth();
  const monthName = months[monthIndex];

  const day = date.getDate();

  const year = date.getFullYear();

  return `${day}, ${monthName} ${year}`;
};

export const getDay = (seconds: number, nanoseconds: number) => {
  let ms = new Timestamp(seconds, nanoseconds).toMillis();
  let dayOfWeek = new Date(ms).getDay();

  // Convert the day of the week from a numeric value to a string
  switch (dayOfWeek) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Unknown";
  }
};

export function groupMessagesByDay(messages: any) {
  let previousMessages: any = [];
  let previousMessagesByDay = {};
  const today = new Date();
  const messagesByDay = messages?.reduce((acc: any, message: any) => {
    const messageDate = message?.createdAt?.toDate();
    let day;

    if (messageDate) {
      if (
        messageDate?.getDay() === today?.getDay() &&
        messageDate?.getDate() === today?.getDate()
      ) {
        day = "Today";
      } else if (
        (messageDate?.getDay() === today?.getDay() - 1 &&
          messageDate?.getDate() === today?.getDate()) ||
        (messageDate?.getDay() === 6 && today?.getDay() === 0)
      ) {
        day = "Yesterday";
      } else {
        day = messageDate?.toLocaleDateString();
      }
    }

    if (!acc[day]) {
      acc[day] = [];
    }

    acc[day].push(message);
    return acc;
  }, {});

  if (previousMessages === messages) {
    return previousMessagesByDay;
  }
  previousMessages = messages;
  previousMessagesByDay = messagesByDay;

  if (messagesByDay) {
    if (!messagesByDay["Today"] || !messagesByDay["Yesterday"]) {
      messagesByDay["Today"] = [];
      messagesByDay["Yesterday"] = [];
    }

    if (
      !messagesByDay[today?.toLocaleDateString()] &&
      (today?.getDay() !== 0 || today?.getDate() !== 1)
    ) {
      messagesByDay[today?.toLocaleDateString()] = [];
    }
  }

  return messagesByDay;
}

export const getTimeAgo = (seconds: number, nanoseconds: number) => {
  const now = Date.now();
  const timestampMs = new Timestamp(seconds, nanoseconds).toMillis();
  const elapsedMs = now - timestampMs;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;

  if (elapsedMs < minute) {
    return "just now";
  } else if (elapsedMs < hour) {
    const minutesAgo = Math.floor(elapsedMs / minute);
    return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
  } else if (elapsedMs < day) {
    const hoursAgo = Math.floor(elapsedMs / hour);
    return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
  } else if (elapsedMs < week) {
    const daysAgo = Math.floor(elapsedMs / day);
    return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  } else if (elapsedMs < month) {
    const weeksAgo = Math.floor(elapsedMs / week);
    return `${weeksAgo} ${weeksAgo === 1 ? "week" : "weeks"} ago`;
  } else {
    const monthsAgo = Math.floor(elapsedMs / month);
    return `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;
  }
};
