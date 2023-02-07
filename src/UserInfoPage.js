import './App.css';
import {useEffect} from "react";
import axios from "axios";

const UserInfoPage = () => {
    const getInfo = async () => {
        const res = await axios.post('http://localhost:4000/registration', {num1: 1, num2: 2});
        console.log(res.data);
    }

    useEffect(() => {
        getInfo()
    }, []);

    return (
        <div className="App">
            User info page
        </div>
    );
}

export default UserInfoPage;
