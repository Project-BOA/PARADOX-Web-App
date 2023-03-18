import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

var config = require("../../../modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

var randomstring = require("randomstring");

export default async function create(req, res) {
  // TODO:
  // validate input
  // verify puzzle exists
  // check roomID does not already exist
  var puzzleID = req.body.puzzleID;
  var roomID = randomstring.generate(5).toUpperCase();

  console.log("Room Created with ID: '" + roomID + "'");

  set(ref(db, "room/" + roomID), {});

  var puzzleType;
  await get(ref(db, "puzzle/" + puzzleID + "/puzzleType"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        puzzleType = snapshot.val();
      } else {
        res.status(500).json({
          status: "No puzzle type available",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });

  if (puzzleType == "time") {
    var points;
    await get(ref(db, "puzzle/" + puzzleID + "/points/full"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          points = snapshot.val();
        } else {
          res.status(500).json({
            status: "No points available",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          status: "ERROR",
        });
        console.error(error);
      });

    set(ref(db, "room/" + roomID), {
      points: parseInt(points),
      puzzleID: puzzleID,
    });
  } else {
    set(ref(db, "room/" + roomID), {
      puzzleID: puzzleID,
    });
  }

  res.status(200).json({
    status: "OK",
    roomID: roomID,
  });
}
