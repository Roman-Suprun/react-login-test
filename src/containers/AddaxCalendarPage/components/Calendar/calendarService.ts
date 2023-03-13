import utils from "../../../../utils/utils";
import {TDaysInMonth, TList, TListItem, TPublicHolidays} from "../../models/models";

// const getDays = (year, month) => {
//     return new Date(year, month, 0).getDate();
// };
// const daysInSeptember = getDays(new Date().getFullYear(), 7);

const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const getLastDayOfMonth = (date: Date) => new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
);
const getBlanksBeforeFirstDay = (date: Date) => {
    const firstDayOfMonth = getFirstDayOfMonth(date)
    const blanksBeforeFirstDay = [];

    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
        blanksBeforeFirstDay.push(i);
    }

    return blanksBeforeFirstDay
}

const getBlanksAfterLastDay = (date: Date) => {
    const lastDayOfMonth = getLastDayOfMonth(date);
    const blanksAfterLastDay = [];

    for (let i = 0; i < 6 - lastDayOfMonth.getDay(); i++) {
        blanksAfterLastDay.push(i);
    }

    return blanksAfterLastDay
}

const getInitialData = (date: Date, publicHoliday: TPublicHolidays) => {
    const firstDayOfMonth = getFirstDayOfMonth(date)
    const lastDayOfMonth = getLastDayOfMonth(date);
    const daysInMonth:TDaysInMonth = [];

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const getDate = () => {
            const result = new Date(firstDayOfMonth);

            result.setDate(result.getDate() + i - 1);

            const dateObj = new Date(result);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            const day = String(dateObj.getDate()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day}`;

            return formattedDate;
        }

        const uuid = utils.getUuidv4()
        // const uuid: string = i.toString()
        const formattedDate: string = getDate();
        const listOfTasks: TList = [];

        publicHoliday.forEach((holiday) => {
            if (holiday.date === formattedDate) {
                listOfTasks.push(getNewTask(holiday.name, true))
            }
        })

        daysInMonth.push({
            id: uuid,
            text: i.toString(),
            date: formattedDate,
            list: i === 4 ? [
                    {id: utils.getUuidv4(), isFixed: false,content: "one"},
                    {id: utils.getUuidv4(), isFixed: false,content: "two"},
                    {id: utils.getUuidv4(), isFixed: false,content: "three"}
                ]
                : listOfTasks
        });
    }

    return {daysInMonth}
}

const getNewTask = (text: string = 'New task...', isFixed: boolean = false): TListItem => ({
    id: utils.getUuidv4(),
    isFixed,
    content: text
});

const getNextMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 1)
const getPreviousMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() - 1, 1)

export {
    getBlanksBeforeFirstDay,
    getBlanksAfterLastDay,
    getLastDayOfMonth,
    getFirstDayOfMonth,
    getNextMonth,
    getPreviousMonth,
    getInitialData,
    getNewTask,
}

