import React, {FC, useEffect, useState} from 'react';
import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import styled from 'styled-components';

import {TCalendarData, TDaysInMonth, TOnDrug, TPublicHolidays} from '../../models/models';
import DayCell from '../DayCell';
import * as calendarData from './calendarData';
import {
    getBlanksAfterLastDay,
    getBlanksBeforeFirstDay,
    getFilteredTask,
    getInitialData,
    getLastDayOfMonth,
    getNewTask,
    getNextMonth,
    getPreviousMonth,
    onDrug,
} from './calendarService';

const StyledTable = styled.table`
    width: 1400px;
`;

const StyledNavButton = styled.button`
    border-radius: 10px;
    color: black;
    width: max-content;
    padding: 0 10px;
    height: 30px;
    background: rgb(238, 238, 238);
`;

const StyledButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    margin: 10px 0 20px;
`;

const StyledFilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: max-content;
    margin: 30px auto 10px;
`;

const StyledFilterInput = styled.input`
    border: solid 1px white;
    background: #374151;
    color: white;
`;

interface ICalendar {
    publicHolidays: TPublicHolidays;
    storedCalendarData: TCalendarData;
    setStoredCalendarData: (calendarData: TCalendarData) => void;
}

const Calendar: FC<ICalendar> = ({publicHolidays, setStoredCalendarData, storedCalendarData}) => {
    const onDragEnd = ({source, destination}: DropResult) => {
        const updatedDaysInMonth = onDrug({source, destination, daysInMonth} as TOnDrug);

        if (updatedDaysInMonth) setDaysInMonth(() => [...updatedDaysInMonth]);
    };

    const [date, setDate] = useState(new Date());
    const lastDayOfMonth = getLastDayOfMonth(date);
    const currentMonth = calendarData.MONTH_OF_YEAR[date.getMonth()];
    const [daysInMonth, setDaysInMonth] = useState<TDaysInMonth>([]);
    const [filteredDaysInMonth, setFilteredDaysInMonth] = useState<TDaysInMonth>(daysInMonth);
    const blanksBeforeFirstDay = getBlanksBeforeFirstDay(date);
    const blanksAfterLastDay = getBlanksAfterLastDay(date);
    const [isDataReady, setIsDataReady] = useState(false);
    const getStoredData = () => storedCalendarData[currentMonth] || [];

    const saveCalendarData = () => {
        if (getStoredData() !== daysInMonth) {
            storedCalendarData[currentMonth.toString()] = daysInMonth;
            setStoredCalendarData({...storedCalendarData});
        }
    };

    useEffect(() => {
        setFilteredDaysInMonth([]);
    }, [date]);

    useEffect(() => {
        saveCalendarData();
    }, [daysInMonth]);

    const initCalendarData = async () => {
        if (publicHolidays.length > 0) {
            const storedData = getStoredData();

            if (storedData.length > 0) {
                setDaysInMonth(storedData);
            } else {
                const {daysInMonth} = getInitialData(date, publicHolidays);

                setDaysInMonth(daysInMonth);
            }
            setIsDataReady(true);
        }
    };

    useEffect(() => {
        initCalendarData();
    }, [date, publicHolidays, storedCalendarData]);

    const addNewTask = (id: string) => {
        const targetIndex = daysInMonth.findIndex((elem) => elem.id === id);

        daysInMonth[targetIndex].list.push(getNewTask());
        setDaysInMonth((prevState) => [...daysInMonth]);
    };

    const deleteTask = (dayId: string, taskId: string) => {
        const targetDayIndex = daysInMonth.findIndex((elem) => elem.id === dayId);
        const targetTaskIndex = daysInMonth[targetDayIndex].list.findIndex((elem) => elem.id === taskId);

        daysInMonth[targetDayIndex].list.splice(targetTaskIndex, 1);
        setDaysInMonth(() => [...daysInMonth]);
    };

    const updateTask = (dayId: string, taskId: string, text: string) => {
        const targetDayIndex = daysInMonth.findIndex((elem) => elem.id === dayId);
        const targetTaskIndex = daysInMonth[targetDayIndex].list.findIndex((elem) => elem.id === taskId);

        daysInMonth[targetDayIndex].list[targetTaskIndex].content = text;
        setDaysInMonth(() => [...daysInMonth]);
    };

    const handlePreviousMonth = () => {
        setDate(getPreviousMonth(date));
        setIsDataReady(false);
    };

    const handleNextMonth = () => {
        setDate(getNextMonth(date));
        setIsDataReady(false);
    };

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilteredDaysInMonth(getFilteredTask(e.target.value, daysInMonth));
    };

    const currentYear = date.getFullYear();
    const totalCellsLength = daysInMonth.length + blanksBeforeFirstDay.length + blanksAfterLastDay.length;
    const calendarWeekRowArray = [...Array(Math.ceil(totalCellsLength / 7))];
    const calendarDayRowArray = [...Array(7)];

    return isDataReady ? (
        <DragDropContext onDragEnd={onDragEnd}>
            <h2>
                {currentMonth} {currentYear}
            </h2>
            <StyledButtonsContainer>
                <StyledNavButton onClick={handlePreviousMonth}>Previous Month</StyledNavButton>
                <StyledNavButton onClick={handleNextMonth}>Next Month</StyledNavButton>
            </StyledButtonsContainer>
            <StyledFilterContainer>
                <p>Filter by text</p>
                <StyledFilterInput type='text' onChange={onFilter} />
            </StyledFilterContainer>
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
                            {calendarDayRowArray.map((day, dayIndex) => (
                                <DayCell
                                    key={dayIndex}
                                    dayIndex={dayIndex}
                                    daysInMonth={filteredDaysInMonth.length > 0 ? filteredDaysInMonth : daysInMonth}
                                    lastDayOfMonth={lastDayOfMonth}
                                    blanksBeforeFirstDay={blanksBeforeFirstDay}
                                    addNewTask={addNewTask}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    weekIndex={weekIndex}
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </StyledTable>
        </DragDropContext>
    ) : (
        <></>
    );
};

export default Calendar;
