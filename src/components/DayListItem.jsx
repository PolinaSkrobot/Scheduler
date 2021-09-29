import React from 'react';
import classNames from 'classnames';
import 'components/DayListItem.scss';
export default function DayListItem(props) {
  let dayClass = classNames('day-list__item', {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots
  });
  const formatSpots = (n) =>{
    if (n===0) {
    return `no spots remaining`;
    }
    else if (n===1) {
      return `${n} spot remaining`;
    
    }
    else {
      return `${n} spots remaining`
    }
  };
  const value = props.spots;
  return (
    <li className = {dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(value)}</h3>
    </li>
  );
}