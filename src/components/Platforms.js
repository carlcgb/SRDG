import React from 'react';

const Platforms = () => {
  const platforms = [
    {
      icon: "📘",
      title: "Facebook",
      description: "Restez informés de nos événements",
      href: "#"
    },
    {
      icon: "📷",
      title: "Instagram",
      description: "Photos et vidéos de nos spectacles",
      href: "#"
    },
    {
      icon: "🐦",
      title: "Twitter",
      description: "Actualités et blagues du jour",
      href: "#"
    },
    {
      icon: "📺",
      title: "YouTube",
      description: "Extraits de nos meilleurs moments",
      href: "#"
    }
  ];

  return (
    <section className="platforms-section">
      <div className="container">
        <h2 className="section-title">Suivez-nous</h2>
        <div className="platforms-grid">
          {platforms.map((platform, index) => (
            <a key={index} href={platform.href} className="platform-card">
              <div className="platform-icon">{platform.icon}</div>
              <h3>{platform.title}</h3>
              <p>{platform.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Platforms;
