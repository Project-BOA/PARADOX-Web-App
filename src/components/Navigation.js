import React from "react";
import {
  Button,
  Link,
  Image,
  Navbar,
  Spacer,
  Text,
  Modal,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { unescapeQuote } from "xss";

function Navigation({ page, username }) {
  const [visible, setVisible] = React.useState(false);

  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
  };

  return (
    <>
      <Head>
        <title>
          {page.charAt(0).toUpperCase() + page.slice(1).toLowerCase()}
        </title>
      </Head>

      <Navbar
        containerCss={{ background: "$primary", color: "$primary" }}
        disableShadow
        disableBlur
        isBordered={false}
        variant="floating"
      >
        <Navbar.Brand>
          <Link href="/">
            <Image
              width={188}
              height={75}
              src="/image/penrose-triangle-PARADOX-dark.png"
              alt=" Logo"
              style={{ objectFit: "cover" }}
            />
          </Link>
        </Navbar.Brand>
        <Navbar.Content variant="underline-rounded">
          <Navbar.Link isActive={page == "profile"} href="/profile">
            <Text weight="bold" size={24}>
              Profile
            </Text>
          </Navbar.Link>

          <Spacer />

          <Navbar.Link href="/" isActive={page == "puzzles"}>
            <Text weight="bold" size={24}>
              Puzzles
            </Text>
          </Navbar.Link>
          <Spacer />
          <Navbar.Link href="/instructions" isActive={page == "instructions"}>
            <Text weight="bold" size={24}>
              Instructions
            </Text>
          </Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Link isActive={page == "profile"} href="/profile">
            <Text align="right" weight="bold" size={20}>
              Hi, {username}
            </Text>
          </Navbar.Link>
          <Navbar.Item>
            <React.Fragment>
              <Button
                auto
                css={{
                  color: "$buttonSecondary",
                  backgroundColor: "$buttonPrimary",
                }}
                onPress={handler}
              >
                Logout
              </Button>
              <Modal
                closeButton
                aria-label="modal-logout-confirmation"
                open={visible}
                onClose={closeHandler}
              >
                <Modal.Header>
                  <Text size={18}>Are you sure you want to logout?</Text>
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

function NavigationGamePlay({
  roomID,
  puzzleName,
  logoAction,
  action,
  actionText,
  secondaryAction,
  secondaryActionText,
}) {
  const router = useRouter();

  actionText = actionText ?? "End";

  action =
    action ??
    function action() {
      router.push("/");
    };

  logoAction =
    logoAction ??
    function logoAction() {
      router.push("/");
    };

  return (
    <>
      <Navbar
        containerCss={{ background: "$primary", color: "$primary" }}
        disableShadow
        disableBlur
        isBordered={false}
        variant="floating"
      >
        <Navbar.Brand>
          <Link
            onPress={() => {
              logoAction();
            }}
          >
            <Image
              width={188}
              height={75}
              src="/image/penrose-triangle-PARADOX-dark.png"
              alt=" Logo"
              style={{ objectFit: "cover" }}
            />
          </Link>
        </Navbar.Brand>

        <Navbar.Content>
          <Text h6 size={40} color="$text" css={{ m: 0 }}>
            Room ID:
          </Text>
          <Text size={40} color="$text" css={{ m: 0 }}>
            {roomID}
          </Text>
        </Navbar.Content>
        <Navbar.Content>
          <Text h6 align="center" size={40} color="$text" css={{ m: 0 }}>
            {puzzleName}
          </Text>
        </Navbar.Content>

        <Navbar.Content>
          {() => {
            if (
              secondaryActionText == undefined ||
              secondaryAction == undefined
            )
              return (
                <Navbar.Item>
                  <Button
                    css={{ visibility: "hidden" }}
                    auto
                    ghost
                    align="right"
                    css={{
                      color: "$buttonPrimary",
                      borderColor: "$buttonPrimary",
                      "&:hover": {
                        color: "$buttonSecondary",
                        backgroundColor: "$buttonPrimary",
                      },
                    }}
                    onPress={() => {
                      secondaryAction();
                    }}
                  >
                    {secondaryActionText}
                  </Button>
                </Navbar.Item>
              );
          }}

          <Navbar.Item>
            <Button
              auto
              align="right"
              css={{
                color: "$buttonSecondary",
                backgroundColor: "$buttonPrimary",
              }}
              onPress={() => {
                action();
              }}
            >
              {actionText}
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
