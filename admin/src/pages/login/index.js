import { useState, useContext} from 'react';
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

const Login = ()=>{
  const { enqueueSnackbar } = useSnackbar();
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const focusInput=(index)=>{
    setInputIndex(index);
  }

  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      enqueueSnackbar("Please fill all fields", { variant: 'error' });
      return;
    }

    try {
      const BACKEND_URL =
        process.env.REACT_APP_BACKEND_URL ||
          (window.location.hostname === "localhost"
            ? "http://localhost:4000"
            : "https://full-stack-ecommerce-project-u0om.onrender.com");

        const res = await fetch(`${BACKEND_URL}/api/user/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login failed");

      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("userToken", data.token);
      context.setUser(data.user);
      context.setIsLogin(true);
      enqueueSnackbar("Login successful!", { variant: 'success' });
      navigate("/", { replace: true });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
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
              <div className={`form-group position-relative ${inputIndex===0 && 'focus'}`}>
                <span className='icon'><MdEmail/></span>
                <input type='email' name='email' value={formData.email} onChange={handleChange} className='form-control' placeholder='enter your email' 
                  onFocus={()=>focusInput(0)}
                  onBlur={()=>setInputIndex(null)} autoFocus/>
              </div>

              <div className={`form-group position-relative ${inputIndex===1 && 'focus'}`}>
                <span className='icon'><RiLockPasswordFill/></span>
                <input className="form-control" placeholder="enter your password" 
                  type={isShowPassword ? 'text' : 'password'} name='password' value={formData.password} onChange={handleChange}
                  onFocus={() => focusInput(1)}
                  onBlur={(e) => {
                    if (!e.relatedTarget || !e.relatedTarget.classList.contains('toggleShowPassword')) {
                      setInputIndex(null);
                    }
                  }}/>

                {inputIndex === 1 && (
                  <span className="toggleShowPassword" tabIndex="0"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsShowPassword(!isShowPassword);
                    }}>
                    {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                  </span>
                )}
              </div>

              <div className='form-group'>
                <Button className="btn-blue btn-lg btn-big w-100" type="submit">Sign In</Button>
              </div>

              <div className='form-group text-center mb-0'>
                <Link to={'/forgot-password'} className='link'>FORGOT PASSWORD</Link>

              <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                <span className="line"></span>
                <span className="txt">or</span>
                <span className="line"></span>
              </div>

              <Button variant='outlined' className="w-100 btn-lg btn-big loginWithGoogle">
                <img src={Google_Icons} width="25px" alt='Icon'/> &nbsp; Sign In with Google
              </Button>

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