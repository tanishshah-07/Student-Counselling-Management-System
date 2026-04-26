const Counselor = require('../models/Counselor');
const User = require('../models/User');

// @desc    Get all counselors (with optional specialization filter)
// @route   GET /api/counselors
// @access  Public/Private
const getCounselors = async (req, res, next) => {
  try {
    const { specialization, search } = req.query;
    
    let query = {};
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    const counselors = await Counselor.find(query).populate({
      path: 'user',
      select: 'name email role',
      match: search ? { name: { $regex: search, $options: 'i' } } : {},
    });

    // Filter out null users (if search didn't match user)
    const filteredCounselors = counselors.filter((c) => c.user !== null);

    res.json(filteredCounselors);
  } catch (error) {
    next(error);
  }
};

// @desc    Get counselor by ID
// @route   GET /api/counselors/:id
// @access  Public/Private
const getCounselorById = async (req, res, next) => {
  try {
    const counselor = await Counselor.findById(req.params.id).populate('user', 'name email');
    if (!counselor) {
      res.status(404);
      return next(new Error('Counselor not found'));
    }
    res.json(counselor);
  } catch (error) {
    next(error);
  }
};

// @desc    Create/Update counselor profile (for counselor themselves)
// @route   POST /api/counselors/profile
// @access  Private/Counselor
const upsertCounselorProfile = async (req, res, next) => {
  try {
    const { specialization, experience, availability } = req.body;

    let profile = await Counselor.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile.specialization = specialization || profile.specialization;
      profile.experience = experience || profile.experience;
      profile.availability = availability || profile.availability;
      await profile.save();
    } else {
      // Create
      profile = await Counselor.create({
        user: req.user.id,
        specialization,
        experience,
        availability,
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCounselors,
  getCounselorById,
  upsertCounselorProfile,
};
