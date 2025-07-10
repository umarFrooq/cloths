const sendEmail = require('../utils/sendEmail'); // Import the actual email utility
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
exports.handleContactForm = async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return next(new ErrorResponse('Please provide name, email, and message.', 400));
  }

  // Basic email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorResponse('Please provide a valid email address.', 400));
  }

  const contactMessage = `
    You have received a new contact form submission:
    --------------------------------------------------
    Name: ${name}
    Email: ${email}
    Phone: ${phone || 'Not provided'}
    Subject: ${subject || 'No subject'}
    --------------------------------------------------
    Message:
    ${message}
    --------------------------------------------------
  `;

  try {
    await sendEmail({
      to: process.env.CONTACT_FORM_RECEIVER_EMAIL || 'admin@example.com', // Admin's email address
      // fromName: name, // Nodemailer will use default from, but replyTo is better
      replyTo: email, // So admin can reply directly to the user
      subject: `Contact Form: ${subject || 'New Inquiry'} from ${name}`,
      message: contactMessage, // Plain text message
      // html: `<p>You have a new message from ${name} (${email}):</p><p><b>Subject:</b> ${subject || 'N/A'}</p><p><b>Phone:</b> ${phone || 'N/A'}</p><hr><p>${message.replace(/\n/g, '<br>')}</p>` // Example HTML version
    });

    res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    // The sendEmail utility already throws a generic error, or we can customize here
    next(new ErrorResponse('Your message could not be sent at this time. Please try again later.', 500));
  }
};
