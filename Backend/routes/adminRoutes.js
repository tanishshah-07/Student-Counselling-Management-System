const express = require('express');
const router = express.Router();
const { getStats, getUsers, getAppointments } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/stats')
  .get(protect, authorize('admin'), getStats);

router.route('/users')
  .get(protect, authorize('admin'), getUsers);

router.route('/appointments')
  .get(protect, authorize('admin'), getAppointments);

module.exports = router;
