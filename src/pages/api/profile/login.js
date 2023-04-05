import { ref, get, update } from "firebase/database";
import { withIronSessionApiRoute } from "iron-session/next";

const { database } = require("@/modules/firebase-config.js");
const bcrypt = require("bcrypt");

export default withIronSessionApiRoute(
  async function handler(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var loggedOnSite = req.body.website;

    if (username == null || password == null) {
      res.status(400).json({
        status: "Invalid input",
      });
      return;
    }

    // sanitation
    username = username.trim();
    password = password.trim();

    var user;
    await get(ref(database, "users/" + username))
      .then((snapshot) => {
        user = snapshot.toJSON();
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({
          status: "ERROR",
        });
      });

    if (user == null || !bcrypt.compareSync(password, user.password)) {
      res.status(400).json({
        status: "Username or Password Incorrect",
      });
      return;
    }

    if (!loggedOnSite) {
      update(ref(database, "users/" + username), {
        loggedIn: true,
      });
    }

    if (user.loggedIn && !loggedOnSite) {
      res.status(400).json({
        status: "User logged in on another device",
      });
      return;
    }

    // save user to session
    req.session.user = {
      username,
      biography: user.biography,
      email: user.email,
      completedPuzzles: user.solved,
    };

    await req.session.save();

    res.status(200).json({
      status: "OK",
      biography: user.biography,
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
