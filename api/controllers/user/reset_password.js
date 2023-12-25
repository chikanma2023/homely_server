const bcrypt = require("bcrypt");
const { prisma } = require("../../lib/index");
const saltRounds = 10;

//------Reset Password Endpoint------
const reset_password = (req, res) => {
  try {
    if (!req.session.user) return res.json("You are not allowed here");

    if (req.body) {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
          return res.json({
            status: "error",
            message: "Something went wrong please try again.",
          });
        }
        bcrypt.hash(req.body.password, salt, async (err, hash) => {
          if (err) {
            res.json({
              status: "error",
              message: "Something went wrong please try again.",
            });
          } else {
            await prisma.user.update({
              where: { id: req.session.user.id },
              data: {
                password: hash,
              },
            });
          }
          res.json({ status: "Success", message: "password modified" });
        });
      });
    }
  } catch (error) {
    res.json({
      status: "faild",
      message: "Please check your internet connetion",
    });
  }
};

module.exports = { reset_password };
