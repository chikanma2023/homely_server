const { prisma, cloudinary } = require("./config");
const { handleImageError, upload } = require("./fileHandlers/multer");
const { file_uploader, delete_file } = require("./fileHandlers/upload_delete");
const { calculateTotal, checkIfEmpty } = require("./helpers");

module.exports = {
  prisma,
  cloudinary,
  handleImageError,
  upload,
  file_uploader,
  delete_file,
  calculateTotal,
  checkIfEmpty,
};
