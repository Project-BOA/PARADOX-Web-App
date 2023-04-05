import { ref, update, get } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");
const { auth, hashPassword } = require("@/modules/authentication.js");

const Filter = require("bad-words"),
  filter = new Filter();

export default async function handler(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var newPassword = req.body.newPassword;
  var biography =
    req.body.biography ?? "Edit your profile to set your biography";

  // check authentication
  if (!(await auth(username, password))) {
    res.status(400).json({
      status: "Incorrect Username or Password",
    });
    return;
  }

  if (newPassword == null) {
    res.status(400).json({
      status: "Invalid input",
    });
    return;
  }

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

  await update(ref(database, "users/" + username), {
    password: hashPassword(newPassword),
    biography: biography,
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
