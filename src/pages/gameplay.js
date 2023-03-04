import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyCRlQyWruO-HhPLIXLbUwe8Re3WCuli_VU",
  authDomain: "codedatabase-819d6.firebaseapp.com",
  databaseURL: "https://codedatabase-819d6-default-rtdb.firebaseio.com",
  projectId: "codedatabase-819d6",
  storageBucket: "codedatabase-819d6.appspot.com",
  messagingSenderId: "420075124138",
  appId: "1:420075124138:web:0020e12a55853d65cf67d3",
  measurementId: "G-QYDJZW417T",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const listRef = ref(storage, "RG23");

var i = 0;
var fireImage = [];

listAll(listRef)
  .then((res) => {
    res.prefixes.forEach((folderRef) => {
      // All the prefixes under listRef.
      // You may call listAll() recursively on them.
    });
    res.items.forEach((itemRef) => {
      // All the items under listRef.
      getImageRef(itemRef);
    });
  })
  .catch((error) => {
    console.log(error);
  });

function nextSlide(nextRef) {
  getDownloadURL(nextRef).then((url) => {
    const img = document.getElementById("myimg");
    img.setAttribute("src", url);
  });
}

function getImageRef(imageRef) {
  fireImage.push(imageRef);
}

function Replace() {
  document.getElementById("container").innerHTML =
    "The Puzzle is Complete <br></br> See your Score Here: <br></br>";
}

export default function gameplay() {
  var time = 5;
  return (
    <div id="container">
      <CountdownCircleTimer
        isPlaying
        duration={time}
        colors={["#000C66", "#F7B801", "#A30000"]}
        colorsTime={[2, 1, 0]}
        onComplete={() => {
          if (i == fireImage.length - 1) {
            Replace();
            return { shouldRepeat: false }; // repeat animation in 1.5 seconds
          }
          nextSlide(fireImage[i++]);
          console.log(i);
          return { shouldRepeat: true, delay: 1.5 }; // repeat animation in 1.5 seconds
        }}
      >
        {({ remainingTime }) => remainingTime}
      </CountdownCircleTimer>

      <img
        id="myimg"
        alt={"Puzzle image: " + fireImage[i]}
        width="500"
        height="500"
      ></img>
    </div>
  );
}
