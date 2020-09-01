import React, {useState, useRef} from 'react';
import classes from './Upload.module.css'

const UploadButton = props => {
  const [uploading, setUploading] = useState(false) 
  const formEl = useRef();

  const submit = () => {
    const form = formEl.current;
    const event = new Event('submit')
    form.dispatchEvent(event);
  }

  const uploadFiles = async (event) => {
    event.preventDefault();
    setUploading(true);
    const formData = new FormData(event.target);
    console.log(formData);
    try{
        const res = await fetch('http://localhost:3001/files/upload', {
            method: 'post',
            body: formData,
            // credentials: "include"
        })
        if(res.status === 201){
          props.fetch();
          setUploading(false);
        }
        else {
          throw new Error('Failed to upload') 
        }
    } catch(err) {
        console.log(err);
    }
  }
  let form = (
    <form className={classes.Upload} ref={formEl} onSubmit = {uploadFiles}>
      <label htmlFor="files"> + Upload</label>
      <input type="file" name="files" id="files" multiple onChange={submit} />
    </form>
  )

  if(uploading){
    form = <p className={classes.Upload} >Uploading...</p>
  }

  return form
}

export default UploadButton;