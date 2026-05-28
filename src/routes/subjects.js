const express = require('express');
const router = express.Router();
const {
  getAllSubjects,
  createSubject,
  deleteSubject
} = require('../controllers/subjectController');

// REST Router configuration map
router.get('/', getAllSubjects);
router.post('/', createSubject);
router.delete('/:id', deleteSubject);

module.exports = router;