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

//Handle image validation errors
const handleImageError = (err, res) => {
  if (err instanceof multer.MulterError) {
    res.json({
      status: "Error",
      message: err.message,
    });
  } else if (err) {
    if (err.name == "ExtensionError") {
      res.json({ status: "Error", message: err.message });
    }
  }
};

module.exports = { upload, handleImageError };
