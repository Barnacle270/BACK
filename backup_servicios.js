import { MongoClient } from "mongodb";
import fs from "fs";

const uri = "mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ"; // 🔹 cambia con tu conexión
const client = new MongoClient(uri);

async function backupServicios() {
  try {
    await client.connect();
    const db = client.db("test"); // 👈 pon el nombre exacto de tu base
    const collection = db.collection("servicios");

    // Obtener todos los documentos
    const servicios = await collection.find({}).toArray();

    // Nombre del archivo con timestamp
    const fileName = `servicios_backup_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;

    // Guardar en archivo
    fs.writeFileSync(fileName, JSON.stringify(servicios, null, 2));

    console.log(`✅ Backup completado: ${fileName}`);
  } catch (err) {
    console.error("❌ Error en backup:", err);
  } finally {
    await client.close();
  }
}

backupServicios();
