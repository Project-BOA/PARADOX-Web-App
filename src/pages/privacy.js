import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import {
  NextUIProvider,
  Container,
  Text,
  Spacer,
  Grid,
  Col,
  Card,
} from "@nextui-org/react";

import { theme } from "@/themes/theme.js";

const { Navigation } = require("@/components/Navigation.js");
const { Footer } = require("@/components/Footer.js");

export default function Privacy({ user }) {
  const router = useRouter();

  return (
    <>
      <NextUIProvider theme={theme}>
        <Navigation page="contact" username={user.username} />

        <Spacer y={1} />

        <Grid.Container gap={2} justify="center">
          <Card
            css={{
              width: "auto",
              background: "$green",
              margin: "1em",
            }}
          >
            <Card css={{ w: "30em", h: "70vh", margin: "1em", width: "auto" }}>
              <Card.Body
                css={{
                  p: 0,
                  backgroundColor: "$lightGreen",
                  border: "#17706E",
                }}
              >
                <Text
                  size={40}
                  align="center"
                  color="$blueViolet"
                  css={{ m: 0 }}
                >
                  Privacy policy
                </Text>
                <div class="box">
                  <Col>
                    <Text size={20} align="center" color="white" css={{ m: 0 }}>
                      At PARAD0X we take your privacy very seriously. This
                      Privacy Policy is designed to provide information about
                      how we collect, use, and share your personal information
                      when you use our website.
                    </Text>
                  </Col>
                  <Col>
                    <div
                      style={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        marginInline: "auto",
                        width: "50%",
                      }}
                    ></div>
                  </Col>
                </div>
                <Spacer y={1} />

                <div class="box">
                  <Col>
                    <Text size={20} align="center" color="white" css={{ m: 0 }}>
                      Information We Collect When you use our website, we may
                      collect certain information about you, including: Personal
                      information: We may collect personal information such as
                      your name, email address
                    </Text>
                  </Col>
                  <Col>
                    <div
                      style={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        marginInline: "auto",
                        width: "50%",
                      }}
                    ></div>
                  </Col>
                </div>

                <Spacer y={1} />
                <div class="box">
                  <Col>
                    <Text size={20} align="center" color="white" css={{ m: 0 }}>
                      How We Use Your Information We use your information to:
                      Provide our services: We use your information to provide
                      and improve our website and services. Communicate with
                      you: We may use your information to communicate with you
                      about our website and services. Analyze usage: We may use
                      your information to analyze how you use our website and
                      services.
                    </Text>
                  </Col>
                  <Col>
                    <div
                      style={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        marginInline: "auto",
                        width: "50%",
                      }}
                    ></div>
                  </Col>
                </div>
              </Card.Body>
            </Card>
          </Card>
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
