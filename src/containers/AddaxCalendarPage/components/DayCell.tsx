import {FC} from "react";
import Day from "./Day";
import styled from "styled-components";
import {ITaskDataObject, TDaysInMonth} from "../models/models";

const StyledTd = styled.td`
  border: 1px solid white;
  width: 200px;
  height: 200px;
`

interface IDayCell {
    lastDayOfMonth: Date
    weekIndex: number
    dayIndex: number
    taskDataObject: ITaskDataObject
    daysInMonth: TDaysInMonth
    blanksBeforeFirstDay: number[]
    addNewTask: (id: string) => void
    addChangeTask: (dayId: string, id: string, text: string) => void
}

const DayCell: FC<IDayCell> = (props) => {
    const {blanksBeforeFirstDay, lastDayOfMonth, weekIndex, dayIndex, taskDataObject, daysInMonth, addNewTask, addChangeTask} = props;
    const dayOfMonth = (weekIndex * 7) + dayIndex + 1 - blanksBeforeFirstDay.length;
    const isEmptyDayCell = dayOfMonth < 1 || dayOfMonth > lastDayOfMonth.getDate()
    const taskItem = taskDataObject[daysInMonth[dayOfMonth - 1]?.id];
    const key = daysInMonth[dayOfMonth - 1]?.id;

    return (
        <StyledTd key={`${weekIndex}-${dayIndex}`}>
            {
                !isEmptyDayCell && <Day taskItem={taskItem} day={dayOfMonth} addNewTask={addNewTask} addChangeTask={addChangeTask}
                                        key={key}/>
            }
        </StyledTd>
    )
}

export default DayCell;