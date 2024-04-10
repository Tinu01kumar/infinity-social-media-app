// profileImageUpload.js

import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import dotenv from "dotenv";

import { S3Client } from "@aws-sdk/client-s3";
dotenv.config();

const s3 = new S3Client({
    credentials: {
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
    },
  region: process.env.S3_BUCKET_REGION,
});

const upload = multer({

  storage: multerS3({
    s3:s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

export { upload };
