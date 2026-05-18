#!/usr/bin/env node

/**
 * Script para migrar datos de Prisma Platform a Neon
 * 
 * Uso:
 * 1. Crea una BD en Neon y obtén su connection string
 * 2. Actualiza las variables en este script
 * 3. Ejecuta: node migrate-to-neon.js
 */

const { Pool } = require("pg");

// ⚠️ ACTUALIZA ESTAS VARIABLES CON TUS DATOS ⚠️

// Tu BD actual (Prisma Platform)
const OLD_DB = {
  host: "db.prisma.io",
  user: "f354a9ed67483dc39e42d816b466d5fd1e558ae3d346409e9d252b6871ba557e",
  password: "sk_laNXVTfS2GWtm5FWjrYZ0",
  database: "postgres",
  ssl: true,
};

// Tu BD nueva en Neon (REEMPLAZA CON TU CONNECTION STRING)
const NEW_DB_URL =
  process.env.NEON_CONNECTION_STRING ||
  "postgresql://neondb_owner:npg_IQgcetUF8mj4@ep-snowy-feather-acibmt8t-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"; // ← ACTUALIZA ESTO

async function migrate() {
  console.log("🚀 Iniciando migración de datos...\n");

  const oldPool = new Pool(OLD_DB);
  const newPool = new Pool(NEW_DB_URL);

  try {
    // Conectar a ambas BDs
    console.log("📡 Conectando a BD antigua (Prisma Platform)...");
    const oldClient = await oldPool.connect();
    console.log("✅ Conectado a Prisma Platform\n");

    console.log("📡 Conectando a BD nueva (Neon)...");
    const newClient = await newPool.connect();
    console.log("✅ Conectado a Neon\n");

    // Tablas a migrar (en orden por dependencias)
    const tables = ["usuario", "trabajo", "review", "reporte", "pruebas"];

    // Migrar cada tabla
    for (const table of tables) {
      console.log(`\n📋 Migrando tabla: ${table}`);

      // Obtener datos de la BD antigua
      const result = await oldClient.query(`SELECT * FROM "${table}"`);
      const rows = result.rows;

      if (rows.length === 0) {
        console.log(`   ℹ️  La tabla está vacía`);
        continue;
      }

      console.log(`   Encontrados ${rows.length} registros`);

      // Insertar en la BD nueva
      for (const row of rows) {
        const columns = Object.keys(row);
        const values = Object.values(row);
        const placeholders = values
          .map((_, i) => `$${i + 1}`)
          .join(", ");

        const insertQuery = `
          INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(", ")})
          VALUES (${placeholders})
          ON CONFLICT DO NOTHING
        `;

        try {
          await newClient.query(insertQuery, values);
        } catch (err) {
          console.warn(`   ⚠️  Error insertando fila:`, err.message);
        }
      }

      console.log(`   ✅ ${rows.length} registros migrados`);
    }

    oldClient.release();
    newClient.release();

    console.log("\n✅ ¡MIGRACIÓN COMPLETADA!");
    console.log(
      "\n📝 Próximos pasos:\n" +
        "1. Actualiza DATABASE_URL en .env con tu connection string de Neon\n" +
        "2. Ejecuta: npm run build\n" +
        "3. Haz push a Vercel\n"
    );
  } catch (err) {
    console.error("❌ Error durante la migración:", err.message);
    process.exit(1);
  } finally {
    await oldPool.end();
    await newPool.end();
  }
}

migrate();
