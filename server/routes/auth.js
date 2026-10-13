const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ============================================
// 📝 ТІРКЕЛУ (тек оқушылар)
// ============================================
router.post('/register', async (req, res) => {
  try {
    const { full_name, class: studentClass, phone, weight, height, login, password } = req.body;

    if (!full_name || !studentClass || !login || !password) {
      return res.status(400).json({ error: 'Аты-жөні, сыныбы, логин, құпиясөз міндетті' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Құпиясөз кемінде 4 таңба' });
    }

    db.get(`SELECT id FROM users WHERE login = ?`, [login], async (err, row) => {
      if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
      if (row) return res.status(400).json({ error: 'Бұл логин бос емес' });

      const hash = await bcrypt.hash(password, 10);

      db.run(
        `INSERT INTO users (full_name, class, phone, weight, height, login, password_hash, role) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'student')`,
        [full_name, studentClass, phone || null, weight || null, height || null, login, hash],
        function (err) {
          if (err) return res.status(500).json({ error: 'Тіркелу сәтсіз' });

          const token = jwt.sign(
            { id: this.lastID, login, role: 'student', full_name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
          );

          res.json({
            message: 'Сәтті тіркелдіңіз!',
            token,
            user: { id: this.lastID, full_name, class: studentClass, role: 'student' }
          });
        }
      );
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

// ============================================
// 🔑 КІРУ
// ============================================
router.post('/login', (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: 'Логин мен құпиясөзді енгізіңіз' });
  }

  db.get(`SELECT * FROM users WHERE login = ?`, [login], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
    if (!user) return res.status(401).json({ error: 'Логин немесе құпиясөз қате' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Логин немесе құпиясөз қате' });

    const token = jwt.sign(
      { id: user.id, login: user.login, role: user.role, full_name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Сәтті кірдіңіз!',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        class: user.class,
        role: user.role
      }
    });
  });
});

// ============================================
// 👤 ӨЗ ПРОФИЛІМ
// ============================================
router.get('/me', authenticateToken, (req, res) => {
  db.get(
    `SELECT id, full_name, class, phone, weight, height, login, role, created_at 
     FROM users WHERE id = ?`,
    [req.user.id],
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
      if (!user) return res.status(404).json({ error: 'Табылмады' });
      res.json(user);
    }
  );
});

// ============================================
// 👥 БАРЛЫҚ ОҚУШЫЛАР (тек админ)
// ============================================
router.get('/students/all', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `SELECT id, full_name, class, phone, weight, height, login, created_at 
     FROM users 
     WHERE role = 'student'
     ORDER BY created_at DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
      res.json(rows);
    }
  );
});

// ============================================
// 🔍 БІР ОҚУШЫНЫҢ ТОЛЫҚ АҚПАРАТЫ (тек админ)
// ============================================
router.get('/students/:id', authenticateToken, requireAdmin, (req, res) => {
  db.get(
    `SELECT id, full_name, class, phone, weight, height, login, created_at 
     FROM users 
     WHERE id = ? AND role = 'student'`,
    [req.params.id],
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
      if (!user) return res.status(404).json({ error: 'Оқушы табылмады' });
      res.json(user);
    }
  );
});

// ============================================
// 🔑 ОҚУШЫНЫҢ ПАРОЛІН ӨЗГЕРТУ (тек админ)
// ============================================
router.put('/students/:id/password', authenticateToken, requireAdmin, async (req, res) => {
  const { new_password } = req.body;
  const studentId = req.params.id;

  if (!new_password || new_password.length < 4) {
    return res.status(400).json({ error: 'Жаңа құпиясөз кемінде 4 таңба' });
  }

  try {
    const hash = await bcrypt.hash(new_password, 10);

    db.run(
      `UPDATE users SET password_hash = ? WHERE id = ? AND role = 'student'`,
      [hash, studentId],
      function (err) {
        if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
        if (this.changes === 0) return res.status(404).json({ error: 'Оқушы табылмады' });

        res.json({
          message: '✅ Құпиясөз өзгертілді',
          new_password: new_password
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

module.exports = router;