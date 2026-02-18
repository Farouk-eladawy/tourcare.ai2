import React, { useEffect, memo } from 'react';

// Declare tsParticles on the window object to satisfy TypeScript
declare global {
  interface Window {
    tsParticles: any;
  }
}

interface ParticlesBackgroundProps {
  id: string;
}

const particlesConfig = {
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#059669", // brand-accent
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.15,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: true,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.3,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
  background: {
    color: 'transparent'
  }
};


const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ id }) => {
  useEffect(() => {
    if (window.tsParticles) {
      window.tsParticles.load({ id, options: particlesConfig });
    }
  }, [id]);

  return <div id={id} className="absolute inset-0 z-0" />;
};

export default memo(ParticlesBackground);