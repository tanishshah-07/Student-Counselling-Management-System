const User = require('../models/User');
const Appointment = require('../models/Appointment');
const SessionRecord = require('../models/SessionRecord');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCounselors = await User.countDocuments({ role: 'counselor' });
    const totalAppointments = await Appointment.countDocuments();
    const completedSessions = await Appointment.countDocuments({ status: 'completed' });
    const pendingRequests = await Appointment.countDocuments({ status: 'pending' });

    res.json({
      users: {
        total: totalUsers,
        students: totalStudents,
        counselors: totalCounselors
      },
      appointments: {
        total: totalAppointments,
        completed: completedSessions,
        pending: pendingRequests
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({})
      .populate('studentId', 'name email')
      .populate({
        path: 'counselorId',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getUsers,
  getAppointments,
};
