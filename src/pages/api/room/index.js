import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

var config = require("@/modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default async function handler(req, res) {
  // TODO:
  // validate input

  var roomID = req.body.roomID;

  await get(ref(db, "room/" + roomID))
    .then((snapshot) => {
      if (snapshot.exists()) {
        res.status(200).json(snapshot.toJSON());
      } else {
        res.status(400).json({
          status: "Room does not exist",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });
}
