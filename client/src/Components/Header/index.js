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

const Header= ()=>{

    const context = useContext(MyContext);

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
                                <Link class="logo" to={'/'}><img src={Logo} alt='Logo' /></Link>
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
                                        <Button className='circle mr-3'><FiUser/></Button>
                                    }
                                    <div className='ml-auto cartTab d-flex align-items-center'>
                                        {context.isLogin && <span className='price'>₹0.00</span>}
                                        <div className='position-relative ml-2'>
                                            <Link to="/Cart"><Button className='cart'><IoBagOutline/></Button></Link>
                                            <span className='count d-flex align-items-center justify-content-center'>0</span>
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