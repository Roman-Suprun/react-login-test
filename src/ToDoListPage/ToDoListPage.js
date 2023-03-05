import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import utils from '../utils/utils';
import todoListService from "../service/todoListService/todoListService";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cn from 'classnames';
import * as routePath from "../consts/routePath";
import TodoList from "./ToDoList";

const ToDoListPage = () => {
    const defaultTask = {id: 1, text: 'My first task...', completed: false, subItems: []}
    const [todoList, setTodoList] = useState([defaultTask]);
    const [isSaveInProgress, setIsSaveInProgress] = useState(false);
    const navigate = useNavigate();

    const onSave = async () => {
        setIsSaveInProgress(true);
        await todoListService.setTodoListData(navigate, todoList).then((res) => {
            if (res) {
                toast("Updated successfully");
            } else {
                toast.error("Update failed");
            }
            setIsSaveInProgress(false);
        });
    }

    useEffect(() => {
        (async () => {
            const data = await todoListService.getTodoListData(navigate);

            if (data) {
                setTodoList(data);
            }
        })()
    }, []);

    // const addTask = (id, child, list) => list?.map((todoItem) => {
    //     if (todoItem.id === id) {
    //         return {...todoItem, subItems: [...todoItem?.subItems, child]}
    //     } else if (todoItem.subItems?.length > 0) {
    //         return {...todoItem, subItems: addTask(id, child, todoItem.subItems)};
    //     } else {
    //         return todoItem;
    //     }
    // });

    // const changeTaskText = (id, text, list) => list?.map((todoItem) => {
    //     if (todoItem.id === id) {
    //         return {...todoItem, text}
    //     } else if (todoItem.subItems?.length > 0) {
    //         return {...todoItem, subItems: changeTaskText(id, text, todoItem.subItems)};
    //     } else {
    //         return todoItem;
    //     }
    // });

    // const onTaskAdd = (parentId, text) => {
    //     const newTask = {
    //         id: utils.getUuidv4(),
    //         text,
    //         subItems: []
    //     };
    //
    //     const res = addTask(parentId, newTask, todoList)
    //
    //     setTodoList(res);
    // };

    const removeTask = (id, list) => {
        return list.filter((task) => {
            if (task.id === id) {
                return false;
            } else if (task.subItems?.length > 0) {
                task.subItems = removeTask(id, task.subItems);
            }
            return true;
        });
    };

    const onTaskDelete = (id) => {
        const newList = removeTask(id, todoList);
        setTodoList(newList);
    };

    // const TodoList = ({todoListData}) => {
    //     return (
    //         todoListData.map((todoItem, index) => {
    //             return (
    //                 <div key={index} className='flex flex-row'>
    //                     <div className='mr-2 mt-[5px]'>{index + 1}.</div>
    //                     <TodoItem key={index} todoItem={todoItem}/>
    //                 </div>
    //             )
    //         })
    //     )
    // }

    // const NewTodoItem = ({id, onCancel}) => {
    //     let inputRef = null;
    //
    //     return (
    //         <div>
    //             <input className='border-solid border-2 border-blue-400 text-black' type="text"
    //                    ref={(ref) => inputRef = ref}/>
    //             <button className={'ml-2'} onClick={() => onTaskAdd(id, inputRef.value)}>Submit</button>
    //             <button className={'ml-2'} onClick={onCancel}>Cancel</button>
    //         </div>
    //     )
    // }
    // const TodoItem = ({todoItem}) => {
    //     const {id, text, subItems} = todoItem || {};
    //     const [isNewTaskMode, setIsNewTaskMode] = useState(false);
    //     const [isEditTaskMode, setIsEditTaskMode] = useState(false);
    //     const [newInputValue, setNewInputValue] = useState(text);
    //
    //     return (
    //         <div>
    //             <div className='flex flex-row items-center'>
    //                 {
    //                     isEditTaskMode
    //                         ? <input value={newInputValue} className='border-solid border-2 border-blue-400' type="text"
    //                                  onChange={(e) => setNewInputValue(e.target.value)}/>
    //                         : <div>{text}</div>
    //                 }
    //                 <button className='ml-2 border-solid border-2 border-black rounded-md'
    //                         onClick={() => {
    //                             if (isEditTaskMode) {
    //                                 setTodoList(changeTaskText(id, newInputValue, todoList))
    //                             }
    //                             setIsEditTaskMode(!isEditTaskMode)
    //                         }}>
    //                     {
    //                         isEditTaskMode ? <div className='text-[20px] w-8'>&#10003;</div> :
    //                             <div className='text-[20px] w-8'>&#9998;</div>
    //                     }
    //                 </button>
    //                 <button className='ml-2 w-8 font-bold text-[20px] border-solid border-2 border-black rounded-md'
    //                         onClick={() => setIsNewTaskMode(!isNewTaskMode)}>
    //                     +
    //                 </button>
    //                 <button
    //                     className='ml-2 w-8 font-bold text-[20px] border-solid border-2 border-violet-700 rounded-md'
    //                     onClick={() => onTaskDelete(id)}>
    //                     -
    //                 </button>
    //             </div>
    //             <div>
    //                 {isNewTaskMode && <NewTodoItem id={id} onCancel={() => setIsNewTaskMode(!isNewTaskMode)}/>}
    //             </div>
    //             {subItems?.map((subItem, index) => {
    //                 return (
    //                     <div key={index} className='ml-8'>
    //                         <div className='flex flex-row'>
    //                             <div className='mr-2 mt-[5px]'>{index + 1}.</div>
    //                             <TodoItem todoItem={subItem}/>
    //                         </div>
    //
    //                     </div>
    //                 )
    //             })}
    //         </div>
    //     )
    // };

    return (
        <div className="flex flex-col items-center pt-10 min-h-screen">
            <button className="absolute text-sm left-2 top-2 h-10 pointer p-2" onClick={() => {
                navigate(routePath.HOME_PAGE)
            }}>
                Home
            </button>
            <button className="absolute right-2 top-2 bg-blue-500 w-14" onClick={() => {
                navigate(routePath.USER_INFO_PAGE)
            }}>
                User
            </button>
            <h1 className="text-3xl font-bold mb-8">To-Do List</h1>
            <button className='ml-2 w-8 font-bold text-[20px] border-solid border-2 border-black rounded-md'
                    onClick={() => setTodoList([...todoList, defaultTask])}>
                +
            </button>
            <div className="mt-8 w-full flex flex-col items-center">
                <TodoList todoListData={todoList} setTodoList={setTodoList} onTaskDelete={onTaskDelete}/>
            </div>
            <button onClick={isSaveInProgress ? () => {
            } : onSave}
                    className={cn('mt-10 bg-blue-500 text-white px-4 py-2 rounded', {'opacity-50': isSaveInProgress})}>
                Save my todo list
            </button>
        </div>
    );
};

export default ToDoListPage;
