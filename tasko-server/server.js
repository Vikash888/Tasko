const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// In-memory store for invite links (in production, use a database)
const inviteLinks = new Map();

// Create email transporter with App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Transporter verification failed:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Generate unique invite link
function generateInviteLink(taskId) {
  const token = crypto.randomBytes(32).toString('hex');
  const inviteLink = `http://localhost:3000/invite/${token}`;
  
  // Store the token-task mapping (expire after 7 days)
  inviteLinks.set(token, {
    taskId,
    expires: Date.now() + (7 * 24 * 60 * 60 * 1000)
  });
  
  // Clean up expired tokens
  cleanupExpiredTokens();
  
  return inviteLink;
}

// Clean up expired tokens
function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [token, data] of inviteLinks.entries()) {
    if (data.expires < now) {
      inviteLinks.delete(token);
    }
  }
}

// Share task endpoint
app.post('/api/share-task', async (req, res) => {
  console.log('Received share task request');

  try {
    const { taskDetails, recipientEmail } = req.body;

    // Validate input
    if (!taskDetails || !recipientEmail) {
      return res.status(400).json({
        error: 'Task details and recipient email are required.'
      });
    }

    // Generate invite link
    const inviteLink = generateInviteLink(taskDetails.id);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'Task Shared With You',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            A New Task Has Been Shared With You
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #2980b9; margin-top: 0;">${taskDetails.title}</h3>
            <p><strong>Description:</strong> ${taskDetails.description || 'No description provided'}</p>
            <p><strong>Priority:</strong> 
              <span style="color: ${
                taskDetails.priority === 'High' ? '#e74c3c' :
                taskDetails.priority === 'Medium' ? '#f39c12' :
                '#27ae60'
              };">
                ${taskDetails.priority}
              </span>
            </p>
            <p><strong>Due Date:</strong> ${new Date(taskDetails.date).toLocaleString()}</p>
            <p><strong>Category:</strong> ${taskDetails.category}</p>
            <p><strong>Status:</strong> ${taskDetails.status}</p>
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="${inviteLink}" 
                 style="background-color: #3498db; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                View and Accept Task
              </a>
            </div>
          </div>
          
          <div style="margin-top: 20px; background-color: #f4f6f8; padding: 15px; border-radius: 5px;">
            <p style="margin: 0; color: #666;">
              <strong>Note:</strong> This invite link will expire in 7 days. 
              Click the button above to view and accept the task in Tasko.
            </p>
          </div>
          
          <div style="margin-top: 20px; font-size: 12px; color: #7f8c8d; text-align: center;">
            <p>This is an automated message from Tasko App. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    res.status(200).json({
      message: 'Task shared successfully',
      messageId: info.messageId,
      inviteLink
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      error: 'Failed to share task',
      details: error.message
    });
  }
});

// Verify invite link endpoint
app.get('/api/verify-invite/:token', (req, res) => {
  const { token } = req.params;
  const inviteData = inviteLinks.get(token);

  if (!inviteData || inviteData.expires < Date.now()) {
    return res.status(404).json({ error: 'Invalid or expired invite link' });
  }

  res.json({ taskId: inviteData.taskId });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});