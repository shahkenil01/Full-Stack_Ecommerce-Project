import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import images from "../../assets/images";
import { useSnackbar } from "notistack";
import OtpInput from "../../Components/OtpBox";

const ForgetPassword = () => {
  const { setisHeaderFooterShow } = useContext(MyContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setisHeaderFooterShow(false);
    return () => setisHeaderFooterShow(true);
  }, [setisHeaderFooterShow]);

  useEffect(() => {
    if (step === 2 && otp.length === 6) {
      handleVerifyOtp(new Event("submit"));
    }
  }, [otp, step]);

  const backend = process.env.REACT_APP_BACKEND_URL;
  const postData = async (url = "", body = {}) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Something went wrong");
    return data;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return enqueueSnackbar("Please enter your email", { variant: "error" });

    try {
      setLoading(true);
      await postData(`${backend}/api/user/request-password-reset`, { email });
      enqueueSnackbar("OTP sent to your email", { variant: "success" });
      setStep(2);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return enqueueSnackbar("Invalid OTP", { variant: "error" });

    try {
      setLoading(true);
      await postData(`${backend}/api/user/verify-reset-otp`, { email, otp });
      enqueueSnackbar("OTP verified", { variant: "success" });
      setStep(3);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPass || !confirmPass) return enqueueSnackbar("Fill all password fields", { variant: "error" });
    if (newPass !== confirmPass) return enqueueSnackbar("Passwords do not match", { variant: "error" });

    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: newPass }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Reset failed");

      enqueueSnackbar("Password changed successfully", { variant: "success" });
      navigate("/signIn", { replace: true });

    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section signInPage">
      <div className="shape-bottom">
        <svg fill="#fff" viewBox="0 0 1921 819.8">
          <path d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path>
        </svg>
      </div>

      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center">
            <img src={images.logo} alt="logo" />
          </div>

          <form className="mt-3" onSubmit={
            step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword
          }>
            <h2 className="mb-4 text-center">Forgot Password</h2>

            {step === 1 && (
              <div className="form-group">
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="standard"
                  className="w-100"
                />
              </div>
            )}

            {step === 2 && (
              <>
                <p className="text-center text-light">
                  OTP sent to <b>{email}</b>
                </p>
                <OtpInput onChange={setOtp} length={6} />
              </>
            )}

            {step === 3 && (
              <>
                <div className="form-group">
                  <TextField
                    label="New Password"
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    variant="standard"
                    className="w-100"
                  />
                </div>
                <div className="form-group">
                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    variant="standard"
                    className="w-100"
                  />
                </div>
              </>
            )}

            <div className="d-flex align-items-center mt-3 mb-3">
              <Button
                type="submit"
                className="btn-blue col btn-lg btn-big bg-blue"
                disabled={loading}
                style={{ height: "45px" }}
              >
                {loading ? (
                  <span className="dot-loader"></span>
                ) : step === 1 ? (
                  "Send OTP"
                ) : step === 2 ? (
                  "Verify OTP"
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
