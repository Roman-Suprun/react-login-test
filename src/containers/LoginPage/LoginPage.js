import '../App/App.css';
import Cookies from 'js-cookie'
import React, {useEffect, useState} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {makeSelectAccessToken, setAuthData} from "../../state/auth";
import {dispatch} from "../../state/store";
import {createStructuredSelector} from "reselect";
import * as routePath from "../../consts/routePath";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import config from "../../config/config";

const mapStateToProps = createStructuredSelector({
    accessToken: makeSelectAccessToken(),
});
const LoginPage = (props) => {
    const {accessToken} = props;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // const result = await axios.post('https://node-server-test-production.up.railway.app/login', {
            const result = await axios.post(config.serverHost+'/login', {
                username,
                password
            }, {withCredentials: true});
            const {id, accessToken, refreshToken} = result?.data;

            Cookies.set('accessToken',accessToken.toString());
            Cookies.set('refreshToken',refreshToken.toString());
            Cookies.set('id',id.toString());

            dispatch(setAuthData({id, accessToken, refreshToken}))
        } catch (e) {
            console.error(e)
        }
    };

    useEffect(() => {
        if (accessToken) {
            toast("Logged successfully");
            navigate(routePath.HOME_PAGE)
        }
    }, [accessToken])

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm h-screen mx-auto p-6 pt-10 bg-gray-800 rounded-lg shadow-xl">
            <Link className='absolute right-2 top-2 bg-blue-500 w-24' to={routePath.REGISTER_PAGE}>REGISTER</Link>
            <div className="mb-4">
                <label className="block text-gray-300 font-medium mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    className="w-full border border-gray-500 p-2 rounded-lg text-gray-100 bg-gray-700"
                    id="email"
                    type="email"
                    placeholder="Email"
                    onChange={(event) => setUsername(event.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-300 font-medium mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    className="w-full border border-gray-500 p-2 rounded-lg text-gray-100 bg-gray-700"
                    id="password"
                    type="password"
                    placeholder="Password"
                    onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                    type="submit"
                >
                    Log in
                </button>
                <a
                    className="inline-block align-baseline font-medium text-sm text-blue-500 hover:text-blue-200"
                    href="/"
                >
                    Forgot Password?
                </a>
            </div>
        </form>
    );
}

export default connect(mapStateToProps)(LoginPage);