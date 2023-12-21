const bcrypt = require("bcrypt");
const { prisma, checkIfEmpty } = require("../../lib/index");
const saltRounds = 10;

const register_user = (req, res) => {
  if (req.body) {
    let body = req.body;
    let isEmpty = checkIfEmpty(body, res);
    if (isEmpty) return isEmpty;

    if (body.password && body.password.length < 6)
      return res.json("password length should be more than 6 characters");

    // Hash user password using bcrypt
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(body.password, salt, async (err, hash) => {
        if (!err) {
          prisma.user
            .create({
              data: {
                firstname: body.firstname.toLowerCase().trim(),
                lastname: body.lastname.toLowerCase().trim(),
                email: body.email.toLowerCase().trim(),
                username: body.username.toLowerCase().trim(),
                phone: body.phone.trim(),
                password: hash,
              },
            })
            .then((response) => {
              // Set user session
              delete response.password;
              req.session.user = response;
              res.json(true);
            })
            .catch((error) => {
              if (
                error.code === "P2002" &&
                error.meta?.target?.includes("email")
              ) {
                // Handle unique constraint violation on email
                return res.json({
                  status: "warning",
                  message: "Email already exit",
                });
              }
              res.json({
                status: "error",
                message: "Registration failed. Please try again",
              });
            });
        }
      });
    });
  }
};

module.exports = { register_user };
