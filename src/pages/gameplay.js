import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

var config = require("../modules/config.js");

const app = initializeApp(config.firebase);
const storage = getStorage(app);

var puzzleid = "RG23";

const listRef = ref(storage, puzzleid);

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
