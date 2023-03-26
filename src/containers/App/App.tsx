import './App.css';

import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';

import * as routePath from '../../consts/routePath';
import AddaxCalendarPage from '../AddaxCalendarPage/AddaxCalendarPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import StartPage from '../StartPage/StartPage';
import TodoListPage from '../ToDoListPage/ToDoListPage';
import UserInfoPage from '../UserInfoPage/UserInfoPage';

const router = createBrowserRouter([
    {
        path: routePath.HOME_PAGE,
        element: <StartPage />,
        // errorElement: <App/>,
    },
    {
        path: routePath.REGISTER_PAGE,
        element: <RegisterPage />,
    },
    {
        path: routePath.USER_INFO_PAGE,
        element: <UserInfoPage />,
    },
    {
        path: routePath.LOGIN_PAGE,
        element: <LoginPage />,
    },
    {
        path: routePath.TO_DO_LIST_PAGE,
        element: <TodoListPage />,
    },
    {
        path: routePath.ADDAX_CALENDAR,
        element: <AddaxCalendarPage />,
    },
]);

const App = () => {
    return (
        <div className='text-center text-white bg-[#282c34] w-full h-full'>
            <RouterProvider router={router} />
            <ToastContainer
                position='top-center'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='dark'
            />
        </div>
    );
};

export default App;
