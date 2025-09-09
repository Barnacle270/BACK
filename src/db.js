import mongoose from "mongoose";

export const connectDB = async (maxRetries = 5, delayMs = 5000) => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("No se encontró la URI de conexión a MongoDB (MONGO_URI) en las variables de entorno");
  }

  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      await mongoose.connect(mongoUri); // 👈 ya sin opciones innecesarias
      console.log("✅ Base de datos MongoDB conectada correctamente");
      return; // listo, salimos
    } catch (error) {
      attempt++;
      console.error(`❌ Intento ${attempt} - Error conectando a MongoDB: ${error.message}`);

      if (attempt < maxRetries) {
        console.log(`⏳ Reintentando en ${delayMs / 1000} segundos...`);
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        console.error("❌ No se pudo conectar a la DB después de varios intentos, cerrando app.");
        process.exit(1);
      }
    }
  }
};
