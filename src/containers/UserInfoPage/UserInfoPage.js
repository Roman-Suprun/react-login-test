import '../App/App.css';
import React, {useCallback, useEffect, useState} from "react";
import * as routePath from "../../consts/routePath";
import {useNavigate} from "react-router-dom";
import todoListService from "../../service/todoListService/todoListService";
import Cookies from "js-cookie";
import {removeAuthData} from "../../state/auth";
import {dispatch} from "../../state/store";
import {toast} from "react-toastify";

const UserInfoPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [changeMode, setIsChangeMode] = useState(null);
    const {username, password, name = '', surname = '', age = 0} = userInfo || {};
    const navigate = useNavigate();

    const setInfo = async () => {
        const info = await todoListService.setUserInfo({name, surname, age});

        if (!info) {
            navigate(routePath.LOGIN_PAGE)
        }

        setUserInfo(info);
    }

    const onInfoUpdate = (newInfo) => {
        setUserInfo({...userInfo, ...newInfo})
    }

    const getInfo = useCallback(async () => {
        const info = await todoListService.getUserInfo();

        if (!info) {
            navigate(routePath.LOGIN_PAGE)
        }
        setUserInfo(info);
    }, [navigate]);

    const onSave = async () => {
        if (changeMode) {
            await setInfo();
            await getInfo();
        } else {
            //TODO: open edit action
        }

        setIsChangeMode(!changeMode)
    }

    const onLogout = () => {
        Cookies.remove('id');
        Cookies.remove('refreshToken');
        Cookies.remove('accessToken');
        dispatch(removeAuthData());
        toast("Log out successfully");
        navigate(routePath.HOME_PAGE);
    }

    const onClose = () => {
        navigate(-1);
    }

    useEffect(() => {
        getInfo();
    }, [getInfo]);

    return (
        <div className="App h-screen bg-[#282c34] text-white p-4">
            <button className="absolute text-sm left-2 top-2 h-10 pointer p-2" onClick={onLogout}>
                LOG OUT
            </button>
            <button className='absolute right-2 top-2 w-10 h-10' onClick={onClose}>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>&#10005;</div>
            </button>
            <div className="bg-gray-800 mt-10 rounded shadow p-4 max-w-sm">
                <p className="text-gray-300">Username: {username}</p>
                <p className="text-gray-300">Password: {password}</p>
                <InfoItem name={'Name'} value={name} action={onInfoUpdate} mode={changeMode}/>
                <InfoItem name={'Surname'} value={surname} action={onInfoUpdate} mode={changeMode}/>
                <InfoItem name={'Age'} value={age} action={onInfoUpdate} mode={changeMode}/>
                <button className="pointer mt-5 p-2 border-solid border-2 border-white rounded-md" onClick={onSave}>
                    {changeMode ? 'Save' : 'Edit user info'}
                </button>
            </div>
        </div>
    );
}
const InfoItem = ({name, value, action, mode}) => {
    return (
        <div className="text-gray-300 flex">
            {name}:
            {mode ? (
                <input
                    className="border-2 bg-gray-800 text-white ml-2 pl-1"
                    value={value}
                    onChange={(event) => action({[name.toString().toLowerCase()]: event.target.value})}
                />
            ) : (
                <div className="ml-2">{value}</div>
            )}
        </div>
    );
};

export default UserInfoPage;
