import {
  Card,
  Grid,
  Image,
  NextUIProvider,
  Spacer,
  Text,
  Tooltip,
} from "@nextui-org/react";
import { initializeApp } from "firebase/app";
import {
  get,
  ref as ref_database,
  update,
  getDatabase,
} from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref as ref_storage,
} from "firebase/storage";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useList, useObject } from "react-firebase-hooks/database";

import { theme } from "@/themes/theme.js";
const { NavigationGamePlay } = require("@/components/Navigation.js");

const { config } = require("@/modules/firebase-config.js");
const app = initializeApp(config);
const database = getDatabase(app);
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

  // force one last re-render when the time is over to trigger the last animation
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
  function EmptyMessage({ display }) {
    if (display == true) {
      return (
        <Text h2 align="center" size={23}>
          No players
        </Text>
      );
    }
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
            <Spacer y={4} />
            <Text h2 size={30} align="center">
              Top 3
            </Text>
            <EmptyMessage display={snapshots.length == 0} />
            {UpdateLeaderboard(snapshots)}
          </Fragment>
        )}
      </>
    );
  }

  var pieceIndex = 0;

  function toLeaderboard() {
    router.push("/leaderboard?roomID=" + roomID);
  }

  return (
    <NextUIProvider theme={theme}>
      <NavigationGamePlay
        page="gameplay"
        roomID={roomID}
        puzzleName={puzzleName}
        puzzleType={puzzleType}
        logoAction={toLeaderboard}
        action={toLeaderboard}
        actionText={"Finish"}
      />

      <Grid.Container gap={2} justify="center">
        <Grid xs={9}>
          <Card
            css={{
              background: "$green",
              padding: "1em",
              w: "auto",
              h: "70vh",
              width: "auto",
            }}
          >
            <Card css={{ h: "70vh", marginTop: "auto", marginBottom: "auto" }}>
              <Image
                src={puzzlePieces[pieceIndex]}
                // css={{ }}
                id="puzzlePieceImg"
                alt={"Puzzle piece image"}
                width="auto"
                height="auto"
                object-fit="cover"
              />
            </Card>
          </Card>
        </Grid>

        <Grid>
          <Card
            css={{
              width: "auto",
              background: "$green",
              padding: "1em",
              h: "70vh",
            }}
          >
            <Card css={{ h: "70vh", width: "auto" }}>
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
                        toLeaderboard();
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
                  </CountdownCircleTimer>
                </div>
                <Text h3 size={25} align="center" id="availPoints">
                  Available Points:
                </Text>
                <Text h3 size={25} align="center" id="availPoints"></Text>
                <Leaderboard />
              </Card.Body>
            </Card>
          </Card>
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
