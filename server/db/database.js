const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const DB_PATH = path.join(__dirname, 'school.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Дерекқорға қосылу қатесі:', err.message);
  } else {
    console.log('✅ SQLite дерекқорына қосылды');
    initTables();
  }
});

function initTables() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        class TEXT NOT NULL,
        phone TEXT,
        weight REAL,
        height REAL,
        login TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'student' CHECK(role IN ('student', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        unit TEXT NOT NULL,
        sort_order TEXT DEFAULT 'DESC' CHECK(sort_order IN ('ASC', 'DESC')),
        is_active INTEGER DEFAULT 1,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        value REAL NOT NULL,
        video_url TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
        admin_comment TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        approved_at DATETIME,
        approved_by INTEGER,
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (approved_by) REFERENCES users(id)
      )
    `);

    console.log('✅ Кестелер дайын');
    createDefaultAdmin();
  });
}

async function createDefaultAdmin() {
  db.get(`SELECT id FROM users WHERE role = 'admin' LIMIT 1`, async (err, row) => {
    if (err) return console.error(err);
    if (row) {
      console.log('ℹ️  Админ бұрыннан бар');
      return;
    }
    const hash = await bcrypt.hash('admin123', 10);
    db.run(
      `INSERT INTO users (full_name, class, login, password_hash, role) 
       VALUES (?, ?, ?, ?, ?)`,
      ['Мұғалім', 'Әкімші', 'admin', hash, 'admin'],
      (err) => {
        if (err) console.error(err);
        else console.log('✅ Бастапқы админ: login=admin, password=admin123');
      }
    );
  });
}

module.exports = db;