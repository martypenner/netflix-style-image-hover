import React from 'react';
import { useMachine } from '@xstate/react';
import { assign, createMachine } from 'xstate';

const netflixStyleVideoHoverMachine = createMachine({
  context: {},

  initial: '',
  states: {},
});

function ImageCard({ imageSrc, title, description }) {
  const videoRef = React.useRef();

  const [state, send] = useMachine(netflixStyleVideoHoverMachine, {
    devTools: true,
  });

  return (
    <a
      href={`#${imageSrc}`}
      onMouseEnter={() => {
        console.log('mouse over');
      }}
      onMouseOut={() => {
        console.log('mouse out');
      }}
    >
      <img
        src={imageSrc}
        alt=""
        className="cover"
        onLoad={() => {
          console.log('image loaded');
        }}
        onError={() => {
          console.log('image failed to load');
        }}
      />
      <video
        tabIndex="-1"
        disablePictureInPicture
        loop
        muted
        className="cover-full"
        ref={videoRef}
        onCanPlay={() => {
          console.log('can play');
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
