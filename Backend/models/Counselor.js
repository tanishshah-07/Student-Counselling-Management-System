const mongoose = require('mongoose');

const counselorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      default: 0,
    },
    availability: [
      {
        day: {
          type: String, // e.g. "Monday", "Tuesday"
          required: true,
        },
        slots: [
          {
            type: String, // e.g. "09:00", "10:00"
          }
        ]
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Counselor', counselorSchema);
