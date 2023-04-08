import {
  Button,
  Card,
  Col,
  Container,
  NextUIProvider,
  Row,
  Spacer,
  Text,
  Image,
  Navbar,
} from "@nextui-org/react";
import { get, getDatabase, ref, update } from "firebase/database";
import { useRouter } from "next/router";
import { theme } from "@/themes/theme.js";

const { database } = require("@/modules/firebase-config.js");
const { NavigationGamePlay } = require("@/components/Navigation.js");

const { LeaderboardMapper, endRoom } = require("@/modules/leaderboard");

export default function Leaderboard({ title, entries, type }) {
  const router = useRouter();
  const { roomID } = router.query;

  console.log(endRoom);
  return (
    <NextUIProvider theme={theme}>
      <NavigationGamePlay
        roomID={roomID}
        puzzleName={title}
        puzzleType={type}
        Endfunction={() => {
          endRoom(router, roomID);
        }}
      />
      <Container gap={0}>
        <Row gap={0}>
          <Col>
            <Card css={{ $$cardColor: "#17706E" }}>
              <Card.Body>
                <Row>
                  <Col>
                    <Container>
                      <Image
                        height={192}
                        src="/image/penrose-triangle-PARADOX.png"
                        alt=" Logo"
                      />
                    </Container>
                  </Col>
                  <Col>
                    <Spacer y={2} />

                    <Text
                      h1
                      size={60}
                      css={{ m: 0 }}
                      weight="bold"
                      align="center"
                    >
                      {title}
                    </Text>
                  </Col>
                  <Col></Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container gap={0}>
        <Spacer y={1} />
        <Row gap={1}>
          <Col>
            <Card css={{ $$cardColor: "#00764F" }}></Card>
          </Col>
          <Col>
            <Card css={{ $$cardColor: "#90EE90" }}>
              <Text
                h1
                size={60}
                css={{ m: 0 }}
                weight="bold"
                color="#8A2BE2"
                align="center"
              >
                Leaderboard
              </Text>
              <Card.Body>
                <LeaderboardMapper entries={entries} />
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

  var type;
  await get(ref(database, "puzzle/" + puzzleID + "/puzzleType")).then(
    (snapshot) => {
      if (snapshot.exists()) {
        type = snapshot.val();
      } else {
        console.log("No puzzle type available");
      }
    }
  );

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

  return { props: { title, entries, type } };
}
