import React from "react";
import { useEffect } from "react";

const Alert = ({ type, message, showAlert }) => {
  useEffect(() => {
    const timeOut = setTimeout(() => {
      showAlert();
    }, 2000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);
  return <p className={`alert alert-${type}`}>{message}</p>;
};

export default Alert;
