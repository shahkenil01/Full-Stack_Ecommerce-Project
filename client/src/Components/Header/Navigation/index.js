import { Button } from '@mui/material';
import { IoIosMenu } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import images from '../../../assets/images';

const  Navigation=()=>{

    const [isopenSidebarVal, setisopenSidebarVal] = useState(false);

    return(
        <nav>
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-2 navPart1'>
                        <div className='catWrapper'>
                            <Button className='allCatTab align-items-center' onClick={()=>setisopenSidebarVal(!isopenSidebarVal)}>
                                <span className='icon1 mr-2'><IoIosMenu/></span>
                                <span className="text">ALL CATEGORIES</span>
                                <span className='icon2 ml-2'><FaAngleDown/></span>
                            </Button>

                            <div className={`sidebarNav ${isopenSidebarVal===true ? 'open' : ''}`}>
                                <ul>
                                    <li><Link to="/"><Button><img src={images.Fashion} width="20" class="mr-2" alt="Fashion" />Fashion</Button></Link>
                                        <div className="submenu">
                                            <Link to="/"><Button className="custom">men</Button></Link>
                                            <Link to="/"><Button className="custom">women</Button></Link>
                                        </div>
                                    </li>
                                    <li><Link to="/"><Button><img src={images.Electronics} width="20" class="mr-2" />Electronics</Button></Link>
                                        <div className="submenu">
                                            <Link to="/"><Button className="custom">Laptops</Button></Link>
                                            <Link to="/"><Button className="custom">smart watches accessories</Button></Link>
                                            <Link to="/"><Button className="custom">cameras</Button></Link>
                                        </div>
                                    </li>
                                    <li><Link to="/"><Button><img src={images.Bags} width="20" class="mr-2" />Bags</Button></Link>
                                        <div className="submenu">
                                            <Link to="/"><Button className="custom">men bags</Button></Link>
                                            <Link to="/"><Button className="custom">women bags</Button></Link>
                                        </div>
                                    </li>
                                    <li><Link to="/"><Button><img src={images.Footwear} width="20" class="mr-2" />Footwear</Button></Link>
                                        <div className="submenu">
                                            <Link to="/"><Button className="custom">men footwear</Button></Link>
                                            <Link to="/"><Button className="custom">women footwear</Button></Link>
                                        </div>
                                    </li>
                                    <li><Link to="/"><Button><img src={images.Groceries} width="20" class="mr-2" />Groceries</Button></Link></li>
                                    <li><Link to="/"><Button><img src={images.Beauty} width="20" class="mr-2" />Beauty</Button></Link></li>
                                    <li><Link to="/"><Button><img src={images.Wellness} width="20" class="mr-2" />Wellness</Button></Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-10 navPart2 d-flex align-items-center '>
                        <ul className='list list-inline ml-auto'>
                            <li className='list-inline-item'><Link to="/cat/1">
                                <Button><img src={images.Fashion} width="20" className="mr-2" alt="Fashion" />fashion</Button></Link>
                                <div className='submenu shadow widh'>
                                    <Link to="/"><Button>men</Button></Link>
                                    <Link to="/"><Button>women</Button></Link>
                                </div>
                            </li>
                            <li className='list-inline-item'><Link to="/cat/1">
                                <Button><img src={images.Electronics} width="20" class="mr-2" />electronics</Button></Link>
                                <div className='submenu shadow'>
                                    <Link to="/"><Button>Laptops</Button></Link>
                                    <Link to="/"><Button>smart watches accessories</Button></Link>
                                    <Link to="/"><Button>cameras</Button></Link>
                                </div>
                            </li>
                            <li className='list-inline-item'><Link to="/cat/1">
                                <Button><img src={images.Bags} width="20" class="mr-2" />bags</Button></Link>
                                <div className='submenu shadow widh'>
                                    <Link to="/"><Button>men bags</Button></Link>
                                    <Link to="/"><Button>women bags</Button></Link>
                                </div>
                            </li>
                            <li className='list-inline-item'><Link to="/cat/1">
                                <Button><img src={images.Footwear} width="20" class="mr-2" />footwear</Button></Link>
                                <div className='submenu shadow'>
                                    <Link to="/"><Button>men footwear</Button></Link>
                                    <Link to="/"><Button>women footwear</Button></Link>
                                </div>
                            </li>
                            <li className='list-inline-item'><Link to="/cat/1">
                                <Button><img src={images.Groceries} width="20" class="mr-2" />groceries</Button></Link></li>
                            <li className='list-inline-item'><Link to="/cat/1">
                                <Button><img src={images.Beauty} width="20" class="mr-2" />beauty</Button></Link></li>
                            <li className='list-inline-item'><Link to="/cat/1">
                                <Button><img src={images.Wellness} width="20" class="mr-2" />wellness</Button></Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navigation