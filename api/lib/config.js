const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;

// Prisma Config
let prisma;
if (process.env.NODE_ENV == "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

module.exports = { prisma, cloudinary };
