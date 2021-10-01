import React, { useState, useEffect } from "react";
import axios from "axios";
import DayList from "./DayList";
import Appointment from "./Appointment/index";
import "components/Application.scss";
import { getAppointmentsForDay } from "../helpers/selectors";

// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       },
//     },
//   },
//   {
//     id: 3,
//     time: "2pm",
//   },
//   {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Peter Pen",
//       interviewer: {
//         id: 3,
//         name: "Hulio Eglesias",
//         avatar: "https://i.imgur.com/twYrpay.jpg",
//       },
//     },
//   },
//   {
//     id: 5,
//     time: "4pm",
//     interview: {
//       student: "Polina Ilina",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       },
//     },
//   },
// ];
export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
  });
  const setDay = day => setState({ ...state, day });
  //const setDays = d => setState(prev => ({ ...prev, days: d }));  

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then (all=>{
      setState(prev=>({...prev, days: all[0].data, appointments: all[1].data}));
    })
  }, []);

  const objToPassToGetAppointmFunct = {//object to pass to function
    days: state.days,
    appointments: state.appointments
  };

  const dailyAppointments = getAppointmentsForDay(objToPassToGetAppointmFunct, state.day);

  const arr = dailyAppointments.map((appointment) => (
    <Appointment key={appointment.id} {...appointment} />
  ));

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {arr}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
