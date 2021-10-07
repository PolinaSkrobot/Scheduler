
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

