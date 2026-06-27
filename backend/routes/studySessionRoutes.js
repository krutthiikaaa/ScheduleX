const express = require('express');
const router = express.Router();
const {
  getStudySessions,
  createStudySession,
  updateStudySession,
  deleteStudySession
} = require('../controllers/studySessionController');

router.route('/')
  .get(getStudySessions)
  .post(createStudySession);

router.route('/:id')
  .put(updateStudySession)
  .delete(deleteStudySession);

module.exports = router;
