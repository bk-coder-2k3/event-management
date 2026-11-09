import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { logger } from '../config/logger';

export interface UploadResult {
  url: string;
  storageKey: string;
}

export interface IStorageService {
  uploadImage(file: Express.Multer.File, folder?: string): Promise<UploadResult>;
  deleteImage(storageKey: string): Promise<boolean>;
}

export class LocalStorageService implements IStorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadImage(file: Express.Multer.File, folder = 'vendors'): Promise<UploadResult> {
    const targetDir = path.join(this.uploadDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const targetPath = path.join(targetDir, filename);

    if (file.buffer) {
      await fs.promises.writeFile(targetPath, file.buffer);
    } else if (file.path) {
      await fs.promises.copyFile(file.path, targetPath);
    }

    const storageKey = `${folder}/${filename}`;
    // Construct local serving URL
    const url = `/uploads/${folder}/${filename}`;

    return { url, storageKey };
  }

  async deleteImage(storageKey: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, storageKey);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
      return true;
    } catch (err) {
      logger.error({ err, storageKey }, 'Failed to delete local file');
      return false;
    }
  }
}

export class CloudinaryStorageService implements IStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async uploadImage(file: Express.Multer.File, folder = 'vizhaspace'): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `vizhaspace/${folder}`,
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) {
            logger.error({ error }, 'Cloudinary upload failed');
            return reject(error || new Error('Upload failed'));
          }
          resolve({
            url: result.secure_url,
            storageKey: result.public_id,
          });
        }
      );

      if (file.buffer) {
        uploadStream.end(file.buffer);
      } else if (file.path) {
        fs.createReadStream(file.path).pipe(uploadStream);
      } else {
        reject(new Error('No file buffer or path provided'));
      }
    });
  }

  async deleteImage(storageKey: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(storageKey);
      return result.result === 'ok';
    } catch (err) {
      logger.error({ err, storageKey }, 'Cloudinary deletion failed');
      return false;
    }
  }
}

export const storageService: IStorageService =
  env.STORAGE_DRIVER === 'cloudinary' && env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY
    ? new CloudinaryStorageService()
    : new LocalStorageService();
