import { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import OtpInput from "../../Components/OtpBox/index.js";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import images from '../../assets/images.js';

const SignUp = () =>{

  const context = useContext(MyContext);

  useEffect(()=>{
      context.setisHeaderFooterShow(false);
  },[context]);

  return(
      <section className="section signInPage otpPage">
        <div className="shape-bottom">
          <svg fill="#fff" id="Layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8"> 
            <path className="st0" d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path> 
          </svg>
        </div>
        <div className="container">
          <div className="box card p-3 shadow border-0">
            <div className="text-center">
              <img src={images.shield} alt="shield" width={"100px"}/>
            </div>
            
            <form className="mt-3">
              <h2 className="mb-1 text-center">OTP Verification</h2>

              <p class="text-center text-light">OTP has been sent to <br/><b>tirths@gmail.com</b></p>

              <OtpInput/>

              <div className="d-flex align-items-center mt-3 mb-3 d-flex">
                <Button className="btn-blue col btn-lg btn-big bg-blue">Verify OTP</Button>
              </div>

              <p className="txt text-center"><Link to="/signIn" className="border-effect">&nbsp;Resend OTP</Link></p>
            </form>

          </div>
        </div>
      </section>
  )
}

export default SignUp;