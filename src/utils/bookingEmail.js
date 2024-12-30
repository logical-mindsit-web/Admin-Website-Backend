import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.EMAIL_PASS,
  },
});

//Request resived mail for customer
export const bookingEmail = async (recipient, sessionDates, name) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_ADMIN,
      to: recipient,
      subject: "Demo Booking Request Received",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">

       <img src="https://i.postimg.cc/LXBcG7q8/Spotless-AI-Logo-Straight-O-black.png" 
        alt="Spotless AI Logo" 
        style="max-width: 30%; height: auto; float: right; margin: 0 0 20px 20px;">

      <h1 style="
        margin-top: 60px; 
        clear: right; 
        font-size: 28px; 
        background: linear-gradient(to right, #0048e6, #9C15F7, rgba(255, 75, 248, 0.3)); 
        background-clip: text; 
        color: transparent; 
        -webkit-background-clip: text; 
        -webkit-text-fill-color: transparent;">
        Thank You for Booking a Demo!
      </h1>

        <p style="font-size: 16px; margin-top: 0;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 16px;">Thank you for booking a demo session with us. We are thrilled to showcase our robot to you! The demo session is scheduled for the following date:</p>
          <ul style="list-style-type: none; padding: 0;">
              <li style="padding: 8px; background: #f9f9f9; border-radius: 4px; margin: 4px 0;">Demo Session Date: <strong>${sessionDates}</strong></li>
          </ul>
          <p style="font-size: 16px;">Please note, your booking is currently under review. We will send you a follow-up email confirming whether the demo session is confirmed. Kindly await our reply for final confirmation.</p>
          <p style="font-size: 16px;">If you have any questions or need further assistance, feel free to contact us. We look forward to providing you with an exceptional demo experience!</p>
          <p style="font-size: 16px;">Best regards,<br/><strong>Team@Spotless Ai</strong></p>
         </div>
    `,
    });
    console.log("Booking email sent successfully");
  } catch (error) {
    console.error("Error sending booking email:", error);
    throw error;
  }
};

// Function to notify team members
export const notifyTeam = async (name, companyName, sessionDates) => {
  const teamEmails = ["malaravanm2911@gmail.com","kesava@spotless.ai"];
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_ADMIN,
      to: teamEmails.join(","),
      subject: "New Demo Booking Alert",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">

      <img src="https://i.postimg.cc/LXBcG7q8/Spotless-AI-Logo-Straight-O-black.png" 
        alt="Spotless AI Logo" 
        style="max-width: 30%; height: auto; float: right; margin: 0 0 20px 20px;">

       <h1 style="
        margin-top: 60px; 
        clear: right; 
        font-size: 28px; 
        background: linear-gradient(to right, #0048e6, #9C15F7, rgba(255, 75, 248, 0.3)); 
        background-clip: text; 
        color: transparent; 
        -webkit-background-clip: text; 
        -webkit-text-fill-color: transparent;">
        New Demo Booking Received!
        </h1>

        <p style="font-size: 16px;">Dear Team,</p>
        <p style="font-size: 16px;">A new demo session booking has been received with the following details:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li style="padding: 8px; background: #f9f9f9; border-radius: 4px; margin: 4px 0;">Customer Name: <strong>${name}</strong></li>
          <li style="padding: 8px; background: #f9f9f9; border-radius: 4px; margin: 4px 0;">Company Name: <strong>${companyName}</strong></li>
          <li style="padding: 8px; background: #f9f9f9; border-radius: 4px; margin: 4px 0;">Demo Session Date: <strong>${sessionDates}</strong></li>
        </ul>
        <p style="font-size: 16px;">Please review the booking and take necessary actions to confirm the session.</p>
        <p style="font-size: 16px;">Best regards,<br/>Team@spotless Ai</p>
      </div>
    `,
    });
    console.log("Team notification emails sent successfully");
  } catch (error) {
    console.error("Error sending team notification emails:", error);
    throw error;
  }
};

// Confirmation Email
export const sendConfirmationEmail = async (
  email,
  name,
  date,
  companyName,
  address
) => {
  const mailOptions = {
    from: `<your-email@gmail.com>`, // Sender address
    to: email, // Receiver's email
    subject: "Session Booking Confirmation", // Subject line
    html: `
         <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">

        <img src="https://i.postimg.cc/LXBcG7q8/Spotless-AI-Logo-Straight-O-black.png" 
        alt="Spotless AI Logo" 
        style="max-width: 30%; height: auto; float: right; margin: 0 0 20px 20px;">

        <h1 style="
          margin-top: 60px; 
          clear: right; 
          font-size: 28px; 
          background: linear-gradient(to right, #0048e6, #9C15F7, rgba(255, 75, 248, 0.3)); 
          background-clip: text; 
          color: transparent; 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent;">
         Demo Booking Confirmed!
         </h1>

         <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
         <p style="font-size: 16px;">We are excited to confirm your demo session with us! We appreciate your interest in experiencing our innovative robot. The demo is scheduled for the following date:</p>
         <ul style="list-style-type: none; padding: 0;">
        <li><strong>Company Name:</strong> ${companyName} </li>
        <li><strong>Address:</strong> ${address} </li>
       <li><strong>Demo Session Date:</strong> ${date}</li>
        </ul>
       <p style="font-size: 16px;">Our team is thrilled to showcase the features and capabilities of our robot, and we are confident you will find the experience valuable.</p>
       <p style="font-size: 16px;">Please ensure you are available at the scheduled time. You will receive a reminder email closer to the date. If you have any questions or specific requests, feel free to contact us.</p>
       <p style="font-size: 16px;">We are looking forward to your session and hope you enjoy the demo!</p>
       <p style="font-size: 16px;">Best regards,<br/><strong>Team@Spotless Ai</strong></p>
       </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Rejection Email
export const sendRejectionEmail = async (email, name, sessionDates) => {
  const mailOptions = {
    from: `<your-email@gmail.com>`, // Sender address
    to: email, // Receiver's email
    subject: "Session Booking Rejection", // Subject line
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">

      <img src="https://i.postimg.cc/LXBcG7q8/Spotless-AI-Logo-Straight-O-black.png" 
       alt="Spotless AI Logo" 
       style="max-width: 30%; height: auto; float: right; margin: 0 0 20px 20px;">

       <h1 style="
        margin-top: 60px; 
        clear: right; 
        font-size: 28px; 
        background: linear-gradient(to right, #0048e6, #9C15F7, rgba(255, 75, 248, 0.3)); 
        background-clip: text; 
        color: transparent; 
        -webkit-background-clip: text; 
        -webkit-text-fill-color: transparent;">
      Demo Booking Canceled!
      </h1>
      <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
      <p style="font-size: 16px;">We regret to inform you that your demo session scheduled for the following date has been canceled:</p>
      <ul style="list-style-type: none; padding: 0;">
      <li style="padding: 8px; background: #ffffff; border-radius: 4px; margin: 4px 0; border: 1px solid #ddd;">
      <strong>Demo Session Date:</strong>${sessionDates}
      </li>
      </ul>
      <p style="font-size: 16px;">Unfortunately, due to unforeseen circumstances, we are unable to proceed with the demo at this time. Our team will contact you shortly regarding the cancellation and discuss alternative options.</p>
      <p style="font-size: 16px;">We sincerely apologize for the inconvenience and appreciate your understanding. If you have any questions or concerns, please don’t hesitate to reach out to us.</p>
      <p style="font-size: 16px;">Best regards,<br/><strong>Team@Spotless Ai</strong></p>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default transporter;
