const path = require("path");
const multer = require("multer");
const axios = require("axios");
const Datauri = require("datauri/parser");
const { cloudinary } = require("../../lib/config");
const { prisma, upload } = require("../../lib/index");

const dataUri = new Datauri();
const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`;

const uploadFile = async (req, res) => {
  let response = "";
  if (req.files && req.files[0] !== undefined) {
    let newImage = req.files[0];

    //-------delete old image if any-------
    if (req.body.publicId) {
      cloudinary.uploader
        .destroy(req.body.publicId)
        .then(async (result) => {
          if (result.result !== "ok") {
            res.json(result.result);
          }
        })
        .catch((error) => {
          if (error) res.jso(error);
        });
    }
    //-------Upload new image if any-------
    if (newImage) {
      newImage = dataUri.format(
        path.extname(newImage.originalname).toString(),
        newImage.buffer
      ).content;

      //------Upload converted files to cloudinary------
      const data = new FormData();
      data.append("file", newImage);
      data.append("cloud_name", process.env.CLOUDINARY_NAME);
      data.append("upload_preset", process.env.CLOUDINARY_PRESET_NAME);
      data.append("folder", process.env.CLOUDINARY_FOLDER_NAME);
      const cloud_uploader = await axios.post(url, data);
      response = cloud_uploader.data;
    }
  }
  if (response) return response;
};

const updateUser = async (req, imageData) => {
  if (req.body) {
    const body = req.body;
    const url = imageData ? imageData.url : "";
    const public_id = imageData ? imageData.public_id : "";

    await prisma.user.update({
      where: { id: body.id },
      data: {
        firstname: body.firstname.toLowerCase().trim(),
        lastname: body.lastname.toLowerCase().trim(),
        username: body.username.toLowerCase().trim(),
        email: body.email.toLowerCase().trim(),
        phone: body.phone.trim(),
        publicId: public_id,
        imageUrl: url,
      },
    });
  }
};

const update_profile = (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (!req.session.user) return res.json("You are not allowed here");

      if (err instanceof multer.MulterError) {
        return res.json({
          status: "Error",
          message: err.message,
        });
      } else if (err) {
        if (err.name == "ExtensionError") {
          return res.json({ status: "Error", message: err.message });
        }
      }

      // Check if new email already exist in the database
      const emailExists = await prisma.user.findFirst({
        where: {
          email: req.body.email.toLowerCase().trim(),
          NOT: {
            id: req.session.user.id, // Exclude the current user from the check
          },
        },
      });

      if (emailExists == null) {
        const uploadResponse = await uploadFile(req, res);

        if (uploadResponse) {
          await updateUser(req, uploadResponse);
          return res.json({ status: "Success", message: "Profile updated" });
        }

        if (!req.files) {
          await updateUser(req, uploadResponse);
          return res.json({ status: "Success", message: "Profile updated" });
        }
      } else {
        return res.json({
          status: "faild",
          message: "Email already exist",
        });
      }
    });
  } catch (error) {
    res.json({
      status: "faild",
      message: "Please check your internet connetion",
    });
  }
};

module.exports = { update_profile };
