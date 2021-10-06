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

  useEffect(()=> {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
        ws.addEventListener("open", ()=>{
          console.log("Connected!!!");
        });
        ws.onopen = function (event) {
          ws.send("ping");
        };
        ws.onmessage = function(event) {
          // var text = "";
          var msg = JSON.parse(event.data);
          console.log("MESS",msg);

          if (msg.type === "SET_INTERVIEW") {
            console.log("I", msg.interview);
            const newApp={...state.appointments[msg.id], interview: msg.interview };
            console.log("newApp", newApp);
            console.log("AppBefore", {...state.appointments});
            const newApps={...state.appointments, [msg.id]: newApp};
            console.log("newApps", newApps);
            updateSpots(newApps);
            //setState({...state, appointments: newApps})
            
          }
     
          // if (text.length) {
          //   f.write(text);
          //   document.getElementById("chatbox").contentWindow.scrollByPages(1);
          // }

        };
        return () => ws.close();
  })

  function updateSpots(appointments_) {
    const objToPassToGetAppointmFunct = {
      //object to pass to function
      ...state,
      appointments: appointments_,
    };
    const dailyAppointments = getAppointmentsForDay(
      objToPassToGetAppointmFunct,
      state.day
    );
    const filteredSpots = dailyAppointments.filter(
      (elem) => elem.interview === null
    );
    const newDays = [...state.days];

    for (let i = 0; i < newDays.length; i++) {
      if (newDays[i].name === state.day) {
        newDays[i].spots = filteredSpots.length;
      }
    }

    setState((prev) => ({
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
    const appointments_ = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
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
