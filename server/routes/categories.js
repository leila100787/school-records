const express = require('express');
const db = require('../db/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Барлық белсенді бағыттар (барлығы көреді)
router.get('/', authenticateToken, (req, res) => {
  db.all(
    `SELECT id, name, unit, sort_order, is_active, created_at 
     FROM categories 
     WHERE is_active = 1 
     ORDER BY id ASC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
      res.json(rows);
    }
  );
});

// Барлық бағыттар (админ — өшірілгендерін де көреді)
router.get('/all', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `SELECT c.*, u.full_name AS created_by_name 
     FROM categories c
     LEFT JOIN users u ON c.created_by = u.id
     ORDER BY c.id DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Дерекқор қатесі' });
      res.json(rows);
    }
  );
});

// Жаңа бағыт қосу (тек админ)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const { name, unit, sort_order } = req.body;

  if (!name || !unit) {
    return res.status(400).json({ error: 'Атауы мен өлшем бірлігі міндетті' });
  }

  const order = sort_order === 'ASC' ? 'ASC' : 'DESC';

  db.run(
    `INSERT INTO categories (name, unit, sort_order, created_by) 
     VALUES (?, ?, ?, ?)`,
    [name.trim(), unit.trim(), order, req.user.id],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Бұл бағыт бұрыннан бар' });
        }
        return res.status(500).json({ error: 'Қосу сәтсіз' });
      }
      res.json({
        message: '✅ Бағыт қосылды',
        category: { id: this.lastID, name, unit, sort_order: order }
      });
    }
  );
});

// Бағытты өңдеу
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { name, unit, sort_order, is_active } = req.body;
  const id = req.params.id;

  db.run(
    `UPDATE categories 
     SET name = ?, unit = ?, sort_order = ?, is_active = ?
     WHERE id = ?`,
    [name, unit, sort_order, is_active ? 1 : 0, id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Өңдеу сәтсіз' });
      if (this.changes === 0) return res.status(404).json({ error: 'Табылмады' });
      res.json({ message: '✅ Бағыт өңделді' });
    }
  );
});

// Бағытты өшіру (is_active = 0)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run(
    `UPDATE categories SET is_active = 0 WHERE id = ?`,
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Өшіру сәтсіз' });
      if (this.changes === 0) return res.status(404).json({ error: 'Табылмады' });
      res.json({ message: '✅ Бағыт өшірілді' });
    }
  );
});

module.exports = router;