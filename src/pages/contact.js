import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import {
  NextUIProvider,
  Container,
  Text,
  Spacer,
  Grid,
  Card,
} from "@nextui-org/react";

import { theme } from "@/themes/theme.js";

const { Navigation } = require("@/components/Navigation.js");
const { Footer } = require("@/components/Footer.js");

export default function Contacts({ user }) {
  const router = useRouter();

  return (
    <>
      <NextUIProvider theme={theme}>
        <Navigation activePage="contact" username={user.username} />

        <Spacer y={1} />

        <Container>
          <Card css={{ $$cardColor: "#90EE90" }}>
            <Text h2 size={40} align="center" color="#8A2BE2" css={{ m: 0 }}>
              {" "}
              Contact us{" "}
            </Text>

            <Text
              h3
              size={40}
              align="center"
              color="white"
              css={{ m: 0 }}
            ></Text>
          </Card>
        </Container>

        <Grid.Container gap={2} justify="center">
          <Grid xs={4}>
            <Card css={{ $$cardColor: "#90EE90" }}>
              <Text size={40} align="center" color="#8A2BE2" css={{ m: 0 }}>
                Email
              </Text>
              <Text size={20} align="center" color="white" css={{ m: 0 }}>
                alanjohn@gmail.com
              </Text>
            </Card>
          </Grid>
          <Grid xs={4}>
            <Card css={{ $$cardColor: "#90EE90" }}>
              <Text size={40} align="center" color="#8A2BE2" css={{ m: 0 }}>
                Phone
              </Text>
              <Text size={20} align="center" color="white" css={{ m: 0 }}>
                555-587-900
              </Text>
            </Card>
          </Grid>
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
