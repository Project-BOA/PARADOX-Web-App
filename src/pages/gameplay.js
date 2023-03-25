import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { initializeApp } from "firebase/app";
import { getStorage, getDownloadURL, listAll, ref } from "firebase/storage";
import {
  getDatabase,
  get,
  ref as ref_database,
  update,
} from "firebase/database";
import { NextUIProvider } from "@nextui-org/react";
import { Grid, Image } from "@nextui-org/react";

import { useRouter } from "next/router";

var config = require("@/modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);
const storage = getStorage(app);
var time = 5;
var getPoints,
  decrement = 0;
export default function Gameplay({
  time,
  getPoints,
  puzzleType,
  decrement,
  puzzlePieces,
}) {
  const router = useRouter();
  var roomID = router.query.roomID;
  var pieceIndex = 0;
  console.log(puzzlePieces);
  return (
    <NextUIProvider>
      <Grid.Container gap={2} justify="center">
        <Grid xs={4}></Grid>
        <Grid xs={4}>
          <Image
            src={puzzlePieces[pieceIndex]}
            id="puzzlePieceImg"
            alt={"Puzzle piece image"}
            width="100%"
            height="auto"
            object-fit="cover"
          ></Image>
        </Grid>
        <Grid xs={4}>
          <CountdownCircleTimer
            isPlaying
            duration={time}
            colors={["#000C66", "#F7B801", "#A30000"]}
            colorsTime={[2, 1, 0]}
            onComplete={() => {
              pieceIndex++;
              if (pieceIndex >= puzzlePieces.length) {
                router.push("/leaderboard?roomID=" + roomID);
                return { shouldRepeat: false };
              }

              if (puzzleType == "time") {
                if (getPoints <= 0) getPoints = 0;
                getPoints = getPoints - decrement;
                update(ref_database(db, "room/" + roomID), {
                  points: getPoints,
                });
              }

              const img = document.getElementById("puzzlePieceImg");
              img.setAttribute("src", puzzlePieces[pieceIndex]);

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

export async function getServerSideProps(context) {
  var puzzleID;

  if (context.query.roomID == undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/app",
      },
    };
  }

  await get(
    ref_database(db, "room/" + context.query.roomID + "/puzzleID")
  ).then((snapshot) => {
    puzzleID = snapshot.val();
  });

  var puzzleType;
  await get(ref_database(db, "puzzle/" + puzzleID + "/puzzleType")).then(
    (snapshot) => {
      if (snapshot.exists()) {
        puzzleType = snapshot.val();
      } else {
        console.log("No puzzle type available");
      }
    }
  );
  await get(ref_database(db, "puzzle/" + puzzleID + "/pieceTime")).then(
    (snapshot) => {
      if (snapshot.exists()) {
        var pieceTime = snapshot.toJSON();
        time = pieceTime.interval ?? 10;
        decrement = pieceTime.decrement ?? 10;
      } else {
        console.log("No puzzle piece available");
      }
    }
  );

  await get(ref_database(db, "room/" + context.query.roomID + "/points")).then(
    (snapshot) => {
      getPoints = snapshot.val();
    }
  );

  const listRef = ref(storage, puzzleID);
  var puzzlePieces = [];

  await listAll(listRef).then(async (res) => {
    await Promise.all(
      res.items.map(async (itemRef) => {
        await getDownloadURL(ref(storage, itemRef)).then((url) => {
          puzzlePieces.push(url);
        });
      })
    );
  });

  puzzlePieces.sort(); // sort urls in ascending, ASCII character order

  var newI = 0;
  return {
    props: {
      time,
      getPoints,
      puzzleType,
      decrement,
      puzzleID,
      puzzlePieces,
      newI,
    }, // will be passed to the page component as props
  };
}
