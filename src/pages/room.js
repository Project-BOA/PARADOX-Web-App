import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Container, Card, Row, Text, Col, Grid } from "@nextui-org/react";
import { Spacer } from "@nextui-org/react";
import { initializeApp } from "firebase/app";
import { ref, remove, get, getDatabase } from "firebase/database";
import React from "react";
import { useListKeys } from "react-firebase-hooks/database";
import { useRouter } from "next/router";
import { theme } from "@/themes/theme.js";

const { config } = require("@/modules/firebase-config.js");
const app = initializeApp(config);
const database = getDatabase(app);

const { NavigationGamePlay } = require("@/components/Navigation.js");

export default function Room({ roomID, puzzleTitle, puzzleType }) {
  const router = useRouter();

  async function endRoom() {
    const data = {
      roomID: roomID,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch("api/room/remove", options);
    const result = await response.json();
    if (result.status != "OK") {
      alert(result.status);
    }
    router.push("/");
  }

  function EmptyMessage({ display }) {
    if (display == true) {
      return (
        <>
          <Text h2 size={32}>
            Use the app to join the room with the Room ID...
          </Text>
        </>
      );
    }
  }

  function Room() {
    var players = [];
    const [snapshots, loading, error] = useListKeys(
      ref(database, "room/" + roomID + "/leaderboard")
    );
    const removePlayer = async (roomID, player) => {
      console.log(roomID);
      await remove(ref(database, "room/" + roomID + "/leaderboard/" + player));
      players.pop();
    };
    return (
      <>
        {error && (
          <Text h2 size={32} color="$secondary" align="center">
            Error: {error}
          </Text>
        )}
        {loading && (
          <Text h2 size={32} color="$secondary" align="center">
            Loading Room...
          </Text>
        )}
        {!loading && snapshots && (
          <>
            <Grid.Container gap={1} justify="center">
              <EmptyMessage display={snapshots.length == 0} />
              {snapshots.map((username) => {
                if (!players.includes(username)) {
                  players.push(username);
                  return (
                    <Grid key={username}>
                      <Button
                        align="center"
                        css={{
                          color: "$buttonPrimary",
                          marginInline: "auto",
                          fontSize: "28px",
                          "&:hover": {
                            textDecoration: "line-through",
                          },
                        }}
                        onPress={() => removePlayer(roomID, username)}
                      >
                        {username}
                      </Button>
                      <Spacer y={2.5} />
                    </Grid>
                  );
                }
              })}
            </Grid.Container>
          </>
        )}
      </>
    );
  }

  return (
    <NextUIProvider id="page-container" theme={theme}>
      <NavigationGamePlay
        page="room"
        roomID={roomID}
        puzzleType={puzzleType}
        logoAction={endRoom}
        actionText="Start"
        action={() => {
          router.push("/gameplay?roomID=" + roomID);
        }}
        secondaryActionText="Exit"
        secondaryAction={endRoom}
      />
      <Spacer y={1} />
      <Row gap={1}>
        <Card
          css={{
            width: "60vw",
            background: "$green",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Card
            css={{
              width: "auto",
              background: "$primary",
              margin: "1em",
            }}
          >
            <Spacer y={1} />
            <Text h2 size={40} color="$secondary" align="center">
              {puzzleTitle} Room
            </Text>
            <Spacer y={2.5} />
            <Room />
            <Spacer y={2.5} />
          </Card>
        </Card>
      </Row>
    </NextUIProvider>
  );
}

export async function getServerSideProps(context) {
  var { roomID } = context.query;

  if (roomID == undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  roomID = roomID.toUpperCase();

  var puzzleID;
  await get(ref(database, "room/" + roomID + "/puzzleID")).then((snapshot) => {
    puzzleID = snapshot.val();
  });

  if (puzzleID == undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  var puzzleType = "None";
  await get(ref(database, "puzzle/" + puzzleID + "/puzzleType")).then(
    (snapshot) => {
      if (snapshot.exists()) {
        puzzleType = snapshot.val();
      } else {
      }
    }
  );

  var puzzleTitle;
  await get(ref(database, "puzzle/" + puzzleID + "/title")).then((snapshot) => {
    if (snapshot.exists()) {
      puzzleTitle = snapshot.val();
    } else {
      puzzleTitle = "No Title";
    }
  });

  puzzleType = puzzleType.toUpperCase();

  return {
    props: { roomID, puzzleType, puzzleTitle }, // will be passed to the page component as props
  };
}
