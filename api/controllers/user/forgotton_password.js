const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { prisma } = require("../../lib/index");
const saltRounds = 10;

const transporter = nodemailer.createTransport({
  service: "Gmail", // Change this based on your email service provider
  auth: {
    user: process.env.MAIL_ADDRESS, // Replace with your email address
    pass: process.env.PASSWORD, // Replace with your email password or an app-specific password
  },
});

//------Forgotton Password Endpoint------
const forgotten_password = async (req, res) => {
  try {
    if (req.body) {
      const findUser = await prisma.user.findUnique({
        where: { email: req.body.email },
      });

      if (findUser !== null) {
        let newPassword = Math.random().toString(36).slice(2, 10);

        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
            return res.json({
              status: "error",
              message: "Something went wrong please try again.",
            });
          }
          bcrypt.hash(newPassword, salt, async (err, hash) => {
            const updatePassword = await prisma.user.update({
              where: { email: req.body.email },
              data: {
                password: hash,
              },
            });

            //------Send new password to user through mail------
            if (updatePassword) {
              const mailOptions = {
                from: process.env.MAIL_ADDRESS,
                to: req.body.email, // Replace with the recipient's email
                subject: "Your New Homely Password",
                text: newPassword,
              };

              const sentMail = await transporter.sendMail(mailOptions);
              if (sentMail.messageId) {
                res.json({
                  status: "Success",
                  message: "Password sent. Please check your mail.",
                });
              }
            }
          });
        });
      } else {
        res.json({ status: "failed", message: "user not found" });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "faild",
      message: "Please check your internet connetion",
    });
  }
};

module.exports = { forgotten_password };
// let newPassword = Math.random().toString(36).slice(2, 10);
// res.json(newPassword);
