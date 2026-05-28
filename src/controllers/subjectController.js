const db = require('../models/db');

const getAllSubjects = (req, res, next) => {
  try {
    const subjects = db.prepare('SELECT * FROM subjects ORDER BY id DESC').all();
    res.status(200).json({ success: true, data: subjects });
  } catch (err) {
    next(err);
  }
};

const createSubject = (req, res, next) => {
  try {
    const { subject, marks, credits } = req.body;
    const errors = [];

    if (!subject || subject.trim() === '') errors.push('Subject name is required');
    if (marks === undefined || isNaN(marks) || marks < 0 || marks > 100) errors.push('Marks must be between 0 and 100');
    if (!credits || isNaN(credits)) errors.push('Valid credit assessment required');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const statement = db.prepare('INSERT INTO subjects (subject, marks, credits) VALUES (?, ?, ?)');
    const info = statement.run(subject.trim(), Number(marks), Number(credits));

    const newRow = db.prepare('SELECT * FROM subjects WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ success: true, data: newRow });
  } catch (err) {
    next(err);
  }
};

const deleteSubject = (req, res, next) => {
  try {
    const { id } = req.params;
    const item = db.prepare('SELECT * FROM subjects WHERE id = ?').get(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    db.prepare('DELETE FROM subjects WHERE id = ?').run(id);
    res.status(200).json({ success: true, message: 'Record cleared successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllSubjects, createSubject, deleteSubject };