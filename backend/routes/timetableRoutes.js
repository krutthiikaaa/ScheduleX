const express = require('express');
const router = express.Router();
const {
  getTimetableEvents,
  createTimetableEvent,
  updateTimetableEvent,
  deleteTimetableEvent
} = require('../controllers/timetableController');

router.route('/').get(getTimetableEvents).post(createTimetableEvent);
router.route('/:id').put(updateTimetableEvent).delete(deleteTimetableEvent);

module.exports = router;
