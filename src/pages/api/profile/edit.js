import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

var config = require("../../../Config.js");

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
      if (!snapshot.exists()) {
        res.status(200).json({
          status: "Profile does not exist",
        });
        return;
      } else {
        console.log(snapshot.child("password").val());
        if (snapshot.child("password").val() == password) {
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
        } else {
          res.status(400).json({
            status: "Incorrect Username or Password",
          });
        }
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