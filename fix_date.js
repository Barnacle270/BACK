import mongoose from "mongoose";

const uri = "mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ"; // tu conexión
await mongoose.connect(uri);

const Servicio = mongoose.connection.collection("servicios");

const camposFecha = [
  "fechaTraslado",
  "fechaRecepcion",
  "fechaFacturacion",
  "fechaDevolucion",
  "vencimientoMemo",
  "createdAt",
  "updatedAt"
];

async function fixFechas() {
  for (const campo of camposFecha) {
    console.log(`⏳ Corrigiendo campo: ${campo}...`);
    const cursor = Servicio.find({ [campo]: { $type: "string" } });
    let count = 0;

    for await (const doc of cursor) {
      const valor = doc[campo];
      if (valor) {
        await Servicio.updateOne(
          { _id: doc._id },
          { $set: { [campo]: new Date(valor) } }
        );
        count++;
      }
    }

    console.log(`✅ ${campo} corregido en ${count} documentos.`);
  }

  console.log("🎉 Fechas reparadas!");
  process.exit();
}

fixFechas();
