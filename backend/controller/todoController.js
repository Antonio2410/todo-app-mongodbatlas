import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db/database.js';

export async function getAllTodos(req, res) {
  try {
    const db = await connectToDatabase();
    const todos = await db.collection('todos').find({}).toArray();
    res.json(todos);
  } catch (error) {
    console.error('Fehler beim Abrufen der Todos:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
}

export async function createTodo(req, res) {
  try {
    const { title, description, completed } = req.body;
    const db = await connectToDatabase();
    const result = await db.collection('todos').insertOne({ title, completed });
    res.status(201).json({ message: result });
  } catch (error) {
    console.error('Fehler beim Erstellen des Todos:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
}

export async function deleteTodo(req, res) {
  try {
    const id = req.params.id;
    const db = await connectToDatabase();
    const result = await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Todo nicht gefunden' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Fehler beim Löschen des Todos:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
}

export async function updateTodoStatus(req, res) {
  try {
    const id = req.params.id;
    const { completed } = req.body;
    const db = await connectToDatabase();
    const result = await db
      .collection('todos')
      .updateOne({ _id: new ObjectId(id) }, { $set: { completed: completed } });
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: 'Todo nicht gefunden' });
    } else {
      res.status(200).json({ message: 'Todo erfolgreich aktualisiert' });
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Todos:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
}
