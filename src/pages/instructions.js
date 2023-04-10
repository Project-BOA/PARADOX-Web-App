import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import {
  NextUIProvider,
  Container,
  Text,
  Spacer,
  Link,
  Grid,
  Card,
  Row,
  Col,
  Image,
} from "@nextui-org/react";

import { theme } from "@/themes/theme.js";

const { Navigation } = require("@/components/Navigation.js");
const { Footer } = require("@/components/Footer.js");

export default function Instruction({ user }) {
  const router = useRouter();

  const multiDescription =
    "These puzzles have multiple answers, that will score you a low amount of points. These LOW point answers will hint towards the big ticket answer";

  const timeDescritption =
    "Better answer quick these puzzles require quick thinking or you will lose so many points";
  const singleDescritption =
    "Simple, answer the puzzles single answer and get points";

  return (
    <>
      <NextUIProvider theme={theme}>
        <Navigation page="instructions" username={user.username} />

        <Spacer y={1} />
        <Grid.Container gap={2} justify="center">
          <Card
            css={{
              width: "70%",
              background: "$green",
              margin: "1em",
            }}
          >
            <Card css={{ w: "30em", h: "20vh", margin: "1em", width: "auto" }}>
              <Card.Header
                css={{
                  backgroundColor: "$lightGreen",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Col>
                  <Text
                    size={18}
                    weight="bold"
                    transform="uppercase"
                    color="black"
                  ></Text>
                </Col>
              </Card.Header>
              <Card.Body
                css={{
                  p: 0,
                  backgroundColor: "$lightGreen",
                  border: "#17706E",
                }}
              >
                <Text
                  h2
                  size={40}
                  align="center"
                  color="$blueViolet"
                  css={{ m: 0 }}
                >
                  How to Play
                </Text>
                <Text h3 size={40} align="center" color="white" css={{ m: 0 }}>
                  There are 3 Types of puzzles...
                </Text>
              </Card.Body>
            </Card>
          </Card>
        </Grid.Container>

        <Grid.Container gap={2} justify="center">
          <Card
            css={{
              width: "auto",
              background: "$green",
              margin: "1em",
            }}
          >
            <Card css={{ w: "30em", h: "50vh", margin: "1em" }}>
              <Card.Header
                css={{
                  marginLeft: "auto",
                  backgroundColor: "$lightGreen",
                  marginRight: "auto",
                }}
              >
                <Col>
                  <Text
                    size={28}
                    weight="bold"
                    transform="uppercase"
                    color="black"
                  ></Text>
                  <Text
                    size={18}
                    weight="bold"
                    transform="uppercase"
                    color="black"
                  ></Text>
                </Col>
              </Card.Header>
              <Card.Body
                css={{
                  p: 0,
                  backgroundColor: "$lightGreen",
                  border: "#17706E",
                }}
              >
                <Text
                  size={40}
                  align="center"
                  color="$blueViolet"
                  css={{ m: 0 }}
                >
                  Single Puzzles
                </Text>
                <Text size={20} align="center" color="$powder" css={{ m: 0 }}>
                  {singleDescritption}
                </Text>
              </Card.Body>
            </Card>
          </Card>

          <Card
            css={{
              width: "auto",
              background: "$green",
              margin: "1em",
            }}
          >
            <Card css={{ w: "30em", h: "50vh", margin: "1em" }}>
              <Card.Header
                css={{
                  marginLeft: "auto",
                  backgroundColor: "$lightGreen",
                  marginRight: "auto",
                }}
              >
                <Col>
                  <Text
                    size={28}
                    weight="bold"
                    transform="uppercase"
                    color="black"
                  ></Text>
                  <Text
                    size={18}
                    weight="bold"
                    transform="uppercase"
                    color="black"
                  ></Text>
                </Col>
              </Card.Header>
              <Card.Body
                css={{
                  p: 0,
                  backgroundColor: "$lightGreen",
                  border: "#17706E",
                }}
              >
                <Text
                  size={40}
                  align="center"
                  color="$blueViolet"
                  css={{ m: 0 }}
                >
                  Multi Puzzles
                </Text>
                <Text size={20} align="center" color="$powder" css={{ m: 0 }}>
                  {multiDescription}
                </Text>
              </Card.Body>
            </Card>
          </Card>

          <Card
            css={{
              width: "auto",
              background: "$green",
              margin: "1em",
            }}
          >
            <Card css={{ w: "30em", h: "50vh", margin: "1em" }}>
              <Card.Header
                css={{
                  marginLeft: "auto",
                  backgroundColor: "$lightGreen",
                  marginRight: "auto",
                }}
              >
                <Col>
                  <Text
                    size={28}
                    weight="bold"
                    transform="uppercase"
                    color="black"
                  ></Text>
                  <Text
                    size={18}
                    weight="bold"
                    transform="uppercase"
                    color="black"
                  ></Text>
                </Col>
              </Card.Header>
              <Card.Body
                css={{
                  p: 0,
                  backgroundColor: "$lightGreen",
                  border: "#17706E",
                }}
              >
                <Text
                  size={40}
                  align="center"
                  color="$blueViolet"
                  css={{ m: 0 }}
                >
                  Timed Puzzles
                </Text>
                <Text size={20} align="center" color="$powder" css={{ m: 0 }}>
                  {timeDescritption}
                </Text>
              </Card.Body>
            </Card>
          </Card>
        </Grid.Container>

        <Grid.Container gap={2} justify="center">
          <Card
            css={{
              width: "auto",
              background: "$green",
              margin: "1em",
            }}
          >
            <Card css={{ w: "30em", h: "70vh", margin: "1em", width: "auto" }}>
              <Card.Body
                css={{
                  p: 0,
                  backgroundColor: "$lightGreen",
                  border: "#17706E",
                }}
              >
                <Text
                  size={40}
                  align="center"
                  color="$blueViolet"
                  css={{ m: 0 }}
                >
                  Gameplay
                </Text>
                <div class="box">
                  <Col>
                    <Text size={20} align="right" color="white" css={{ m: 0 }}>
                      Users can join a room by inputting the room ID that
                      appears in the corner, once a user joins their username
                      will be displayed in the room. Click on the username of a
                      user to kick them out of the room. Click on the start
                      button to start the game and begin your puzzle journey
                    </Text>
                  </Col>
                  <Col>
                    <div
                      style={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        marginInline: "auto",
                        width: "50%",
                      }}
                    >
                      <Image
                        css={{
                          margin: "auto",
                        }}
                        src="/image/default_puzzle_image.png"
                        width="auto"
                        height="auto"
                        alt="puzzle image"
                      />
                    </div>
                  </Col>
                </div>
                <Spacer y={1} />

                <div class="box">
                  <Col>
                    <Text size={20} align="right" color="white" css={{ m: 0 }}>
                      Once a room starts a time will countdown till the next
                      puzzle piece. The timer will vary from puzzle to puzzle.
                      The puzzle piece will display front and center. Under the
                      timer you can check the top players in the room, hover of
                      their names to find out some fun info. You can either end
                      the room early or went for it to tick down to be brough to
                      the leaderboard page.
                    </Text>
                  </Col>
                  <Col>
                    <div
                      style={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        marginInline: "auto",
                        width: "50%",
                      }}
                    >
                      <Image
                        css={{
                          margin: "auto",
                        }}
                        src="/image/default_puzzle_image.png"
                        width="auto"
                        height="auto"
                        alt="puzzle image"
                      />
                    </div>
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
                    <div
                      style={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        marginInline: "auto",
                        width: "50%",
                      }}
                    >
                      <Image
                        css={{
                          margin: "auto",
                        }}
                        src="/image/default_puzzle_image.png"
                        width="auto"
                        height="auto"
                        alt="puzzle image"
                      />
                    </div>
                  </Col>
                </div>
              </Card.Body>
            </Card>
          </Card>
        </Grid.Container>
        <Spacer y={2} />

        <Grid.Container gap={2} justify="center">
          <Card
            css={{
              width: "40%",
              background: "$green",
              margin: "1em",
            }}
          >
            <Card css={{ w: "20em", h: "auto", margin: "1em", width: "auto" }}>
              <Card.Body
                css={{
                  p: 0,
                  backgroundColor: "$lightGreen",
                  border: "#17706E",
                }}
              >
                <Container>
                  <Row gap={1}>
                    <Col>
                      <Text size={"2vw"} color="$blueViolet" align="center">
                        <Link href="#">Get the PARAD0X App</Link>
                      </Text>
                    </Col>

                    <Image src="/image/googleplay.png" alt="GooglePlay icon" />
                  </Row>
                </Container>
              </Card.Body>
            </Card>
          </Card>
        </Grid.Container>
        <Footer />
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
