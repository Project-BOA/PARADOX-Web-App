import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

var config = require("../../../modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default async function handler(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var biography = req.body.biography;

  if (
    username == null ||
    password == null ||
    biography == null // biography mandatory?
  ) {
    res.status(400).json({
      status: "Invalid input",
    });
    return;
  }

  await get(ref(db, "users/" + username))
    .then((snapshot) => {
      if (snapshot.exists()) {
        res.status(200).json({
          status: "Name is already in use",
        });
        return;
      } else {
        set(ref(db, "users/" + username), {
          password: password,
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
