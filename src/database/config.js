import mysql from "mysql2/promise"
import dotenv from "dotenv";
dotenv.config();

const connection = mysql.createConnection({
    connectionLimit:10,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT,
});

export const getConnection = async () => await connection;






