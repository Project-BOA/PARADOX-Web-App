import {
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
const { NavigationGamePlay } = require("@/components/Navigation.js");

const { LeaderboardMapper, endRoom } = require("@/modules/leaderboard");

export default function Leaderboard({ title, entries, type }) {
  const router = useRouter();
  const { roomID } = router.query;

  console.log(endRoom);
  return (
    <NextUIProvider theme={theme}>
      <NavigationGamePlay
        page="leaderboard"
        roomID={roomID}
        puzzleName={title}
        puzzleType={type}
        Endfunction={() => {
          endRoom(router, roomID);
        }}
      />
      <Container gap={0}>
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
              <Spacer y={1} />{" "}
              <Text
                h1
                size={60}
                css={{ m: 0 }}
                weight="bold"
                color="#8A2BE2"
                align="center"
              >
                Leaderboard for {title}
              </Text>
              <Spacer y={2} />
              <LeaderboardMapper entries={entries} />
            </Card>
          </Card>
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
