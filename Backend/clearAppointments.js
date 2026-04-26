const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/student-counseling')
  .then(async () => {
    console.log('Connected to MongoDB');
    await Appointment.deleteMany({});
    console.log('All appointments deleted');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
