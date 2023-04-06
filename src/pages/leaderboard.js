import {
  Button,
  Card,
  Col,
  Container,
  NextUIProvider,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import { get, getDatabase, ref, update } from "firebase/database";
import { useRouter } from "next/router";
import { theme } from "@/themes/theme.js";

const { database } = require("@/modules/firebase-config.js");

const { LeaderboardMapper, endRoom } = require("@/modules/leaderboard");

export default function Leaderboard({ entries }) {
  const router = useRouter();
  const { roomID } = router.query;

  return (
    <NextUIProvider theme={theme}>
      <Container gap={0}>
        <Row gap={1}>
          <Col>
            <Card css={{ $$cardColor: "#CC083E" }}>
              <Card.Body>
                <Text h1 size={60} css={{ m: 0 }} weight="bold" align="center">
                  {"Room ID: " + roomID}
                </Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Spacer y={1} />
        <Row gap={1}>
          <Col>
            <Card css={{ $$cardColor: "#00764F" }}></Card>
          </Col>
          <Col>
            <Card css={{ $$cardColor: "#00764F" }}>
              <Card.Body>
                <LeaderboardMapper entries={entries} />
                <Button
                  onPress={(event) => {
                    endRoom(router, roomID);
                  }}
                >
                  End
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card css={{ $$cardColor: "#00764F" }}></Card>
          </Col>
        </Row>
      </Container>
    </NextUIProvider>
  );
}

export async function getServerSideProps(context) {
  if (context.query.roomID == undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  var leaderboard;
  await get(
    ref(database, "room/" + context.query.roomID + "/leaderboard")
  ).then((snapshot) => {
    leaderboard = snapshot.val();
  });

  var puzzleID;
  await get(ref(database, "room/" + context.query.roomID + "/puzzleID")).then(
    (snapshot) => {
      puzzleID = snapshot.val();
    }
  );

  var title;
  await get(ref(database, "puzzle/" + puzzleID + "/title")).then((snapshot) => {
    if (snapshot.exists()) {
      title = snapshot.val();
    } else {
      console.log("No puzzle type available");
    }
  });

  var entries = [];
  const date = Date.now();

  for (var player in leaderboard) {
    entries.push([player, leaderboard[player].score ?? leaderboard[player]]);

    await get(ref(database, "users/" + player + "/solved/" + title)).then(
      async (snapshot) => {
        if (!snapshot.exists()) {
          await update(ref(database, "users/" + player + "/solved/" + title), {
            completedOn: date,
            points: leaderboard[player].score ?? leaderboard[player],
          });
        }
      }
    );
  }

  entries.sort(function (a, b) {
    return b[1] - a[1];
  });

  return { props: { entries } };
}
