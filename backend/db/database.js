import { MongoClient } from 'mongodb';

import dotenv from 'dotenv';
dotenv.config({ path: './db/.env' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

export async function connectToDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Erfolgreich zur MongoDB verbunden');

    return client.db(dbName);
  } catch (error) {
    console.error('Fehler beim Herstellen der Verbindung zur MongoDB:', error);
    throw error;
  }
}

export async function insertDocument(collectionName, document) {
  try {
    const db = await connectToDatabase();

    await db.collection(collectionName).insertOne(document);

    console.log('Dokument erfolgreich eingefügt');
  } catch (error) {
    console.error('Fehler beim Einfügen des Dokuments:', error);
    throw error;
  }
}
