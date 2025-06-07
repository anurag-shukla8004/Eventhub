import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { title, description, location, date } = req.body;

  if (!title || !description || !location || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Insert the new event into the database
    const result = await db.run(
      'INSERT INTO events (title, description, location, date) VALUES (?, ?, ?, ?)',
      [title, description, location, date]
    );

    res.status(201).json({
      message: 'Event created successfully',
      event_id: result.lastID,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
