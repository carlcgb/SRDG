import React from 'react';

const Platforms = () => {
  const platforms = [
    {
      icon: "📘",
      title: "Facebook",
      description: "Restez informés de nos événements",
      href: "https://www.facebook.com/lsdrg/"
    },
    {
      icon: "📷",
      title: "Instagram",
      description: "Photos et vidéos de nos spectacles",
      href: "https://www.instagram.com/lsdrdg/"
    },

    {
      icon: "📺",
      title: "TikTok",
      description: "Des clips de nos meilleurs moments",
      href: "https://www.tiktok.com/@carl.cgb"
    }
  ];

  return (
    <section className="platforms-section">
      <div className="container">
        <h2 className="section-title">Suivez-nous</h2>
        <p className="platforms-description">
          Restez connectés avec <a href="#evenements" className="internal-link">La Soirée du Rire</a> ! 
          Découvrez nos <a href="#evenements" className="internal-link">prochains spectacles d'humour</a> et 
          nos <a href="#corporate" className="internal-link">services d'animation corporative</a>.
        </p>
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
