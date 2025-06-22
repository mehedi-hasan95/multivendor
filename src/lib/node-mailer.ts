import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GOOGLE_APP_GMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendEmail = async (email: string, code: string) => {
  const date = new Date().getFullYear();
  const emailSend = await transporter.sendMail({
    to: email,
    subject: "Verify your email",
    html: `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Email Verification</title>
                  <style>
                      body {
                          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                          line-height: 1.6;
                          color: #333;
                          margin: 0;
                          padding: 0;
                          background-color: #f5f5f5;
                      }
                      .container {
                          max-width: 600px;
                          margin: 20px auto;
                          padding: 20px;
                          background-color: #ffffff;
                          border-radius: 8px;
                          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                      }
                      .header {
                          text-align: center;
                          padding: 20px 0;
                          border-bottom: 1px solid #eeeeee;
                      }
                      .logo {
                          max-width: 150px;
                          height: auto;
                      }
                      .content {
                          padding: 20px;
                      }
                      .verification-code {
                          background-color: #f8f9fa;
                          border: 1px dashed #dee2e6;
                          padding: 15px;
                          text-align: center;
                          font-size: 24px;
                          font-weight: bold;
                          letter-spacing: 2px;
                          color: #007bff;
                          margin: 20px 0;
                          border-radius: 4px;
                      }
                      .footer {
                          text-align: center;
                          padding: 20px;
                          font-size: 12px;
                          color: #6c757d;
                          border-top: 1px solid #eeeeee;
                      }
                      .button {
                          display: inline-block;
                          padding: 10px 20px;
                          background-color: #007bff;
                          color: #ffffff;
                          text-decoration: none;
                          border-radius: 4px;
                          margin: 10px 0;
                      }
                      .note {
                          font-size: 14px;
                          color: #6c757d;
                          margin-top: 20px;
                      }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <div class="header">
                          <!-- Replace with your logo -->
                          <img src="https://via.placeholder.com/150x50?text=Your+Logo" alt="Company Logo" class="logo">
                          <h2>Verify Your Email Address</h2>
                      </div>
                      
                      <div class="content">
                          <p>Hello,</p>
                          <p>Thank you for registering with us. To complete your registration, please use the following verification code:</p>
                          
                          <div class="verification-code">
                              {${code}}
                          </div>
                          
                          <p>This code will expire in 15 minutes. If you didn't request this code, you can safely ignore this email.</p>
                          
                          <p class="note">
                              For security reasons, please don't share this code with anyone. Our support team will never ask you for this information.
                          </p>
                          
                          <p>Best regards,<br>Your Company Team</p>
                      </div>
                      
                      <div class="footer">
                          <p>&copy; ${date} Your Company. All rights reserved.</p>
                          <p>
                              <a href="#" style="color: #6c757d; text-decoration: none;">Privacy Policy</a> | 
                              <a href="#" style="color: #6c757d; text-decoration: none;">Terms of Service</a>
                          </p>
                      </div>
                  </div>
              </body>
              </html>`,
  });
  return emailSend;
};
