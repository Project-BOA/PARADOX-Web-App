import { ref, set } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");
const { userExists, hashPassword } = require("@/modules/authentication.js");
const validator = require("validator");
var Filter = require("bad-words"),
  filter = new Filter();

export default async function handler(req, res) {
  var username = req.body.username; // mandatory
  var password = req.body.password; // mandatory
  var email = req.body.email; // mandatory
  var biography = req.body.biography; // non mandatory

  // if missing mandatory fields
  if (username == null || password == null || email == null) {
    res.status(400).json({
      status: "Missing mandatory fields",
    });
    return;
  }

  // if missing non mandatory fields then set defaults
  if (biography == null) {
    biography = "Edit your profile to set your biography";
  }

  // sanitization

  if (!userExists(username)) {
    res.status(400).json({
      status: "Username is already in use",
    });
    return;
  }

  if (!validator.isEmail(email) || !validator.isAscii(biography)) {
    res.status(400).json({
      status: "Invalid input",
    });
    return;
  }

  username = username.trim();
  password = password.trim();
  email = email.trim();
  biography = biography.trim();

  if (username.length < 3 || username.length > 15) {
    res.status(400).json({
      status: "Username has to have a length between 3 and 16 characters",
    });
    return;
  }

  if (password.length < 3) {
    res.status(400).json({
      status: "Minimum password length is 3 characters",
    });
    return;
  }

  if (email.length < 3 || username.length > 255) {
    res.status(400).json({
      status: "Username has to have a length between 3 and 256 characters",
    });
    return;
  }

  if (biography.length > 50) {
    res.status(400).json({
      status: "Max Biography length is 50 characters",
    });
    return;
  }

  if (
    filter.isProfane(username) ||
    filter.isProfane(email) ||
    filter.isProfane(biography)
  ) {
    res.status(400).json({
      status: "Invalid input",
    });
    return;
  }

  await set(ref(database, "users/" + username), {
    password: hashPassword(password),
    biography: biography,
    email: email,
  }).catch((error) => {
    console.error(error);
    res.status(500).json({
      status: "ERROR",
    });
    return;
  });

  res.status(200).json({
    status: "OK",
  });
}
