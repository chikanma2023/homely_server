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
                contains: query, // Search by name containing the query string
              },
            },
            {
              AND: [
                {
                  category: {
                    lte: query, // Filter for price less than or equal to maxPrice
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

