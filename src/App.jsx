import React from 'react';
import './App.css';
import ImageCard from './ImageCard';

const items = [
  {
    imageSrc: '/assets/dog.jpeg',
    title: 'Dog/man',
    description:
      'A dog takes on skateboarding as a way to wrestle with his checkered past.',
  },
  {
    imageSrc: '/assets/person.jpeg',
    title: 'The Day My Life Began',
    description: 'A young woman saves a cat from an intruder on her spaceship.',
  },
  {
    imageSrc: '/assets/flower.jpeg',
    title: 'Blue Planet III',
    description:
      'The third installment in the blue planet series. Now with more blue and less planet.',
  },
  {
    imageSrc: '/assets/people.jpeg',
    title: 'The Corry-door',
    description:
      'Corry finds a door. He MIGHT go through it. If he gets there first, that is.',
  },
  {
    imageSrc: '/assets/bubbles.jpeg',
    title: 'A Dream of Sleep',
    description:
      'Listen to your inner voice as we take you on a journey through the subconscious.',
  },
];

function App() {
  return (
    <ul className="container">
      {items.map((item) => (
        <li key={item.description} className="item">
          <ImageCard {...item} />
        </li>
      ))}
    </ul>
  );
}

export default App;
