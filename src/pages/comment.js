import Image from "next/image";
import { ref, get, update } from "firebase/database";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import {
  NextUIProvider,
  Container,
  Text,
  Row,
  Col,
  Card,
  Spacer,
  Button,
  Link,
  User,
  Navbar,
  Textarea,
} from "@nextui-org/react";
import { theme } from "@/themes/theme.js";

const { database } = require("@/modules/firebase-config.js");
const { Navigation } = require("@/components/Navigation.js");
const { Footer } = require("@/components/Footer.js");

export default function Home({ user, comments }) {
  const router = useRouter();
  const { puzzleID } = router.query;

  async function handleSubmit(event) {
    event.preventDefault();
    const comment = document.querySelector("#comment").value;

    const data = {
      comment: event.target.comment.value,
      username: user.username,
      puzzleID: puzzleID,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    console.log(options);

    const response = await fetch("api/puzzle/submit", options);
    const result = await response.json();
    if (result.status == "OK") {
      router.push({ pathname: "/" });
    } else {
      alert("Status: " + result.status);
    }
  }

  return (
    <>
      <NextUIProvider theme={theme}>
        <Navigation activePage="comment" username={user.username} />
        <Spacer y={1} />
        {/* <Container>
          <Text h2 size={40} align="center" color="green" css={{ m: 0 }}>
            Welcome {user.username}! Check out these comments
          </Text>
        </Container> */}

        <Container>
          <Row>
            <Card css={{ $$cardColor: "$colors$primary" }}>
              <Card.Body>
                <Text h4 align="center">
                  Puzzle title: puzzle type
                </Text>
                <Col>
                  <Text h4 align="center">
                    Description
                  </Text>
                  <div class="box">
                    <Col>
                      {" "}
                      <Text size={20} align="left" color="white" css={{ m: 0 }}>
                        Amount of time you have to answer each puzzle piece is
                        INTERVAL seconds . IF MULTI, and you will lose DECREMENT
                        points every INTERVAL seconds{" "}
                      </Text>
                    </Col>
                  </div>
                </Col>
              </Card.Body>
            </Card>
            <Card css={{ $$cardColor: "$colors$primary" }}>
              <Card.Body>
                <Text h4 align="center">
                  Comments
                </Text>
                <div class="box">
                  <Col>
                    {" "}
                    <Text size={20} align="left" color="white" css={{ m: 0 }}>
                      {JSON.stringify(comments)}
                    </Text>
                  </Col>
                </div>
              </Card.Body>
            </Card>
          </Row>
        </Container>

        <form onSubmit={handleSubmit}>
          <Textarea
            aria-label="Write your thoughts"
            placeholder="Enter your amazing ideas."
            id="comment"
          />
          <Button auto flat size="sm" type="submit">
            Submit
          </Button>
        </form>
        <Spacer y={1} />
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

    const NextRequestMetaSymbol = Reflect.ownKeys(req).find(
      (key) => key.toString() === "Symbol(NextRequestMeta)"
    );

    const id =
      (await NextRequestMetaSymbol) &&
      req[NextRequestMetaSymbol].__NEXT_INIT_QUERY
        ? req[NextRequestMetaSymbol].__NEXT_INIT_QUERY.puzzleID
        : undefined;

    console.log(id);

    var comments = "There are no comments";
    await get(ref(database, "comments/" + id)).then((snapshot) => {
      if (snapshot.exists()) {
        comments = snapshot.toJSON();
      } else {
        console.log("No comments available");
        update(ref(database, "comments/" + id), {});
      }
    });

    console.log(comments);

    return {
      props: {
        user: req.session.user,
        comments: comments,
        id: id,
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
