const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("Error connecting to PostgreSQL database:", err.message);
});

async function initializeTables() {
  try {
    const client = await pool.connect();

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        project_url TEXT,
        github_url TEXT,
        technologies TEXT,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Homepage table
    await client.query(`
      CREATE TABLE IF NOT EXISTS homepage (
        id SERIAL PRIMARY KEY,
        hero_title TEXT,
        hero_subtitle TEXT,
        about_text TEXT,
        skills TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        social_links TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Images table (for tracking uploaded images)
    await client.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        mimetype TEXT NOT NULL,
        size INTEGER NOT NULL,
        path TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create default homepage entry if it doesn\'t exist
    const { rows } = await client.query(
      "SELECT COUNT(*) as count FROM homepage"
    );
    if (rows[0].count === "0") {
      await client.query(
        `
          INSERT INTO homepage (hero_title, hero_subtitle, about_text)
          VALUES ($1, $2, $3)
        `,
        [
          "Welcome to My Portfolio",
          "Full Stack Developer",
          "About me section...",
        ]
      );
    }
    client.release();
  } catch (err) {
    console.error("Error initializing tables:", err.message);
  }
}

initializeTables();

async function runQuery(sql, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return { id: result.rows[0]?.id, changes: result.rowCount };
  } finally {
    client.release();
  }
}

async function getRow(sql, params = []) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(sql, params);
    return rows[0];
  } finally {
    client.release();
  }
}

async function getAllRows(sql, params = []) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(sql, params);
    return rows;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  runQuery,
  getRow,
  getAllRows,
};

