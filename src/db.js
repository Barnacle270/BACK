import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("No se encontró la URI de conexión a MongoDB (MONGO_URI) en las variables de entorno");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Base de datos MongoDB conectada correctamente");
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error.message);
    process.exit(1); // Termina la app si no conecta
  }
};
