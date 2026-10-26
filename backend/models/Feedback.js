const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: [true, 'Course ID is required.'],
      trim: true,
      minlength: [2, 'Course ID must be at least 2 characters long.']
    },
    courseName: {
      type: String,
      required: [true, 'Course name is required.'],
      trim: true,
      minlength: [2, 'Course name must be at least 2 characters long.']
    },
    courseDuration: {
      type: String,
      required: [true, 'Course duration is required.'],
      trim: true,
      minlength: [2, 'Course duration must be at least 2 characters long.']
    },
    comments: {
      type: String,
      required: [true, 'Feedback comments are required.'],
      trim: true,
      minlength: [3, 'Comments must be at least 3 characters long.']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required.'],
      min: [1, 'Rating must be between 1 and 5.'],
      max: [5, 'Rating must be between 1 and 5.']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
