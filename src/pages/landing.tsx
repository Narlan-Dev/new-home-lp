import { useEffect } from 'react';
import { useLocation } from 'react-router';

// material-ui
import Box from '@mui/material/Box';

// project-imports
import Header from 'components/pages/Header';
import About from 'sections/landing/About';
import Contact from 'sections/landing/Contact';
import EventInfo from 'sections/landing/EventInfo';
import Faq from 'sections/landing/Faq';
import Gifts from 'sections/landing/Gifts';
import Hero from 'sections/landing/Hero';
import Schedule from 'sections/landing/Schedule';
import { scrollToSection } from 'utils/scroll';

// ==============================|| LANDING PAGE ||============================== //

export default function Landing() {
  const { hash } = useLocation();

  // abre direto na seção quando a URL já traz a âncora (ex.: /#presentes)
  useEffect(() => {
    if (!hash) return;
    const timeout = setTimeout(() => scrollToSection(hash.replace('#', '')), 100);
    return () => clearTimeout(timeout);
  }, [hash]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Header />
      <Box component="main">
        <Hero />
        <EventInfo />
        <About />
        <Schedule />
        <Gifts />
        <Faq />
        <Contact />
      </Box>
    </Box>
  );
}
