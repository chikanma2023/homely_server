const {
  upload,
  file_uploader,
  prisma,
  calculateTotal,
} = require("../../lib/index");
const multer = require("multer");

let files;

const uploadFiles = async (req, res, err) => {
  if (req.files) {
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
    //----Prevent Double file upload when network issuse occur----
    files == undefined ? (files = await file_uploader(req)) : null;
  } else {
    return res.json({
      status: "failed",
      message: "cannot create post without image",
    });
  }
};

const createPropert = async (req) => {
  let result = "",
    id = "";
  if (req.body) {
    const body = req.body;
    const totalAmont = calculateTotal(req);

    result = await prisma.property.create({
      data: {
        location: body.location.toLowerCase().trim(),
        number_of_toilets: Number(body.number_of_toilets),
        number_of_bedroom: Number(body.number_of_bedroom),
        amenities: JSON.stringify(body.amenities),
        extra_list: JSON.stringify(body.extra_list),
        category: body.category.toLowerCase().trim(),
        price: Number(body.price.trim()),
        hospitality_fee: Number(body.hospitality_fee.trim()),
        insurace_fee: Number(body.insurace_fee.trim()),
        legal_fee: Number(body.legal_fee.trim()),
        total_amount: totalAmont,
        description: body.description.toLowerCase().trim(),
        user: { connect: { id: req.session.user.id } },
      },
    });
    id = result.id;
  }
  return id;
};

const createImages = async (images, propertyId) => {
  let results = [],
    completed = false;
  if (images && propertyId) {
    for (let index = 0; index < images.length; ) {
      let response = await prisma.image.create({
        data: {
          publicId: images[index].public_id,
          imageUrl: images[index].image_url,
          property: { connect: { id: propertyId } },
        },
      });
      results.push(response);
      index++;
      //-----Wait for all the images to be stored in the database-----
      if (results.length == images.length) {
        results = [];
        files = undefined;
        completed = true;
      }
    }
  }
  return completed;
};

//------Create Property EndPoint------
const create_property = (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (!req.session.user) {
        return res.json("You are not allowed here");
      }

      await uploadFiles(req, res, err);
      let propertyId = await createPropert(req);
      let iscompleted = await createImages(files, propertyId);

      iscompleted
        ? res.json({ status: "success", message: "Property created" })
        : null;
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: "Please check your network connection",
    });
  }
};

module.exports = { create_property };
