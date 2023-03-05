import Cookies from "js-cookie";
import axios from "axios";
import * as routePath from "../../consts/routePath";

const getUserInfo = async () => {
    try {
        const accessToken = Cookies.get('accessToken');
        const userId = Cookies.get('id');

        if (userId && accessToken) {
            const userInfo = await axios.get(`http://localhost:4000/userinfo/userId?id=${userId}`, {
                headers: {"x-access-token": accessToken}
            }, {withCredentials: true});

            return userInfo.data
        }
    } catch (e) {
        console.log(e);

        if (e.response.status === 401) {
            const currentRefreshToken = Cookies.get('refreshToken');
            await axios.post('http://localhost:4000/refreshtoken', {
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
            const userInfo = await axios.post(`http://localhost:4000/setuserinfo/userId?id=${userId}`, {
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
            await axios.post('http://localhost:4000/refreshtoken', {
                refreshToken: currentRefreshToken,
            }, {withCredentials: true});

            return await setUserInfo()
        }
    }
}

const getTodoListData = async (navigate) => {
    const accessToken = Cookies.get('accessToken');
    const userId = Cookies.get('id');

    if (userId && accessToken) {
        try {
            const todoListData = await axios.get(`http://localhost:4000/usertodolist/userid?id=${userId}`, {
                headers: {"x-access-token": accessToken}
            }, {withCredentials: true});

            // if (todoListData?.data?.data) {
            //     setTodoList(todoListData?.data?.data);
            // }
            return todoListData?.data?.data
        } catch (e) {
            console.log(e);

            if (e.response.status === 401) {
                const currentRefreshToken = Cookies.get('refreshToken');
                await axios.post('http://localhost:4000/refreshtoken', {
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
            await axios.post(`http://localhost:4000/updateusertodolist/userid?id=${userId}`, {
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
                await axios.post('http://localhost:4000/refreshtoken', {
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