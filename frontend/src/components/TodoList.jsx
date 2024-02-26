import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Todo from './Todo';
import TodoForm from './TodoForm';
import TodoFilter from './TodoFilter';
import moonIcon from '../images/icon-moon.svg';
import sunIcon from '../images/icon-sun.svg';
import '../styles/TodoList.css';
import { fetchTodos, addTodo as postTodo } from '../components/api';
import { updateTodoStatus } from '../components/api';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    const [darkMode, setDarkMode] = useState(false);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const todosData = await fetchTodos();
                setTodos(todosData);
            } catch (error) {
                console.error('Fehler beim Abrufen der Todos:', error);
            }
        };

        fetchData();
    }, [])

    const addTodo = async (text) => {
        try {
            const newTodo = { title: text, completed: false};
            const addedTodo = await postTodo(newTodo); 
            setTodos(prevTodos => [...prevTodos, { ...addedTodo, title: text }]);

            const updatedTodosData = await fetchTodos();
            setTodos(updatedTodosData);
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Todos:', error);
        }
    };

    const toggleComplete = async (id) => {
       
        try {
            const todoToUpdate = todos.find(todo => todo._id === id);  
            if (!todoToUpdate) {
                throw new Error('Todo not found');
            }
            const updatedStatus = !todoToUpdate.completed;
            const updatedTodo = await updateTodoStatus(id, updatedStatus);
        
            // Aktualisieren Sie den Zustand der Todos-Komponente, indem Sie eine neue Liste mit aktualisierten Todos erstellen
            setTodos(prevTodos =>
                prevTodos.map(todo =>
                    todo._id === updatedTodo._id ? updatedTodo : todo
                )
            );

            const updatedTodosData = await fetchTodos();
            setTodos(updatedTodosData);
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Aufgabenstatus:', error);
        }
    };
    
    

    const deleteTodo = async (id) => {
        try {
          const response = await fetch(`http://localhost:9000/todos/${id}`, {
            method: 'DELETE',
          });
          if (!response.ok) {
            throw new Error('Fehler beim Löschen der Aufgabe');
          }
          // Aktualisieren Sie den Zustand Ihrer Todo-Liste, um die gelöschte Aufgabe zu entfernen
          setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
          
          // Daten erneut abrufen, um die Liste zu aktualisieren
          const updatedTodosData = await fetchTodos();
          setTodos(updatedTodosData);
        } catch (error) {
          console.error('Fehler beim Löschen der Aufgabe:', error);
        }
      };
    

    const moveTodo = (dragIndex, hoverIndex) => {
        const dragTodo = todos[dragIndex];
        setTodos((prevTodos) => {
            const updatedTodos = [...prevTodos];
            updatedTodos.splice(dragIndex, 1);
            updatedTodos.splice(hoverIndex, 0, dragTodo);
            return updatedTodos;
        });
    };

    const clearCompleted = async () => {
        try {
            // Filtere die IDs der abgeschlossenen Todos heraus
            const completedIds = todos.filter(todo => todo.completed).map(todo => todo._id);
    
            // Durchlaufe die Liste der abgeschlossenen Todos und lösche sie einzeln
            for (const id of completedIds) {
                const response = await fetch(`http://localhost:9000/todos/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Fehler beim Löschen der Aufgabe');
                }
            }
    
            // Aktualisiere die Liste der Todos, um die gelöschten zu entfernen
            const updatedTodosData = await fetchTodos();
            setTodos(updatedTodosData);
        } catch (error) {
            console.error('Fehler beim Löschen der abgeschlossenen Aufgaben:', error);
        }
    };
    
    const filteredTodos = todos.filter((todo) => {
        if (filter === 'all') return true;
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const toggleDarkMode = () => {
        setDarkMode((prevDarkMode) => !prevDarkMode);
    };

    return (
        <div className={`todo-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="title-container">
                <h1>Todo</h1>
                <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                    <img src={darkMode ? sunIcon : moonIcon} alt="Dark Mode Toggle" />
                </button>
            </div>
            <TodoForm addTodo={addTodo} />
            <DndProvider backend={HTML5Backend}>
                {filteredTodos.map((todo, index) => (
                    <div key={`${index}-${todo.text}`}>
                        <TodoWithDragAndDrop
                            index={index}
                            todo={todo}
                            toggleComplete={() => toggleComplete(todo._id)} 
                            deleteTodo={() => deleteTodo(todo._id)}
                            moveTodo={moveTodo}
                        />
                    </div>
                ))}
            </DndProvider>
            <TodoFilter todos={todos} setFilter={setFilter} clearCompleted={clearCompleted} />
        </div>
    );
};

const TodoWithDragAndDrop = ({ index, todo, toggleComplete, deleteTodo, moveTodo }) => {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'TODO',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'TODO',
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveTodo(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    useEffect(() => {
        const currentRef = ref.current;
        if (currentRef) {
            currentRef.addEventListener('pointerdown', handlePointerDown);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('pointerdown', handlePointerDown);
            }
        };
    }, []);

    const handlePointerDown = (event) => {
        if (ref.current) {
            ref.current.setPointerCapture(event.pointerId);
        }
    };

    drag(drop(ref));

    return (
        <div
            ref={ref}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
            }}
        >
            <Todo
                todo={todo}
                toggleComplete={() => toggleComplete(todo.id)}
                deleteTodo={() => deleteTodo(todo._id)}
            />
        </div>
    );
};

export default TodoList;
