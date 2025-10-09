import React from 'react';

const Navigation = () => {
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <h1>La Soirée du Rire</h1>
          <span>de Granby</span>
        </div>
        <div className="nav-menu">
          <a 
            href="#evenements" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, '#evenements')}
          >
            Événements
          </a>
          <a 
            href="#contact" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            Contact
          </a>
          <a 
            href="#blague" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, '#blague')}
          >
            Racontez-nous
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
