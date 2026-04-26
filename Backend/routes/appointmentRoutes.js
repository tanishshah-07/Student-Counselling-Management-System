const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  addSessionRecord
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, bookAppointment)
  .get(protect, getAppointments);

router.route('/:id/status')
  .put(protect, updateAppointmentStatus);

router.route('/:id/record')
  .post(protect, authorize('counselor'), addSessionRecord);

module.exports = router;
