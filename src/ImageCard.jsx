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
            entry: 'playVideo',
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
  const videoRef = React.useRef();

  const [state, send] = useMachine(
    netflixStyleVideoHoverMachine.withConfig({
      actions: {
        playVideo: () => videoRef.current.play(),
      },
    }),
    {
      devTools: true,
    }
  );

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
      {state.matches('showingVideo') && (
        <video
          tabIndex="-1"
          disablePictureInPicture
          loop
          muted
          className="cover-full"
          ref={videoRef}
          onCanPlay={() => {
            send({ type: 'REPORT_VIDEO_LOADED' });
          }}
        >
          <source src={`/assets/Flowers.mp4?key=${imageSrc}`} type="video/mp4" />
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
