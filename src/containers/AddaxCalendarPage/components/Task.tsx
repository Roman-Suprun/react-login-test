import {Draggable} from 'react-beautiful-dnd'
import {FC, useState} from "react";
import styled from 'styled-components'
import {TListItem} from "../models/models";

interface ItemProps {
    task: TListItem
    dayId: string
    index: number
    addChangeTask: (dayId: string, id: string, text: string) => void
}

const StyledItem = styled.div`
  color: black;
  background: #eee;
  border-radius: 4px;
  padding: 4px 8px;
  transition: background-color .8s ease-out;
  margin-top: 8px;

  &:hover {
    background: #fff;
    transition: background-color .1s ease-in;
  }
`

const Task: FC<ItemProps> = ({task: {id, isFixed, content}, index, dayId, addChangeTask}) => {
    const [isEditMode, setIsEditMode] = useState(false);

    const onChangeConfirm = (text: string) => {
        addChangeTask(dayId, id, text)
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
                            ? <Input text={content} setIsEditMode={setIsEditMode} onChangeConfirm={onChangeConfirm}/>
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
  margin: 0;
`

interface IInput {
    text: string,
    setIsEditMode: (isEdit: boolean) => void,
    onChangeConfirm: (text: string) => void
}

const Input: FC<IInput> = ({text, setIsEditMode, onChangeConfirm}) => {
    const [currentText, setCurrentText] = useState(text);

    return (
        <StyledInput>
            <input value={currentText} onChange={(e) => setCurrentText(e.target.value)}/>
            <button onClick={() => onChangeConfirm(currentText)}>&#10003;</button>
            <button onClick={() => setIsEditMode(false)}>x</button>
        </StyledInput>
    )
}
