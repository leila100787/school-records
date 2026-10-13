require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// ============================================
// ДЕРЕКҚОРДЫ ІСКЕ ҚОСУ
// ============================================
require('./db/database');

// ============================================
// API МАРШРУТТАР
// ============================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/results', require('./routes/results'));
app.use('/api/ranking', require('./routes/ranking'));

// ============================================
// ТЕСТ МАРШРУТЫ
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Мектеп рекордтары API жұмыс істеп тұр!' });
});

// ============================================
// ҚАТЕ ӨҢДЕУ
// ============================================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Сервер қатесі' });
});

// ============================================
// СЕРВЕРДІ ІСКЕ ҚОСУ
// ============================================
app.listen(PORT, () => {
  console.log(`✅ Сервер: http://localhost:${PORT}`);
  console.log(`📋 Тест: http://localhost:${PORT}/api/health`);
});