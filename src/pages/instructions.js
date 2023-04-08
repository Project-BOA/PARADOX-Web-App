import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import {
  NextUIProvider,
  Container,
  Text,
  Spacer,
  Button,
  Link,
  User,
  Navbar,
  Grid,
  Card,
  Col,
  Row,
  Image,
} from "@nextui-org/react";

import { theme } from "@/themes/theme.js";
const { Navigation } = require("@/components/Navigation.js");

const { database } = require("@/modules/firebase-config.js");

export default function Home({ user }) {
  const router = useRouter();

  const multiDescritption =
    "These puzzles have multiple answers, that will score you a low amount of points. These LOW point answers will hin towards the big ticket answer";

  const timeDescritption =
    "Better answer quick these puzzles require quick thinking or you will lose so many points";
  const singleDescritption =
    "Simple, answer the puzzles single answer and get points";

  return (
    <>
      <NextUIProvider theme={theme}>
        <Navigation username={user.username} />

        <Spacer y={1} />

        <Container>
          <Card css={{ $$cardColor: "#90EE90" }}>
            <Text h2 size={40} align="center" color="#8A2BE2" css={{ m: 0 }}>
              How to Play
            </Text>

            <Text h3 size={40} align="center" color="white" css={{ m: 0 }}>
              There are 3 Types of puzzles...
            </Text>
          </Card>
        </Container>

        <Grid.Container gap={2} justify="center">
          <Grid xs={4}>
            <Card css={{ $$cardColor: "#90EE90" }}>
              <Text size={40} align="center" color="#8A2BE2" css={{ m: 0 }}>
                Multi Puzzles
              </Text>
              <Text size={20} align="center" color="white" css={{ m: 0 }}>
                {multiDescritption}
              </Text>
            </Card>
          </Grid>
          <Grid xs={4}>
            <Card css={{ $$cardColor: "#90EE90" }}>
              <Text size={40} align="center" color="#8A2BE2" css={{ m: 0 }}>
                Single Puzzles
              </Text>
              <Text size={20} align="center" color="white" css={{ m: 0 }}>
                {singleDescritption}
              </Text>
            </Card>
          </Grid>
          <Grid xs={4}>
            <Card css={{ $$cardColor: "#90EE90" }}>
              <Text size={40} align="center" color="#8A2BE2" css={{ m: 0 }}>
                Timed Puzzles
              </Text>
              <Text size={20} align="center" color="white" css={{ m: 0 }}>
                {timeDescritption}
              </Text>
            </Card>
          </Grid>
        </Grid.Container>
        <Container>
          <Card css={{ $$cardColor: "#90EE90" }}>
            <Text size={40} align="center" color="#8A2BE2" css={{ m: 0 }}>
              Gameplay
            </Text>
            <div class="box">
              <Col>
                {" "}
                <Text size={20} align="right" color="white" css={{ m: 0 }}>
                  Users can join a room by inputting the room ID that appears in
                  the corner, once a user joins their username will be dipslayed
                  in the room. Click on the username of a user to kick them out
                  of the room. Click on the start button to start the game and
                  begin your puzzle journey
                </Text>
              </Col>
              <Col>
                <Image
                  src="/image/default_puzzle_image.png"
                  width="auto"
                  height="auto"
                  alt="puzzle image"
                />
              </Col>
            </div>
            <Spacer y={1} />

            <div class="box">
              <Col>
                <Text size={20} align="right" color="white" css={{ m: 0 }}>
                  Once a room starts a time will countdown till the next puzzle
                  piece. The timer will vary from puzzle to puzzle. The puzzle
                  piece will display front and center. Under the timer you can
                  check the top players in the room, hover of their names to
                  find out some fun info. You can either end the room ealry or
                  went for it to tick down to be brough to the leaderboord page.
                </Text>
              </Col>
              <Col>
                <Image
                  src="/image/default_puzzle_image.png"
                  width="auto"
                  height="auto"
                  alt="puzzle image"
                />
              </Col>
            </div>

            <Spacer y={1} />
            <div class="box">
              <Col>
                <Text size={20} align="right" color="white" css={{ m: 0 }}>
                  Make sure to download the app to experience the the fun
                  puzzles and begin your puzzle journey
                </Text>
              </Col>
              <Col>
                <Image
                  src="/image/default_puzzle_image.png"
                  width="auto"
                  height="auto"
                  alt="puzzle image"
                />
              </Col>
            </div>
          </Card>
        </Container>
        <Spacer y={2} />

        <Container>
          <Card css={{ $$cardColor: "#90EE90" }}>
            <div class="box">
              <Col>
                {" "}
                <Text size={20} align="right" color="#8A2BE2" css={{ m: 0 }}>
                  Get the PARAD0X App
                </Text>
              </Col>
              <Col>
                <Link a href="#">
                  <Image
                    src="/image/googleplay.png"
                    width="auto"
                    height="auto"
                    alt="GooglePlay icon"
                  />
                </Link>
              </Col>
            </div>
          </Card>
        </Container>
      </NextUIProvider>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    if (req.session.user == undefined) {
      return {
        redirect: {
          permanent: false,
          destination: "login",
        },
      };
    }

    return {
      props: {
        user: req.session.user,
      },
    };
  }, // -------------------- All boilerplate code for sessions ------------------------------------
  {
    cookieName: process.env.COOKIE_NAME,
    password: process.env.SESSION_PASSWORD,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
