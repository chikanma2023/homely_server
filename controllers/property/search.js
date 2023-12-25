const { prisma } = require("../../lib/index");

const search = async (req, res) => {
  try {
    if (req.params) {
      const query = req.params.query;
      const property = await prisma.property.findMany({
        where: {
          OR: [
            {
              location: {
                contains: query,
              },
            },
            {
              AND: [
                {
                  category: {
                    lte: query,
                  },
                },
              ],
            },
          ],
        },
      });
      res.json(property);
    }
  } catch (error) {
    res.json({
      status: "faild",
      message: "Please check your network connection",
    });
  }
};

module.exports = { search };

