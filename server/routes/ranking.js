const express = require('express');
const db = require('../db/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Барлық бағыттар бойынша рейтинг
router.get('/', authenticateToken, (req, res) => {
  db.all(
    `SELECT id, name, unit, sort_order FROM categories WHERE is_active = 1 ORDER BY id`,
    [],
    (err, categories) => {
      if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });

      const promises = categories.map((cat) => {
        return new Promise((resolve) => {
          const order = cat.sort_order === 'ASC' ? 'ASC' : 'DESC';
          db.all(
            `SELECT 
              u.full_name, 
              u.class,
              r.value,
              r.video_url,
              r.approved_at
             FROM results r
             JOIN users u ON r.student_id = u.id
             WHERE r.category_id = ? AND r.status = 'approved'
             AND r.value = (
                SELECT MAX(r2.value) FROM results r2
                WHERE r2.student_id = r.student_id 
                  AND r2.category_id = r.category_id 
                  AND r2.status = 'approved'
             )
             GROUP BY u.id
             ORDER BY r.value ${order}, r.approved_at ASC`,
            [cat.id],
            (err, rows) => {
              if (err) return resolve({ ...cat, results: [] });
              const ranked = rows.map((row, idx) => ({
                rank: idx + 1,
                full_name: row.full_name,
                class: row.class,
                value: row.value,
                video_url: row.video_url
              }));
              resolve({ ...cat, results: ranked });
            }
          );
        });
      });

      Promise.all(promises).then((result) => {
        res.json(result);
      });
    }
  );
});

// Бір бағыт бойынша рейтинг
router.get('/:categoryId', authenticateToken, (req, res) => {
  const categoryId = req.params.categoryId;

  db.get(`SELECT id, name, unit, sort_order FROM categories WHERE id = ? AND is_active = 1`, [categoryId], (err, cat) => {
    if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
    if (!cat) return res.status(404).json({ error: 'Бағыт табылмады' });

    const order = cat.sort_order === 'ASC' ? 'ASC' : 'DESC';

    db.all(
      `SELECT 
        u.full_name, 
        u.class,
        r.value,
        r.video_url,
        r.approved_at
       FROM results r
       JOIN users u ON r.student_id = u.id
       WHERE r.category_id = ? AND r.status = 'approved'
       AND r.value = (
          SELECT MAX(r2.value) FROM results r2
          WHERE r2.student_id = r.student_id 
            AND r2.category_id = r.category_id 
            AND r2.status = 'approved'
       )
       GROUP BY u.id
       ORDER BY r.value ${order}, r.approved_at ASC`,
      [categoryId],
      (err, rows) => {
        if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
        const ranked = rows.map((row, idx) => ({
          rank: idx + 1,
          full_name: row.full_name,
          class: row.class,
          value: row.value,
          video_url: row.video_url
        }));
        res.json({ ...cat, results: ranked });
      }
    );
  });
});

// Статистика (админ үшін)
router.get('/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  const stats = {};

  db.get(`SELECT COUNT(*) AS total FROM users WHERE role = 'student'`, [], (err, row) => {
    stats.total_students = row?.total || 0;

    db.get(`SELECT COUNT(*) AS total FROM categories WHERE is_active = 1`, [], (err, row) => {
      stats.total_categories = row?.total || 0;

      db.get(`SELECT COUNT(*) AS total FROM results WHERE status = 'pending'`, [], (err, row) => {
        stats.pending = row?.total || 0;

        db.get(`SELECT COUNT(*) AS total FROM results WHERE status = 'approved'`, [], (err, row) => {
          stats.approved = row?.total || 0;

          db.get(`SELECT COUNT(*) AS total FROM results WHERE status = 'rejected'`, [], (err, row) => {
            stats.rejected = row?.total || 0;
            res.json(stats);
          });
        });
      });
    });
  });
});

module.exports = router;