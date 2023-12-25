const { prisma } = require("../../lib/config");

//--------Get Single  User Endpoint--------
const get_single_user = async (req, res) => {
  try {
    if (req.params) {
      id = req.params.id;

      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (user !== null) return res.json({ status: "Success", message: user });
      res.json({ status: "failed", message: "User not found" });
    }
  } catch (error) {
    res.json({
      status: "failed",
      message: "Something went wrong. Please check your internet connection",
    });
  }
};

module.exports = { get_single_user };
