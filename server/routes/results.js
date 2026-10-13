const express = require('express');
const db = require('../db/database');
const { authenticateToken, requireAdmin, requireStudent } = require('../middleware/auth');

const router = express.Router();

// ============================================
// 📤 ОҚУШЫ НӘТИЖЕ ЖІБЕРЕДІ
// ============================================
router.post('/', authenticateToken, requireStudent, (req, res) => {
  const { category_id, value, video_url } = req.body;
  const student_id = req.user.id;

  if (!category_id || value === undefined || value === null) {
    return res.status(400).json({ error: 'Бағыт пен нәтиже міндетті' });
  }

  if (!video_url || !video_url.trim()) {
    return res.status(400).json({ error: 'Видео сілтемесі міндетті' });
  }

  const url = video_url.trim();
  if (!url.startsWith('http')) {
    return res.status(400).json({ error: 'Сілтеме http немесе https-пен басталуы керек' });
  }

  db.get(`SELECT id FROM categories WHERE id = ? AND is_active = 1`, [category_id], (err, cat) => {
    if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
    if (!cat) return res.status(404).json({ error: 'Бағыт табылмады' });

    db.run(
      `INSERT INTO results (student_id, category_id, value, video_url, status) 
       VALUES (?, ?, ?, ?, 'pending')`,
      [student_id, category_id, Number(value), url],
      function (err) {
        if (err) return res.status(500).json({ error: 'Жіберу сәтсіз' });
        res.json({
          message: '✅ Нәтиже жіберілді! Мұғалім тексерген соң кестеге қосылады.',
          result_id: this.lastID
        });
      }
    );
  });
});

// ============================================
// 📋 ОҚУШЫ ӨЗ НӘТИЖЕЛЕРІН КӨРЕДІ
// ============================================
router.get('/my', authenticateToken, requireStudent, (req, res) => {
  db.all(
    `SELECT r.id, r.value, r.video_url, r.status, r.admin_comment, r.submitted_at,
            c.name AS category_name, c.unit
     FROM results r
     JOIN categories c ON r.category_id = c.id
     WHERE r.student_id = ?
     ORDER BY r.submitted_at DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
      res.json(rows);
    }
  );
});

// ============================================
// 📊 АДМИН — БАРЛЫҚ НӘТИЖЕЛЕР (БАҒЫТ БОЙЫНША)
// ============================================
router.get('/all', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `SELECT 
       r.id, r.value, r.status, r.video_url, r.submitted_at, r.approved_at,
       r.admin_comment,
       u.full_name, u.class, u.phone, u.weight, u.height,
       c.name AS category_name, c.unit, c.id AS category_id, c.sort_order
     FROM results r
     JOIN users u ON r.student_id = u.id
     JOIN categories c ON r.category_id = c.id
     WHERE c.is_active = 1
     ORDER BY c.id ASC, r.value DESC, r.submitted_at ASC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
      res.json(rows);
    }
  );
});

// ============================================
// 📋 АДМИН — ТЕКСЕРУ КЕЗЕГІНДЕГІ НӘТИЖЕЛЕР
// ============================================
router.get('/pending', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `SELECT r.id, r.value, r.video_url, r.submitted_at,
            u.full_name, u.class, u.phone, u.weight, u.height,
            c.name AS category_name, c.unit
     FROM results r
     JOIN users u ON r.student_id = u.id
     JOIN categories c ON r.category_id = c.id
     WHERE r.status = 'pending'
     ORDER BY r.submitted_at ASC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
      res.json(rows);
    }
  );
});

// ============================================
// ✅ АДМИН РАСТАЙДЫ
// ============================================
router.put('/:id/approve', authenticateToken, requireAdmin, (req, res) => {
  db.run(
    `UPDATE results 
     SET status = 'approved', approved_at = CURRENT_TIMESTAMP, approved_by = ?
     WHERE id = ? AND status = 'pending'`,
    [req.user.id, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Растау сәтсіз' });
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Табылмады немесе бұрын тексерілген' });
      }
      res.json({ message: '✅ Нәтиже расталды, кестеге қосылды!' });
    }
  );
});

// ============================================
// ❌ АДМИН ҚАБЫЛДАМАЙДЫ
// ============================================
router.put('/:id/reject', authenticateToken, requireAdmin, (req, res) => {
  const { comment } = req.body;

  db.run(
    `UPDATE results 
     SET status = 'rejected', admin_comment = ?, approved_at = CURRENT_TIMESTAMP, approved_by = ?
     WHERE id = ? AND status = 'pending'`,
    [comment || 'Видео сәйкес емес', req.user.id, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Қабылдамау сәтсіз' });
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Табылмады немесе бұрын тексерілген' });
      }
      res.json({ message: '❌ Нәтиже қабылданбады' });
    }
  );
});

// ============================================
// 📋 АДМИН — БІР ОҚУШЫНЫҢ БАРЛЫҚ НӘТИЖЕЛЕРІ
// ============================================
router.get('/student/:id', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `SELECT r.id, r.value, r.video_url, r.status, r.admin_comment,
            r.submitted_at, r.approved_at,
            c.name AS category_name, c.unit
     FROM results r
     JOIN categories c ON r.category_id = c.id
     WHERE r.student_id = ?
     ORDER BY r.submitted_at DESC`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
      res.json(rows);
    }
  );
});

module.exports = router;