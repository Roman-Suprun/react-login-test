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
import {ITaskDataObject, TDaysInMonth, TPublicHolidays} from "../../models/models";
import api from "../../api";

const StyledTable = styled.table`
  width: 1400px;
`

const Calendar: FC = () => {
    const onDragEnd = ({source, destination}: DropResult) => {
        if (destination === undefined || destination === null) return null
        if (
            source.droppableId === destination.droppableId &&
            destination.index === source.index
        )
            return null

        const start = taskDataObject[source.droppableId]
        const end = taskDataObject[destination.droppableId]

        if (start === end) {
            const newList = start.list.filter(
                (_: any, idx: number) => idx !== source.index
            )

            newList.splice(destination.index, 0, start.list[source.index])

            const newCol = {
                id: start.id,
                date: start.date,
                list: newList
            }

            setTaskDataObject(state => ({...state, [newCol.id]: newCol}))
            return null
        } else {
            const newStartList = start.list.filter(
                (_: any, idx: number) => idx !== source.index
            )

            const newStartCol = {
                id: start.id,
                date: start.date,
                list: newStartList
            }

            const newEndList = end.list

            newEndList.splice(destination.index, 0, start.list[source.index])

            const newEndCol = {
                id: end.id,
                list: newEndList
            }

            // @ts-ignore
            setTaskDataObject(state => ({
                ...state,
                [newStartCol.id]: newStartCol,
                [newEndCol.id]: newEndCol
            }))

            return null
        }
    }

    const [date, setDate] = useState(new Date());
    const lastDayOfMonth = getLastDayOfMonth(date);

    const [daysInMonth, setDaysInMonth] = useState<TDaysInMonth>([]);
    const [taskDataObject, setTaskDataObject] = useState<ITaskDataObject>({})

    const [isTaskDataObjectUpdated, setIsTaskDataObjectUpdated] = useState(false);
    const blanksBeforeFirstDay = getBlanksBeforeFirstDay(date)
    const blanksAfterLastDay = getBlanksAfterLastDay(date)
    const [isDataReady, setIsDataReady] = useState(false);

    const initCalendarData = async () => {
        const publicHoliday: TPublicHolidays = await api.getPublicHoliday('2023', 'ua')
        const {daysInMonth, initialTaskDataObject} = getInitialData(date, publicHoliday);

        setDaysInMonth(daysInMonth);
        setTaskDataObject(initialTaskDataObject);
        setIsDataReady(true);
    }

    useEffect(() => {
        initCalendarData();
    }, [date])

    const addNewTask = (id: string) => {
        taskDataObject[id].list.push(getNewTask());
        setTaskDataObject(taskDataObject)
        setIsTaskDataObjectUpdated(!isTaskDataObjectUpdated)
    }

    const addChangeTask = (dayId: string, taskId: string, text: string) => {
        const targetTaskId = taskDataObject[dayId].list.findIndex((item) => item.id === taskId);
        const targetTask = taskDataObject[dayId].list[targetTaskId];

        targetTask.content = text;
        taskDataObject[dayId].list.splice(targetTaskId, 1, targetTask);
        setTaskDataObject(taskDataObject)
        setIsTaskDataObjectUpdated(!isTaskDataObjectUpdated)
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
                                                                                 taskDataObject={taskDataObject}
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