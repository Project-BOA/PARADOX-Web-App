import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update} from "firebase/database";
import { withIronSessionApiRoute } from "iron-session/next";

var config = require("@/modules/config.js");
const bcrypt = require("bcrypt");

const app = initializeApp(config.firebase);
const db = getDatabase(app);
export default async function handler(req, res) {
    var username = req.body.username;
    username = username.trim();


      update(ref(db, "users/" + username), {
        loggedIn:false
      
      });

        res.status(200).json({
          status: username+" logged out",
        });
        return;
      

  
    }
