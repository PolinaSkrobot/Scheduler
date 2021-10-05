// const state_ = {
//   days: [
//     {
//       id: 1,
//       name: "Monday",
//       appointments: [1, 2, 3],
//     },
//     {
//       id: 2,
//       name: "Tuesday",
//       appointments: [4, 5],
//     },
//   ],
//   appointments: {
//     1: { id: 1, time: "12pm", interview: null },
//     2: { id: 2, time: "1pm", interview: null },
//     3: {
//       id: 3,
//       time: "2pm",
//       interview: { student: "Archie Cohen", interviewer: 2 },
//     },
//     4: { id: 4, time: "3pm", interview: null },
//     5: {
//       id: 5,
//       time: "4pm",
//       interview: { student: "Chad Takahashi", interviewer: 2 },
//     },
//   },
//   interviewers: {
//     1: {
//       id: 1,
//       name: "Sylvia Palmer",
//       avatar: "https://i.imgur.com/LpaY82x.png",
//     },
//     2: {
//       id: 2,
//       name: "Tori Malcolm",
//       avatar: "https://i.imgur.com/Nmx0Qxo.png",
//     },
//   },
// };
export function getAppointmentsForDay(state, day_) {
  const result = [];
  const dayObj = state.days.find((d) => d.name === day_);
  if (dayObj) {
    for (let appId of dayObj.appointments) {
      result.push(state.appointments[appId]);
    }
  }
  return result;
}

export function getInterview(state, interview) {
  const newObj = {};
  if (interview!==null) {
    const id_ = interview.interviewer;
    newObj.student = interview.student;
    newObj.interviewer = state.interviewers[id_];
    return newObj;
  } else {
  return null;
  }
}

export function getInterviewersForDay(state, day_) {
  const result = [];
  const dayObj = state.days.find((d) => d.name === day_);
  if (dayObj) {
    for (let appId of dayObj.interviewers) {
      result.push(state.interviewers[appId]);
    }
  }

  return result;
}


//getInterview(state_, state_.appointments["3"].interview);
