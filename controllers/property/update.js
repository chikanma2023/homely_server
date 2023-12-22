const {
  prisma,
  upload,
  file_uploader,
  calculateTotal,
} = require("../../lib/index");
const multer = require("multer");
const { cloudinary } = require("../../lib/config");

// const demoImages = [
//   {
//     id: "clqeua9ex0001l2awlz6md0mo",
//     publicId: "homely_folder/r8jfchcssxor9pycoanv",
//   },
//   {
//     id: "clqeuab6s0002l2aw234gcblv",
//     publicId: "homely_folder/u4fqt6pbwywwlmut2bil",
//   },
// ];
// let oldImages = demoImages;

let newlyUploadedFiles;
const uploadFiles = async (req, res, err) => {
  if (req.files) {
    const oldImages = req.body.oldImages;
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
    //--------------Replace deleted images-----------------
    newlyUploadedFiles == undefined
      ? (newlyUploadedFiles = await file_uploader(req))
      : null;

    //-----------Delete Old images from cloudinary-----------
    for (let index = 0; index < oldImages.length; ) {
      cloudinary.uploader
        .destroy(oldImages[index].publicId)
        .then(async (result) => {
          if (result.result !== "ok") {
            res.json(result.result);
          }
        })
        .catch((error) => {
          if (error) res.jso(error);
        });
      //---------Update image table in the database---------
      await prisma.image.update({
        where: { id: oldImages[index].id },
        data: {
          publicId: newlyUploadedFiles[index].public_id,
          imageUrl: newlyUploadedFiles[index].image_url,
        },
      });
      index++;
    }
  }
};

const updateProperty = async (req) => {
  if (req.body) {
    const body = req.body;
    const totalAmont = calculateTotal(req);
    await prisma.property.update({
      where: { id: body.id },
      data: {
        location: body.location.toLowerCase().trim(),
        number_of_toilets: Number(body.number_of_toilets.trim()),
        number_of_bedroom: Number(body.number_of_bedroom.trim()),
        amenities: JSON.stringify(body.amenities),
        extra_list: JSON.stringify(body.extra_list),
        category: body.category.toLowerCase().trim(),
        price: Number(body.price.trim()),
        hospitality_fee: Number(body.hospitality_fee.trim()),
        insurace_fee: Number(body.insurace_fee.trim()),
        legal_fee: Number(body.legal_fee.trim()),
        total_amount: totalAmont,
        description: body.description.toLowerCase().trim(),
      },
    });
    return true;
  }
};

const update_property = (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (!req.session.user) return res.json("You are not allowed here !");

      if (newlyUploadedFiles == undefined) {
        await uploadFiles(req, res, err);
      }
      let updateResponse = await updateProperty(req);
      if (updateResponse)
        res.json({ status: "Success", message: "Post updated" });
    });
  } catch (error) {
    res.json({ status: "error", message: "Check your network conection" });
  }
};

module.exports = { update_property };
