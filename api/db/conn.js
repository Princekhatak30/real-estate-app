const mysql2 = require('mysql2');
const dotenv= require('dotenv')

dotenv.config()

const connection = mysql2.createConnection({
   host: process.env.HOST,
   user: process.env.USER,
   password: process.env.PASSWORD,
   database: process.env.DATABASE,
   port: process.env.PORT,
 });
 connection.connect((err) => {
   if (err) {
     console.error('Error connecting to database:', err);
     return;
   }
   console.log('Connected to the database');
 });

 module.exports = connection