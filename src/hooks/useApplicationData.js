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

  useEffect(() => {//api calls and setting new state with json data
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

  useEffect(()=> {//connection to the websocket server
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
        ws.addEventListener("open", ()=>{
          console.log("Connected!!!");
        });
        ws.onopen = function (event) {
          // ws.send("ping");
        };
        ws.onmessage = function(event) {
          const msg = JSON.parse(event.data);

          if (msg.type === "SET_INTERVIEW") {
            const newApp={...state.appointments[msg.id], interview: msg.interview };
            const newApps={...state.appointments, [msg.id]: newApp};
            updateSpots(newApps);            
          }

        };
        return () => ws.close();
  })

  function updateSpots(appointments_) {
    const objToPassToFunct = {//object to pass to function      
      ...state,
      appointments: appointments_,
    };
    const dailyAppointments = getAppointmentsForDay(//call hepler function to get app-s for the day
      objToPassToFunct,
      state.day
    );
    const filteredSpots = dailyAppointments.filter(//looking for nulls
      (elem) => elem.interview === null
    );
    const newDays = [...state.days];//copy content of state.day

    for (let i = 0; i < newDays.length; i++) {//looking for the day to change the num of available spots
      if (newDays[i].name === state.day) {
        newDays[i].spots = filteredSpots.length;
      }
    }

    setState((prev) => ({//setter to render the page
      ...prev,
      appointments: appointments_,
      days: newDays
    }));
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments_ = {//new appointments obj with passed interview data
      ...state.appointments,
      [id]: appointment,
    };

    return axios//request to the server
      .put(`/api/appointments/${id}`, {
        interview,
      })
      .then(() => {
        updateSpots(appointments_);
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
        updateSpots(appointments_);
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
