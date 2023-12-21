const { delete_file, prisma } = require("../../lib/index");

// const data = {
//   propertyId: "clqeua7l60000l2awl5tbx7wg",
//   filesData: [
//     {
//       id: "clqeua9ex0001l2awlz6md0mo",
//       publicId: "homely_folder/fntoi7egeozmhoujemdq",
//     },
//     {
//       id: "clqeuab6s0002l2aw234gcblv",
//       publicId: "homely_folder/juemhbqp46gc02pldvxs",
//     },
//   ],
// };

const delete_property = async (req, res) => {
  try {
    if (req.body) {
      const data = req.body;

      if (data.propertyId && data.filesData) {
        for (const file of data.filesData) {
          // delete all files relating to a property from cloudinary
          //--------------------------------------------------------
          await delete_file(file.publicId);

          // delete property images from DB
          //--------------------------------
          await prisma.image.delete({
            where: { id: file.id },
          });
        }
        // delete property descriptions from DB
        //--------------------------------------
        await prisma.property.delete({
          where: { id: data.propertyId },
        });
        res.json({ status: "Success", message: "Item deleted" });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "Check your network connection" });
  }
};

module.exports = { delete_property };
