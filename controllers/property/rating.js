const { prisma } = require("../../lib/config");

const rate_property = (req, res) => {
  try {
    if (req.body) {
      const { propertId } = req.body;
      let rate = 0.5;
    }
    res.json("rating");
  } catch (error) {
    console.log(error);
    res.json({ status: "faild", message: "Please try again" });
  }
};

module.exports = { rate_property };