import React, {useState} from 'react';

import utils from '../../utils/utils';

const TodoItem = ({todoItem, setTodoList, todoList, onTaskDelete}) => {
    const {id, text, subItems} = todoItem || {};
    const [isNewTaskMode, setIsNewTaskMode] = useState(false);
    const [isEditTaskMode, setIsEditTaskMode] = useState(false);
    const [newInputValue, setNewInputValue] = useState(text);

    const changeTaskText = (id, text, list) =>
        list?.map((todoItem) => {
            if (todoItem.id === id) {
                return {...todoItem, text};
            } else if (todoItem.subItems?.length > 0) {
                return {...todoItem, subItems: changeTaskText(id, text, todoItem.subItems)};
            } else {
                return todoItem;
            }
        });

    const addTask = (id, child, list) =>
        list?.map((todoItem) => {
            if (todoItem.id === id) {
                return {...todoItem, subItems: [...todoItem?.subItems, child]};
            } else if (todoItem.subItems?.length > 0) {
                return {...todoItem, subItems: addTask(id, child, todoItem.subItems)};
            } else {
                return todoItem;
            }
        });

    const onTaskAdd = (parentId, text) => {
        const newTask = {
            id: utils.getUuidv4(),
            text,
            subItems: [],
        };

        const res = addTask(parentId, newTask, todoList);

        setTodoList(res);
        setIsNewTaskMode(!isNewTaskMode);
    };

    const NewTodoItem = ({id, onCancel}) => {
        let inputRef = null;

        return (
            <div>
                <input
                    className='border-solid border-2 border-blue-400 text-black'
                    type='text'
                    ref={(ref) => (inputRef = ref)}
                />
                <button className={'ml-2'} onClick={() => onTaskAdd(id, inputRef.value)}>
                    Submit
                </button>
                <button className={'ml-2'} onClick={onCancel}>
                    Cancel
                </button>
            </div>
        );
    };

    return (
        <div>
            <div className='flex flex-row items-center'>
                {isEditTaskMode ? (
                    <input
                        value={newInputValue}
                        className='border-solid border-2 border-blue-400'
                        type='text'
                        onChange={(e) => setNewInputValue(e.target.value)}
                    />
                ) : (
                    <div>{text}</div>
                )}
                <button
                    className='ml-2 border-solid border-2 border-black rounded-md'
                    onClick={() => {
                        if (isEditTaskMode) {
                            setTodoList(changeTaskText(id, newInputValue, todoList));
                        }
                        setIsEditTaskMode(!isEditTaskMode);
                    }}
                >
                    {isEditTaskMode ? (
                        <div className='text-[20px] w-8'>&#10003;</div>
                    ) : (
                        <div className='text-[20px] w-8'>&#9998;</div>
                    )}
                </button>
                <button
                    className='ml-2 w-8 font-bold text-[20px] border-solid border-2 border-black rounded-md'
                    onClick={() => setIsNewTaskMode(!isNewTaskMode)}
                >
                    +
                </button>
                <button
                    className='ml-2 w-8 font-bold text-[20px] border-solid border-2 border-violet-700 rounded-md'
                    onClick={() => onTaskDelete(id)}
                >
                    -
                </button>
            </div>
            <div>{isNewTaskMode && <NewTodoItem id={id} onCancel={() => setIsNewTaskMode(!isNewTaskMode)} />}</div>
            {subItems?.map((subItem, index) => {
                return (
                    <div key={index} className='ml-8'>
                        <div className='flex flex-row'>
                            <div className='mr-2 mt-[5px]'>{index + 1}.</div>
                            <TodoItem
                                todoItem={subItem}
                                setTodoList={setTodoList}
                                todoList={todoList}
                                onTaskDelete={onTaskDelete}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TodoItem;
