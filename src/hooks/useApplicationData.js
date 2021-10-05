import { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";

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
