const Database = require('better-sqlite3');
require('dotenv').config();

const dbFile = process.env.DB_FILE || './academic_tracker.db';
const db = new Database(dbFile);

// Initialize database schema matching your frontend requirements
db.exec(`
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    marks INTEGER NOT NULL,
    credits INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log(`SQLite Database initialized connected at: ${dbFile}`);
module.exports = db;