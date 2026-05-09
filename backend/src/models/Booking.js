const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ["Pending", "Confirmed", "Completed"], 
    default: "Pending" 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
