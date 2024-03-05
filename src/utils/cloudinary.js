import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({ 
  cloud_name: 'dnbezdmse', 
  api_key: '462864496767428', 
  api_secret: 'p0JcMBoLY5e69vqEnLM5rArfTqM'
});


export const uploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "replit/"
  })
}

export const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
}