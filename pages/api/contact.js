// pages/api/contact.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { first_name, last_name, location, phone, email, collection, message } = req.body;

    await resend.emails.send({
      from: "Eco Bambo Contact <onboarding@resend.dev>", // You can replace this with your verified sender
      to: "ecobambooarts@gmail.com", // Your receiving email
      subject: `New Inquiry from ${first_name} ${last_name}`,
      html: `
        <h2>New Inquiry from Eco Bambo Website</h2>
        <p><strong>Name:</strong> ${first_name} ${last_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Collection:</strong> ${collection}</p>
        <p><strong>Message:</strong> ${message || "No message provided"}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
