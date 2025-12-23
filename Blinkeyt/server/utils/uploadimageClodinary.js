
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name : process.env.CLODINARY_CLOUD_NAME,
    api_key : process.env.CLODINARY_API_KEY,
    api_secret : process.env.CLODINARY_API_SECRET_KEY
}
)

const uploadImageCloudinary = async (image) => {
  // ensure we always have a Buffer
  const buffer = image?.buffer 
    ? image.buffer 
    : Buffer.from(await image.arrayBuffer());

  // wrap cloudinary.upload_stream in a Promise
  const uploadImage = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blinkeyt" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    stream.end(buffer); // send buffer to Cloudinary
  });
  
  return uploadImage;
};

export default uploadImageCloudinary