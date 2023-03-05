import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import * as routePath from "./consts/routePath";
import RegisterPage from "./RegisterPage";
import UserInfoPage from "./UserInfoPage";
import LoginPage from "./LoginPage";
import TodoListPage from "./ToDoListPage/ToDoListPage";
import React from "react";
import StartPage from "./StartPage";
import {ToastContainer} from "react-toastify";

const router = createBrowserRouter([
    {
        path: routePath.HOME_PAGE,
        element: <StartPage/>,
        // errorElement: <App/>,
    },
    {
        path: routePath.REGISTER_PAGE,
        element: <RegisterPage/>,
    },
    {
        path: routePath.USER_INFO_PAGE,
        element: <UserInfoPage/>,
    },
    {
        path: routePath.LOGIN_PAGE,
        element: <LoginPage/>,
    },
    {
        path: routePath.TO_DO_LIST_PAGE,
        element: <TodoListPage/>,
    },
]);

const App = () => {
    return (
        <div className='text-center text-white bg-[#282c34] w-full h-full'>
            <RouterProvider router={router}/>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
}

export default App;
