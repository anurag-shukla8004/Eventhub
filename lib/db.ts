import sqlite3 from 'sqlite3';


class Database {
  private db: sqlite3.Database;
  private initialized = false;

  constructor() {
    this.db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to in-memory SQLite database');
      }
    });
  }

  async initialize() {
    if (this.initialized) return;

    const run = (...args: Parameters<sqlite3.Database['run']>) =>
      new Promise<sqlite3.RunResult>((resolve, reject) => {
        this.db.run(...args, function (this: sqlite3.RunResult, err: Error | null) {
          if (err) reject(err);
          else resolve(this);
        });
      });
    
    // Create tables
    await run(`
      CREATE TABLE events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(100),
        date DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(`
      CREATE TABLE registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER,
        name VARCHAR(100),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id)
      )
    `);

    // Create indexes for performance optimization
    await run(`CREATE INDEX idx_events_date ON events(date)`);
    await run(`CREATE INDEX idx_events_title ON events(title)`);
    await run(`CREATE INDEX idx_events_location ON events(location)`);
    await run(`CREATE INDEX idx_registrations_event_id ON registrations(event_id)`);
    await run(`CREATE INDEX idx_registrations_created_at ON registrations(created_at)`);

    // Seed with sample data
    await this.seedData();
    
    this.initialized = true;
  }

  private async seedData() {
    const run = (...args: Parameters<sqlite3.Database['run']>) =>
      new Promise<sqlite3.RunResult>((resolve, reject) => {
        this.db.run(...args, function (this: sqlite3.RunResult, err: Error | null) {
          if (err) reject(err);
          else resolve(this);
        });
      });
    
    const sampleEvents = [
      {
        title: 'React Conference 2025',
        description: 'The biggest React conference of the year',
        location: 'San Francisco, CA',
        date: '2025-07-15 09:00:00'
      },
      {
        title: 'JavaScript Workshop',
        description: 'Learn modern JavaScript techniques',
        location: 'New York, NY',
        date: '2025-06-20 14:00:00'
      },
      {
        title: 'AI & ML Symposium',
        description: 'Exploring the future of artificial intelligence',
        location: 'Boston, MA',
        date: '2025-08-10 10:00:00'
      },
      {
        title: 'Web Dev Bootcamp',
        description: 'Intensive web development training',
        location: 'Austin, TX',
        date: '2025-09-05 09:00:00'
      },
      {
        title: 'Cloud Computing Summit',
        description: 'Latest trends in cloud technologies',
        location: 'Seattle, WA',
        date: '2025-07-30 08:30:00'
      }
    ];

    for (const event of sampleEvents) {
      await run(
        `INSERT INTO events (title, description, location, date) VALUES (?, ?, ?, ?)`,
        [event.title, event.description, event.location, event.date]
      );
    }
  }

  async query(sql: string, params: unknown[] = []): Promise<unknown[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async run(sql: string, params: unknown[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  async get(sql: string, params: unknown[] = []): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

const db = new Database();
export default db;