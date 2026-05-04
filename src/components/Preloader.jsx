"use client";

import { useEffect } from 'react';

export default function Preloader() {
  useEffect(() => {
    const preloader = document.getElementById('ui-preloader');
    if (!preloader) return;

    const progress = preloader.querySelector('.preloader-progress');
    let width = 0;
    const interval = setInterval(() => {
      width += Math.random() * 20; // Más rápido
      if (width >= 100) {
        width = 100;
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add('preloader-hidden');
        }, 200); // Mitad de tiempo
      }
      if (progress) progress.style.width = `${width}%`;
    }, 60); // Mitad de tiempo

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="ui-preloader" className="preloader">
      <div className="preloader-content">
        <img src="/img/logo.png" alt="La Nonna Logo" className="logo-preloader" />
        <div className="preloader-bar">
          <div className="preloader-progress" />
        </div>
        <p className="preloader-text">Encendiendo el horno de leña...</p>
      </div>
    </div>
  );
}
