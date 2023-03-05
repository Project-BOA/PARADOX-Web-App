import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { initializeApp } from "firebase/app";
import { getStorage, getDownloadURL, listAll, ref } from "firebase/storage";
import { getDatabase, get, ref as ref_database } from "firebase/database";
import { NextUIProvider, Button, Link } from "@nextui-org/react";
import { Grid, Card, Text } from "@nextui-org/react";

import { useRouter } from "next/router";

var config = require("../modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);
const storage = getStorage(app);
var fireImage = [];

async function getPuzzle(roomID) {
  var puzzleID;

  await get(ref_database(db, "room/" + roomID + "/puzzleID")).then(
    (snapshot) => {
      puzzleID = snapshot.val();
    }
  );

  const listRef = ref(storage, puzzleID);

  listAll(listRef)
    .then((res) => {
      res.prefixes.forEach((folderRef) => {
        // All the prefixes under listRef.
        // You may call listAll() recursively on them.
      });
      res.items.forEach((itemRef) => {
        // All the items under listRef.
        //console.log(itemRef + "\n");
        getImageRef(itemRef);
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });
}
async function nextSlide(nextRef) {
  await getDownloadURL(nextRef).then((url) => {
    const img = document.getElementById("myimg");
    img.setAttribute("src", url);
  });
}

function getImageRef(imageRef) {
  fireImage.push(imageRef);
}

export default function Gameplay() {
  var time = 1;
  var i = 0;
  const router = useRouter();
  var roomID = router.query.roomID;
  getPuzzle(roomID);

  return (
    <NextUIProvider>
      <Grid.Container gap={2} justify="center">
        <Grid xs={4}></Grid>
        <Grid xs={4}>
          <img
            src="/image/Loading_icon.gif"
            id="myimg"
            alt={"Puzzle image: " + fireImage[i]}
            width="500"
            height="500"
            object-fit="cover"
          ></img>
        </Grid>
        <Grid xs={4}>
          {" "}
          <CountdownCircleTimer
            isPlaying
            duration={time}
            colors={["#000C66", "#F7B801", "#A30000"]}
            colorsTime={[2, 1, 0]}
            onComplete={() => {
              if (i == fireImage.length - 1) {
                router.push("/leaderboard?roomID=" + roomID);
                return { shouldRepeat: false }; // repeat animation in 1.5 seconds
              }
              nextSlide(fireImage[i++]);

              return { shouldRepeat: true, delay: 1.5 }; // repeat animation in 1.5 seconds
            }}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        </Grid>
      </Grid.Container>
    </NextUIProvider>
  );
}
