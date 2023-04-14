import { Container, Text, Image, Spacer, Link } from "@nextui-org/react";

function Footer() {
  return (
    <div id="footer">
      <Image
        width={75}
        height={75}
        src="/image/penrose-triangle-coloured-circled-512.png"
        alt=" Logo"
        style={{ objectFit: "cover" }}
      />
      <Spacer y={1} />
      <Container align="center" css={{ width: "100%" }}>
        <Link h3 size={20} align="center" href="/contact">
          Contact Us
        </Link>
        {" - "}
        <Link h3 size={20} align="center" href="/privacy">
          Privacy
        </Link>
      </Container>
      <Spacer y={1} />

      <Text h3 size={12} align="center">
        &copy; PARADOX 2023
      </Text>
    </div>
  );
}

module.exports = {
  Footer,
};
