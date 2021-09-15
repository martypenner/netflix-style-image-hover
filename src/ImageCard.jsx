import React from 'react';
import { useMachine } from '@xstate/react';
import { assign, createMachine } from 'xstate';

const netflixStyleVideoHoverMachine = createMachine(
  {
    id: 'netflixStyleVideoHover',

    context: {
      hasVideoLoaded: false,
    },

    initial: 'awaitingBackgroundImageLoad',
    states: {
      awaitingBackgroundImageLoad: {
        on: {
          REPORT_IMAGE_LOADED: 'idle',
          REPORT_IMAGE_FAILED_TO_LOAD: 'imageFailedToLoad',
        },
      },
      imageFailedToLoad: {},
      idle: {
        on: {
          MOUSE_OVER: 'showingVideo',
        },
      },
      showingVideo: {
        initial: 'checkingIfVideoHasLoaded',
        on: {
          MOUSE_OUT: 'idle',
        },
        states: {
          checkingIfVideoHasLoaded: {
            always: [
              {
                cond: 'hasLoadedVideo',
                target: 'waitingBeforePlaying',
              },
              {
                target: 'loadingVideoSrc',
              },
            ],
          },
          waitingBeforePlaying: {
            after: {
              2000: 'autoPlayingVideo',
            },
          },
          loadingVideoSrc: {
            initial: 'cannotMoveOn',
            states: {
              cannotMoveOn: {
                after: {
                  2000: 'canMoveOn',
                },
                on: {
                  REPORT_VIDEO_LOADED: {
                    actions: 'reportVideoLoaded',
                  },
                },
              },
              canMoveOn: {
                always: {
                  cond: 'hasLoadedVideo',
                  target: '#autoPlayingVideo',
                },
                on: {
                  REPORT_VIDEO_LOADED: {
                    actions: 'reportVideoLoaded',
                    target: '#autoPlayingVideo',
                  },
                },
              },
            },
          },
          autoPlayingVideo: {
            id: 'autoPlayingVideo',
          },
        },
      },
    },
  },
  {
    guards: {
      hasLoadedVideo: (context) => {
        return context.hasVideoLoaded;
      },
    },

    actions: {
      reportVideoLoaded: assign({
        hasVideoLoaded: true,
      }),
    },
  }
);

function ImageCard({ imageSrc, title, description }) {
  const [state, send] = useMachine(netflixStyleVideoHoverMachine, {
    devTools: true,
  });

  return (
    <a
      href={`#${imageSrc}`}
      onMouseEnter={() => {
        send({ type: 'MOUSE_OVER' });
      }}
      onMouseOut={() => {
        send({ type: 'MOUSE_OUT' });
      }}
    >
      <img
        src={imageSrc}
        alt=""
        className="cover"
        onLoad={() => {
          send({ type: 'REPORT_IMAGE_LOADED' });
        }}
        onError={() => {
          send({ type: 'REPORT_IMAGE_FAILED_TO_LOAD' });
        }}
      />
      {/* <video
        tabIndex="-1"
        disablePictureInPicture
        loop
        muted
        crossOrigin="anonymous"
        className="cover-full"
      >
        <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
        <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm" />
      </video> */}
      {state.matches('showingVideo') && (
        <video
          preload="none"
          tabIndex="-1"
          disablePictureInPicture
          loop
          muted
          autoPlay
          src={`/assets/Flowers.mp4?key=${imageSrc}`}
          className="cover-full"
          onCanPlayThrough={() => {
            send({ type: 'REPORT_VIDEO_LOADED' });
          }}
        >
          {/* <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4" /> */}
        </video>
      )}

      <div className="text">
        <p>{title}</p>
        <small>{description}</small>
      </div>
    </a>
  );
}

export default ImageCard;
