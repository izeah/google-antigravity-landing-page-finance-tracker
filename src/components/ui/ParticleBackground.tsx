'use client';

import { useEffect, useMemo, useState, memo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions, Container } from '@tsparticles/engine';

function ParticleBackgroundComponent() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      background: {
        color: {
          value: 'transparent',
        },
      },
      // Reduce FPS for better performance
      fpsLimit: 60,
      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: {
            enable: false,
          },
          onClick: {
            enable: false,
          },
          resize: {
            enable: true,
            delay: 0.5,
          },
        },
      },
      particles: {
        color: {
          value: ['#8b5cf6', '#06b6d4', '#ec4899'],
        },
        // Disable links - this is very expensive!
        links: {
          color: '#8b5cf6',
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce',
          },
          random: true,
          // Slower speed = less calculations
          speed: 0.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            // Larger area = fewer particles per screen area
            area: 1000,
          },
          // Reduce particle count significantly
          value: 80,
        },
        opacity: {
          value: { min: 0.3, max: 0.7 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.1,
          },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: false, // Disable retina for performance
    }),
    []
  );

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // Optional: You can add any initialization logic here
  };

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="absolute inset-0 -z-10 pointer-events-none"
      particlesLoaded={particlesLoaded}
    />
  );
}

// Memoize the component to prevent re-renders when parent state changes
const ParticleBackground = memo(ParticleBackgroundComponent);

export default ParticleBackground;
