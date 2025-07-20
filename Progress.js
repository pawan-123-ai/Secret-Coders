const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedPercentage: {
    type: Number,
    default: 0
  },
  lastAccessedLessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'  // Optional: Only if you track lessons
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Progress', progressSchema);
