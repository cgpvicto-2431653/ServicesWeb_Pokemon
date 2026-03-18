import pg from 'pg';
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config();

// On utilise DATABASE_URL qui est le standard sur Render pour PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Requis pour les connexions sécurisées sur Render
    }
});

export default pool;