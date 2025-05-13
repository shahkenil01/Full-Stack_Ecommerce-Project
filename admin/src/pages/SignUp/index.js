import { useState, useRef } from 'react';
import Logo from '../../assets/images/logo.png';
import pattern from '../../assets/images/pattern.webp';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Google_Icons from '../../assets/images/Google_Icons.png';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { TiHome } from "react-icons/ti";

const SignUp = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const focusInput = (index) => {
    setInputIndex(index);
  }

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

              <div className="wrapper mt-3 card">
                <form>
                  <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                    <span className="icon"><FaUserCircle /></span>
                    <input type="text" className="form-control" placeholder="enter your name" onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus/>
                  </div>

                  <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                    <span className="icon"><MdEmail /></span>
                    <input type="email" className="form-control" placeholder="enter your email" onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)}/>
                  </div>

                  <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                    <span className="icon"><RiLockPasswordFill /></span>
                    <input ref={passwordRef} className="form-control" placeholder="enter your password" 
                      type={isShowPassword ? "text" : "password"} onFocus={() => focusInput(2)} 
                      onBlur={(e) => {
                        if (!e.relatedTarget || !e.relatedTarget.classList.contains('toggleShowPassword')) {
                          setInputIndex(null);
                        }
                      }}/>
                      
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
                    <input ref={confirmPasswordRef} className="form-control" placeholder="confirm your password"
                      type={isShowConfirmPassword ? "text" : "password"} onFocus={() => focusInput(3)}
                      onBlur={(e) => {
                        if (!e.relatedTarget || !e.relatedTarget.classList.contains('toggleShowPassword')) {
                          setInputIndex(null);
                        }
                      }}/>

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

                  <div className="d-flex align-items-center">
                  <FormControlLabel required control={<Checkbox />} label="I agree to all Terms & Conditions" />
                  </div>

                  <div className="form-group">
                    <Button className="btn-blue btn-lg btn-big w-100">Sign Up</Button>
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
  )
}

export default SignUp;