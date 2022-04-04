import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    let extension = file.mimetype.split("/");

    console.log(extension[extension.length - 1]);
    cb(
      null,
      file.fieldname + Date.now() + "." + extension[extension.length - 1]
    );
  },
});

export const upload = multer({ storage });
