import React, {FC, useEffect, useState} from "react";
import DayCell from "../DayCell";
import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import styled from "styled-components";
import * as calendarData from './calendarData'
import {
    getBlanksBeforeFirstDay,
    getBlanksAfterLastDay,
    getLastDayOfMonth,
    getInitialData,
    getNextMonth,
    getPreviousMonth,
    getNewTask,
} from './calendarService'
import {TDaysInMonth, TPublicHolidays} from "../../models/models";

const StyledTable = styled.table`
  width: 1400px;
`

interface ICalendar {
    publicHolidays: TPublicHolidays
}

const Calendar: FC<ICalendar> = ({publicHolidays}) => {
    const onDragEnd = ({source, destination}: DropResult) => {
        if (destination === undefined || destination === null) return null
        if (
            source.droppableId === destination.droppableId &&
            destination.index === source.index
        ) {
            return null
        }

        const start = daysInMonth.find((elem) => elem.id === source.droppableId);
        const end = daysInMonth.find((elem) => elem.id === destination.droppableId);

        if (!start || !end) return null;
        if (start === end) {
            const startColIndex = daysInMonth.findIndex((elem) => elem.id === start.id);
            const newList = start.list.filter(
                (_: any, idx: number) => idx !== source.index
            )

            newList?.splice(destination.index, 0, start.list[source.index])
            daysInMonth[startColIndex].list = newList;

            setDaysInMonth(() => [...daysInMonth])

            return null
        } else {
            const startColIndex = daysInMonth.findIndex((elem) => elem.id === start.id);
            const endColIndex = daysInMonth.findIndex((elem) => elem.id === end.id);
            const newStartList = start.list.filter(
                (_: any, idx: number) => idx !== source.index
            )
            const newEndList = end.list

            newEndList.splice(destination.index, 0, start.list[source.index])
            daysInMonth[startColIndex].list = newStartList;
            daysInMonth[endColIndex].list = newEndList;

            setDaysInMonth(() => [...daysInMonth])

            return null
        }
    }

    const [date, setDate] = useState(new Date());
    const lastDayOfMonth = getLastDayOfMonth(date);
    const [daysInMonth, setDaysInMonth] = useState<TDaysInMonth>([]);
    const blanksBeforeFirstDay = getBlanksBeforeFirstDay(date)
    const blanksAfterLastDay = getBlanksAfterLastDay(date)
    const [isDataReady, setIsDataReady] = useState(false);

    const initCalendarData = async () => {
        if (publicHolidays) {
            const {daysInMonth} = getInitialData(date, publicHolidays);

            setDaysInMonth(daysInMonth);
            setIsDataReady(true);
        }
    }

    useEffect(() => {
        initCalendarData();
    }, [date, publicHolidays])

    const addNewTask = (id: string) => {
        const targetIndex = daysInMonth.findIndex((elem) => elem.id === id);

        daysInMonth[targetIndex].list.push(getNewTask());
        setDaysInMonth(prevState => [...daysInMonth])
    }

    const addChangeTask = (dayId: string, taskId: string, text: string) => {
        const targetDayIndex = daysInMonth.findIndex((elem) => elem.id === dayId);
        const targetTaskIndex = daysInMonth[targetDayIndex].list.findIndex((elem) => elem.id === taskId);

        daysInMonth[targetDayIndex].list[targetTaskIndex].content = text;
        setDaysInMonth(() => [...daysInMonth])
    }
    const handlePreviousMonth = () => {
        setDate(getPreviousMonth(date));
        setIsDataReady(false);
    };

    const handleNextMonth = () => {
        setDate(getNextMonth(date));
        setIsDataReady(false);
    };

    const currentMonth = calendarData.MONTH_OF_YEAR[date.getMonth()];
    const currentYear = date.getFullYear();
    const totalCellsLength = daysInMonth.length + blanksBeforeFirstDay.length + blanksAfterLastDay.length;
    const calendarWeekRowArray = [...Array(Math.ceil(totalCellsLength / 7))];
    const calendarDayRowArray = [...Array(7)];

    return (
        isDataReady ?
            <DragDropContext onDragEnd={onDragEnd}>
                {/*<DragDropContext onDragEnd={()=>{}}>*/}
                <h2>{currentMonth} {currentYear}</h2>
                <StyledTable>
                    <thead>
                    <tr>
                        {calendarData.DAYS_OF_WEEK.map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {calendarWeekRowArray.map((week, weekIndex) => (
                        <tr key={weekIndex}>
                            {calendarDayRowArray.map((day, dayIndex) => <DayCell key={dayIndex} dayIndex={dayIndex}
                                                                                 daysInMonth={daysInMonth}
                                                                                 lastDayOfMonth={lastDayOfMonth}
                                                                                 blanksBeforeFirstDay={blanksBeforeFirstDay}
                                                                                 addNewTask={addNewTask}
                                                                                 addChangeTask={addChangeTask}
                                                                                 weekIndex={weekIndex}/>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </StyledTable>
                <button onClick={handlePreviousMonth}>Previous Month</button>
                <button onClick={handleNextMonth}>Next Month</button>
            </DragDropContext>
            : <></>
    )
}

export default Calendar