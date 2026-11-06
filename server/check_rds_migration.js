import mysql from "mysql2/promise";


async function checkRdsCols() {
  try {
    const conn = await mysql.createConnection({
      host: "127.0.0.1",
      port: 3307,
      user: "printing_admin",
      password: "deytalyadav",
      database: "document_platform",
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

    await conn.end();
    console.log("RDS check complete!");
  } catch (err) {
    console.error("Error checking RDS cols:", err.message);
  }
}

checkRdsCols();

