import mysql from 'mysql2/promise';

export const mysqlQueryAll = async (tableName) => {
    const db = await mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
        port: process.env.port,
    });

    try {
        const queryString = `SELECT * FROM ${tableName} `;
        const value = []
        const [result] = await db.execute(queryString, value);
        return result;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    } finally {
        db.end();
    }
};