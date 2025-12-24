import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "../../App";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import images from '../../assets/images.js';
import { postData } from "../../utils/api";
import { GoogleLogin } from "@react-oauth/google";

const SignIn = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const googleBtnRef = useRef(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      enqueueSnackbar(`Please fill all fields`, { variant: "error" });
      return;
    }

    setLoading(true);

    try {
      const data = await postData("/api/user/signin", { email, password });
      if (!data?.token) { throw new Error(data.message); }

      enqueueSnackbar("Login successful!", { variant: "success" });

      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      context.setUser(data.user);
      context.setIsLogin(true);

      if (data.cart && Array.isArray(data.cart)) {
        localStorage.setItem("cartItems", JSON.stringify(data.cart));
        context.setCartItems(data.cart);
      }

      navigate("/", { replace: true });
    } catch (err) {
      enqueueSnackbar(err.message || "Please try again.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    context.setisHeaderFooterShow(false);
    return () => context.setisHeaderFooterShow(true);
  }, [context]);

  return (
    <section className="section signInPage">
      <div className="shape-bottom">
        <svg fill="#fff" viewBox="0 0 1921 819.8">
          <path className="st0" d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path>
        </svg>
      </div>
      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center">
            <img src={images.logo} alt="logo" />
          </div>

          <form className="mt-3" onSubmit={handleLogin}>
            <h2 className="mb-4">Sign In</h2>
            <div className="form-group">
              <TextField label="Email" name="email" value={formData.email} onChange={handleChange} variant="standard" className="w-100" />
            </div>
            <div className="form-group">
              <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} variant="standard" className="w-100" />
            </div>

            <a href="/forget-password" className="border-effect cursor txt">Forgot Password?</a>

            <div className="d-flex align-items-center mt-3 mb-3">
              <Button type="submit" className="btn-blue col btn-lg btn-big bg-blue" disabled={loading} style={{ height: "45px"}}>
                {loading ? <span className="dot-loader"></span> : "Sign In"}
              </Button>
              <Link to="/"><Button className="cancel-btn btn-lg btn-big col ml-3" variant="outlined" onClick={() => { setTimeout(() => { context.setisHeaderFooterShow(true); }, 0); }}>Cancel</Button></Link>
            </div>

            <p className="txt">Not Registered? <Link to="/signUp" className="border-effect">&nbsp;Sign Up</Link></p>

            <h6 className="mt-4 text-center font-weight-bold">Or continue with social account</h6>

            <Button className="loginWithGoogle mt-2 w-100" variant="outlined"
              onClick={() => {
                const btn = googleBtnRef.current.querySelector('div[role="button"]');
                if (btn) btn.click();
              }}
            >
              <img src={images.Google_Icons} alt="Google" /> Sign In with Google
            </Button>

            {/* --- HIDDEN ORIGINAL GOOGLE LOGIN --- */}
            <div style={{ display: 'none' }} ref={googleBtnRef}>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const res = await postData("/api/user/google-precheck", {
                      token: credentialResponse.credential,
                    });
                    if (res.existingUser) {
                      localStorage.setItem("userToken", res.token);
                      localStorage.setItem("userInfo", JSON.stringify(res.user));
                      context.setUser(res.user);
                      context.setIsLogin(true);
                      navigate("/", { replace: true });
                    } else {
                      localStorage.setItem("googlePrefill", JSON.stringify(res.prefill));
                      navigate("/signUp", { replace: true });
                    }
                  } catch (err) {
                    enqueueSnackbar("Google login failed", { variant: "error" });
                  }
                }}
                onError={() => enqueueSnackbar("Google login cancelled", { variant: "error" })}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignIn;