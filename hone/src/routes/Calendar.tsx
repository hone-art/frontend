// import { useEffect } from 'react';
// import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
import { Calendar as CalendarImport } from '@fullcalendar/core';
import { useEffect, FC, useState } from "react";
import { useNavigate, useParams } from "react-router";
import LoggedInHeader from "../components/LoggedInHeader";
// import { User, Event } from "../globals";
import { Event } from "../globals";
import "../styles/calendar.css";
import { useAuth } from "../hooks/useAuth";

// type Props = {
//   user: User | null;
// }

// const Calendar: FC<Props> = () => {
const Calendar: FC = () => {
  const navigate = useNavigate();
  const { user, autoLogin } = useAuth();
  const { username } = useParams<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCalendar() {
      await autoLogin();
      if (user === null) navigate("/");
      else if (username !== user.user_name) navigate("/");
      else {
        setIsLoading(false);
        const arrayOfEvents: Array<object> = [];
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
          const result = { title: (project.title + ": " + formattedTime), start: formattedDate, url: `https://www.hone-art.space/${user?.user_name}/projects/${thisEvent.project_id}` };
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
    }

    fetchCalendar();
  }, []);

  return (
    <>
      {isLoading ? null : <LoggedInHeader />}
      <div id="calendar" className="calendar">
      </div>
    </>
  )
};

export default Calendar;

