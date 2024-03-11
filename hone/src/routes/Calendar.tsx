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
    const screenWidth = document.body.clientWidth;
    const isMobile = (screenWidth < 450) ? true : false;

    const calendar = new CalendarImport(calendarEl!, {
      plugins: [dayGridPlugin],
      initialView: isMobile ? 'dayGridDay' : 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay' // user can switch between the three
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

