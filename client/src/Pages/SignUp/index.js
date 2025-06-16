import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import images from '../../assets/images.js';
import { useSnackbar } from "notistack";

const SignUp = () => {
  const context = useContext(MyContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: "client"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, [context]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, phone } = formData;

    const missing = [];
    if (!name) missing.push("Name");
    if (!phone) missing.push("Phone");
    if (!email) missing.push("Email");
    if (!password) missing.push("Password");

    if (missing.length > 0) {
      enqueueSnackbar(`Please enter: ${missing.join(", ")}`, { variant: "error" });
      return;
    }

    try {
      const checkEmail = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const checkRes = await checkEmail.json();
      if (!checkEmail.ok) throw new Error(checkRes.msg || "Email check failed");

      const otpRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const otpData = await otpRes.json();
      if (!otpRes.ok) throw new Error(otpData.msg || "OTP send failed");

      localStorage.setItem("pendingEmail", email);
      localStorage.setItem("pendingUserData", JSON.stringify(formData));

      enqueueSnackbar("OTP sent to your email", { variant: "success" });
      navigate("/verifyOTP");

    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return (
    <section className="section signInPage signUpPage">
      <div className="shape-bottom">
        <svg fill="#fff" id="Layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8">
          <path className="st0" d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path>
        </svg>
      </div>

      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center">
            <img src={images.logo} alt="logo" />
          </div>

          <form className="mt-2" onSubmit={handleSubmit}>
            <h2 className="mb-3">Sign Up</h2>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <TextField label="Name" type="text" variant="standard" className="w-100"
                    name="name" value={formData.name} onChange={handleChange} />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <TextField label="Phone No" type="text" variant="standard" className="w-100"
                    name="phone" value={formData.phone} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <TextField label="Email" type="email" variant="standard" className="w-100"
                name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <TextField label="Password" type="password" variant="standard" className="w-100"
                name="password" value={formData.password} onChange={handleChange} />
            </div>

            <a href="/" className="border-effect cursor txt">Forgot Password?</a>

            <div className="d-flex align-items-center mt-3 mb-3">
              <Button type="submit" className="btn-blue col btn-lg btn-big bg-blue">Sign Up</Button>
              <Link to="/" className="d-block col">
                <Button className="cancel-btn btn-lg btn-big col" variant="outlined"
                  onClick={() => { setTimeout(() => { context.setisHeaderFooterShow(true); }, 0); }}>
                  Cancel
                </Button>
              </Link>
            </div>

            <p className="txt">
              Already Registered? <Link to="/signIn" className="border-effect">&nbsp;Sign In</Link>
            </p>

            <h6 className="mt-4 text-center font-weight-bold">Or continue with social account</h6>

            <Button className="loginWithGoogle mt-2 w-100" variant="outlined">
              <img src={images.Google_Icons} alt="Google" />Sign In with Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;