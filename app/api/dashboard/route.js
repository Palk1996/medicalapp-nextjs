import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: process.env.port,
});


export async function GET() {
    try {
        const tableName = ['disease', 'medicine', 'medicine_type', 'admin'];
        const promises = tableName.map(async (table, index) => {
            const query = `SELECT COUNT(*) as ${table} FROM ${table}`;
            const [queryResult] = await db.execute(query, []);
            return queryResult;
        });

        const result = await Promise.all(promises);
        console.log(result);
        return Response.json({ result });

    } catch (error) {
        return Response.json({ message: error.message });
    }
}
