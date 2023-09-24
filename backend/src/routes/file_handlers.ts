import express from 'express';
import multer from 'multer';
import appRootPaht from 'app-root-path';

import { deleteAllInfo, getAllInfos, getInfoByDateFixed, uploadFile, uploadMultiFile } from '../controller/file_handlers';

const router = express.Router();

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${appRootPaht}/upload_files/`);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
const upload = multer({ storage });


router.post('/upload', upload.single('csvFile'), uploadFile);
router.post('/upload-multi', upload.array('csvFiles'), uploadMultiFile);
router.delete('/delete-all', deleteAllInfo);
router.get('/get-infos', getAllInfos);

export default router;