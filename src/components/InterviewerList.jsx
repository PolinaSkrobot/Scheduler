import React from 'react';
import 'components/InterviewerList.scss';
import InterviewerListItem from './InterviewerListItem';
import PropTypes from 'prop-types';


function InterviewerList(props) {
  
  const arr = props.interviewers.map(interviewer =>
     <InterviewerListItem 
     
      key={interviewer.id}
      id={interviewer.id}
      avatar={interviewer.avatar} 
      name={interviewer.name}
      selected={interviewer.id === props.value}
      setInterviewer_={() => props.onChange(interviewer.id)}
    />
  );

  return (
    <section className="interviewers">
    <h4 className="interviewers__header text--light">Interviewer</h4>
    <ul className="interviewers__list">
    {arr}
    </ul>
  </section>
  );
}
InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};
export default InterviewerList;