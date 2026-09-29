"use client";

import { useEffect, useState } from "react";

const heroImages = [
  "/image1.png",
  "/image2.png",
  "/image3.png",
];

export default function HeroImageBackground() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {heroImages.map((image, index) => (
        <img
          key={image}
          src={image}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}