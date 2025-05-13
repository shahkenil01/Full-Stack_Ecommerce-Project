import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';


function TopLoadingBar({ skip }) {
  const location = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (skip) {
      return;
    }

    NProgress.start();
    NProgress.set(0.3);

    const timeout = setTimeout(() => {
      NProgress.done();
    }, 400);

    return () => clearTimeout(timeout);
  }, [location.pathname, navType]);

  return null;
}

export default TopLoadingBar;
