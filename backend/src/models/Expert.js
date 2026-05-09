const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  isBooked: { type: Boolean, default: false }
});

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  experience: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  availableSlots: [slotSchema]
});

module.exports = mongoose.model('Expert', expertSchema);
