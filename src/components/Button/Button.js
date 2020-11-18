import React from 'react';
import classes from './Button.module.css'

const Button = props => {
  const styles = props.active ? classes.ActiveButton : classes.Button
  return(
    <button onClick = {props.click} className={styles} type="button">{props.children}</button>
  )
}

export default Button;