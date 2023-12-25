// password: se0p3svu;

const bcrypt = require("bcrypt");
const { prisma, checkIfEmpty } = require("../../lib/index");

const user_login = (req, res) => {
  if (req.body) {
    let body = req.body;
    let isEmpty = checkIfEmpty(body, res);
    if (isEmpty) return isEmpty;

    prisma.user
      .findUnique({
        where: { email: body.email },
      })
      .then((response) => {
        if (response) {
          bcrypt.compare(body.password, response.password).then((result) => {
            if (result == true) {
              // set user session
              delete response.password;
              req.session.user = response;
              res.json({ status: "Success", login: true });
            } else {
              res.json({
                status: "failed",
                message: "Incorrect username or password",
              });
            }
          });
        } else {
          res.json({ status: "faild", message: "User Not found" });
        }
      })
      .catch((error) => {
        res.json({
          status: "error",
          message: "Connection timeout. Please check your network connection",
        });
      });
  }
};

module.exports = { user_login };
