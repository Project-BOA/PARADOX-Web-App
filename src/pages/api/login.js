import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue} from "firebase/database";
import { withIronSessionApiRoute } from "iron-session/next";

const firebaseConfig = {
  apiKey: "AIzaSyCRlQyWruO-HhPLIXLbUwe8Re3WCuli_VU",
  authDomain: "codedatabase-819d6.firebaseapp.com",
  databaseURL: "https://codedatabase-819d6-default-rtdb.firebaseio.com",
  projectId: "codedatabase-819d6",
  storageBucket: "codedatabase-819d6.appspot.com",
  messagingSenderId: "420075124138",
  appId: "1:420075124138:web:0020e12a55853d65cf67d3",
  measurementId: "G-QYDJZW417T"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

var pass;
async function getUser(username){
  const userNames = ref(db, 'users/'+username);
  onValue(userNames, (snapshot) => {
    const data = snapshot.val();
  
    pass = data.pass;
    console.log(pass);

  });
}
export default withIronSessionApiRoute(
    async function handler(req, res) {

        var username = req.body.username;
        var password = req.body.password;

        // var username = "test123";
        // var password = "pass";

        getUser(username);

        if (pass == password) {

            req.session.user = username;

            await req.session.save();

            res.status(200).json(
                {
                    status: "OK"
                }
            )
       
            return
        }
        else{
            res.status(200).json(
                {
                    status: "Username or Password Incorrect"
                }
            )
            return
        }
    },
    {
        cookieName: process.env.COOKIE_NAME,
        password: process.env.SESSION_PASSWORD,
        cookieOptions: {
          secure: process.env.NODE_ENV === "production",
        },
    }
);