import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const db = await mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: process.env.port,
});

export async function POST(req, res) {
    try {
        const {username, password} = await req.json();
        const plainPassword = password
        const findUserQuery = 'SELECT * FROM admin WHERE username = ?'
        const [user] = await db.query(findUserQuery, [username]);
        if(user[0]){
            const { status, password } = user[0];
            if(status === 'verified'){
                const verifyPassword = await bcrypt.compare(plainPassword, password);
                if(verifyPassword){
                    console.log('Login Successfully', user[0]);
                    return Response.json({user: user[0]}, {status: 200})
                }
                return Response.json({ message: `Your password is invalid.` }, { status: 500 })
            }
            return Response.json({ message: `Your account was'nt verified yet.` }, { status: 500 })
        }
        return Response.json({ message: 'Username is invalid.' }, { status: 500 })
    }catch(error){
        console.log(error.message);
        return Response.json({message: error.message}, { status: 500});
    }
    
}