// Version du module mysql qu'on peut utiliser avec async/await
import pg from 'pg';
import dotenv from "dotenv";
dotenv.config();

const pool = new pg.Pool({
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 5432,
    ssl: {
        rejectUnauthorized: false // Requis pour les connexions sécurisées sur Render
    }
});
 
export default pool;
