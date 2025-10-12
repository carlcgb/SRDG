import React, { Suspense, lazy } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Events from './components/Events';
import Platforms from './components/Platforms';
import CorporateSection from './components/CorporateSection';
import JokeSection from './components/JokeSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StructuredData from './components/StructuredData';
import { useScrollEffects } from './hooks/useScrollEffects';
import { useMascotTilt } from './hooks/useMascotTilt';
import { useJokeModal } from './hooks/useJokeModal';
import { useEventCards } from './hooks/useEventCards';
import { useButtonAnimations } from './hooks/useButtonAnimations';
import { useParallax } from './hooks/useParallax';

// Lazy load the modal component since it's not immediately visible
const JokeModal = lazy(() => import('./components/JokeModal'));

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
      <Suspense fallback={<div>Loading...</div>}>
        <JokeModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onSubmit={handleJokeSubmission} 
        />
      </Suspense>
    </div>
  );
}

export default App;
