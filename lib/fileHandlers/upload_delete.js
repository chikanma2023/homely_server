const Datauri = require("datauri/parser");
const path = require("path");
const axios = require("axios");
const { cloudinary } = require("../config");

const dataUri = new Datauri();
const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`;

//======== Upload File Function ========
const file_uploader = async (req) => {
  const image_data = [];
  const files = req.files;

  for (let index = 0; index < files.length; ) {
    // Convert ecach file to base64
    files[index] = dataUri.format(
      path.extname(files[index].originalname).toString(),
      files[index].buffer
    ).content;

    // Upload converted files to cloudinary
    const data = new FormData();
    data.append("file", files[index]);
    // Cloudinary Authentication Config
    data.append("cloud_name", process.env.CLOUDINARY_NAME);
    data.append("upload_preset", process.env.CLOUDINARY_PRESET_NAME);
    data.append("folder", process.env.CLOUDINARY_FOLDER_NAME);

    const cloud_uploader = await axios.post(url, data);
    const response = cloud_uploader.data;
    image_data.push({
      public_id: response.public_id,
      image_url: response.url,
    });
    index++;
  }
  // Wait for all the files to be uploaded before returning response
  if (image_data.length == req.files.length) {
    return image_data;
  }
};

//=========== Delete File Function ===========
const delete_file = async (public_id) => {
  let response = await cloudinary.uploader.destroy(public_id);
  return response;
};

module.exports = { file_uploader, delete_file };
