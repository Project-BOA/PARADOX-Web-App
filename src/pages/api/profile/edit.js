import { getDatabase, ref, set, get } from "firebase/database";

const { firebaseApp } = require("@/modules/config.js"),
  db = getDatabase(firebaseApp);

const bcrypt = require("bcrypt");

const Filter = require("bad-words"),
  filter = new Filter();

export default async function handler(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var newPassword = req.body.newPassword;
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

  await get(ref(db, "users/" + username))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        res.status(200).json({
          status: "Profile does not exist",
        });
        return;
      } else {
        //console.log(snapshot.child("password").val());
        if (bcrypt.compareSync(password, snapshot.child("password").val())) {
          const saltRounds = 12;

          const salt = bcrypt.genSaltSync(saltRounds);
          const hashPassword = bcrypt.hashSync(newPassword, salt);
          update(ref(db, "users/" + username), {
            password: hashPassword,
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
