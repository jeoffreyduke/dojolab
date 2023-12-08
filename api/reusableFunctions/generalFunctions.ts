import { DocumentData, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export function toCamelCase(input: string): string {
  // Split the input string by space or other non-alphanumeric characters
  const words = input.split(/[^a-zA-Z0-9]+/);

  // Convert the first word to lowercase and the rest to title case
  const camelCasedWords = words.map((word, index) => {
    if (index === 0) {
      return word.toLowerCase();
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  });

  // Join the words without spaces to create the camelCase string
  const camelCasedString = camelCasedWords.join("");

  return camelCasedString;
}

export function preprocessText(text: string): string {
  // Remove extra line breaks and whitespace
  return text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

export function extractNumberedTips(text: string): string[] {
  const regex = /\d+\.\s(.*?)(?=(\d+\.\s)|$)/g;
  const tips: string[] = [];
  let match;

  while ((match = regex.exec(preprocessText(text))) !== null) {
    tips.push(match[1]);
  }

  return tips;
}

export const getAttendance = async (user: DocumentData, id: string) => {
  const attendanceRef =
    user &&
    collection(db, "schools", user.schoolId, "students", id, "attendance");

  const attendanceSnap = attendanceRef && (await getDocs(attendanceRef));

  //attendanceSnap?.docs.map((attendance) => console.log(attendance.data()));

  return attendanceSnap?.docs.map((attendance) => attendance.data());
};

export function countSchoolDays(startDate: any, endDate: any, holidays: any[]) {
  let count = 0;
  let currDate = startDate;
  while (currDate <= endDate) {
    let dayOfWeek = currDate.getDay();
    // Check if the current date is a holiday
    let isHoliday = holidays.some(
      (holiday) =>
        holiday.getDate() === currDate.getDate() &&
        holiday.getMonth() === currDate.getMonth() &&
        holiday.getFullYear() === currDate.getFullYear()
    );
    if (dayOfWeek != 0 && dayOfWeek != 6 && !isHoliday) {
      // 0: Sunday, 6: Saturday
      count++;
    }
    currDate.setDate(currDate.getDate() + 1);
  }
  return count;
}

export function calculateAttendancePercentage(attendance: any[] | any) {
  let startDate = new Date("2023-11-01"); // adjust this date as per your requirement
  let endDate = new Date(); // Today
  let totalSchoolDays = countSchoolDays(startDate, endDate, []);
  let attendedDays = isNaN(attendance.length) ? 0 : attendance?.length;
  let missedDays = totalSchoolDays - attendedDays;
  let result = (attendedDays / totalSchoolDays) * 100;

  return +parseFloat(result.toString()).toFixed(1);
}

export const fetchStudentAttendance = async (
  user: DocumentData,
  id: string
) => {
  const attendance = await getAttendance(user, id);
  const attendancePercentage = calculateAttendancePercentage(attendance);
  return attendancePercentage;
};

export async function calculateAttendanceForAllStudents(
  students: any[],
  user: DocumentData
) {
  let totalAttendancePercentage = 0;
  const attendancePercentages = await Promise.all(
    students.map(async (student) => {
      let attendancePercentage = calculateAttendancePercentage(
        await getAttendance(user, student.id)
      );
      return attendancePercentage;
    })
  );
  totalAttendancePercentage = attendancePercentages.reduce((a, b) => a + b, 0);
  let schoolAttendancePercentage = totalAttendancePercentage / students.length;
  return Math.round(schoolAttendancePercentage);
}
