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
  Button,
  Col,
  Row,
  Container,
  Card,
} from "@nextui-org/react";
import { Fragment } from "react";
import { useList, useObject } from "react-firebase-hooks/database";
import { useRouter } from "next/router";
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
              Leaderboard:
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
        roomID={roomID}
        puzzleName={puzzleName}
        puzzleType={puzzleType}
        Endfunction={endGame}
      />

      <Row gap={0}>
        <Col>
          <Card css={{ $$cardColor: "#17706E" }}>
            <Card.Body>
              <Row>
                <Text h3 size={25} align="center" id="availPoints"></Text>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Grid.Container gap={2} justify="center">
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
                update(ref_database(database, "room/" + roomID), {
                  points: getPoints,
                });
                document.getElementById("availPoints").innerHTML = getPoints;
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
