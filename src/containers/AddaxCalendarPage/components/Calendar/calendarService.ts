import utils from '../../../../utils/utils';
import {TDaysInMonth, TList, TListItem, TOnDrug, TPublicHolidays} from '../../models/models';

const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const getLastDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const getBlanksBeforeFirstDay = (date: Date) => {
    const firstDayOfMonth = getFirstDayOfMonth(date);
    const blanksBeforeFirstDay = [];

    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
        blanksBeforeFirstDay.push(i);
    }

    return blanksBeforeFirstDay;
};

const getBlanksAfterLastDay = (date: Date) => {
    const lastDayOfMonth = getLastDayOfMonth(date);
    const blanksAfterLastDay = [];

    for (let i = 0; i < 6 - lastDayOfMonth.getDay(); i++) {
        blanksAfterLastDay.push(i);
    }

    return blanksAfterLastDay;
};

const getInitialData = (date: Date, publicHoliday: TPublicHolidays) => {
    const firstDayOfMonth = getFirstDayOfMonth(date);
    const lastDayOfMonth = getLastDayOfMonth(date);
    const daysInMonth: TDaysInMonth = [];

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const getDate = () => {
            const result = new Date(firstDayOfMonth);

            result.setDate(result.getDate() + i - 1);

            const dateObj = new Date(result);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        };

        const uuid = utils.getUuidv4();
        const formattedDate: string = getDate();
        const listOfTasks: TList = [];

        publicHoliday.forEach((holiday) => {
            if (holiday.date === formattedDate) {
                listOfTasks.push(getNewTask(holiday.name, true));
            }
        });

        daysInMonth.push({
            id: uuid,
            text: i.toString(),
            date: formattedDate,
            list: listOfTasks,
        });
    }

    return {daysInMonth};
};

const getNewTask = (text: string = 'New task...', isFixed: boolean = false): TListItem => ({
    id: utils.getUuidv4(),
    isFixed,
    content: text,
});

const getNextMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 1);
const getPreviousMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() - 1, 1);

const getFilteredTask = (filter: string, daysInMonth: TDaysInMonth) => {
    const daysInMonthCopy = [...daysInMonth];

    if (filter !== '' && filter !== undefined) {
        return daysInMonthCopy.map((dayItem) => ({
            ...dayItem,
            list: dayItem.list.filter((listItem) => listItem.content === filter),
        }));
    } else {
        return daysInMonthCopy;
    }
};

const onDrug = ({source, destination, daysInMonth}: TOnDrug) => {
    if (destination === undefined || destination === null) return null;
    if (source.droppableId === destination.droppableId && destination.index === source.index) {
        return null;
    }

    const start = daysInMonth.find((elem) => elem.id === source.droppableId);
    const end = daysInMonth.find((elem) => elem.id === destination.droppableId);

    if (!start || !end) return null;
    if (start === end) {
        const startColIndex = daysInMonth.findIndex((elem) => elem.id === start.id);
        const newList = start.list.filter((_: any, idx: number) => idx !== source.index);

        newList?.splice(destination.index, 0, start.list[source.index]);
        daysInMonth[startColIndex].list = newList;

        return daysInMonth;
    } else {
        const startColIndex = daysInMonth.findIndex((elem) => elem.id === start.id);
        const endColIndex = daysInMonth.findIndex((elem) => elem.id === end.id);
        const newStartList = start.list.filter((_: any, idx: number) => idx !== source.index);
        const newEndList = end.list;

        newEndList.splice(destination.index, 0, start.list[source.index]);
        daysInMonth[startColIndex].list = newStartList;
        daysInMonth[endColIndex].list = newEndList;

        return daysInMonth;
    }
};

export {
    getBlanksAfterLastDay,
    getBlanksBeforeFirstDay,
    getFilteredTask,
    getFirstDayOfMonth,
    getInitialData,
    getLastDayOfMonth,
    getNewTask,
    getNextMonth,
    getPreviousMonth,
    onDrug,
};
