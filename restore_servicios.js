import { MongoClient } from "mongodb";
import fs from "fs";

const uri = "mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ"; // 🔹 cambia con tu conexión
const client = new MongoClient(uri);

async function restoreServicios(filePath) {
  try {
    await client.connect();
    const db = client.db("test");
    const collection = db.collection("servicios");

    // Leer archivo
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Borrar colección y restaurar
    await collection.deleteMany({});
    await collection.insertMany(data);

    console.log(`✅ Restauración completada desde ${filePath}`);
  } catch (err) {
    console.error("❌ Error en restore:", err);
  } finally {
    await client.close();
  }
}

// 👇 ejemplo de uso
restoreServicios("./servicios_backup_2025-08-22T16-59-22-136Z.json");
