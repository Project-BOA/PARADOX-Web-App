import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

var config = require("@/modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default async function handler(req, res) {
  const page = req.body.page || 1;

  await get(ref(db, "puzzle/"))
    .then((snapshot) => {
      res.status(200).json({
        status: "OK",
        puzzles: Object.entries(snapshot.toJSON()).map((entry) => ({
          name: entry[0],
          data: entry[1],
        })),
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });
}
