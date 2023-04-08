import handler from "@/pages/api/room";
import React from "react";
import {
  Button,
  Link,
  Image,
  Navbar,
  Spacer,
  Container,
  Text,
  User,
  Modal,
} from "@nextui-org/react";
import { useRouter } from "next/router";

function Navigation({ username }) {
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
  };
  return (
    <>
      <Navbar css={{ background: "$background" }} isBordered variant="floating">
        <Navbar.Brand>
          <Link href="/">
            <Image
              width={188}
              height={75}
              src="/image/penrose-triangle-PARADOX.png"
              alt=" Logo"
              style={{ objectFit: "cover" }}
            />
          </Link>
        </Navbar.Brand>
        <Navbar.Content hideIn="xs" variant="highlight-rounded">
          <Navbar.Link href="/profile">Profile</Navbar.Link>
          <Navbar.Link href="/">Puzzles</Navbar.Link>
          <Navbar.Link href="/instructions">Instruction</Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Item>
            <Text h6 align="right" size={25} color="black" css={{ m: 0 }}>
              <User src="/image/user_icon.png" name={username} />
            </Text>
          </Navbar.Item>
          <Navbar.Item>
            <React.Fragment>
              <Button auto flat onPress={handler}>
                Logout
              </Button>
              <Modal
                closeButton
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
              >
                {" "}
                <Modal.Header>
                  <Text id="modal-title" size={18}>
                    Are you sure you want to logout?
                  </Text>
                </Modal.Header>
                <Modal.Footer justify="center">
                  <Button auto flat color="error" onPress={closeHandler}>
                    Exit
                  </Button>
                  <Button auto as={Link} href="logout" onPress={closeHandler}>
                    Logout
                  </Button>
                </Modal.Footer>
              </Modal>
            </React.Fragment>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
      <Spacer y={1} />
    </>
  );
}

function NavigationGamePlay({ roomID, puzzleName, puzzleType, Endfunction }) {
  const router = useRouter();

  return (
    <>
      <Navbar
        css={{ background: "$primary" }}
        isBordered
        disableShadow
        variant="floating"
      >
        <Navbar.Brand>
          <Link href="/">
            <Image
              width={188}
              height={75}
              src="/image/penrose-triangle-PARADOX.png"
              alt=" Logo"
              style={{ objectFit: "cover" }}
            />
          </Link>
        </Navbar.Brand>
        <Navbar.Content hideIn="xs" variant="highlight-rounded">
          <Text h6 align="center" size={40} color="#8A2BE2" css={{ m: 0 }}>
            RoomID: {roomID}
          </Text>
          <Spacer y={2} />
          <Text h6 align="center" size={40} color="#8A2BE2" css={{ m: 0 }}>
            {puzzleName}
          </Text>
          <Spacer y={2} />

          <Text h6 align="center" size={40} color="#8A2BE2" css={{ m: 0 }}>
            PuzzleType: {puzzleType}
          </Text>
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Item>
            <Button
              align="right"
              css={{
                color: "#17706E",
                backgroundColor: "#BB2297",
                marginInline: "auto",
              }}
              onPress={(event) => {
                //router.push("/leaderboard?roomID=" + roomID);
                //console.log(Endfunction);
                Endfunction();
              }}
            >
              End
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
      <Spacer y={1} />
    </>
  );
}

module.exports = {
  Navigation,
  NavigationGamePlay,
};
