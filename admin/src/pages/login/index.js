import { useState } from 'react';
import Logo from '../../assets/images/logo.png';
import pattern from '../../assets/images/pattern.webp';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Google_Icons from '../../assets/images/Google_Icons.png'

const Login = ()=>{

  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const focusInput=(index)=>{
    setInputIndex(index);
  }

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
            <form>
              <div className={`form-group position-relative ${inputIndex===0 && 'focus'}`}>
                <span className='icon'><MdEmail/></span>
                <input type='email' className='form-control' placeholder='enter your email' 
                  onFocus={()=>focusInput(0)}
                  onBlur={()=>setInputIndex(null)} autoFocus/>
              </div>

              <div className={`form-group position-relative ${inputIndex===1 && 'focus'}`}>
                <span className='icon'><RiLockPasswordFill/></span>
                <input className="form-control" placeholder="enter your password" 
                  type={isShowPassword ? 'text' : 'password'}
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
                <Button className="btn-blue btn-lg btn-big w-100">Sign In</Button>
              </div>

              <div className='form-group text-center mb-0'>
                <Link to={'/forgot-password'} className='link'>FORGOT PASSWORD</Link>

              <div class="d-flex align-items-center justify-content-center or mt-3 mb-3">
                <span class="line"></span>
                <span class="txt">or</span>
                <span class="line"></span>
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