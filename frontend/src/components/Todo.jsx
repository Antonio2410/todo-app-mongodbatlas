import React from 'react';
import '../styles/Todo.css';
import crossIcon from '../images/icon-cross.svg';

const Todo = ({ todo, toggleComplete, deleteTodo }) => {
    return (
        <div className="todo">
            <div
                className={`check-icon ${todo.completed ? 'completed' : ''}`}
                onClick={() => toggleComplete(todo.id)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11">
                    <path fill="none" stroke="#FFF" strokeWidth="2" d="M1 4.304L3.696 7 9 1" />
                </svg>
            </div>
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.title}
            </span>
            <div className="delete-icon" onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }}>
                <img src={crossIcon} alt="Delete Icon" />
            </div>
        </div>
    );
};

export default Todo;
