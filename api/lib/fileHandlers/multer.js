const multer = require("multer");

//======= Image Validation Function=======
const storage = multer.memoryStorage();
const image_uploader = multer({
  storage: storage,
  // Accept only 1mb file
  limits: { fieldSize: 1 * 1024 * 1024 },
  // Accept only .png, .jpg and .jpeg files
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
      const err = new Error("Only .png, .jpg and .jpeg files allowed!");
      err.name = "ExtensionError";
      return callback(err);
    }
  },
});

// Accept only five files at a time
const upload = image_uploader.array("file", 5);



module.exports = { upload };
