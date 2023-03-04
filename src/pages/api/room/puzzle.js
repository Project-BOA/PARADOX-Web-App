import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

var config = require("../../../modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default async function handler(req, res) {
  // TODO:
  // validate input
  // verify roomID exists

  var roomID = req.body.roomID;

  if (roomID == null) {
    res.status(400).json({
      status: "Invalid input",
    });
    return;
  }

  var puzzleID;
  await get(ref(db, "room/" + roomID + "/puzzleID"))
    .then((snapshot) => {
      puzzleID = snapshot.val();
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });

  var puzzle;
  await get(ref(db, "puzzle/" + puzzleID))
    .then((snapshot) => {
      puzzle = snapshot.toJSON();
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });

  res.status(200).json({
    status: "OK",
    puzzle: puzzle,
  });
}
