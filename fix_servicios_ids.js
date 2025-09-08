// fix_servicios_ids.js
import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ";
const client = new MongoClient(uri);

async function fixIds() {
  try {
    await client.connect();
    const db = client.db("test"); // ⚠️ ajusta si tu DB no es "test"
    const col = db.collection("servicios");

    const docs = await col.find({}).toArray();
    let count = 0;

    for (const doc of docs) {
      if (typeof doc._id === "string" && ObjectId.isValid(doc._id)) {
        const newId = new ObjectId(doc._id);

        // 👇 copiamos el documento sin el _id viejo
        const { _id, ...rest } = doc;

        await col.deleteOne({ _id }); // elimina el doc con _id string
        await col.insertOne({ ...rest, _id: newId }); // inserta con ObjectId

        count++;
      }
    }

    console.log(`✅ Reparados ${count} documentos con _id string → ObjectId`);
  } catch (err) {
    console.error("❌ Error corrigiendo IDs:", err);
  } finally {
    await client.close();
  }
}

fixIds();
