// import { useEffect } from 'react';
// import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
// import React, { ReactNode } from "react";
// import interactionPlugin from "@fullcalendar/interaction";
import { Calendar as CalendarImport } from '@fullcalendar/core';
// import { useEffect, FC, useState } from "react";
import { useEffect, FC } from "react";
import { useNavigate, useParams } from "react-router";
import LoggedInHeader from "../components/LoggedInHeader";
import { Event } from "../globals";
import "../styles/calendar.css";
import { useAuth } from "../hooks/useAuth";

const Calendar: FC = () => {
  const navigate = useNavigate();
  const { user, autoLogin, isLoggedIn } = useAuth();
  const { username } = useParams<string>();
  // const [isLoaded, setIsLoaded] = useState<boolean>(false);
  // const [hasStreak, setHasStreak] = useState<boolean>(false);

  useEffect(() => {

    async function fetchCalendar() {
      if (!isLoggedIn) {
        const result = await autoLogin();
        if (result === null) {
          navigate("/");
        }
      }
      else if (username !== user!.user_name) {
        navigate("/");
      }
      else {
        const arrayOfEvents: Array<object> = [];
        // const fetchEvents = await fetch(`${process.env.API_URL}/entries/users/${result!.id}`);
        const fetchEvents = await fetch(`${process.env.API_URL}/entries/users/${user!.id}`);
        const events: Array<Event> = await fetchEvents.json();

        // Check for streak
        const currentYear: number = new Date().getFullYear();
        const currentMonth: number = new Date().getMonth();
        const currentDate: number = new Date().getDate();

        const formattedDate: string = (currentDate).toString().padStart(2, '0');
        const formattedMonth: string = (currentMonth + 1).toString().padStart(2, '0');
        const formattedYear: string = (currentYear).toString()
        const formattedYearMonthDate: string = `${formattedYear}-${formattedMonth}-${formattedDate}`;

        const fetchResponse = await fetch(`${process.env.API_URL}/entries/users/${user?.id}/streaks/${formattedYearMonthDate}`);
        const fetchedStreaks = await fetchResponse.json();

        if (fetchedStreaks.current > 0) {
          const startDate: Date = new Date();
          startDate.setDate((startDate.getDate() - (fetchedStreaks.current - 1)));
          // const startDateString = startDate.toISOString().slice(0, 10);
          // console.log(startDateString);

          const endDate: Date = new Date();
          endDate.setDate(endDate.getDate() + 1);
          const endDateString = endDate.toISOString().slice(0, 10);
          // console.log(endDate);
          const streakEvent = { title: "Streak!", start: startDate, end: endDateString, allDay: true, backgroundColor: "#F72798", textColor: "black" };
          arrayOfEvents.push(streakEvent);
          // setHasStreak(true);
        }

        // Create events from entries
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
          const result = { title: (project.title + ": " + formattedTime), start: formattedDate, username: user?.user_name, projectId: thisEvent.project_id, image_url: null };
          if (thisEvent.img_id !== null) {
            const fetchImage = await fetch(`${process.env.API_URL}/images/${thisEvent.img_id}`);
            const image = await fetchImage.json();
            result.image_url = image.url;
          }
          arrayOfEvents.push(result);
        }
        // setIsLoaded(true);

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
          // dayMaxEvents: hasStreak ? 2 : 1,
          views: {
            day: {
              dayMaxEvents: false,
            },
            week: {
              dayMaxEvents: true,
            },
            month: {
              dayMaxEvents: 2
            }
          },
          // moreLinkClick: "day",
          // dayMaxEventRows: true,
          eventDidMount: function (info) {
            if (info.event.extendedProps.image_url && info.event.extendedProps.image_url !== null) {
              const imgEl = document.createElement("img");
              imgEl.src = info.event.extendedProps.image_url;
              info.el.prepend(imgEl);
            }
          },
          eventClick: function (info) {
            const username = info.event.extendedProps.username;
            const projectId = info.event.extendedProps.projectId;
            if (info.event.extendedProps.username) navigate(`/${username}/projects/${projectId}`);
          }
        })

        calendar.render();
      }
    }

    fetchCalendar();
  }, [user]); //hasStreak

  return (
    <>
      <LoggedInHeader />
      <div id="calendar" className="calendar">
      </div>
    </>
  )
};

export default Calendar;

