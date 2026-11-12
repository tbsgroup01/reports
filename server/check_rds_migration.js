import "dotenv/config";
import mysql from "mysql2/promise";

async function checkRdsCols() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  const missingConfig = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"].filter((key) => !process.env[key]);
  if (missingConfig.length) {
    console.error(`Missing database configuration: ${missingConfig.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  let conn;
  try {
    conn = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT) || 3306,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
    const [cols] = await conn.query("SHOW COLUMNS FROM users");
    const fields = cols.map(c => c.Field);
    console.log("RDS users columns:", fields);

    const needed = ["two_factor_enabled", "two_factor_secret", "two_factor_temp_secret", "two_factor_backup_codes"];
    const missing = needed.filter(c => !fields.includes(c));
    console.log("Missing columns in RDS:", missing);

    if (missing.includes("two_factor_enabled")) {
      await conn.query("ALTER TABLE `users` ADD COLUMN `two_factor_enabled` TINYINT(1) DEFAULT 0");
      console.log("Added two_factor_enabled to RDS");
    }
    if (missing.includes("two_factor_secret")) {
      await conn.query("ALTER TABLE `users` ADD COLUMN `two_factor_secret` VARCHAR(255) NULL");
      console.log("Added two_factor_secret to RDS");
    }
    if (missing.includes("two_factor_temp_secret")) {
      await conn.query("ALTER TABLE `users` ADD COLUMN `two_factor_temp_secret` VARCHAR(255) NULL");
      console.log("Added two_factor_temp_secret to RDS");
    }
    if (missing.includes("two_factor_backup_codes")) {
      await conn.query("ALTER TABLE `users` ADD COLUMN `two_factor_backup_codes` JSON NULL");
      console.log("Added two_factor_backup_codes to RDS");
    }
    console.log("RDS check complete!");
  } catch (err) {
    console.error("Error checking database columns:", err.message);
    process.exitCode = 1;
  } finally {
    if (conn) await conn.end();
  }
}

checkRdsCols();
