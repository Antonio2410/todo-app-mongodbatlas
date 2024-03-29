import bcrypt from 'bcrypt';

export async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Fehler beim Hashen des Passworts:', error);
    throw error;
  }
}

export async function comparePassword(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.error('Fehler beim Überprüfen des Passworts:', error);
    throw error;
  }
}
