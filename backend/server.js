import express from 'express';
import { connectToDatabase } from './db/database.js';
import {
  getAllTodos,
  createTodo,
  deleteTodo,
  updateTodoStatus,
} from './controller/todoController.js';
import { hashPassword } from './db/auth.js';

const app = express();
const PORT = 9000;
app.use(express.json());

// Middleware-Funktion zum Hashen des Passworts
const hashPasswordMiddleware = async (req, res, next) => {
  if (req.body.password) {
    req.body.password = await hashPassword(req.body.password);
  }
  next();
};

// Middleware zum Setzen der CORS-Header
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Verwendung der Middleware zum Hashen des Passworts
app.use(hashPasswordMiddleware);

// Verbindung zur Datenbank herstellen
connectToDatabase()
  .then(() => {
    console.log('Erfolgreich zur MongoDB verbunden');
    app.listen(PORT, () => {
      console.log(`Server läuft auf Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Fehler beim Herstellen der Verbindung zur MongoDB:', error);
  });

// Routing für die Todos
app.get('/todos', getAllTodos);
app.post('/todos', createTodo);
app.delete('/todos/:id', deleteTodo);
app.patch('/todos/:id', updateTodoStatus);
