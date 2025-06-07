import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await db.initialize();

    const query = `
      SELECT 
        e.id,
        e.title,
        e.date,
        e.location,
        COUNT(r.id) as registration_count
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE r.created_at >= datetime('now', '-30 days')
      GROUP BY e.id, e.title, e.date, e.location
      ORDER BY registration_count DESC
      LIMIT 10
    `;

    const popularEvents = await db.query(query);

    res.status(200).json(popularEvents);
  } catch (error) {
    console.error('Error fetching popular events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}