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

    context: {
      hasVideoLoaded: false
    },

    initial: "awaitingBackgroundImageLoad",
    states: {
      awaitingBackgroundImageLoad: {
        on: {
          REPORT_IMAGE_LOADED: {
            target: "idle"
          },
          REPORT_IMAGE_FAILED_TO_LOAD: {
            target: "imageFailedToLoad"
          }
        }
      },
      imageFailedToLoad: {},
      idle: {
        on: {
          MOUSE_OVER: {
            target: "showingVideo"
          }
        }
      },
      showingVideo: {
        entry: "setVideoSrc",
        exit: "removeVideoSrc",
        initial: "checkingIfVideoHasLoaded",
        on: {
          MOUSE_OUT: {
            target: "idle"
          }
        },
        states: {
          checkingIfVideoHasLoaded: {
            always: [
              {
                cond: "hasLoadedVideo",
                target: "waitingBeforePlaying"
              },
              {
                target: "loadingVideoSrc"
              }
            ]
          },
          waitingBeforePlaying: {
            after: {
              2000: {
                target: "autoPlayingVideo"
              }
            }
          },
          loadingVideoSrc: {
            initial: "cannotMoveOn",
            states: {
              cannotMoveOn: {
                after: {
                  2000: {
                    target: "canMoveOn"
                  }
                },
                on: {
                  REPORT_VIDEO_LOADED: {
                    actions: "reportVideoLoaded"
                  }
                }
              },
              canMoveOn: {
                always: {
                  cond: "hasLoadedVideo",
                  target: "#autoPlayingVideo"
                },
                on: {
                  REPORT_VIDEO_LOADED: {
                    actions: "reportVideoLoaded",
                    target: "#autoPlayingVideo"
                  }
                }
              }
            }
          },
          autoPlayingVideo: {
            id: "autoPlayingVideo"
          }
        }
      }
    }
  },
  {
    guards: {
      hasLoadedVideo: (context) => {
        return context.hasVideoLoaded;
      }
    },

    actions: {
      reportVideoLoaded: assign({
        hasVideoLoaded: true
      })
    }
  }
);

document.querySelectorAll(".item").forEach((elem) => {
  const runningMachine = interpret(
    netflixStyleVideoHoverMachine.withConfig({
      actions: {
        setVideoSrc: () => {
          console.log(elem.dataset.src);
          elem.src = elem.dataset.src;
          elem.play();
        },
        removeVideoSrc: () => {
          elem.src = null;
        }
      }
    }),
    {
      devTools: true
    }
  ).start();

  const coverImage = elem.querySelector(".cover");
  const video = elem.querySelector("video");

  coverImage.addEventListener("load", () => {
    runningMachine.send({ type: "REPORT_IMAGE_LOADED" });
  });

  coverImage.addEventListener("error", () => {
    runningMachine.send({ type: "REPORT_IMAGE_FAILED_TO_LOAD" });
  });

  video.addEventListener("canplaythrough", () => {
    runningMachine.send({ type: "REPORT_VIDEO_LOADED" });
  });

  elem.addEventListener("mouseenter", () => {
    runningMachine.send({ type: "MOUSE_OVER" });
  });

  elem.addEventListener("mouseleave", () => {
    runningMachine.send({ type: "MOUSE_OUT" });
  });
});
