import React, { useRef, useContext } from "react";
import classes from "./Upload.module.css";
import { AllFilesContext } from "../../context/filesContext";
import { withRouter } from "react-router";
import { useLocation } from "react-router-dom";

const UploadButton = () => {
  const formEl = useRef();
  const uploading = useContext(AllFilesContext).uploading;
  const uploadPercent = useContext(AllFilesContext).uploadPercent;
  const uploadFiles = useContext(AllFilesContext).uploadFiles;

  const submit = () => {
    const form = formEl.current;
    const event = new Event("submit");
    form.dispatchEvent(event);
  };

  const location = useLocation();
  let parent = location.pathname.split("/")[1] || "/";

  let form = (
    <form className={classes.Upload} ref={formEl} onSubmit={uploadFiles}>
      <label htmlFor="files"> + Upload </label>
      <input type="text" name="parent" value={parent} readOnly />
      <input type="file" name="files" id="files" multiple onChange={submit} />
    </form>
  );

  if (uploading) {
    form = (
      <progress className={classes.Upload} value={uploadPercent} max={100}>
        {" "}
        {uploadPercent}%{" "}
      </progress>
    );
  }

  return form;
};

export default withRouter(UploadButton);
