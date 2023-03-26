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
import { Grid, Image, Text, Spacer, Tooltip } from "@nextui-org/react";
import React from "react";
import { useList } from "react-firebase-hooks/database";
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
  puzzleName,
}) {
  const router = useRouter();
  var roomID = router.query.roomID;
  var leaderboard = [];

  async function GetUserBio(name) {
    var bio = "No biography";
    await get(ref_database(db, "users/" + name + "/biography")).then(
      (snapshot) => {
        if (snapshot.exists()) {
          bio = snapshot.val();
          console.log(bio);
        } else {
          console.log("No Bio");
        }
      }
    );
    return bio;
  }

  function UpdateLeaderboard(snapshots) {
    var players = [];
    var position = 1;

    for (const snapshot of snapshots) {
      const newEntry = {
        name: snapshot.key,
        score: snapshot.val().score ?? snapshot.val(),
      };

      if (
        leaderboard.some((entry) => {
          return entry.name == snapshot.key;
        })
      ) {
        leaderboard[
          leaderboard.findIndex((item) => item.name == snapshot.key)
        ] = newEntry;
        continue;
      }

      leaderboard.push(newEntry);
    }

    //console.log(leaderboard);

    return leaderboard
      .sort((a, b) => {
        if (a.score < b.score) return 1;
        if (a.score > b.score) return -1;
        return 0;
      })
      .map((snap, index) => {
        var name = snap.name;
        var score = snap.score;
        if (!players.includes(name)) {
          players.push(name);
          if (index < 3) {
            return (
              <React.Fragment key={name}>
                <Tooltip content={"Bio: " + GetUserBio(name)}>
                  <Text h3 size={25} style={{ margin: "auto" }}>
                    {position++}. {name} - {score} points
                  </Text>
                </Tooltip>
                <Spacer y={2.5} />
              </React.Fragment>
            );
          }
        }
      });
  }

  function Leaderboard() {
    const [snapshots, loading, error] = useList(
      ref_database(db, "room/" + roomID + "/leaderboard")
    );
    return (
      <>
        {error && (
          <Text
            h2
            size={30}
            weight="bold"
            align="center"
            style={{ margin: "auto" }}
          >
            Error: {error}
          </Text>
        )}
        {loading && (
          <Text h2 size={30} align="center" style={{ margin: "auto" }}>
            Loading Leaderboard...
          </Text>
        )}
        {!loading && snapshots && (
          <React.Fragment>
            <Text h2 size={30} align="center" style={{ margin: "auto" }}>
              Leaderboard:
            </Text>
            <Spacer y={4} />
            {UpdateLeaderboard(snapshots)}
          </React.Fragment>
        )}
      </>
    );
  }

  var pieceIndex = 0;
  return (
    <NextUIProvider>
      <Grid.Container gap={2} justify="center">
        <Grid xs={4}>
          {" "}
          <Text h1 size={30} css={{ m: 0 }} weight="bold" align="left">
            RoomID: {roomID}
          </Text>
        </Grid>
        <Grid xs={4}>
          <Text h1 size={50} css={{ m: 0 }} weight="bold" align="center">
            {puzzleName}
          </Text>
        </Grid>
        <Grid xs={1}>
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

      <Grid.Container gap={0} justify="center">
        <Grid xs>
          {" "}
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
          <Leaderboard />
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
        destination: "/",
      },
    };
  }

  await get(
    ref_database(db, "room/" + context.query.roomID + "/puzzleID")
  ).then((snapshot) => {
    puzzleID = snapshot.val();
  });

  var puzzleName;

  await get(ref_database(db, "puzzle/" + puzzleID + "/title")).then(
    (snapshot) => {
      if (snapshot.exists()) {
        puzzleName = snapshot.val();
      } else {
        console.log("No puzzle title available");
      }
    }
  );
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

  return {
    props: {
      time,
      getPoints,
      puzzleType,
      decrement,
      puzzleID,
      puzzlePieces,
      puzzleName,
    }, // will be passed to the page component as props
  };
}
