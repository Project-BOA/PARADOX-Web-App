import Image from "next/image";
import { Inter } from "@next/font/google";
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { useList } from "react-firebase-hooks/database";
import styles from "@/styles/Home.module.css";
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
} from "@nextui-org/react";

import { theme } from "@/themes/theme.js";

const { database } = require("@/modules/firebase-config.js");
const { Navigation } = require("@/components/Navigation.js");
const { Footer } = require("@/components/Footer.js");

export default function Home({ user }) {
  const router = useRouter();

  const multiDescritption =
    "These puzzles have multiple answers, that will score you a low amount of points. These LOW point answers will hint towards the big ticket answer";

  const timeDescritption =
    "Better answer quick these puzzles require quick thinking or you will lose so many points";
  const singleDescritption =
    "Simple, answer the puzzles single answer and get points";

  return (
    <>
      <NextUIProvider theme={theme}>
        <Navigation username={user.username} />
        <Container>
          <Text h2 size={40} align="center" color="green" css={{ m: 0 }}>
            Welcome {user.username}! Check out these Rules
          </Text>
        </Container>

        <Text h3 size={40} align="center" color="green" css={{ m: 0 }}>
          There are 3 Types of puzzles
        </Text>

        <Grid.Container gap={2} justify="center">
          <Grid xs={4}>
            <Card css={{ $$cardColor: "#B6EB7A" }}>
              <Text h4 align="center">
                Multi Puzzles
              </Text>
              <Text size={20} align="center" color="green" css={{ m: 0 }}>
                {multiDescritption}
              </Text>
            </Card>
          </Grid>
          <Grid xs={4}>
            <Card css={{ $$cardColor: "#B6EB7A" }}>
              <Text h4 align="center">
                Single Puzzles
              </Text>
              <Text size={20} align="center" color="green" css={{ m: 0 }}>
                {singleDescritption}
              </Text>
            </Card>
          </Grid>
          <Grid xs={4}>
            <Card css={{ $$cardColor: "#B6EB7A" }}>
              <Text size={20} align="center" color="green" css={{ m: 0 }}>
                <Text h4 align="center">
                  Timed Puzzles
                </Text>
                {timeDescritption}
              </Text>
            </Card>
          </Grid>
        </Grid.Container>
        <Grid.Container gap={2} justify="center">
          <Grid xs={4}>
            <Card css={{ $$cardColor: "#B6EB7A" }}>
              <Text size={20} align="center" color="green" css={{ m: 0 }}>
                Obtain our app{" "}
                <Link color href="#">
                  here
                </Link>{" "}
                and get ready to play
              </Text>
            </Card>
          </Grid>
        </Grid.Container>
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
