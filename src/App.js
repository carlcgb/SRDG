import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Events from './components/Events';
import Platforms from './components/Platforms';
import JokeSection from './components/JokeSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import JokeModal from './components/JokeModal';
import { useScrollEffects } from './hooks/useScrollEffects';
import { useMascotTilt } from './hooks/useMascotTilt';
import { useJokeModal } from './hooks/useJokeModal';
import { useEventCards } from './hooks/useEventCards';
import { useButtonAnimations } from './hooks/useButtonAnimations';
import { useParallax } from './hooks/useParallax';

function App() {
  // Hooks personnalisés
  useScrollEffects();
  useMascotTilt();
  useEventCards();
  useButtonAnimations();
  useParallax();
  const { isModalOpen, openModal, closeModal, handleJokeSubmission } = useJokeModal();

  return (
    <div className="App">
      <Navigation />
      <Hero />
      <Events />
      <Platforms />
      <JokeSection onOpenModal={openModal} />
      <Contact />
      <Footer />
      <JokeModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSubmit={handleJokeSubmission} 
      />
    </div>
  );
}

export default App;
