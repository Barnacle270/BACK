// updateServicios.js
import mongoose from "mongoose";
import Servicio from "./src/models/servicio.model.js"; // ajusta la ruta según tu proyecto

const MONGO_URI = "mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ"; // cambia por tu conexión real

const actualizarServicios = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado a MongoDB");

    const result = await Servicio.updateMany(
      { cliente: "TRANSPORTES J EIRL" },
      { $set: { estadoFacturacion: "FACTURADO" } }
    );

    console.log(`🔄 Documentos modificados: ${result.modifiedCount}`);
  } catch (error) {
    console.error("❌ Error al actualizar:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB");
  }
};

actualizarServicios();
