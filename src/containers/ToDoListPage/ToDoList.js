import React from 'react';

import TodoItem from './ToDoItem';

const TodoList = (props) => {
    const {todoListData, setTodoList, onTaskDelete} = props;

    return todoListData?.map((todoItem, index) => {
        return (
            <div key={index} className='flex flex-row'>
                <div className='mr-2 mt-[5px]'>{index + 1}.</div>
                <TodoItem
                    key={index}
                    todoList={todoListData}
                    setTodoList={setTodoList}
                    todoItem={todoItem}
                    onTaskDelete={onTaskDelete}
                />
            </div>
        );
    });
};

export default TodoList;
