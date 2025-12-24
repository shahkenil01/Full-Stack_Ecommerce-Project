import { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff} from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { Button } from '@mui/material';
import Logo from '../../assets/images/logo.png';
import pattern from '../../assets/images/pattern.webp';
import Google_Icons from '../../assets/images/Google_Icons.png';
import { useSnackbar } from 'notistack';
import { MyContext } from '../../App';
import { GoogleLogin } from "@react-oauth/google";
import { postData } from "../../utils/api";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const googleBtnRef = useRef(null);

  const focusInput = (index) => setInputIndex(index);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      enqueueSnackbar("Please fill email & password", { variant: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await postData("/api/user/signin", { email, password });

      if (!res?.token) throw new Error("Login failed");

      // 🔴 ADMIN CHECK
      if (res.user.role !== "admin") {
        enqueueSnackbar("Admin access denied", { variant: "error" });
        return;
      }

      localStorage.setItem("userToken", res.token);
      localStorage.setItem("userInfo", JSON.stringify(res.user));
      context.setUser(res.user);
      context.setIsLogin(true);

      enqueueSnackbar("Admin login successful", { variant: "success" });
      navigate("/", { replace: true });
    } catch (err) {
      enqueueSnackbar(err.message || "Login failed", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return(
    <>
      <img src={pattern} className='loginPatern' alt="Pattern"/>
      <section className="loginSection">
        <div className="loginBox">
          <div className='logo text-center'>
            <img src={Logo} width="60px" alt="Logo"/>
            <h5 className='font-weight-bold'>Login to Hotash</h5>
          </div>

          <div className='wrapper mt-3 card border'>
            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                <span className='icon'><MdEmail /></span>
                <input
                  type='email'
                  name='email'
                  className='form-control'
                  placeholder='enter admin email'
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => focusInput(0)}
                  onBlur={() => setInputIndex(null)}
                />
              </div>

              {/* PASSWORD */}
              <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                <span className='icon'><RiLockPasswordFill /></span>
                <input
                  className="form-control"
                  placeholder="enter password"
                  type={isShowPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => focusInput(1)}
                  onBlur={() => setInputIndex(null)}
                />

                {inputIndex === 1 && (
                  <span className="toggleShowPassword"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsShowPassword(!isShowPassword);
                    }}>
                    {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                  </span>
                )}
              </div>

              <div className='form-group'>
                <Button className="btn-blue btn-lg btn-big w-100" type="submit" disabled={loading} style={{ height: "45px"}}>
                  {loading ? <span className="dot-loader"></span> : "Sign In"}
                </Button>
              </div>

              <div className='form-group text-center mb-0'>
                <Link to={'/forgot-password'} className='link'>FORGOT PASSWORD</Link>
              </div>

              <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                <span className="line"></span>
                <span className="txt">or</span>
                <span className="line"></span>
              </div>

              <Button variant='outlined' className="w-100 btn-lg btn-big loginWithGoogle"
                onClick={() => {
                  const btn = googleBtnRef.current.querySelector('div[role="button"]');
                  if (btn) btn.click();
                }}
              >
                <img src={Google_Icons} width="25px" alt='Google' /> &nbsp;
                Sign In with Google
              </Button>

              {/* HIDDEN GOOGLE LOGIN */}
              <div style={{ display: 'none' }} ref={googleBtnRef}>
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const res = await postData("/api/user/google-precheck", {
                        token: credentialResponse.credential,
                      });

                      // 🔴 ADMIN CHECK
                      if (res.existingUser) {

                      if (res.user.role !== "admin") {
                        enqueueSnackbar("Admin access denied", { variant: "error" });
                        return;
                      }
                    
                      localStorage.setItem("userToken", res.token);
                      localStorage.setItem("userInfo", JSON.stringify(res.user));
                      context.setUser(res.user);
                      context.setIsLogin(true);

                      enqueueSnackbar("Admin login successful", { variant: "success" });
                      navigate("/", { replace: true });
                      return;
                    }

                    localStorage.setItem("googlePrefill", JSON.stringify(res.prefill));
                    navigate("/signUp", { replace: true });

                    } catch {
                      enqueueSnackbar("Google login failed", { variant: "error" });
                    }
                  }}
                  onError={() => enqueueSnackbar("Google login cancelled", { variant: "error" })}
                />
              </div>
            </form> 
          </div>

          <div className="wrapper mt-3 card border footer p-3">
            <span className="text-center">Don't have an account?
              <Link to={'/signUp'} className="link color ml-2" >Register</Link>
            </span>
          </div>

        </div>
      </section>
    </>
  )
}

export default Login;