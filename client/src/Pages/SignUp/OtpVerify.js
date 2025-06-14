import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import OtpInput from "../../Components/OtpBox";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import images from '../../assets/images';

const OtpVerify = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("pendingEmail");
  const userData = localStorage.getItem("pendingUserData");

  useEffect(() => {
    context.setisHeaderFooterShow(false);
    if (!email || !userData) navigate("/signUp", { replace: true });
    return () => context.setisHeaderFooterShow(true);
  }, [context, email, userData, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verify OTP
      const verifyRes = await fetch("http://localhost:4000/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.msg || "OTP Verification Failed");

      enqueueSnackbar("OTP verified successfully!", { variant: "success" });

      // Parse user data from localStorage
      const parsedUser = JSON.parse(userData || '{}');
      const missing = [];

      if (!parsedUser.name) missing.push("name");
      if (!parsedUser.email) missing.push("email");
      if (!parsedUser.phone) missing.push("phone");
      if (!parsedUser.password) missing.push("password");

      if (missing.length > 0) {
        enqueueSnackbar(`Please fill: ${missing.join(", ")}`, { variant: "error" });
        navigate("/signUp", { replace: true });
        return;
      }

      // Signup user
      const signupRes = await fetch("http://localhost:4000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedUser),
      });
      const signupData = await signupRes.json();
      if (!signupRes.ok) throw new Error(signupData.msg || "Signup Failed");

      enqueueSnackbar("Account created!", { variant: "success" });

      // Set logged-in state
      localStorage.setItem("userToken", signupData.token);
      localStorage.setItem("userInfo", JSON.stringify(signupData.user));
      context.setIsLogin(true);
      context.setUser(signupData.user);

      // Clean up
      localStorage.removeItem("pendingEmail");
      localStorage.removeItem("pendingUserData");

      navigate("/", { replace: true });

    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section signInPage otpPage">
      <div className="shape-bottom">
        <svg fill="#fff" viewBox="0 0 1921 819.8">
          <path className="st0" d="M1921,413.1v406.7H0V0.5h0.4l228.1..."></path>
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
          </form>
        </div>
      </div>
    </section>
  );
};

export default OtpVerify;