// import { useEffect } from 'react';
// import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
import { Calendar as CalendarImport } from '@fullcalendar/core';
import { useEffect, FC } from "react";
import { useNavigate } from "react-router";
import LoggedInHeader from "../components/LoggedInHeader";
import { User } from "../globals";
import "../styles/calendar.css";

type Props = {
  user: User | null;
}

const Calendar: FC<Props> = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) navigate("/");
    const calendarEl = document.getElementById("calendar");

    const calendar = new CalendarImport(calendarEl!, {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay' // user can switch between the two
      }
    })

    calendar.render();
  }, []);

  return (
    <>
      <LoggedInHeader user={user} />
      <div id="calendar" className="calendar">
      </div>
    </>
  )
};

export default Calendar;

