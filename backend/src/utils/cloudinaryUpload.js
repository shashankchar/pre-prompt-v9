import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

export function uploadBuffer(file, folder = "editbridge") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(file.buffer).pipe(stream);
  });
}
