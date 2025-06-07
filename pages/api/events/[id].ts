import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await db.initialize();

    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const query = `
      SELECT 
        e.*,
        COUNT(r.id) as registration_count
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = ?
      GROUP BY e.id
    `;

    const event = await db.get(query, [id]);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
