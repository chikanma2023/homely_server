const { prisma } = require("../../lib/config");

const rate_property = (req, res) => {
  try {
    res.json("rating");
  } catch (error) {
    console.log(error);
    res.json({ status: "faild", message: "Please try again" });
  }
};
