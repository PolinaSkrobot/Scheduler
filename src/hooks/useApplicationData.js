import { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";
require("dotenv").config();

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    //api calls and setting new state with json data
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  useEffect(() => {
    //connection to the websocket server
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    ws.addEventListener("open", () => {
      // console.log("Connected!!!");
    });
    ws.onopen = function (event) {
      // ws.send("ping");
    };
    ws.onmessage = function (event) {
      const msg = JSON.parse(event.data);

      if (msg.type === "SET_INTERVIEW") {
        const newApp = {
          ...state.appointments[msg.id],
          interview: msg.interview,
        };
        const newApps = { ...state.appointments, [msg.id]: newApp };
        const newDays = updateSpots(msg.id, newApps);
        setState((prev) => ({//setter to render the page
          ...prev,
          appointments: newApps,
          days: newDays,
        }));

      }
    };
    return () => ws.close();
  });

  function updateSpots(id, appointments_) {
    const newDays = [...state.days].map((day) => {
      let vacSpots = 0;
      if (day.appointments.includes(id)) {
        for (const app_id of day.appointments) {
          if (appointments_[app_id].interview === null) {
            vacSpots += 1;
          }
        }
        day.spots = vacSpots;
      }
      return day;
    }); 
    return newDays;  
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments_ = { //new appointments obj with passed interview data
      ...state.appointments,
      [id]: appointment,
    };

    return axios //request to the server
      .put(`/api/appointments/${id}`, {
        interview,
      })
      .then(() => {
        const newDays = updateSpots(id, appointments_);
        setState((prev) => ({//setter to render the page
          ...prev,
          appointments: appointments_,
          days: newDays,
        }));
      });
  }

  function cancelInterview(id, interview_) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments_ = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios
      .delete(`/api/appointments/${id}`, {
        interview_,
      })
      .then(() => {
        const newDays = updateSpots(id, appointments_);
        setState((prev) => ({//setter to render the page
          ...prev,
          appointments: appointments_,
          days: newDays,
        }));
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
