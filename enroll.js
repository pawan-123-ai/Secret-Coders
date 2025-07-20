const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const sendMail = require('../utils/mailer'); // Import mailer for sending emails

// POST route to handle course enrollment
router.post('/enroll', async (req, res) => {
  const { name, email, courseCode, courseTitle, paymentMethod } = req.body;

  // Check if all fields are provided
  if (!name || !email || !courseCode || !courseTitle || !paymentMethod) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the course exists (optional validation step)
    const course = await Enrollment.findOne({ courseCode });
    if (!course) {
      return res.status(400).json({ message: 'Course not found' });
    }

    // Create new enrollment record
    const enrollment = new Enrollment({
      name,
      email,
      courseCode,
      courseTitle,
      paymentMethod
    });

    // Save the enrollment to the database
    await enrollment.save();

    // Send a confirmation email to the user
    const emailSubject = '🎓 Course Enrollment Confirmation - Secret Coders';
    const emailBody = `
      <h2>Hello ${name},</h2>
      <p>Thank you for enrolling in <strong>${courseTitle}</strong> (${courseCode}).</p>
      <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      <p>Your enrollment has been successfully recorded. 🎉</p>
      <p>All the best with your learning journey!<br/>Team Secret Coders</p>
    `;

    await sendMail(email, emailSubject, emailBody);

    // Return success response
    res.status(200).json({ message: 'Enrollment saved and confirmation email sent' });
  } catch (error) {
    // Log error and send failure response
    console.error(error);
    res.status(500).json({ message: 'Failed to save enrollment or send email' });
  }
});

module.exports = router;
