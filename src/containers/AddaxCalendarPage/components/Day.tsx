import {Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import {FC} from "react";
import TaskList from "./TaskList";
import {IDayInMonth} from "../models/models";

interface IDayProps {
    taskItem: IDayInMonth
    day: number
    addNewTask: (id: string) => void
    deleteTask: (dayId:string, id:string) => void
    updateTask: (dayId: string, id: string, text: string) => void

}

const StyledColumn = styled.div`
  //padding: 24px 16px;
  display: flex;
  flex-direction: column;
`

const StyledAddTask = styled.button`
  font-size: 26px;
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  line-height: 40px;

  &:hover {
    border: solid 1px white;
  }
`

const Day: FC<IDayProps> = (props) => {
    const {taskItem: {list, id}, day, addNewTask, deleteTask,updateTask} = props || {};

    return (
        <div>
            <div>{day}</div>
            <StyledAddTask onClick={() => addNewTask(id)}>+</StyledAddTask>
            <Droppable droppableId={id}>
                {provided => (
                    <StyledColumn>
                        <TaskList dayId={id} list={list} provided={provided} deleteTask={deleteTask} updateTask={updateTask}/>
                    </StyledColumn>
                )}
            </Droppable>
        </div>
    )
}

export default Day
