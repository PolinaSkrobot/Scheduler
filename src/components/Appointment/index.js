import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  console.log('props from Appo', props);
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_CANCEl = "ERROR_CANCEL";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
    
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(()=> transition(SHOW))
    .catch(error => transition(ERROR_SAVE, true));

  }

  function cancel(id) {
    const interview = null;
    transition(DELETING, true);
    props.cancelInterview(id, interview)
      .then(()=> transition(EMPTY))
      .catch(error => transition(ERROR_CANCEl, true));

  }


  return (
    <article className="appointment">
      <Header time={props.time} />
      {/* {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer} />: <Empty />} */}
      {mode === EMPTY && <Empty onAdd={()=>transition(CREATE)} />}
      {mode=== SAVING && <Status message={'Saving'}/>}
      {mode=== DELETING && <Status message={'Deleting'}/>}
      {mode=== ERROR_SAVE && <Error message={'Could not save appointment'} onClose={back}/>}
      {mode=== ERROR_CANCEl && <Error message={'Could not cancel appointment'} onClose={back}/>}
      {mode=== CONFIRM && <Confirm message={'Are you sure you want to delete the appointment?'} onCancel={back} onConfirm={()=>cancel(props.id)}/>}
      {mode=== EDIT && <Form 
        name={props.interview.student} 
        interviewer={props.interview.interviewer.id}
        interviewers={props.func}
        onCancel={()=> transition(SHOW)} onSave= {save}
        />}
      {mode === SHOW && (
        
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={()=> transition(CONFIRM)}
          onEdit={()=> transition(EDIT)}
        />
      )}
      {mode===CREATE && <Form interviewers={props.func} onCancel={back} onSave={save}/>}
    </article>
  );
}
