import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

export function getUploadSignature(req: Request, res: Response) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp }, process.env.CLOUDINARY_API_SECRET as string);
  res.json({ timestamp, signature, apiKey: process.env.CLOUDINARY_API_KEY, cloudName: process.env.CLOUDINARY_CLOUD_NAME });
}
