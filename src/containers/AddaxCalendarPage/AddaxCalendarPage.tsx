import Calendar from "./components/Calendar/Calendar";
import {useEffect, useState} from "react";
import {TPublicHolidays} from "./models/models";
import api from "./api";

const AddaxCalendarPage = () => {
    const [publicHolidays, setPublicHoliday] = useState<TPublicHolidays>([]);

    const getPublicHolidays = async () => {
        const publicHoliday: TPublicHolidays = await api.getPublicHoliday('2023', 'ua')

        setPublicHoliday(publicHoliday);
    }

    useEffect(() => {
        getPublicHolidays();
    }, [])

    return (
       <Calendar publicHolidays={publicHolidays}/>
    )
}

export default AddaxCalendarPage;