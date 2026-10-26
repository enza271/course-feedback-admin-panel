const express = require('express');
const Feedback = require('../models/Feedback');

const router = express.Router();

const normalizeFeedbackPayload = (body) => ({
  courseId: typeof body.courseId === 'string' ? body.courseId.trim() : body.courseId,
  courseName: typeof body.courseName === 'string' ? body.courseName.trim() : body.courseName,
  courseDuration: typeof body.courseDuration === 'string' ? body.courseDuration.trim() : body.courseDuration,
  comments: typeof body.comments === 'string' ? body.comments.trim() : body.comments,
  rating: Number(body.rating)
});

const validatePayload = (payload) => {
  if (!payload.courseId || !payload.courseName || !payload.courseDuration || !payload.comments || payload.rating === undefined || Number.isNaN(payload.rating)) {
    return 'Course ID, course name, duration, comments, and rating are required.';
  }

  if (payload.rating < 1 || payload.rating > 5) {
    return 'Rating must be between 1 and 5.';
  }

  return null;
};

router.get('/', async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: feedbackList.length, data: feedbackList });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch feedback entries.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = normalizeFeedbackPayload(req.body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const feedback = new Feedback(payload);
    const savedFeedback = await feedback.save();

    return res.status(201).json({ success: true, message: 'Feedback created successfully.', data: savedFeedback });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((field) => field.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    return res.status(500).json({ success: false, message: 'Unable to create feedback entry.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payload = normalizeFeedbackPayload(req.body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    if (!updatedFeedback) {
      return res.status(404).json({ success: false, message: 'Feedback record not found.' });
    }

    return res.status(200).json({ success: true, message: 'Feedback updated successfully.', data: updatedFeedback });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid feedback ID provided.' });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((field) => field.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    return res.status(500).json({ success: false, message: 'Unable to update feedback entry.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(404).json({ success: false, message: 'Feedback record not found.' });
    }

    return res.status(200).json({ success: true, message: 'Feedback deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid feedback ID provided.' });
    }

    return res.status(500).json({ success: false, message: 'Unable to delete feedback entry.' });
  }
});

module.exports = router;
