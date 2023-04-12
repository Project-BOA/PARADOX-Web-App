import { withIronSessionApiRoute } from "iron-session/next";

const { auth } = require("@/modules/authentication.js");

export default withIronSessionApiRoute(
  async function handler(req, res) {
    // authentication
    var username = req.body.username;
    var password = req.body.password;

    // check authentication
    var user = await auth(username, password);

    if (user == false) {
      res.status(400).json({
        status: "Incorrect Username or Password",
      });
      return;
    }

    // ================ after authentication ================

    // save user to session for website usage
    req.session.user = {
      username,
      password,
      biography: user.biography,
      email: user.email,
      completedPuzzles: user.solved,
    };

    await req.session.save();

    res.status(200).json({
      status: "OK",
      biography: user.biography,
      email: user.email,
      completedPuzzles: user.solved,
    });
  },
  {
    cookieName: process.env.COOKIE_NAME,
    password: process.env.SESSION_PASSWORD,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
