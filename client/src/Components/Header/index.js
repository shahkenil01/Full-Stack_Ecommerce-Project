import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.jpeg';
import { Button } from '@mui/material';
import CountryDropdown from '../CountryDropdown';
import SearchBox from './SearchBox';
import { FiUser } from 'react-icons/fi';
import { IoBagOutline } from "react-icons/io5";
import Navigation from './Navigation';
import { useContext } from 'react';
import { MyContext } from '../../App';
import UserMenu from '../Header/UserMenu';

const Header= ()=>{

    const context = useContext(MyContext);
    const getTotalPrice = () => {
        return context.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    const getTotalCount = () => {
        return context.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    };

    return(
        <>
            <div className="headerWrapper">
            {/*<div className="top-strip bg-blue">
                    <div className="container">
                        <p className="mb-0 mt-0 text-center">Due to high order Might be dealy.</p>
                    </div>
                </div>*/}
                <header className="header">
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
                                            <span className='count d-flex align-items-center justify-content-center'>{getTotalCount()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <Navigation/>

            </div>
        </>
    )
}

export default Header;