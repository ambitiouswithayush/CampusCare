const express = require('express');
const {
  createAppointment,
  getStudentAppointments,
  getDoctorAppointments,   
  updateAppointmentStatus,
} = require('../controllers/appointmentController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Student creates appointment
router.post('/', protect, createAppointment);

// Student views own appointments
router.get('/student', protect, getStudentAppointments);

// Doctor views assigned appointments
router.get('/doctor', protect, getDoctorAppointments); 

// Doctor updates appointment status
router.put('/:id', protect, updateAppointmentStatus);
router.patch('/:id/status', protect, updateAppointmentStatus);

module.exports = router;
