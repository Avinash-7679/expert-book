const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

exports.createBooking = async (req, res) => {
  const { expertId, slotId, name, email, phone, notes } = req.body;
  
  console.log("📝 Incoming Booking Request:", { expertId, slotId, name, email });

  try {
    // ATOMIC GUARD: Update the slot to isBooked: true ONLY IF it was false
    // Using $elemMatch to ensure we target the same slot for both ID and availability
    const expert = await Expert.findOneAndUpdate(
      { 
        _id: expertId, 
        availableSlots: {
          $elemMatch: {
            _id: slotId,
            isBooked: false
          }
        }
      },
      { 
        $set: { "availableSlots.$.isBooked": true } 
      },
      { new: true }
    );

    if (!expert) {
      console.log("❌ Booking Failed: Slot not found or already booked.");
      return res.status(409).json({ 
        success: false, 
        message: 'This slot has already been booked by someone else or does not exist.' 
      });
    }

    // Find the specific slot details for the booking record
    const slot = expert.availableSlots.id(slotId);

    const newBooking = new Booking({
      expertId,
      slotId,
      name,
      email,
      phone,
      date: slot.date,
      timeSlot: slot.time,
      notes
    });

    await newBooking.save();

    // EMIT REAL-TIME UPDATE
    const io = req.app.get('io');
    io.emit('slotBooked', { expertId, slotId });

    res.status(201).json({ success: true, data: newBooking, message: 'Booking requested successfully!' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const bookings = await Booking.find({ email }).populate('expertId', 'name category').sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
