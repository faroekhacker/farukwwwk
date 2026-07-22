import { Sequelize } from "sequelize";
import mysql2 from 'mysql2';
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    define: {
      timestamps: false,
    },
  }
);

export default db;

/* (async()=>{
     await db.sync();
})();*/
