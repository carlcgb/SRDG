import React, { Suspense, lazy, useMemo, useCallback } from 'react';
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
  // Hooks personnalisés - only run once on mount
  useScrollEffects();
  useMascotTilt();
  useEventCards();
  useButtonAnimations();
  useParallax();
  const { isModalOpen, openModal, closeModal, handleJokeSubmission } = useJokeModal();
  
  // State for events data (for structured data)
  const [events, setEvents] = React.useState([]);
  
  // Memoize the events handler to prevent unnecessary re-renders
  const handleEventsLoad = useCallback((eventsData) => {
    setEvents(eventsData);
  }, []);
  
  // Memoize the structured data to prevent re-renders
  const structuredData = useMemo(() => <StructuredData events={events} />, [events]);

  return (
    <div className="App">
      {structuredData}
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
