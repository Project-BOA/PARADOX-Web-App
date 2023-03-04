import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

var config = require("../../../modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default async function handler(req, res) {
  var puzzleID = req.body.puzzleID;

  if (puzzleID == null) {
    res.status(400).json({
      status: "Invalid input",
    });
    return;
  }

  var puzzle;
  await get(ref(db, "puzzle/" + puzzleID))
    .then((snapshot) => {
      puzzle = snapshot.toJSON();
    })
    .catch((error) => {
      console.error(error);
    });

  res.status(200).json({
    status: "OK",
    puzzle: puzzle,
  });
}
