import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import {withRouter} from 'react-router';
import { useLocation } from 'react-router-dom'

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 250,
    backgroundColor: '#F4F1DE',
    border: '2px solid #3D405B',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  nameInput: {
    display: 'block',
    margin:10
  }
}));

const FolderNameModal = props => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const location = useLocation();
  let parent = location.pathname.split('/')[1] || '/';

  console.log(parent);
  
  const body = (
    <div style={modalStyle} className={classes.paper}>
       <h2 id="Create Folder">Create a Folder</h2>
      <form onSubmit = {(e) => {props.toggleModal(); props.submit(e)}}>
        <input type='text' name='parent' value = {parent} readOnly/>
        <label htmlFor='name'>Folder Name:</label> 
        <input className={classes.nameInput} type = 'text' name='name' id = 'name' placeholder='Folder Name' />
        <br />
        <Button m={2} type='submit' variant="contained" color="primary" >
          Create
        </Button>
      </form>
    </div>
  );

  return (
    <div>
      <Modal
        open={props.open}
        onClose = {props.toggleModal}
        aria-labelledby="Create Folder"
        aria-describedby="Enter Folder name"
      >
        {body}
      </Modal>
    </div>
  );
}

export default withRouter(FolderNameModal);