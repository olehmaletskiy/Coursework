const sql = require("mssql");

const connectionParams = {
    server: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    pool: { idleTimeoutMillis: 30000 },
    options: {
        encrypt: false,
        enableArithAbort: false,
        instanceName: 'SQLEXPRESS'
    },
};

const createDBConnection = async () => {
    try {
        // FOR MySql
        // const connection = mysql.createConnection(connectionParams);
        // return connection.promise();

        const pool = await sql.connect(connectionParams);
        console.error("Connection to DB - success");
        return pool;
    } catch (error) {
        console.error("Connection to DB failed error:", error);
    }
    return null;
};

// // create the connection to database
const connection = createDBConnection();

module.exports = connection;
