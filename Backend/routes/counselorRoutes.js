const express = require('express');
const router = express.Router();
const {
  getCounselors,
  getCounselorById,
  upsertCounselorProfile,
} = require('../controllers/counselorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getCounselors);

router.route('/profile')
  .post(protect, authorize('counselor', 'admin'), upsertCounselorProfile);

router.route('/:id')
  .get(protect, getCounselorById);

module.exports = router;
