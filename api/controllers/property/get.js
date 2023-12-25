const { prisma } = require("../../lib/index");

//------------- Get all properties Endpoint-------------
const get_all_properties = async (req, res) => {
  try {
    let properties = await prisma.property.findMany({
      //   skip: 3,
      // take: 30,
      include: {
        image: {
          select: {
            id: true,
            publicId: true,
            imageUrl: true,
          },
        },
      },
    });
    // Parse stringified objects (such as amenities and extra_list)
    if (properties) {
      let modifiedObjects = [];
      for (let indx = 0; indx < properties.length; ) {
        properties[indx] = {
          ...properties[indx],
          amenities: JSON.parse(properties[indx].amenities),
          extra_list: JSON.parse(properties[indx].extra_list),
        };

        modifiedObjects.push(properties[indx]);
        indx++;
      }
      modifiedObjects.length == properties.length
        ? res.json({ status: "Success", modifiedObjects })
        : null;
    }
  } catch (error) {
    res.json({
      status: "error",
      message: "Please check your network connection",
    });
  }
};

//----------Get single property Endpoint by id----------
const get_single_property = async (req, res) => {
  try {
    if (req.params) {
      let property = await prisma.property.findUnique({
        where: { id: req.params.id },
        include: {
          image: {
            select: {
              id: true,
              publicId: true,
              imageUrl: true,
            },
          },
        },
      });

      if (property) {
        property = {
          ...property,
          amenities: JSON.parse(property.amenities),
          extra_list: JSON.parse(property.extra_list),
        };
        res.json({ status: "Success", property });
      }
    }
  } catch (error) {
    res.json({
      status: "error",
      message: "Please check your network connection",
    });
  }
};

module.exports = { get_all_properties, get_single_property };
