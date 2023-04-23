import { ref, remove, get } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");

export default async function create(req, res) {
  var roomID = req.body.roomID;

  if (roomID == null) {
    res.status(400).json({
      status: "Invalid request body",
    });
    return;
  }

  // match first 5 uppercase letters with with regex
  var validation = roomID.match(/[A-Z0-9]{5}?/);
  if (validation == null) {
    res.status(400).json({
      status: "Invalid RoomID",
    });
    return;
  } else {
    roomID = validation[0]; // first matched substring
  }

  await get(ref(database, "room/" + roomID))
    .then((snapshot) => {
      if (snapshot.exists()) {
        remove(ref(database, "room/" + roomID));

        console.log("Room removed at ID: '" + roomID + "'");

        res.status(200).json({
          status: "OK",
        });
      } else {
        res.status(400).json({
          status: "Room does not Exist",
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
