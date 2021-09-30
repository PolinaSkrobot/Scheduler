import { declareTypeAlias } from '@babel/types';
import React from 'react';
import DayListItem from './DayListItem';
export default function DayList(props) {
  //console.log(props.days);
 const arr = props.days.map(day => <DayListItem key={day.id} name={day.name} selected={day.name === props.day} spots={day.spots} setDay={props.setDay}/>);
  return (
    <ul>
 {arr}
 </ul>
  );
}