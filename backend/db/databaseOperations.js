// Importieren Sie die Funktionen aus Ihrer database.js-Datei
const { connectToDatabase, insertDocument } = require('./database');

// Definieren Sie die Hauptfunktion
async function main() {
  try {
    // Verbindung zur Datenbank herstellen
    const db = await connectToDatabase();

    // Dokument zum Einfügen erstellen
    const newTodo = {
      id: 4,
      title: 'Einen neuen Task hinzufügen',
      description: 'Eine Beschreibung für den neuen Task',
      completed: false,
    };

    // Dokument in die Datenbank einfügen
    await insertDocument('todos', newTodo);

    console.log('Neuer Task erfolgreich eingefügt');
  } catch (error) {
    console.error('Fehler beim Ausführen der Hauptfunktion:', error);
  }
}

// Exportieren Sie die Hauptfunktion, um sie in anderen Dateien zu verwenden
module.exports = main;
