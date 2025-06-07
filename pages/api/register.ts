import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await db.initialize();

    const { event_id, name, email } = req.body;

    // Validation
    if (!event_id || !name || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if event exists
    const event = await db.get("SELECT id FROM events WHERE id = ?", [
      event_id,
    ]);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user already registered
    const existingRegistration = await db.get(
      "SELECT id FROM registrations WHERE event_id = ? AND email = ?",
      [event_id, email]
    );

    if (existingRegistration) {
      return res
        .status(409)
        .json({ message: "Already registered for this event" });
    }

    // Create registration
    const result = await db.run(
      "INSERT INTO registrations (event_id, name, email) VALUES (?, ?, ?)",
      [event_id, name, email]
    );

    res.status(201).json({
      message: "Registration successful",
      registration_id: result.lastID,
    });
  } catch (error) {
    console.error("Error creating registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
