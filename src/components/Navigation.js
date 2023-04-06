import {
  Button,
  Link,
  Image,
  Navbar,
  Spacer,
  Container,
  Text,
  User,
} from "@nextui-org/react";

function Navigation({ username }) {
  return (
    <>
      <Navbar css={{ background: "$primary" }} isBordered variant="floating">
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
            <Button auto flat as={Link} href="logout">
              Logout
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
};
