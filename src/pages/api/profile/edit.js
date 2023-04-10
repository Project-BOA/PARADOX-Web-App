import { ref, update } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");

const { auth, hashPassword } = require("@/modules/authentication.js");

const validator = require("validator");
const Filter = require("bad-words"),
  filter = new Filter();

export default async function handler(req, res) {
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
  if (newPassword == null && biography == null && email == null) {
    res.status(400).json({
      status: "Invalid input",
    });
    return;
  }

  // add info to update here
  var updatedInfo = {};

  // if biography is provided
  if (biography != undefined) {
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
  }

  // if email is provided
  if (email != undefined) {
    if (!validator.isEmail(email)) {
      res.status(400).json({
        status: "Valid Email",
      });
      return;
    }
    updatedInfo.email = email;
  }

  // if new password is provided
  if (newPassword != undefined) {
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

  // if update successful
  res.status(200).json({
    status: "OK",
  });
}
