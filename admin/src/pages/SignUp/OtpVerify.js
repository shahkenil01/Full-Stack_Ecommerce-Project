import { useState } from "react";
import Logo from "../../assets/images/logo.png";
import patern from "../../assets/images/pattern.webp";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import OtpBox from "../../components/OtpBox";

const VerifyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const verify = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Just simulate verification delay
    setTimeout(() => {
      alert("OTP Verified Successfully (Demo Only)");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <img src={patern} className="loginPatern" />
      <section className="loginSection">
        <div className="loginBox">
          <Link to={"/"} className="d-flex align-items-center flex-column logo">
            <img src={Logo} />
            <span className="ml-2">ECOMMERCE</span>
          </Link>

          <div className="wrapper mt-3 card border text-center">
            <form onSubmit={verify}>
              <img src="https://fullstack-ecommerce-add-admin.netlify.app/shield.png" width="80px" />
              <p className="text-center mt-3">
                OTP has been sent to <b>your@email.com</b>
              </p>

              <OtpBox length={6} onChange={handleOtpChange} />

              <div className="form-group mt-3 row">
                <Button type="submit" className="btn-blue btn-lg w-100 btn-big">
                  {isLoading ? <CircularProgress size={24} /> : "Verify OTP"}
                </Button>
              </div>
            </form>
          </div>

          <div className="wrapper mt-3 card border footer p-3">
            <span className="text-center">
              <Link to={"/"} className="link color ml-2">
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
