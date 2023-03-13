import Task from './Task'
import styled from 'styled-components'
import {FC} from "react";
import {DroppableProvided} from "react-beautiful-dnd";
import {TList} from "../models/models";

interface ITaskList {
    list: TList
    provided: DroppableProvided
    dayId: string
    updateTask: (dayId: string, id: string, text: string) => void
    deleteTask: (dayId:string, id:string) => void
}

const StyledList = styled.div`
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-top: 8px;
  height: 150px;
  overflow: auto;
`

const TaskList: FC<ITaskList> = ({list, provided, dayId, updateTask, deleteTask}) => {

    return (
        <StyledList {...provided.droppableProps} ref={provided.innerRef}>
            {list.map((item, index) => <Task key={item.id} task={item} dayId={dayId} index={index}
                                             updateTask={updateTask} deleteTask={deleteTask}/>)}
            {provided.placeholder}
        </StyledList>
    )
}

export default TaskList
