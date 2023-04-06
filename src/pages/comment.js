import Image from "next/image";
import { Inter } from "@next/font/google";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { useList } from "react-firebase-hooks/database";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import {
  NextUIProvider,
  Container,
  Card,
  Row,
  Text,
  Col,
  Spacer,
  Button,
  Link,
  Grid,
  User,
  Navbar,
  Textarea,
} from "@nextui-org/react";
import { theme } from "@/themes/theme.js";

const { database } = require("@/modules/firebase-config.js");

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
        <Navbar isBordered variant="floating">
          <Navbar.Brand>
            <Link href="/">
              <Image
                width={188}
                height={75}
                src="/image/penrose-triangle-PARADOX-text.png"
                alt=" Logo"
                style={{ objectFit: "cover" }}
              />
            </Link>
          </Navbar.Brand>
          <Navbar.Content hideIn="xs" variant="highlight-rounded">
            <Navbar.Link href="/profile">Profile</Navbar.Link>
            <Navbar.Link href="/">Home</Navbar.Link>
            <Navbar.Link href="/instructions">Instruction</Navbar.Link>
          </Navbar.Content>
          <Navbar.Content>
            <Navbar.Item>
              <Text h6 align="right" size={25} color="black" css={{ m: 0 }}>
                <User src="/image/user_icon.png" name={user.username} />
              </Text>
            </Navbar.Item>
            <Navbar.Item>
              <Button auto flat as={Link} href="logout">
                Logout
              </Button>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>
        <Spacer y={1} />

        <Container>
          <Text h2 size={40} align="center" color="green" css={{ m: 0 }}>
            Welcome {user.username}! Check out these comments
          </Text>
          {JSON.stringify(comments)}
        </Container>
        <form onSubmit={handleSubmit}>
          <Textarea
            label="Write your thoughts"
            placeholder="Enter your amazing ideas."
            id="comment"
          />
          <Button auto flat size="sm" type="submit">
            Submit
          </Button>
        </form>
        <Spacer y={1} />
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

    var comments;
    await get(ref(database, "puzzle/" + id + "/comments")).then((snapshot) => {
      if (snapshot.exists()) {
        comments = snapshot.toJSON();
      } else {
        console.log("No comments available");
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
