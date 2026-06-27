const express = require('express');
const router = express.Router();
const {
  getFocusSessions,
  createFocusSession
} = require('../controllers/focusSessionController');

router.route('/')
  .get(getFocusSessions)
  .post(createFocusSession);

module.exports = router;
