import React, { useState } from "react";
import Calendar from "react-calendar";
import "./Attendance.css";
import { deleteAttendance, markAttendance } from "../../../../../api/database";
import { Backdrop } from "@mui/material";

function Attendance({ user, student, attendance }: any) {
  const [date, setDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  const handleSlotSelect = (value: any) => {
    console.log(value.getTime());
    setSelectedSlot(value);
  };

  const checkSelected = attendance.some(
    (mark: any) =>
      new Date(+mark.id).toDateString() === selectedSlot?.toDateString()
  );

  const handleBooking = () => {
    if (!user || !selectedSlot) {
      console.error("User or selected slot not available.");
      return;
    }

    // Simulate adding a booked date to the local array
    // setBookedDates((prevBookedDates) => [...prevBookedDates, selectedSlot]);

    if (checkSelected) {
      deleteAttendance(
        selectedSlot.getTime().toString(),
        user.schoolId,
        student.id
      );

      setSelectedSlot(null);
      console.log("Delete successful!");
    } else {
      markAttendance(
        selectedSlot.getTime().toString(),
        user.schoolId,
        student.id
      );

      setSelectedSlot(null);
      console.log("Booking successful!");
    }
  };

  const isDateBooked = (dateToCheck: Date) => {
    return attendance.some(
      (mark: any) =>
        new Date(+mark.id).toDateString() === dateToCheck.toDateString()
    );
  };

  return (
    <div className="container">
      <Calendar
        onChange={handleSlotSelect}
        value={date}
        tileContent={({ date, view }: any) =>
          view === "month" && isDateBooked(date) ? (
            <div
              style={{
                backgroundColor: "#000",
                height: "100%",
                width: "100%",
              }}
            ></div>
          ) : null
        }
      />
      {selectedSlot && (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open
        >
          <div className="confirm" style={{ marginLeft: "20px" }}>
            <h3>Selected Date</h3>
            <p>{selectedSlot.toDateString()}</p>
            <button className="btn" onClick={handleBooking}>
              {checkSelected ? "Delete Attendance" : "Mark Attendance"}
            </button>

            <button className="cancelBtn" onClick={() => setSelectedSlot(null)}>
              Cancel
            </button>
          </div>
        </Backdrop>
      )}
    </div>
  );
}

export default Attendance;
