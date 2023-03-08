import {Link, useNavigate} from "react-router-dom";
import * as routePath from "../../consts/routePath";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
// import {toast} from "react-toastify";
import Cube from "../MenuCube/Cube";

const StartPage = () => {
    const [isUserLogged, setIsUserLogged] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');
        const userId = Cookies.get('id');

        if (accessToken && refreshToken && userId) {
            setIsUserLogged(true)
        } else {
            setIsUserLogged(false)
        }
    }, []);

    return (
        <div className="text-center">
            {
                isUserLogged &&
                <Link
                    className='absolute right-2 top-2 border-[1px] border-violet-700 border-solid rounded-md w-10 h-10 z-10'
                    to={routePath.USER_INFO_PAGE}>
                    <div
                        className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>&#128526;</div>
                </Link>
            }
            <header className="bg-[#282c34] min-h-[100vh] flex flex-col items-center justify-center color-white">
                <Cube isVariantsVisible={isUserLogged}/>
                <div className="z-10 flex flex-col mt-[50%] md:mt-[20%]">
                    {
                        !isUserLogged &&
                        <>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                                onClick={()=>navigate(routePath.REGISTER_PAGE)}
                            >
                                REGISTER
                            </button>
                            <button
                                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                                onClick={()=>navigate(routePath.LOGIN_PAGE)}
                            >
                                LOGIN
                            </button>
                        </>
                    }
                </div>
            </header>
        </div>
    );
}

export default StartPage;
