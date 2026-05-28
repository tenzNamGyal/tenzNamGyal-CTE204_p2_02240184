const express = require('express');
const router = express.Router();
const {
  getAllSubjects,
  createSubject,
  deleteSubject
} = require('../controllers/subjectController');

router.get('/', getAllSubjects);
router.post('/', createSubject);
router.delete('/:id', deleteSubject);

module.exports = router;