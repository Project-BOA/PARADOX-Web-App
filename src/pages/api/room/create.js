import { ref, set, get } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");

var randomstring = require("randomstring");
var Filter = require("bad-words"),
  filter = new Filter();
export default async function create(req, res) {
  // TODO:
  // verify puzzle exists
  // check roomID does not already exist
  var puzzleID = req.body.puzzleID;

  if (puzzleID == null) {
    res.status(400).json({
      status: "Invalid request body",
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

  var roomID = randomstring.generate({
    length: 5,
    readable: true,
    charset: "alphanumeric",
    capitalization: "uppercase",
  });

  while (filter.isProfane(roomID)) {
    roomID = randomstring.generate({
      length: 5,
      readable: true,
      charset: "alphanumeric",
      capitalization: "uppercase",
    });
  }

  set(ref(database, "room/" + roomID), {});

  var puzzleType;
  await get(ref(database, "puzzle/" + puzzleID + "/puzzleType"))
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
    await get(ref(database, "puzzle/" + puzzleID + "/points"))
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

    set(ref(database, "room/" + roomID), {
      points: parseInt(points),
      puzzleID: puzzleID,
    });
  } else {
    set(ref(database, "room/" + roomID), {
      puzzleID: puzzleID,
    });
  }

  res.status(200).json({
    status: "OK",
    roomID: roomID,
  });
}
