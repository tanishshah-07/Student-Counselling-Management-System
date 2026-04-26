const Appointment = require('../models/Appointment');
const Counselor = require('../models/Counselor');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Student)
const bookAppointment = async (req, res, next) => {
  try {
    const { counselorId, date, timeSlot } = req.body;
    const studentId = req.user.id; // User from protect middleware

    // Validate if counselor exists
    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
      res.status(404);
      return next(new Error('Counselor not found'));
    }

    // Double Booking Check Logic
    // Same counselor, same date, same timeSlot and status is NOT cancelled/rejected
    const conflictingAppointment = await Appointment.findOne({
      counselorId,
      date,
      timeSlot,
      status: { $in: ['pending', 'accepted', 'completed'] },
    });

    if (conflictingAppointment) {
      res.status(400);
      return next(new Error('Time slot is already booked for this counselor'));
    }

    const appointment = await Appointment.create({
      studentId,
      counselorId,
      date,
      timeSlot,
      status: 'pending',
    });

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user appointments (Student: those they booked, Counselor: those booked with them)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query.studentId = req.user.id;
    } else if (req.user.role === 'counselor') {
      const counselor = await Counselor.findOne({ user: req.user.id });
      if (counselor) {
        query.counselorId = counselor._id;
      } else {
        return res.json([]); // Counselor hasn't set up profile yet
      }
    } else {
      // Admin gets all
    }

    const appointments = await Appointment.find(query)
      .populate('studentId', 'name email phone gender bloodGroup age education degree profilePicture')
      .populate({
        path: 'counselorId',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ date: 1, timeSlot: 1 });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Accept, Reject, Complete, Cancel)
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
       res.status(400);
       return next(new Error('Invalid status'));
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      res.status(404);
      return next(new Error('Appointment not found'));
    }

    // Role-based restrictions
    if (req.user.role === 'student' && status !== 'cancelled') {
      res.status(403);
      return next(new Error('Students can only cancel appointments'));
    }

    if (req.user.role === 'counselor') {
       const counselor = await Counselor.findOne({ user: req.user.id });
       if (!counselor || appointment.counselorId.toString() !== counselor._id.toString()) {
           res.status(403);
           return next(new Error('Not authorized to update this appointment'));
       }
    }
    
    if (req.user.role === 'student' && appointment.studentId.toString() !== req.user.id) {
       res.status(403);
       return next(new Error('Not authorized to update this appointment'));
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a session record (notes) to a completed appointment
// @route   POST /api/appointments/:id/record
// @access  Private (Counselor)
const addSessionRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes, followUpRequired, followUpDate } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      res.status(404);
      return next(new Error('Appointment not found'));
    }

    if (appointment.status !== 'completed') {
      res.status(400);
      return next(new Error('Session notes can only be added to completed appointments'));
    }

    if (req.user.role !== 'counselor') {
      res.status(403);
      return next(new Error('Only counselors can add session records'));
    }

    const SessionRecord = require('../models/SessionRecord');
    
    // Check if record already exists
    const existingRecord = await SessionRecord.findOne({ appointmentId: id });
    if (existingRecord) {
      res.status(400);
      return next(new Error('Session record already exists for this appointment'));
    }

    const record = await SessionRecord.create({
      appointmentId: id,
      counselorId: req.user.id,
      studentId: appointment.studentId,
      notes,
      followUpRequired,
      followUpDate
    });

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  addSessionRecord
};
