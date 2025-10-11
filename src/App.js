import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Events from './components/Events';
import Platforms from './components/Platforms';
import CorporateSection from './components/CorporateSection';
import JokeSection from './components/JokeSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import JokeModal from './components/JokeModal';
import StructuredData from './components/StructuredData';
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
  
  // State for events data (for structured data)
  const [events, setEvents] = React.useState([]);
  
  const handleEventsLoad = (eventsData) => {
    setEvents(eventsData);
  };

  return (
    <div className="App">
      <StructuredData events={events} />
      <Navigation />
      <Hero />
      <Events onEventsLoad={handleEventsLoad} />
      <Platforms />
      <CorporateSection />
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
