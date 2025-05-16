import { diskStorage } from 'multer';
import { Request } from 'express';

const generateId = () =>
  Array(18)
    .fill(null)
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');

const normalizeFileName = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) => {
  const fileExtName = file.originalname.split('.').pop();
  cb(null, `${generateId()}.${fileExtName}`);
};

export const storage = diskStorage({
  destination: './uploads',
  filename: normalizeFileName,
});
