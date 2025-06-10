import { useState, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail } from "react-icons/md";
import { TiHome } from "react-icons/ti";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserCircle, FaPhoneAlt } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Button } from '@mui/material';
import Google_Icons from '../../assets/images/Google_Icons.png';
import Logo from '../../assets/images/logo.png';
import pattern from '../../assets/images/pattern.webp';
import { MyContext } from '../../App';
import { useSnackbar } from 'notistack';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const context = useContext(MyContext);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' ,phone: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const focusInput = (index) => setInputIndex(index);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords does not match", { variant: "error" });
      setLoading(false);
      return;
    }

    try {
  const otpRes = await fetch("http://localhost:4000/api/user/request-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const otpData = await otpRes.json();
  if (!otpRes.ok) throw new Error(otpData.msg || "Failed to send OTP");

  enqueueSnackbar("OTP sent to your email!", { variant: "success" });

  localStorage.setItem("pendingEmail", email);
  localStorage.setItem("pendingUserData", JSON.stringify({ name, email, password, phone }));

  navigate("/verify-account");

} catch (err) {
  enqueueSnackbar(err.message, { variant: "error" });
} finally {
  setLoading(false);
}
  };

  return (
    <>
      <img src={pattern} className="loginPatern" alt="Pattern" />
      <section className="loginSection signUpSection">
        <div className="row">
          <div className="col-md-8 d-flex align-items-center flex-column part1 justify-content-center">
            <div>
              <h1>
                BEST UX/UI FASHION <br />
                <span className="text-sky">ECOMMERCE DASHBOARD</span> & <br />
                ADMIN PANEL
              </h1>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                It has survived not only five centuries
              </p>
              <div className="w-100 mt-4">
                <Link to={'/'}>
                  <Button className="btn-blue btn-lg btn-big">
                    <TiHome style={{ marginRight: '8px', fontSize: '20px', marginTop: '-3px' }} />Go To Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="loginBox">
              <div className="logo text-center">
                <img src={Logo} width="60px" alt="Logo" />
                <h5 className="font-weight-bold">Register a new account</h5>
              </div>

              <div className="wrapper signup mt-3 card">
                <form onSubmit={handleSubmit}>
                  <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                    <span className="icon"><FaUserCircle /></span>
                    <input type="text" className="form-control" placeholder="enter your name" name="name"
                      onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus
                      onChange={handleChange} value={formData.name} />
                  </div>

                  <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                    <span className="icon"><MdEmail /></span>
                    <input type="email" className="form-control" placeholder="enter your email" name="email"
                      onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)}
                      onChange={handleChange} value={formData.email} />
                  </div>

                  <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                    <span className="icon"><FaPhoneAlt /></span>
                    <input type="number" className="form-control" placeholder="enter your Phone Number" name="phone"
                      onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)}
                      onChange={handleChange} value={formData.phone} />
                  </div>

                  <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                    <span className="icon"><RiLockPasswordFill /></span>
                    <input ref={passwordRef} className="form-control" placeholder="enter your password" name="password"
                      type={isShowPassword ? "text" : "password"} onFocus={() => focusInput(2)}
                      onBlur={() => setInputIndex(null)} onChange={handleChange} value={formData.password} />
                    {inputIndex === 2 && (
                      <span className="toggleShowPassword" tabIndex="0"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setIsShowPassword(!isShowPassword);
                          passwordRef.current?.focus();
                        }}>
                        {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                      </span>
                    )}
                  </div>

                  <div className={`form-group position-relative ${inputIndex === 3 && 'focus'}`}>
                    <span className="icon"><IoShieldCheckmarkSharp /></span>
                    <input ref={confirmPasswordRef} className="form-control" placeholder="confirm your password" name="confirmPassword"
                      type={isShowConfirmPassword ? "text" : "password"} onFocus={() => focusInput(3)}
                      onBlur={() => setInputIndex(null)} onChange={handleChange} value={formData.confirmPassword} />
                    {inputIndex === 3 && (
                      <span className="toggleShowPassword" tabIndex="0"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setIsShowConfirmPassword(!isShowConfirmPassword);
                          confirmPasswordRef.current?.focus();
                        }}>
                        {isShowConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <Button type="submit" className="btn-blue btn-lg btn-big w-100" disabled={loading} >
                      {loading ? ( <span className="dot-loader"></span> ) : ( 'Sign Up' )}
                    </Button>
                  </div>

                  <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                    <span className="line"></span> <span className="txt">or</span> <span className="line"></span>
                  </div>

                  <Button variant="outlined" className="w-100 btn-lg btn-big loginWithGoogle">
                    <img src={Google_Icons} width="25px" alt="Google Icon" /> &nbsp; Sign Up with Google
                  </Button>
                </form>

                <span className="text-center d-block mt-3">
                  Already have an account?
                  <Link to={'/login'} className="link color ml-2">Sign In</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;