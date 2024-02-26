const apiUrl = 'http://localhost:9000/todos';

fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Netzwerkfehler: ' + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    //console.log('Empfangene Daten:', data);
  })
  .catch((error) => {
    console.error('Fehler beim Abrufen der Daten:', error);
  });

export async function fetchTodos() {
  const apiUrl = 'http://localhost:9000/todos';
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Netzwerkfehler: ' + response.statusText);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    throw error;
  }
}

export async function addTodo(todo) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: todo.title,
        completed: false,
      }),
    });
    if (!response.ok) {
      throw new Error('Netzwerkfehler: ' + response.statusText);
    }
    const addedTodo = await response.json();
    return addedTodo;
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Todos:', error);
    throw error;
  }
}

export async function updateTodoStatus(id, completed) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: completed,
      }),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Aktualisieren des Aufgabenstatus');
    }
    const updatedTodo = await response.json();
    return updatedTodo;
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Aufgabenstatus:', error);
    throw error;
  }
}
