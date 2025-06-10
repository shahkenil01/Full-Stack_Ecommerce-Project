import { useState } from "react";
import Logo from "../../assets/images/logo.png";
import patern from "../../assets/images/pattern.webp";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import OtpBox from "../../components/OtpBox";
import { useSnackbar } from 'notistack';

const VerifyAccount = () => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const email = localStorage.getItem("pendingEmail");

  const handleOtpChange = (value) => setOtp(value);

  const verify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Verification failed");

      enqueueSnackbar("OTP Verified Successfully!", { variant: "success" });

      const userData = JSON.parse(localStorage.getItem("pendingUserData"));
      if (!userData) throw new Error("Missing user data for signup");

      const signupRes = await fetch("http://localhost:4000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const signupData = await signupRes.json();
      if (!signupRes.ok) throw new Error(signupData.msg || "Signup failed");

      enqueueSnackbar("Account created successfully!", { variant: "success" });

      localStorage.setItem("userToken", signupData.token);
      localStorage.setItem("userInfo", JSON.stringify(signupData.user));

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
    <>
      <img src={patern} className="loginPatern" />
      <section className="loginSection">
        <div className="loginBox">
          <Link to="/" className="d-flex align-items-center flex-column logo">
            <img src={Logo} />
            <span className="ml-2">ECOMMERCE</span>
          </Link>

          <div className="wrapper mt-3 card border text-center">
            <form onSubmit={verify}>
              <img src="https://fullstack-ecommerce-add-admin.netlify.app/shield.png" width="80px" />
              <p className="text-center mt-3"> OTP has been sent to <b>{email || "your@email.com"}</b> </p>

              <OtpBox length={6} onChange={handleOtpChange} />

              <div className="form-group mt-3 row">
                <Button type="submit" className="btn-blue btn-lg w-100 btn-big">
                  {loading ? <span className="dot-loader"></span> : "Verify OTP"}
                </Button>
              </div>
            </form>
          </div>

          <div className="wrapper mt-3 card border footer p-3">
            <span className="text-center">
              <Link to="/" className="link color ml-2">
                Resend OTP
              </Link>
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default VerifyAccount;