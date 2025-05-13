import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const Toast = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isError = type === "error";

  const icon = isError ? (
    <AiOutlineCloseCircle size={24} className="mr-2" />
  ) : (
    <AiOutlineCheckCircle size={24} className="mr-2" />
  );

  const bgColor = isError ? "#f44336" : "#4caf50";

  return (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{
        backgroundColor: bgColor,
        color: "#fff",
        padding: "12px 16px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        minWidth: "280px",
        maxWidth: "340px",
        transition: "opacity 0.4s ease-in-out",
        opacity: visible ? 1 : 0,
        fontSize: "15px",
        fontWeight: 500,
      }}>
      <div className="d-flex align-items-center" style={{ flex: 1 }}>
        {icon}
        <span>{message}</span>
      </div>
      <IoMdClose size={20} style={{ marginLeft: "12px", cursor: "pointer" }} onClick={onClose} />
    </div>
  );
};

export default Toast;