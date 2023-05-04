import { withIronSessionApiRoute } from "iron-session/next";
import { ref, update } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");

const { auth, hashPassword } = require("@/modules/authentication.js");

const validator = require("validator");
const Filter = require("bad-words"),
  filter = new Filter();

export default withIronSessionApiRoute(
  async function handler(req, res) {
    // authentication
    var username = req.body.username;
    var password = req.body.password;

    // check authentication
    var user = await auth(username, password);

    if (user == false) {
      res.status(400).json({
        status: "Incorrect Username or Password",
      });
      return;
    }

    // ================ after authentication ================

    // new info
    var newPassword = req.body.newPassword;
    var biography = req.body.biography;
    var email = req.body.email;

    // there should be something to edit
    if (!newPassword && !biography && !email) {
      res.status(400).json({
        status: "Invalid input",
      });
      return;
    }

    // add info to update here
    var updatedInfo = {};

    // if biography is provided
    if (biography) {
      biography = biography.trim();

      if (filter.isProfane(biography)) {
        res.status(400).json({
          status: "Invalid input",
        });
        return;
      }

      if (biography.length > 50) {
        res.status(400).json({
          status: "Max Biography length is less than 50",
        });
        return;
      }
      updatedInfo.biography = biography;
      req.session.user.biography = biography;
    }

    // if email is provided
    if (email) {
      email = email.trim();
      if (email.length < 3 || username.length > 255) {
        res.status(400).json({
          status: "Username has to have a length between 3 and 256 characters",
        });
        return;
      }

      if (!validator.isEmail(email)) {
        res.status(400).json({
          status: "Valid Email",
        });
        return;
      }
      updatedInfo.email = email;
      req.session.user.email = email;
    }

    // if new password is provided
    if (newPassword) {
      newPassword = newPassword.trim();
      if (password.length < 3) {
        res.status(400).json({
          status: "Minimum password length is 3 characters",
        });
        return;
      }

      updatedInfo.password = hashPassword(newPassword);
    }

    // update the user profile with new info
    await update(ref(database, "users/" + username), updatedInfo).catch(
      (error) => {
        console.error(error);
        res.status(500).json({
          status: "ERROR",
        });
        return;
      }
    );

    await req.session.save();

    // if update successful
    res.status(200).json({
      status: "OK",
    });
  },
  {
    cookieName: process.env.COOKIE_NAME,
    password: process.env.SESSION_PASSWORD,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
