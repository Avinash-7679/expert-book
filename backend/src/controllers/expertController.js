const Expert = require('../models/Expert');

exports.getExperts = async (req, res) => {
  try {
    const { page = 1, limit = 6, category, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    console.log("🔍 Fetching experts with query:", query);

    const experts = await Expert.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Expert.countDocuments(query);

    res.json({
      success: true,
      data: {
        experts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    });
  } catch (error) {
    console.error("❌ BACKEND ERROR:", error); // This will show in your terminal
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return res.status(404).json({ success: false, message: 'Expert not found' });
    res.json({ success: true, data: expert });
  } catch (error) {
    console.error("❌ BACKEND ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
