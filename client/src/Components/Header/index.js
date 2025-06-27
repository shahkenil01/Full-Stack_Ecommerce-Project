import { useContext, useLayoutEffect  } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { IoBagOutline } from "react-icons/io5";
import SearchBox from './SearchBox';
import Navigation from './Navigation';
import Logo from '../../assets/images/logo.jpeg';
import CountryDropdown from '../CountryDropdown';
import UserMenu from '../Header/UserMenu';
import { MyContext } from '../../App';

const Header= ()=>{
    const context = useContext(MyContext);

    const getTotalPrice = () => {
        return context.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    const getUniqueItemCount = () => {
        return context.cartItems.length;
    };

    useLayoutEffect(() => {
        const el = document.querySelector('.headerWrapperFixed');

        const handleScroll = () => {
            if (window.scrollY > 50) {
                el.classList.add('fixed');
            } else {
                el.classList.remove('fixed');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return(
        <>
        <div className='headerWrapperFixed'>
        <div className='headerWrapper'>
            {/*<div className="top-strip bg-blue">
                <div className="container">
                    <p className="mb-0 mt-0 text-center">Due to high order Might be dealy.</p>
                </div>
            </div>*/}
                 <header className='header'>
                    <div className="container">
                        <div className="row">
                            <div className="logoWrapper col-sm-2 d-flex align-items-center ">
                                <Link className="logo" to={'/'}><img src={Logo} alt='Logo' /></Link>
                            </div>

                            <div className='part2 col-sm-10 d-flex align-items-center'>

                            {
                                context.countryList.length !==0 && <CountryDropdown />
                            }
                                
                                <SearchBox />

                                <div className='part3 d-flex align-items-center ml-auto'>
                                    {
                                        context.isLogin!==true ? 
                                        <Link to="/signIn"><Button className='btn-blue btn-round bg-blue mr-3'>Sign In</Button></Link> : 
                                        <UserMenu/>
                                    }
                                    <div className='ml-auto cartTab d-flex align-items-center'>
                                        {context.isLogin && ( <span className='price'> ₹{getTotalPrice().toFixed(2)} </span> )}
                                        <div className='position-relative ml-2'>
                                            <Link to="/Cart"><Button className='cart'><IoBagOutline/></Button></Link>
                                            <span className='count d-flex align-items-center justify-content-center'>{getUniqueItemCount()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <Navigation />

            </div></div>
        </>
    )
}

export default Header;