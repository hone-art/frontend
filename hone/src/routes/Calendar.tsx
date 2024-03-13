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

interface Event {
  id: number;
  description: string;
  img_id?: number;
  project_id: number;
  user_id: number;
  created_date: Date;
}

const Calendar: FC<Props> = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) navigate("/");
    else {
      const arrayOfEvents: Array<object> = [];
      async function fetchEventsAndDisplay() {
        const fetchEvents = await fetch(`${process.env.API_URL}/entries/users/${user!.id}`);
        const events: Array<Event> = await fetchEvents.json();

        for (const thisEvent of events) {
          const fetchProject = await fetch(`${process.env.API_URL}/projects/${thisEvent.project_id}`);
          const project = await fetchProject.json();

          const formattedDate = new Date(thisEvent.created_date)
            .toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .split("/")
            .join("-");

          const formattedTime = new Date(thisEvent.created_date).toLocaleTimeString("en-US");
          const result = { title: (project.title + ": " + formattedTime), start: formattedDate, url: `https://hone-space.art/${user?.user_name}/projects/${thisEvent.project_id}` };
          arrayOfEvents.push(result);
        }

        const calendarEl = document.getElementById("calendar");
        const screenWidth = document.body.clientWidth;
        const isMobile = (screenWidth < 450) ? true : false;

        const calendar = new CalendarImport(calendarEl!, {
          plugins: [dayGridPlugin],
          initialView: isMobile ? 'dayGridDay' : 'dayGridMonth',
          headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay', // user can switch between the three
          },
          events: arrayOfEvents,
          eventColor: '#222224',
        })

        calendar.render();
      }

      fetchEventsAndDisplay();
    }
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

