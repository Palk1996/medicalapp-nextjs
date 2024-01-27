/** @type {import('next').NextConfig} */
module.exports = {
    env: {
        host: "mysqldbresource.mysql.database.azure.com",
        user: "manisorn",
        password: "prim2004P",
        database: "medical_app",
        port: "3306"
    },
    pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
}
