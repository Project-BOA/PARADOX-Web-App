import { getDatabase, ref, set, get } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");
const bcrypt = require("bcrypt");
var validator = require("validator");
var Filter = require("bad-words"),
  filter = new Filter();
export default async function handler(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var biography = req.body.biography;
  var email = req.body.email;

  if (username == null || password == null) {
    res.status(400).json({
      status: "Invalid input",
    });
    return;
  }
  // sanitation
  username = username.trim();
  password = password.trim();

  if (
    filter.isProfane(username) ||
    filter.isProfane(password) ||
    filter.isProfane(biography)
  ) {
    res.status(400).json({
      status: "Only Text",
    });
    return;
  }

  if (!validator.isAscii(username) || !validator.isAscii(password)) {
    res.status(400).json({
      status: "Only Text",
    });
    return;
  }

  if (!validator.isEmail(email)) {
    res.status(400).json({
      status: "Valid Email",
    });
    return;
  }

  if (biography.length > 50) {
    res.status(400).json({
      status: "Max Biography length is less than 50",
    });
    return;
  }
  // biography not mandatory: default is "No Biography"
  if (biography == null) {
    biography = "No Biography";
  }
  const saltRounds = 12;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPassword = bcrypt.hashSync(password, salt);

  await get(ref(database, "users/" + username))
    .then((snapshot) => {
      if (snapshot.exists()) {
        res.status(400).json({
          status: "Name is already in use",
        });
        return;
      } else {
        set(ref(database, "users/" + username), {
          password: hashPassword,
          biography: biography,
          email: email,
          loggedIn: false,
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
        return;
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        status: "ERROR",
      });
      return;
    });
}
