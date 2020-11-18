import React from 'react';
import classes from './Message.module.css';

const Message = props => {
  return (
    <div className={classes.Message}>
     <h4>{props.children}</h4>
    </div>
  )
}

export default Message;