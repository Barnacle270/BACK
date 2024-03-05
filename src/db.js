import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://jhos:22314121@cluster0.1jusnio.mongodb.net/?retryWrites=true&w=majority");  
    console.log("DB is connected");  
  } catch (error) {
    console.log(error);
  }
};