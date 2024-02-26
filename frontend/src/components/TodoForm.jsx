import React, { useState } from 'react';
import '../styles/TodoForm.css';

const TodoForm = ({ addTodo }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() !== '') {
            addTodo(text);
            setText('');
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add new todo"
                pattern="^(?!.*(?:http|www))[a-zA-Z0-9\s]+$" 
                title="Please enter a valid todo (no links allowed)"
            />
        </form>
    );
};

export default TodoForm;
