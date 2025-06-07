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
        DATE(created_at) as date,
        COUNT(*) as registrations
      FROM registrations
      WHERE created_at >= datetime('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    const dailyStats = await db.query(query);

    res.status(200).json(dailyStats);
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}