import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { initializeApp } from "firebase/app";
import { getStorage, getDownloadURL, listAll, ref } from "firebase/storage";
import styles from "@/styles/Home.module.css";
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
  Input,
  Link,
  Grid,
  User,
  Navbar,
} from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  async function getRoom(puzzleID) {
    const data = {
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

    const response = await fetch("api/room/create", options);
    const result = await response.json();
    if (result.status == "OK") {
      router.push({ pathname: "/room", query: { roomID: result.roomID } });
    } else {
      alert("Status: " + result.status);
    }
  }

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
            <Navbar.Link href="/">Profile</Navbar.Link>
            <Navbar.Link href="/">Puzzle</Navbar.Link>
            <Navbar.Link href="/leaderboard">LeaderBoard</Navbar.Link>
          </Navbar.Content>
          <Navbar.Content>
            <Navbar.Item>
              <Text h6 align="right" size={25} color="white" css={{ m: 0 }}>
                <User src="/image/user_icon.png" name="Benji" />
              </Text>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>

        <Spacer y={1} />

        <Container>
          <Row gap={1}>
            <Card css={{ $$cardColor: "$colors$primary" }}>
              <Card.Body>
                <Grid.Container gap={2} justify="center">
                  <Spacer x={4} />
                </Grid.Container>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </NextUIProvider>
    </>
  );
}
