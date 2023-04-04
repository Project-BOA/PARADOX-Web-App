import { getDatabase, ref, get } from "firebase/database";

const { firebaseApp } = require("@/modules/config.js"),
  db = getDatabase(firebaseApp);

export default async function personHandler(req, res) {
  var puzzleID = req.body.puzzleID;

  if (puzzleID == null) {
    res.status(400).json({
      status: "Invalid input",
    });
    return;
  }

  // match first 3 or more uppercase alphanumeric with with regex
  var validation = puzzleID.match(/[A-Z0-9]{3,}/);
  if (validation == null) {
    res.status(400).json({
      status: "Invalid puzzleID",
    });
    return;
  } else {
    puzzleID = validation[0]; // first matched substring
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
