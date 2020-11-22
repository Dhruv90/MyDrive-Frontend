import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { useLocation } from 'react-router-dom'

// function rand() {
//   return Math.round(Math.random() * 20) - 10;
// }

// function getModalStyle() {

//   return {
//     top: `50%`,
//     left: `50%`,
//     transform: `translate(-${top}%, -${left}%)`,
//   };
// }

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 250,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  nameInput: {
    display: 'block',
    margin:10
  }
}));

const ConfirmDeleteModal = props => {
  const classes = useStyles();
  // const [modalStyle] = React.useState(getModalStyle);

  const location = useLocation();
  let parent = location.pathname.split('/')[1] || '/';

  console.log(parent);
  
  const body = (
    <div  style={{ top: `30%`,
                  left: `20%`,
                  fontSize: 'small'
                }} 
          className={classes.paper}
    >
       <h2 id="Confirm Delete">Are you sure you want to delete these Files/Folders(and all their contents)?</h2>
        <Button m={2} type='button' onClick = {() => {props.confirm(); props.cancel();}} variant="contained" color="secondary" >Confirm</Button>
        <Button m={2} type='button' onClick = {props.cancel}  variant="contained" color="primary">Cancel</Button>
    </div>
  );

  return (
    <div>
      <Modal
        open={props.open}
        onClose = {props.cancel}
        aria-labelledby="Delete Confirm Modal"
        aria-describedby="Delete Confirm Modal"
      >
        {body}
      </Modal>
    </div>
  );
}

export default ConfirmDeleteModal;