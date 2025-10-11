// Variables globales
let isScrolling = false;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeEventCards();
    initializeJokeForm();
    initializeSmoothScrolling();
    initializeMascotTilt();
});

// Navigation scroll effect
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            requestAnimationFrame(function() {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
}

// Effets de scroll pour les éléments
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les cartes d'événements
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });

    // Observer les cartes de plateformes
    const platformCards = document.querySelectorAll('.platform-card');
    platformCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}

// Effet de tilt pour les cartes d'événements
function initializeEventCards() {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    // Don't apply tilt effects on mobile devices
    if (isMobile) {
        return;
    }
    
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// Formulaire de blague
function initializeJokeForm() {
    const jokeForm = document.getElementById('jokeForm');
    
    if (jokeForm) {
        jokeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleJokeSubmission();
        });
    }
}

// Ouvrir le modal de blague
function openJokeForm() {
    const modal = document.getElementById('jokeModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Animation d'entrée
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.8)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 10);
    }
}

// Fermer le modal de blague
function closeJokeForm() {
    const modal = document.getElementById('jokeModal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.8)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Gérer la soumission de blague
function handleJokeSubmission() {
    const form = document.getElementById('jokeForm');
    const formData = new FormData(form);
    
    const jokeData = {
        title: formData.get('jokeTitle'),
        content: formData.get('jokeContent'),
        author: formData.get('jokeAuthor') || 'Anonyme'
    };
    
    // Simulation d'envoi (remplacer par vraie logique)
    console.log('Blague soumise:', jokeData);
    
    // Afficher message de confirmation
    showNotification('Merci pour votre blague ! Nous la lirons lors de nos prochains spectacles.', 'success');
    
    // Fermer le modal et réinitialiser le formulaire
    closeJokeForm();
    form.reset();
}

// Afficher une notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles de la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#F64A3E'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        text-transform: uppercase;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Navigation fluide
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Ajuster pour la navbar fixe
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Effet de parallaxe pour le hero
function initializeParallax() {
    const hero = document.querySelector('.hero');
    const mascot = document.querySelector('.mascot-placeholder');
    
    if (hero && mascot) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            mascot.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Animation des boutons au survol
function initializeButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Fermer le modal en cliquant à l'extérieur
document.addEventListener('click', function(e) {
    const modal = document.getElementById('jokeModal');
    if (e.target === modal) {
        closeJokeForm();
    }
});

// Fermer le modal avec la touche Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeJokeForm();
    }
});

// Animation de chargement de la page
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Gestion des erreurs
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// Fonction utilitaire pour déboguer
function debug(message, data = null) {
    if (console && console.log) {
        console.log(`[DEBUG] ${message}`, data || '');
    }
}

// Effet de tilt pour la mascotte
function initializeMascotTilt() {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    // Don't apply tilt effects on mobile devices
    if (isMobile) {
        return;
    }
    
    const mascotPlaceholder = document.querySelector('.mascot-placeholder');
    const mascot = document.querySelector('.mascot');
    
    if (mascotPlaceholder && mascot) {
        mascotPlaceholder.addEventListener('mousemove', function(e) {
            const rect = mascotPlaceholder.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            mascot.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            mascot.style.filter = 'drop-shadow(5px 10px 15px rgba(0,0,0,0.4))';
        });
        
        mascotPlaceholder.addEventListener('mouseleave', function() {
            mascot.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            mascot.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))';
        });
    }
}

// Initialiser les animations supplémentaires
document.addEventListener('DOMContentLoaded', function() {
    initializeParallax();
    initializeButtonAnimations();
});

// Export des fonctions pour utilisation externe si nécessaire
window.LaSoireeDuRire = {
    openJokeForm,
    closeJokeForm,
    showNotification
};
