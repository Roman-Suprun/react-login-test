import {Draggable} from 'react-beautiful-dnd'
import {FC, useState} from "react";
import styled from 'styled-components'
import {TListItem} from "../models/models";

interface ItemProps {
    task: TListItem
    dayId: string
    index: number
    updateTask: (dayId: string, id: string, text: string) => void
    deleteTask: (dayId:string, id:string) => void
}

const StyledItem = styled.div`
  color: black;
  background: #eee;
  border-radius: 4px;
  padding: 4px 6px;
  transition: background-color .8s ease-out;
  margin-top: 8px;

  &:hover {
    background: #fff;
    transition: background-color .1s ease-in;
  }
`

const Task: FC<ItemProps> = ({task: {id, isFixed, content}, index, dayId, updateTask, deleteTask}) => {
    const [isEditMode, setIsEditMode] = useState(false);

    const onChangeConfirm = (text: string) => {
        updateTask(dayId, id, text)
        setIsEditMode(false)
    }

    const onDeleteConfirm = () => {
        deleteTask(dayId, id)
        setIsEditMode(false)
    }

    return (
        <Draggable draggableId={id} index={index} isDragDisabled={isFixed}>
            {provided => (
                <StyledItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {
                        isEditMode
                            ? <Input text={content} onChangeConfirm={onChangeConfirm} onDeleteConfirm={onDeleteConfirm}/>
                            : <div onClick={() => setIsEditMode(!isFixed)}>{content}</div>
                    }
                </StyledItem>
            )}
        </Draggable>
    )
}

export default Task

const StyledInput = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0;
  margin: 0 auto;
  gap: 5px;
  flex: 1;
  
  input{
    width: 100%;
    padding-left: 10px;
    flex:1
  }
  
  button{
    width: 24px;
    height: 24px;
    padding: 0;
    margin: 0;
    text-align: center;
    border: 1px solid grey;
    border-radius: 5px;
  }
`

interface IInput {
    text: string,
    onChangeConfirm: (text: string) => void
    onDeleteConfirm: () => void
}

const Input: FC<IInput> = ({text, onChangeConfirm, onDeleteConfirm}) => {
    const [currentText, setCurrentText] = useState(text);

    return (
        <StyledInput>
            <input value={currentText} onChange={(e) => setCurrentText(e.target.value)}/>
            <button onClick={() => onChangeConfirm(currentText)}>&#10003;</button>
            <button onClick={onDeleteConfirm}>x</button>
        </StyledInput>
    )
}
