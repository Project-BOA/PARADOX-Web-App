import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

var config = require("@/modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default async function personHandler(req, res) {
  const puzzleID = req.body.puzzleID;

  if (puzzleID == null) {
    res.status(400).json({
      status: "Invalid input",
    });
    return;
  }

  await get(ref(db, "puzzle/" + puzzleID))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        res.status(400).json({
          status: "Puzzle ID not found",
        });
        return;
      }
      res.status(200).json({
        status: "OK",
        puzzle: snapshot.toJSON(),
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });
}
