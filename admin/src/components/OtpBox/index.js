import React, { useState } from "react";

const OtpInput = ({ length = 6, onChange = () => {} }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; // Only allow digits or empty

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    onChange(updatedOtp.join(""));

    if (value && index < length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }} className="otpBox">
      {otp.map((value, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={value}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          style={{
            width: "45px",
            height: "45px",
            textAlign: "center",
            fontSize: "18px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      ))}
    </div>
  );
};

export default OtpInput;
