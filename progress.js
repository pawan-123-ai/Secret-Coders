const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// Save or update progress
router.post('/update', async (req, res) => {
  const { userId, courseId, completedPercentage, lastAccessedLessonId } = req.body;
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId, courseId },
      { completedPercentage, lastAccessedLessonId, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json({ success: true, progress });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all progress of a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const progress = await Progress.find({ userId })
      .populate('courseId')
      .populate('lastAccessedLessonId');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
