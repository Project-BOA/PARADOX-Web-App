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
var getPoints = 0;
var decrement = 0;

async function getPuzzle(puzzleID) {
  // const listRef = ref(storage, puzzleID);
  // listAll(listRef)
  //   .then((res) => {
  //     res.items.forEach((itemRef) => {
  //       // All the items under listRef.
  //       //console.log(itemRef + "\n");
  //       getImageRef(itemRef);
  //     });
  //   })
  //   .catch((error) => {
  //     res.status(500).json({
  //       status: "ERROR",
  //     });
  //     console.error(error);
  //   });
}

// async function nextSlide(nextRef) {
//   getDownloadURL(nextRef).then((url) => {
//     const img = document.getElementById("myimg");
//     img.setAttribute("src", url);
//   });
// }
async function nextSlide(nextRef) {
  await getDownloadURL(nextRef).then((url) => {
    const img = document.getElementById("myimg");
    img.setAttribute("src", url);
  });
}

// function getImageRef(imageRef) {
//   fireImage.push(imageRef);
//   console.log(fireImage.length);
// }
export default function Gameplay({
  time,
  getPoints,
  puzzleType,
  decrement,
  puzzleID,
  fireImage,
  newI,
}) {
  //var i = 0;
  const router = useRouter();
  var roomID = router.query.roomID;

  var i = newI;
  getPuzzle(puzzleID);
  return (
    <NextUIProvider>
      <Grid.Container gap={2} justify="center">
        <Grid xs={4}></Grid>
        <Grid xs={4}>
          <Image
            src="/image/Loading_icon.gif"
            id="myimg"
            alt={"Puzzle image: " + fireImage[i]}
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
              if (i >= fireImage.length) {
                router.push("/leaderboard?roomID=" + roomID);
                i = 0;
                return { shouldRepeat: false }; // repeat animation in 1.5 seconds
              }
              if (puzzleType == "time") {
                if (getPoints <= 0) getPoints = 0;
                getPoints = getPoints - decrement;
                update(ref_database(db, "room/" + roomID), {
                  points: getPoints,
                });
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

export async function getServerSideProps(context) {
  var puzzleID;

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
  var fireImage = [];

  await listAll(listRef).then((res) => {
    res.items.forEach((itemRef) => {
      // All the items under listRef.
      //console.log(itemRef + "\n");
      fireImage.push(itemRef);
    });
  });

  //console.log(fireImage[0]);
  var newI = 0;
  return {
    props: {
      time,
      getPoints,
      puzzleType,
      decrement,
      puzzleID,
      fireImage,
      newI,
    }, // will be passed to the page component as props
  };
}
