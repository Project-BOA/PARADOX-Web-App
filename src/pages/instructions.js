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

const inter = Inter({ subsets: ["latin"] });

var config = require("@/modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

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
      <NextUIProvider>
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
            Welcome {user.username}! Check out these Rules
          </Text>
        </Container>

        <Text h3 size={40} align="center" color="green" css={{ m: 0 }}>
          There are 3 Types of puzzles
        </Text>

        <Grid.Container gap={2} justify="center">
          <Grid xs={4}>
            <Card css={{ $$cardColor: "#B6EB7A" }}>
              <Text size={20} align="center" color="green" css={{ m: 0 }}>
                {multiDescritption}
              </Text>
            </Card>
          </Grid>
          <Grid xs={4}>
            <Card css={{ $$cardColor: "#B6EB7A" }}>
              <Text size={20} align="center" color="green" css={{ m: 0 }}>
                {singleDescritption}
              </Text>
            </Card>
          </Grid>
          <Grid xs={4}>
            <Card css={{ $$cardColor: "#B6EB7A" }}>
              <Text size={20} align="center" color="green" css={{ m: 0 }}>
                {timeDescritption}
              </Text>
            </Card>
          </Grid>
        </Grid.Container>
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
