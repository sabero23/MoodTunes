// src/components/MoodSelector.jsx
import React, { useState } from 'react';
import './MoodSelector.css';
import muyMal from '../assets/moods/muy_mal.svg';
import mal from '../assets/moods/mal.svg';
import algoMal from '../assets/moods/algo_mal.svg';
import normal from '../assets/moods/normal.svg';
import bien from '../assets/moods/bien.svg';
import muyBien from '../assets/moods/muy_bien.svg';
import motivado from '../assets/moods/motivado.svg';

const moods = [
  { id: 'muy_mal', label: 'Muy mal', icon: muyMal },
  { id: 'mal', label: 'Mal', icon: mal },
  { id: 'algo_mal', label: 'Algo mal', icon: algoMal },
  { id: 'normal', label: 'Normal', icon: normal },
  { id: 'bien', label: 'Bien', icon: bien },
  { id: 'muy_bien', label: 'Muy bien', icon: muyBien },
  { id: 'motivado', label: 'Motivado', icon: motivado },
];

export default function MoodSelector() {
  const [index, setIndex] = useState(3); // Empieza en "normal"

  const handleSlider = (e) => {
    setIndex(Number(e.target.value));
  };

  const handleNext = () => {
    const mood = moods[index];
    alert(`Estado de ánimo guardado: ${mood.label}`);
  };

  const mood = moods[index];

  return (
    <div className="mood-selector-container">
      <h2 className="mood-title">¿Cómo te has sentido en general hoy?</h2>

      <div className="icon-container">
        <div className="circle-layer circle-1"></div>
        <div className="circle-layer circle-2"></div>
        <div className="circle-layer circle-3"></div>
        <img
          key={mood.id}
          src={mood.icon}
          alt={mood.label}
          className="mood-icon"
        />
      </div>

      <div className="mood-label">{mood.label}</div>

      <input
        type="range"
        min="0"
        max={moods.length - 1}
        value={index}
        onChange={handleSlider}
        className="mood-slider"
      />

      <div className="slider-labels">
        <span>{moods[0].label}</span>
        <span>{moods[moods.length - 1].label}</span>
      </div>

      <button className="next-button" onClick={handleNext}>Siguiente</button>
    </div>
  );
}
