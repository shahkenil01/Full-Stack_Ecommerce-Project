import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import OtpInput from "../../Components/OtpBox";
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import images from '../../assets/images';

const OtpVerify = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [resending, setResending] = useState(false);

  const email = localStorage.getItem("pendingEmail");
  const userData = localStorage.getItem("pendingUserData");

  useEffect(() => {
    context.setisHeaderFooterShow(false);
    const email = localStorage.getItem("pendingEmail");
    const userData = localStorage.getItem("pendingUserData");

    const isVerified = localStorage.getItem("userToken");

    if ((!email || !userData) && !isVerified) {
      navigate("/signup", { replace: true });
    }
    return () => context.setisHeaderFooterShow(true);
  }, [context]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const verifyRes = await fetch("http://localhost:4000/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.msg || "OTP Verification Failed");

      enqueueSnackbar("OTP verified successfully!", { variant: "success" });

      const parsedUser = JSON.parse(userData || '{}');
      parsedUser.role = "client";

      const signupRes = await fetch("http://localhost:4000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedUser),
      });
      const signupData = await signupRes.json();
      if (!signupRes.ok) throw new Error(signupData.msg || "Signup Failed");

      enqueueSnackbar("Account created!", { variant: "success" });

      localStorage.setItem("userToken", signupData.token);
      localStorage.setItem("userInfo", JSON.stringify({
        name: signupData.user.name,
        email: signupData.user.email,
        phone: signupData.user.phone
      }));

      context.setIsLogin(true);
      context.setUser(signupData.user);

      localStorage.removeItem("pendingEmail");
      localStorage.removeItem("pendingUserData");

      navigate("/", { replace: true });

    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResending(true);
      setTimer(30);

      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to resend OTP");

      enqueueSnackbar("OTP resent to your email!", { variant: "success" });

    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="section signInPage otpPage">
      <div className="shape-bottom">
        <svg fill="#fff" viewBox="0 0 1921 819.8">
          <path className="st0" d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path>
        </svg>
      </div>
      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center">
            <img src={images.shield} alt="shield" width="100px" />
          </div>
          <form className="mt-3" onSubmit={handleVerify}>
            <h2 className="mb-1 text-center">OTP Verification</h2>
            <p className="text-center text-light">OTP sent to <br /><b>{email}</b></p>
            <OtpInput onChange={setOtp} length={6} />
            <div className="d-flex align-items-center mt-3 mb-3">
              <Button type="submit" className="btn-blue col btn-lg btn-big bg-blue" disabled={loading}>
                {loading ? <span className="dot-loader"></span> : "Verify OTP"}
              </Button>
            </div>
            <div className="text-center">
              {timer > 0 ? (
                <span className="text-muted">Resend OTP in {timer}s</span>
              ) : (
                <Link variant="text" onClick={resendOtp} className="border-effect">
                  Resend OTP
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OtpVerify;