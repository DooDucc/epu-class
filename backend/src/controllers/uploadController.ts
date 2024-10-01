import { Request, Response } from "express";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dtxfvf9f9",
  api_key: "446554177273236",
  api_secret: "eHgd415JKXjBfgLuPwEbF2cUCoM",
});

const handleUploadFile = async (filePath: any) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        resource_type: "auto",
      },
      (error, result) => {
        if (result && result.secure_url) {
          return resolve(result.secure_url);
        }
        // @ts-ignore
        console.log(error.message);
        // @ts-ignore
        return reject({ message: error.message });
      }
    );
  });
};

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.body.file;
    const result = await handleUploadFile(file);

    res.json(result);
  } catch (error) {
    res.status(500).json("Something went wrong");
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.log("An unknown error occurred");
    }
  }
};

export const uploadFiles = async (req: Request, res: Response) => {
  try {
    const files = req.body.files;
    const uploads = files.map((file: any) => handleUploadFile(file));
    const results = await Promise.all(uploads);
    res.json(results);
  } catch (error) {
    res.status(500).json("Something went wrong");
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.log("An unknown error occurred");
    }
  }
};
