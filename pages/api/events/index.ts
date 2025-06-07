import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { EventFilters, PaginationParams, EventsResponse, Event } from '../../../lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await db.initialize();

    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      location = '', 
      date_from = '', 
      date_to = '' 
    } = req.query;

    // Ensure all filters are strings (not string[])
    const getString = (value: string | string[] | undefined): string => {
      if (Array.isArray(value)) return value[0] || '';
      return value || '';
    };

    const filters: EventFilters = { 
      search: getString(search), 
      location: getString(location), 
      date_from: getString(date_from), 
      date_to: getString(date_to) 
    };
    const pagination: PaginationParams = { 
      page: parseInt(Array.isArray(page) ? page[0] : page as string), 
      limit: parseInt(Array.isArray(limit) ? limit[0] : limit as string) 
    };

    // Build WHERE clause dynamically
    let whereClause = 'WHERE 1=1';
    const params: unknown[] = [];

    if (filters.search) {
      whereClause += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.location) {
      whereClause += ' AND location LIKE ?';
      params.push(`%${filters.location}%`);
    }

    if (filters.date_from) {
      whereClause += ' AND date >= ?';
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      whereClause += ' AND date <= ?';
      params.push(filters.date_to);
    }

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM events ${whereClause}`;
    const countResult = await db.get(countQuery, params);
    const total = (countResult as { total: number }).total;

    // Get events with pagination
    const offset = (pagination.page - 1) * pagination.limit;
    const eventsQuery = `
      SELECT * FROM events 
      ${whereClause} 
      ORDER BY date ASC 
      LIMIT ? OFFSET ?
    `;
    
    const events = await db.query(eventsQuery, [...params, pagination.limit, offset]) as Event[];

    const response: EventsResponse = {
      events,
      total,
      page: pagination.page,
      totalPages: Math.ceil(total / pagination.limit)
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}