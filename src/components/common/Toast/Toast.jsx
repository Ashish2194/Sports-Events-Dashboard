import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, onDismiss, type }) => {
  useEffect(() => {
    setTimeout(() => onDismiss(), 5000);
  }, [onDismiss]);

  return <div data-testid="toast" className={`toast ${type ? type : ""}`}>{message}</div>;
};

export default Toast;
