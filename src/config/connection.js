const mysql = require("mysql2");
const config = require("./config");

const pool = mysql.createPool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  port: config.port,
});

pool.getConnection((err, conn) => {
  if (err) console.error("❌ Error connecting to the database:", err);
  else console.log("✅ Connected successfully to database");
});

module.exports = pool.promise();
