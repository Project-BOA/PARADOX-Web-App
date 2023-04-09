import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Container, Card, Row, Text, Col, Grid } from "@nextui-org/react";
import { Spacer } from "@nextui-org/react";

import { ref, remove, get } from "firebase/database";
import React from "react";
import { useListKeys } from "react-firebase-hooks/database";
import { useRouter } from "next/router";
import { Footer } from "@/components/Footer";
import { theme } from "@/themes/theme.js";

const { database } = require("@/modules/firebase-config.js");
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

  function Room() {
    var players = [];
    const [snapshots, loading, error] = useListKeys(
      ref(database, "room/" + roomID + "/leaderboard")
    );
    const removePlayer = (roomID, player) => {
      remove(ref(database, "room/" + roomID + "/leaderboard/" + player));
      players.pop();
      if (players.length == 0) {
        router.push("/");
      }
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
            <Text h2 size={32} color="$secondary" align="center">
              Players in Room...
            </Text>
            <Spacer y={2.5} />
            <Grid.Container gap={1} justify="center">
              {snapshots.map((v) => {
                if (!players.includes(v)) {
                  players.push(v);
                  return (
                    <Grid key={v}>
                      <Button
                        align="center"
                        css={{
                          color: "$primaryButton",
                          marginInline: "auto",
                          fontSize: "28px",
                          "&:hover": {
                            textDecoration: "line-through",
                          },
                        }}
                        onPress={(event) => removePlayer(event, roomID, v)}
                      >
                        {v}
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
    <NextUIProvider theme={theme}>
      <NavigationGamePlay
        roomID={roomID}
        puzzleName={puzzleTitle}
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
      <Container gap={0}>
        <Row gap={1}>
          <Card
            css={{
              width: "auto",
              background: "$green",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Card
              css={{
                width: "40vw",
                background: "$primary",
                margin: "1em",
              }}
            >
              <Spacer y={1} />
              <Text h2 size={32} color="$secondary" align="center">
                Type: {puzzleType}
              </Text>
              <Spacer y={1} />
            </Card>
          </Card>
        </Row>
        <Spacer y={2} />
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
              <Room />
              <Spacer y={2.5} />
            </Card>
          </Card>
        </Row>
      </Container>
      <Container id="footer">
        <Footer />
      </Container>
    </NextUIProvider>
  );
}

export async function getServerSideProps(context) {
  var puzzleID;
  var roomID = context.query.roomID;

  if (roomID == undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  roomID = roomID.toUpperCase();

  await get(ref(database, "room/" + roomID + "/puzzleID")).then((snapshot) => {
    puzzleID = snapshot.val();
  });

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
