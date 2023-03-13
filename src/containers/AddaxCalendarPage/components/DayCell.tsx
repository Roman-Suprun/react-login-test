import {FC} from "react";
import Day from "./Day";
import styled from "styled-components";
import {TDaysInMonth} from "../models/models";

const StyledTd = styled.td`
  border: 1px solid white;
  width: 200px;
  height: 200px;
`

interface IDayCell {
    lastDayOfMonth: Date
    weekIndex: number
    dayIndex: number
    daysInMonth: TDaysInMonth
    blanksBeforeFirstDay: number[]
    addNewTask: (id: string) => void
    deleteTask: (dayId:string, id:string) => void
    updateTask: (dayId: string, id: string, text: string) => void
}

const DayCell: FC<IDayCell> = (props) => {
    const {blanksBeforeFirstDay, lastDayOfMonth, weekIndex, dayIndex, daysInMonth, addNewTask, deleteTask,updateTask} = props;
    const dayOfMonth = (weekIndex * 7) + dayIndex + 1 - blanksBeforeFirstDay.length;
    const isEmptyDayCell = dayOfMonth < 1 || dayOfMonth > lastDayOfMonth.getDate()
    const taskItem = daysInMonth[dayOfMonth - 1]

    return (
        <StyledTd key={`${weekIndex}-${dayIndex}`}>
            {
                !isEmptyDayCell &&
                <Day taskItem={taskItem} day={dayOfMonth} addNewTask={addNewTask} deleteTask={deleteTask} updateTask={updateTask}/>
            }
        </StyledTd>
    )
}

export default DayCell;