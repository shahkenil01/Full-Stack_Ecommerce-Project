import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Logo from "../../assets/images/logo.png";
import pattern from "../../assets/images/pattern.webp";
import { useSnackbar } from 'notistack';
import { MyContext } from "../../App";
import OtpBox from "../../components/OtpBox";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { setIsLogin, setUser } = useContext(MyContext);

  const backend = process.env.REACT_APP_BACKEND_URL;

  const postData = async (url, body) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Something went wrong");
    return data;
  };

  useEffect(() => {
    if (step === 2 && otp.length === 6) {
      handleVerifyOtp(new Event("submit"));
    }
  }, [otp, step]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return enqueueSnackbar("Please enter your email", { variant: "error" });

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
    if (!newPass || !confirmPass) return enqueueSnackbar("Please fill all fields", { variant: "error" });
    if (newPass !== confirmPass) return enqueueSnackbar("Passwords do not match", { variant: "error" });

    try {
      setLoading(true);
      await postData(`${backend}/api/user/reset-password`, { email, newPassword: newPass });
      enqueueSnackbar("Password changed successfully", { variant: "success" });
      navigate("/login", { replace: true });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <img src={pattern} className="loginPatern" alt="Pattern" />
      <section className="loginSection">
        <div className="loginBox">
          <div className="d-flex align-items-center flex-column logo">
            <img src={Logo} width="60px" alt="Logo" />
            <h5 className='font-weight-bold'>Reset Your Password</h5>
          </div>

          <div className="wrapper mt-3 card border text-center">
            <form onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword}>
              {step === 1 && (
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control padding"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}

              {step === 2 && (
                <>
                  <p className="text-center">OTP sent to <b>{email}</b></p>
                  <OtpBox length={6} onChange={setOtp} />
                </>
              )}

              {step === 3 && (
                <>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control padding"
                      placeholder="Enter new password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control padding"
                      placeholder="Confirm new password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="form-group mt-3">
                <Button type="submit" className="btn-blue btn-lg w-100 btn-big" style={{ height: "45px" }}>
                  {loading ? <span className="dot-loader"></span> : step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Reset Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgetPassword;
