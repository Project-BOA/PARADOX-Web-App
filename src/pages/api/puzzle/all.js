import { getDatabase, ref, get } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");

export default async function handler(req, res) {
  const page = req.body.page || 1;

  await get(ref(database, "puzzle/"))
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
