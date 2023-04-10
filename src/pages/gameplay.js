import { CountdownCircleTimer } from "react-countdown-circle-timer";
import {
  getStorage,
  ref as ref_storage,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { ref as ref_database, get, update } from "firebase/database";
import { NextUIProvider } from "@nextui-org/react";
import {
  Grid,
  Image,
  Text,
  Spacer,
  Tooltip,
  Col,
  Row,
  Card,
} from "@nextui-org/react";
import { Fragment } from "react";
import { useList, useObject } from "react-firebase-hooks/database";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";

import { useEffect } from "react";
import { theme } from "@/themes/theme.js";
import { initializeApp } from "firebase/app";
const { NavigationGamePlay } = require("@/components/Navigation.js");

const { config, database } = require("@/modules/firebase-config.js");
const app = initializeApp(config);
const storage = getStorage(app);

var time = 5;
var getPoints,
  decrement = 0;
const RenderTime = ({ remainingTime }) => {
  const currentTime = useRef(remainingTime);
  const prevTime = useRef(null);
  const isNewTimeFirstTick = useRef(false);
  const [, setOneLastRerender] = useState(0);

  if (currentTime.current !== remainingTime) {
    isNewTimeFirstTick.current = true;
    prevTime.current = currentTime.current;
    currentTime.current = remainingTime;
  } else {
    isNewTimeFirstTick.current = false;
  }

  // force one last re-render when the time is over to tirgger the last animation
  if (remainingTime === 0) {
    setTimeout(() => {
      setOneLastRerender((val) => val + 1);
    }, 20);
  }

  const isTimeUp = isNewTimeFirstTick.current;

  return (
    <div className="time-wrapper">
      <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
        {remainingTime}
      </div>
      {prevTime.current !== null && (
        <div
          key={prevTime.current}
          className={`time ${!isTimeUp ? "down" : ""}`}
        >
          {prevTime.current}
        </div>
      )}
    </div>
  );
};

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

  function BioToolTip({ name }) {
    const [snapshot, loading, error] = useObject(
      ref_database(database, "users/" + name + "/biography")
    );

    return (
      <>
        {error && <Text align="center">Error: {error}</Text>}
        {loading && <Text align="center">Loading Bio...</Text>}
        {!loading && snapshot && <Text align="center">{snapshot.val()}</Text>}
      </>
    );
  }

  function UpdateLeaderboard(snapshots) {
    var players = [];
    var position = 1;
    for (const snapshot of snapshots) {
      if (
        !leaderboard.some((element) => {
          return element.name == snapshot.key;
        })
      ) {
        leaderboard.push({
          name: snapshot.key,
          score: snapshot.val().score ?? snapshot.val(),
        });
      } else {
        leaderboard[
          leaderboard.findIndex((item) => item.name == snapshot.key)
        ] = {
          name: snapshot.key,
          score: snapshot.val().score ?? snapshot.val(),
        };
      }
    }

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
              <Fragment key={name}>
                <Tooltip content={<BioToolTip name={name} />}>
                  <Text h3 size={25} style={{ margin: "auto" }}>
                    {position++}. {name} - {score} points
                  </Text>
                </Tooltip>
                <Spacer y={2.5} />
              </Fragment>
            );
          }
        }
      });
  }

  function Leaderboard() {
    const [snapshots, loading, error] = useList(
      ref_database(database, "room/" + roomID + "/leaderboard")
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
          <Fragment>
            <Text h2 size={30} align="center" style={{ margin: "auto" }}>
              Top 3
            </Text>
            <Spacer y={4} />
            {UpdateLeaderboard(snapshots)}
          </Fragment>
        )}
      </>
    );
  }

  var pieceIndex = 0;

  useEffect(() => {
    addEventListener("beforeunload", function (event) {
      event.returnValue = "You have unsaved changes.";
    });
  });
  function endGame() {
    router.push("/leaderboard?roomID=" + roomID);
  }

  return (
    <NextUIProvider theme={theme}>
      <NavigationGamePlay
        page="gameplay"
        roomID={roomID}
        puzzleName={puzzleName}
        puzzleType={puzzleType}
        action={endGame}
        actionText={"Leaderboard"}
      />

      <Grid.Container gap={2} justify="center">
        <Grid xs={10}>
          <Card
            css={{
              width: "auto",
              background: "$green",
              margin: "1em",
            }}
          >
            <Card css={{ w: "30em", h: "100%", margin: "1em", width: "auto" }}>
              <Card.Body
                css={{
                  p: 0,
                  backgroundColor: "$lightGreen",
                  border: "$darkGreen",
                }}
              >
                <Image
                  src={puzzlePieces[pieceIndex]}
                  id="puzzlePieceImg"
                  alt={"Puzzle piece image"}
                  width="auto"
                  height="auto"
                  object-fit="cover"
                ></Image>
              </Card.Body>
            </Card>
          </Card>
        </Grid>

        <Grid>
          <Grid.Container gap={2} justify="center">
            <Grid>
              <Card
                css={{
                  width: "auto",
                  background: "$green",
                  margin: "1em",
                }}
              >
                <Card
                  css={{ w: "30em", h: "70vh", margin: "1em", width: "auto" }}
                >
                  <Card.Body
                    css={{
                      p: 0,
                      backgroundColor: "$lightGreen",
                      border: "#17706E",
                    }}
                  >
                    <div className="timer-wrapper">
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
                            update(ref_database(database, "room/" + roomID), {
                              points: getPoints,
                            });
                            document.getElementById("availPoints").innerHTML =
                              getPoints;
                          }

                          const img = document.getElementById("puzzlePieceImg");
                          img.setAttribute("src", puzzlePieces[pieceIndex]);

                          return { shouldRepeat: true, delay: 1.5 }; // repeat animation in 1.5 seconds
                        }}
                      >
                        {RenderTime}

                        {/* {({ remainingTime }) => remainingTime} */}
                      </CountdownCircleTimer>
                    </div>
                    <Text h3 size={25} align="center" id="availPoints"></Text>

                    <Leaderboard />
                  </Card.Body>
                </Card>
              </Card>
            </Grid>
          </Grid.Container>
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
    ref_database(database, "room/" + context.query.roomID + "/puzzleID")
  ).then((snapshot) => {
    puzzleID = snapshot.val();
  });

  var puzzleName;

  await get(ref_database(database, "puzzle/" + puzzleID + "/title")).then(
    (snapshot) => {
      if (snapshot.exists()) {
        puzzleName = snapshot.val();
      } else {
        console.log("No puzzle title available");
      }
    }
  );
  var puzzleType;
  await get(ref_database(database, "puzzle/" + puzzleID + "/puzzleType")).then(
    (snapshot) => {
      if (snapshot.exists()) {
        puzzleType = snapshot.val();
      } else {
        console.log("No puzzle type available");
      }
    }
  );
  await get(ref_database(database, "puzzle/" + puzzleID + "/pieceTime")).then(
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

  await get(
    ref_database(database, "room/" + context.query.roomID + "/points")
  ).then((snapshot) => {
    getPoints = snapshot.val();
  });

  const listRef = ref_storage(storage, puzzleID);
  var puzzlePieces = [];

  await listAll(listRef).then(async (res) => {
    await Promise.all(
      res.items.map(async (itemRef) => {
        await getDownloadURL(ref_storage(storage, itemRef)).then((url) => {
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
      puzzlePieces,
      puzzleName,
    }, // will be passed to the page component as props
  };
}
