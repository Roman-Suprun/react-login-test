import Cookies from "js-cookie";
import axios from "axios";
import * as routePath from "../../consts/routePath";
import config from "../../config/config";
import * as serverMethods from '../../consts/serverMethods'
import utils from "../../utils/utils";

const getUrl = (path, params = []) => {
    return config.serverHost + utils.formatString(path, ...params);
}

const getUserInfo = async () => {
    try {
        const accessToken = Cookies.get('accessToken');
        const userId = Cookies.get('id');

        if (userId && accessToken) {
            const userInfo = await axios.get(getUrl(serverMethods.GET_USER_INFO, [userId]), {
                headers: {"x-access-token": accessToken}
            }, {withCredentials: true});

            return userInfo.data
        }
    } catch (e) {
        console.log(e);

        if (e.response.status === 401) {
            const currentRefreshToken = Cookies.get('refreshToken');
            await axios.post(getUrl(serverMethods.REFRESH_TOKEN), {
                refreshToken: currentRefreshToken,
            }, {withCredentials: true});

            return await getUserInfo()
        }
    }
}

const setUserInfo = async ({name, surname, age}) => {
    try {
        const accessToken = Cookies.get('accessToken');
        const userId = Cookies.get('id');

        if (userId && accessToken) {
            const userInfo = await axios.post(getUrl(serverMethods.SET_USER_INFO, [userId]), {
                    name, surname, age
                },
                {
                    headers: {"x-access-token": accessToken}
                },
                {withCredentials: true});

            return userInfo.data;
        }
    } catch (e) {
        console.log(e);

        if (e.response?.status === 401) {
            const currentRefreshToken = Cookies.get('refreshToken');
            await axios.post(getUrl(serverMethods.REFRESH_TOKEN), {
                refreshToken: currentRefreshToken,
            }, {withCredentials: true});

            return await setUserInfo({name, surname, age})
        }
    }
}

const getTodoListData = async (navigate) => {
    const accessToken = Cookies.get('accessToken');
    const userId = Cookies.get('id');

    if (userId && accessToken) {
        try {
            const todoListData = await axios.get(getUrl(serverMethods.GET_USER_TODO_LIST, [userId]), {
                headers: {"x-access-token": accessToken}
            }, {withCredentials: true});

            return todoListData?.data?.data
        } catch (e) {
            console.log(e);

            if (e.response.status === 401) {
                const currentRefreshToken = Cookies.get('refreshToken');
                await axios.post(getUrl(serverMethods.REFRESH_TOKEN), {
                    refreshToken: currentRefreshToken,
                }, {withCredentials: true});

                return await getTodoListData()
            } else {
                navigate(routePath.LOGIN_PAGE)
            }
        }
    }
}

const setTodoListData = async (navigate, todoList) => {
    const accessToken = Cookies.get('accessToken');
    const userId = Cookies.get('id');

    if (userId && accessToken) {
        try {
            await axios.post(getUrl(serverMethods.UPDATE_USER_TODO_LIST, [userId]), {
                    data: JSON.stringify(todoList)
                },
                {
                    headers: {"x-access-token": accessToken}
                },
                {withCredentials: true});

            return true;
        } catch (e) {
            console.log(e);

            if (e?.response?.status === 401) {
                const currentRefreshToken = Cookies.get('refreshToken');
                await axios.post(getUrl(serverMethods.REFRESH_TOKEN), {
                    refreshToken: currentRefreshToken,
                }, {withCredentials: true});

                await setTodoListData()
            } else {
                navigate(routePath.LOGIN_PAGE)
            }
        }
    }
}

export default {
    getUserInfo,
    setUserInfo,
    getTodoListData,
    setTodoListData,
}