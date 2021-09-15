import "./styles.css";
import { interpret, assign, createMachine } from "xstate";
import { inspect } from "@xstate/inspect";

console.clear();

inspect({
  iframe: false
});

const netflixStyleVideoHoverMachine = createMachine(
  {
    id: "netflixStyleVideoHover",

    context: {},

    initial: "",
    states: {}
  },
  {}
);

document.querySelectorAll(".item").forEach((elem) => {
  const runningMachine = interpret(netflixStyleVideoHoverMachine, {
    devTools: true
  }).start();

  const coverImage = elem.querySelector(".cover");
  const video = elem.querySelector("video");

  coverImage.addEventListener("load", () => {
    console.log("loaded");
  });

  coverImage.addEventListener("error", () => {
    console.log("error loading image");
  });

  video.addEventListener("load", () => {
    console.log("loaded video");
  });

  elem.addEventListener("mouseenter", () => {
    console.log("hover");
  });

  elem.addEventListener("mouseleave", () => {
    console.log("leaving");
  });
});
