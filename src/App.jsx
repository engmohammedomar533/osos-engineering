import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import Login from './Login'; // Import the Login component
import AdminPanel from './AdminPanel'; // Import the AdminPanel component
import useSEO from './hooks/useSEO';

import './index.css'; // Import the main CSS file
import FloatingIcons from './FloatingIcons';
import ScrollToTop from './ScrollToTop';
import BackToTopButton from './BackToTopButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import TextType from './TextAnimations/TextType/TextType';
import PageWrapper from './Components/PageWrapper';
import CardNav from './Components/CardNav/CardNav';
import LogoLoop from './Animations/LogoLoop/LogoLoop';

const AboutUs = React.lazy(() => import('./AboutUs'));
const Gallery = React.lazy(() => import('./Gallery'));
const Projects = React.lazy(() => import('./Projects.jsx'));
const ArchitecturalIdentity = React.lazy(() => import('./ArchitecturalIdentity'));
const ServicesPage = React.lazy(() => import('./ServicesPageNew'));
const OrganizationalChart = React.lazy(() => import('./Components/OrganizationalChart'));
const PartnersOfSuccess = React.lazy(() => import('./PartnersOfSuccess'));
const Credentials = React.lazy(() => import('./Credentials'));
const OurLocations = React.lazy(() => import('./OurLocations'));


const navItems = [
  {
    label_en: "Main",
    label_ar: "الرئيسية",
    bgColor: "#f0f0f0", 
    textColor: "#333", 
    links: [
      { label_en: "Home", label_ar: "الرئيسية", href: "/", ariaLabel: "Go to Home page" },
      { label_en: "Services", label_ar: "الخدمات", href: "/services", ariaLabel: "Go to Services page" },
      { label_en: "Projects", label_ar: "المشاريع", href: "/projects", ariaLabel: "Go to Projects page" },
      { label_en: "Architectural Identity", label_ar: "الهوية المعمارية", href: "/architectural-identity", ariaLabel: "Go to Architectural Identity page" },
      { label_en: "Partners of Success", label_ar: "شركاء النجاح", href: "/partners-of-success", ariaLabel: "Go to Partners of Success page" },
      { label_en: "Credentials", label_ar: "شهاداتنا", href: "/credentials", ariaLabel: "Go to Credentials page" },
    ],
  },
  {
    label_en: "More",
    label_ar: "المزيد",
    bgColor: "#e0e0e0", 
    textColor: "#333", 
    links: [
      { label_en: "Organizational Structure", label_ar: "الهيكل الإداري", href: "/team", ariaLabel: "Go to Team page" },
      { label_en: "About Us", label_ar: "من نحن", href: "/about", ariaLabel: "Go to About Us page" },
      { label_en: "Our Locations", label_ar: "مواقعنا", href: "/our-locations", ariaLabel: "Go to Our Locations page" },
    ],
  },
];



// Components
const Home = ({ currentLanguage }) => {
  useSEO({
    title: currentLanguage === 'en' ? 'Home' : 'الرئيسية',
    description: currentLanguage === 'en' 
      ? 'OSOS Engineering & Consulting provides expert surveying, architectural design, engineering planning, and GIS consulting services in Saudi Arabia and Egypt.' 
      : 'تقدم أسس البناء للاستشارات الهندسية خدمات المسح الأرضي، التصميم المعماري، التخطيط الهندسي، ونظم المعلومات الجغرافية في المملكة العربية السعودية ومصر.',
    keywords: 'OSOS, OSOS Engineering, surveying, GIS, architectural design, consulting, Makkah, Saudi Arabia, Egypt, أسس البناء'
  });

  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const heroVisual = document.querySelector('.hero-visual');
    const technicalDiagram = document.querySelector('.technical-diagram');

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroVisual.getBoundingClientRect();
      const x = (clientX - left - width / 2) / (width / 2);
      const y = (clientY - top - height / 2) / (height / 2);

      technicalDiagram.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.05)`;
    };

    const handleMouseLeave = () => {
      technicalDiagram.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    };

    if (heroVisual && technicalDiagram) {
      heroVisual.addEventListener('mousemove', handleMouseMove);
      heroVisual.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (heroVisual && technicalDiagram) {
        heroVisual.removeEventListener('mousemove', handleMouseMove);
        heroVisual.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    fetch('/api/get_partner_logos', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const BLOB_STORAGE_BASE_URL = 'https://pc5a0jgn4xie1mys.public.blob.vercel-storage.com';
        const formatted = data.map(logo => {
          const cleanedPath = logo.logo_url.replace(/ /g, '%20');
          const logoUrl = cleanedPath.startsWith('http')
            ? cleanedPath
            : `${BLOB_STORAGE_BASE_URL}${cleanedPath.startsWith('/') ? '' : '/'}${cleanedPath}`;
          return {
            ...logo,
            src: logoUrl,
            alt: logo.name
          };
        });
        setLogos(formatted);
      })
      .catch(err => console.error('Error fetching logos:', err));
  }, []);

  return (
    <>
      <section className="hero page-section" id="home">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <TextType
                text={currentLanguage === 'en' ? 'Engineering Excellence' : 'التميز الهندسي'}
                as="h1"
                className="hero-title"
                data-en="Engineering Excellence"
                data-ar="التميز الهندسي"
                textColors={['#1B365C']}
              />
              <TextType
                key={currentLanguage}
                text={currentLanguage === 'en' ? 'Innovative solutions for complex engineering challenges' : 'حلول مبتكرة للتحديات الهندسية المعقدة'}
                className="hero-subtitle"
                textColors={['#1B365C']}
              />
              <div className="hero-actions">
                <Link to="/services" className="btn btn--primary" data-en="Our Services" data-ar="خدماتنا">
                  {currentLanguage === 'en' ? 'Our Services' : 'خدماتنا'}
                </Link>
                <Link to="/projects" className="btn btn--primary" data-en="View All Projects" data-ar="عرض كل المشاريع">
                  {currentLanguage === 'en' ? 'View Projects' : 'عرض كل المشاريع'}
                </Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="technical-diagram hero-image">
                <div className="diagram-elements" style={{ backgroundImage: 'url(/Images/OsosLogoHome.png)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Logo Loop */}
      {logos.length > 0 && (
        <section className="home-partners-section">
          <div className="container">
            <h3 className="home-partners-title">
              {currentLanguage === 'en' ? 'Partners of Success' : 'شركاء النجاح'}
            </h3>
            <LogoLoop 
              logos={logos} 
              speed={75} 
              logoHeight={110} 
              gap={40} 
              pauseOnHover={true} 
              fadeOut={false} 
              scaleOnHover={true} 
              isRTL={currentLanguage === 'ar'} 
            />
          </div>
        </section>
      )}
    </>
  );
};

const BLOB_STORAGE_BASE_URL = 'https://pc5a0jgn4xie1mys.public.blob.vercel-storage.com';

const Services = ({ currentLanguage }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get_services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching services:', err);
        setLoading(false);
      });
  }, []);

  const featuredServices = services.slice(0, 6);

  const getFallbackIcon = (id) => {
    const icons = {
      1: "🏛️", 2: "🏗️", 3: "⚙️", 4: "🔌", 5: "🧯", 6: "🔎",
      7: "🏪", 8: "🏢", 9: "🛣️", 10: "📊", 11: "🛋️", 12: "🌳",
      13: "💻", 14: "🌍", 15: "🗺️"
    };
    return icons[id] || "🛠️";
  };

  return (
    <section className="services page-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" data-en="Our Services" data-ar="خدماتنا">
            {currentLanguage === 'en' ? 'Our Services' : 'خدماتنا'}
          </h2>
          <p className="section-subtitle" data-en="Comprehensive engineering solutions for every need" data-ar="حلول هندسية شاملة لكل الاحتياجات">
            {currentLanguage === 'en' ? 'Comprehensive engineering solutions for every need' : 'حلول هندسية شاملة لكل الاحتياجات'}
          </p>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="skeleton-loader" style={{ height: '100px', borderRadius: '8px', background: '#e0e0e0', width: '100%', maxWidth: '400px', margin: '0 auto' }}></div>
          </div>
        ) : (
          <div className="services-grid">
            {featuredServices.map(service => (
              <div className="service-card featured" key={service.id}>
                {service.icon_url ? (
                  <img src={`${BLOB_STORAGE_BASE_URL}${service.icon_url}`} alt="" className="service-icon" style={{ width: '40px', height: '40px', objectFit: 'contain', marginBottom: '1rem' }} />
                ) : (
                  <span className="service-icon">{getFallbackIcon(service.id)}</span>
                )}
                <h3 className="service-title">{currentLanguage === 'en' ? service.title_en : service.title_ar}</h3>
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/services" className="btn btn--primary" data-en="View All Services" data-ar="عرض كل الخدمات">
            {currentLanguage === 'en' ? 'View All Services' : 'عرض كل الخدمات'}
          </Link>
        </div>
      </div>
    </section>
  );
};



            


const Team = ({ currentLanguage }) => {
  return (
    <section className="team page-section">
      <div className="container">
        <OrganizationalChart currentLanguage={currentLanguage} />
      </div>
    </section>
  );
};

const LoadingScreen = ({ currentLanguage }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4300); // Adjust time as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-screen ${!isLoading ? 'hidden' : ''}`}>
      <div className="engineering-animation">
        <div className="blueprint-bg"></div>
        <div className="model-container">
          <div className="model">
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face right"></div>
            <div className="face left"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
            <div className="fractal-cube-container">
              <div className="fractal-cube">
                <div className="face front"></div>
                <div className="face back"></div>
                <div className="face right"></div>
                <div className="face left"></div>
                <div className="face top"></div>
                <div className="face bottom"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="annotations">
          <div className="annotation a1"><span>X: 75mm</span></div>
          <div className="annotation a2"><span>Y: 75mm</span></div>
          <div className="annotation a3"><span>Z: 75mm</span></div>
          <div className="annotation a4"><span>Material: Steel</span></div>
          <div className="annotation a5"><span>Stress: 250MPa</span></div>
        </div>
        <div className="particle-system"></div>
      </div>
      <div className="loading-text">
        <span className="loading-title" data-en="Building Excellence" data-ar="نبني التميز">
          {currentLanguage === 'en' ? 'Building Excellence' : 'نبني التميز'}
        </span>
        <span className="loading-subtitle" data-en="Engineering the Future" data-ar="نصمم المستقبل">
          {currentLanguage === 'en' ? 'Engineering the Future' : 'نصمم المستقبل'}
        </span>
      </div>
    </div>
  );
};

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (e) {
    return false;
  }
};

function App() {
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('language') || 'en');
  const [isRTL, setIsRTL] = useState(currentLanguage === 'ar');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
  const [formMessage, setFormMessage] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('loggedIn', 'true'); // Persist login status
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && isTokenValid(token)) {
      setIsLoggedIn(true);
      localStorage.setItem('loggedIn', 'true');
    } else {
      setIsLoggedIn(false);
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('authToken');
    }
  }, []);

  // Proactive background session check & window focus observer
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkSession = () => {
      const token = localStorage.getItem('authToken');
      if (!token || !isTokenValid(token)) {
        setIsLoggedIn(false);
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('authToken');
        alert(currentLanguage === 'en' 
          ? 'Your session has expired. Please log in again.' 
          : 'لقد انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.');
      }
    };

    // Check periodically every 10 seconds
    const interval = setInterval(checkSession, 10000);
    
    // Check instantly when user switches back to this tab
    window.addEventListener('focus', checkSession);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkSession);
    };
  }, [isLoggedIn, currentLanguage]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLanguage);
  }, [isRTL, currentLanguage]);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cursor and Mobile Gyroscope parallax effect for the engineering blueprint grid
  useEffect(() => {
    let ticking = false;

    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;
          
          // Calculate translate offset from -30px to 30px (increased range for beautiful effect)
          const offsetX = ((clientX / innerWidth) - 0.5) * 60;
          const offsetY = ((clientY / innerHeight) - 0.5) * 60;
          
          document.documentElement.style.setProperty('--grid-offset-x', `${offsetX}px`);
          document.documentElement.style.setProperty('--grid-offset-y', `${offsetY}px`);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleDeviceOrientation = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const { gamma, beta } = e;
          if (gamma !== null && beta !== null) {
            // Map tilt angles to -30px to 30px translation offsets
            const offsetX = Math.max(-30, Math.min(30, gamma * 1.0));
            const offsetY = Math.max(-30, Math.min(30, (beta - 45) * 1.0)); // offset by 45deg standard holding tilt
            
            document.documentElement.style.setProperty('--grid-offset-x', `${offsetX}px`);
            document.documentElement.style.setProperty('--grid-offset-y', `${offsetY}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const hasMouse = window.matchMedia('(hover: hover)').matches;
    if (hasMouse) {
      window.addEventListener('mousemove', handleMouseMove);
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  // Intersection Observer for fade-in effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .service-card, .project-card, .team-card').forEach(el => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('section, .service-card, .project-card, .team-card').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'ar' : 'en';
    setCurrentLanguage(newLang);
    setIsRTL(newLang === 'ar');
    localStorage.setItem('language', newLang);
    setFormMessage(null); // Clear form message on language switch
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const phone = e.target.phone.value;
    const email = e.target.email.value;
    const message = e.target.message.value;

    try {
      // Send to Formspree
      const formspreeResponse = await fetch('https://formspree.io/f/xgvldwvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, email, message }),
      });

      // Save to database
      const dbResponse = await fetch('/api/save-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, email, message }),
      });

      if (formspreeResponse.ok && dbResponse.ok) {
        setFormMessage({
          type: 'success',
          text: currentLanguage === 'en' ? 'Message sent and saved successfully!' : 'تم إرسال الرسالة وحفظها بنجاح!',
        });
        e.target.reset(); // Clear the form
      } else {
        setFormMessage({
          type: 'error',
          text: currentLanguage === 'en' ? 'Failed to send message.' : 'فشل إرسال الرسالة.',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormMessage({
        type: 'error',
        text: currentLanguage === 'en' ? 'An error occurred while sending your message.' : 'حدث خطأ أثناء إرسال رسالتك.',
      });
    }
  };

  return (
    <Router>
      <CardNav 
        items={navItems}
        currentLanguage={currentLanguage}
        customButton={
          <button className="lang-switch" onClick={toggleLanguage}>
            <span className="lang-text">{currentLanguage === 'en' ? 'العربية' : 'English'}</span>
          </button>
        }
      />
      <ScrollToTop />
      <LoadingScreen currentLanguage={currentLanguage} />

      {/* Engineering Grid Background */}
      <div className="engineering-grid"></div>

      {/* Floating Engineering Elements */}
      <FloatingIcons />
      <div className="floating-elements"></div>
      <BackToTopButton />
      <Suspense fallback={<div />}>
        <Routes>
          <Route path="/" element={<PageWrapper><Home currentLanguage={currentLanguage} /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><ServicesPage currentLanguage={currentLanguage} /></PageWrapper>} />
          <Route path="/projects" element={<PageWrapper><Projects currentLanguage={currentLanguage} /></PageWrapper>} />
          <Route path="/team" element={<PageWrapper><Team currentLanguage={currentLanguage} /></PageWrapper>} />
          <Route path="/gallery" element={<PageWrapper><Gallery currentLanguage={currentLanguage} /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><AboutUs currentLanguage={currentLanguage} /></PageWrapper>} />
          <Route path="/architectural-identity" element={<PageWrapper><ArchitecturalIdentity currentLanguage={currentLanguage} /></PageWrapper>} />
          <Route path="/partners-of-success" element={<PageWrapper><PartnersOfSuccess currentLanguage={currentLanguage} /></PageWrapper>} />
          <Route path="/credentials" element={<PageWrapper><Credentials currentLanguage={currentLanguage} /></PageWrapper>} />
          <Route path="/our-locations" element={<PageWrapper><OurLocations currentLanguage={currentLanguage} /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login onLogin={handleLogin} /></PageWrapper>} />
          <Route
            path="/admin"
            element={isLoggedIn ? <PageWrapper><AdminPanel onLogout={() => setIsLoggedIn(false)} /></PageWrapper> : <Navigate to="/login" replace />}
          />
        </Routes>
      </Suspense>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" data-en="Contact Us" data-ar="اتصل بنا">
              {currentLanguage === 'en' ? 'Contact Us' : 'اتصل بنا'}
            </h2>
            <p className="section-subtitle" data-en="Get in touch for your engineering needs" data-ar="تواصل معنا لاحتياجاتك الهندسية">
              {currentLanguage === 'en' ? 'Get in touch for your engineering needs' : 'تواصل معنا لاحتياجاتك الهندسية'}
            </p>
          </div>
          <div className="contact-content">
            <div className="contact-form">
              <form onSubmit={handleContactFormSubmit}>
                {formMessage && (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className={`form-message ${formMessage.type}`}>
                      {formMessage.text}
                    </div>
                  </div>
                )}
                <div className="form-group" style={currentLanguage === 'ar' ? { textAlign: 'right' } : {}}>
                  <label className="form-label" data-en="Name" data-ar="الاسم" style={currentLanguage === 'ar' ? { textAlign: 'right', display: 'block' } : {}}>
                    {currentLanguage === 'en' ? 'Name' : 'الاسم'}
                  </label>
                  <input type="text" className="form-control" id="name" required />
                </div>
                <div className="form-group" style={currentLanguage === 'ar' ? { textAlign: 'right' } : {}}>
                  <label className="form-label" data-en="Phone Number" data-ar="رقم الهاتف" style={currentLanguage === 'ar' ? { textAlign: 'right', display: 'block' } : {}}>
                    {currentLanguage === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                  </label>
                  <input type="tel" className="form-control" id="phone" required />
                </div>
                <div className="form-group" style={currentLanguage === 'ar' ? { textAlign: 'right' } : {}}>
                  <label className="form-label" data-en="Email" data-ar="البريد الإلكتروني" style={currentLanguage === 'ar' ? { textAlign: 'right', display: 'block' } : {}}>
                    {currentLanguage === 'en' ? 'Email' : 'البريد الإلكتروني'}
                  </label>
                  <input type="email" className="form-control" id="email" required />
                </div>
                <div className="form-group" style={currentLanguage === 'ar' ? { textAlign: 'right' } : {}}>
                  <label className="form-label" data-en="Message" data-ar="الرسالة" style={currentLanguage === 'ar' ? { textAlign: 'right', display: 'block' } : {}}>
                    {currentLanguage === 'en' ? 'Message' : 'الرسالة'}
                  </label>
                  <textarea className="form-control" id="message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn btn--primary btn--full-width" data-en="Send Message" data-ar="إرسال الرسالة">
                  {currentLanguage === 'en' ? 'Send Message' : 'إرسال الرسالة'}
                </button>
              </form>
            </div>
            <div className="contact-info">
              <div className="info-item">
                <h4 data-en="Address" data-ar="العنوان">
                  {'📍 ' + (currentLanguage === 'en' ? 'Address' : 'العنوان')}
                </h4>
                <p dangerouslySetInnerHTML={{ __html:
                  currentLanguage === 'en'
                    ? "Main headquarters: Makkah - Al-Rusaifa district - Abdullah Arif street - near the Haramain train station - next to the mobile market<br />Al-Ahsa branch: Hofuf - Al-Rawda district - Al-Khaleej street - Al-Tamimi building - third floor<br />Egypt branch: Cairo - Maadi district - 4 75th street with 12th street"
                    : "المقر الرئيسي : مكة المكرمة - حي الرصيفة - ش عبدالله عريف - بالقرب من محطة قطار الحرمين - بجوار سوق الجوالات<br />فرع الإحساء : الهفوف - حي الروضة - ش الخليج - عمارة التميمي - الدور الثالث<br />فرع مصر : القاهرة – حي المعادي – 4 شارع 75 مع شارع 12"
                }} />
              </div>
              <div className="info-item">
                <h4 data-en="Phone" data-ar="الهاتف">
                  {'📞 ' + (currentLanguage === 'en' ? 'Phone' : 'الهاتف')}
                </h4>
                <p>
                  {currentLanguage === 'en' ? (
                    <>
                      Main Branch: <a href="tel:00966545181910" className='phone-number'>00966545181910</a><br />
                      Al-Ahsa Branch: <a href="tel:00966566497730" className='phone-number'>00966566497730</a><br />
                      Cairo Branch: <a href="tel:00201116999260" className='phone-number'>00201116999260</a>
                    </>
                  ) : (
                    <>
                      الفرع الرئيسي : <a href="tel:00966545181910" className='phone-number ltr-text'>00966545181910</a><br />
                      فرع الاحساء : <a href="tel:00966566497730" className='phone-number ltr-text'>00966566497730</a><br />
                      فرع القاهرة : <a href="tel:00201116999260" className='phone-number ltr-text'>00201116999260</a>
                    </>
                  )}
                </p>
              </div>
              <div className="info-item">
                <h4 data-en="Email" data-ar="البريد الإلكتروني">
                  {'📧 ' + (currentLanguage === 'en' ? 'Email' : 'البريد الإلكتروني')}
                </h4>
                <p>info@ososbnaa.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      <footer className="footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-column footer-brand">
              <div className="logo-assembly">
                <img src="/Images/logo.png" alt="OSOS Logo" className="logo-img" loading="lazy" />
                <span className="brand-text">OSOS</span>
              </div>
              <p className="footer-tagline" data-en="Engineering Excellence for a Sustainable Future" data-ar="التميز الهندسي لمستقبل مستدام">
                {currentLanguage === 'en' ? 'Engineering Excellence for a Sustainable Future' : 'التميز الهندسي لمستقبل مستدام'}
              </p>
            </div>
            <div className="footer-column footer-links">
              <h4 className="footer-heading" data-en="Quick Links" data-ar="روابط سريعة">
                {currentLanguage === 'en' ? 'Quick Links' : 'روابط سريعة'}
              </h4>
              <ul className="footer-list">
                <li><NavLink to="/services" className="footer-link" data-en="Services" data-ar="الخدمات">
                  {currentLanguage === 'en' ? 'Services' : 'الخدمات'}
                </NavLink></li>
                <li><NavLink to="/projects" className="footer-link" data-en="Projects" data-ar="المشاريع">
                  {currentLanguage === 'en' ? 'Projects' : 'المشاريع'}
                </NavLink></li>
                <li><NavLink to="/team" className="footer-link" data-en="Our Team" data-ar="فريقنا">
                  {currentLanguage === 'en' ? 'Our Team' : 'فريقنا'}
                </NavLink></li>
                <li><NavLink to="/about" className="footer-link" data-en="About Us" data-ar="من نحن">
                  {currentLanguage === 'en' ? 'About Us' : 'من نحن'}
                </NavLink></li>
                <li><NavLink to="/our-locations" className="footer-link" data-en="Our Locations" data-ar="مواقعنا">
                  {currentLanguage === 'en' ? 'Our Locations' : 'مواقعنا'}
                </NavLink></li>
              </ul>
            </div>
            <div className="footer-column footer-contact">
              <h4 className="footer-heading" data-en="Contact Us" data-ar="اتصل بنا">
                {currentLanguage === 'en' ? 'Contact Us' : 'اتصل بنا'}
              </h4>
              <div className="contact-info-item">
                <p dangerouslySetInnerHTML={{ __html: '📍 ' + (currentLanguage === 'en'
                    ? "Main headquarters: Makkah - Al-Rusaifa district - Abdullah Arif street - near the Haramain train station - next to the mobile market<br />Al-Ahsa branch: Hofuf - Al-Rawda district - Al-Khaleej street - Al-Tamimi building - third floor<br />Egypt branch: Cairo - Maadi district - 4 75th street with 12th street"
                    : "المقر الرئيسي : مكة المكرمة - حي الرصيفة - ش عبدالله عريف - بالقرب من محطة قطار الحرمين - بجوار سوق الجوالات<br />فرع الإحساء : الهفوف - حي الروضة - ش الخليج - عمارة التميمي - الدور الثالث<br />فرع مصر : القاهرة – حي المعادي – 4 شارع 75 مع شارع 12")
                }}>
                </p>
              </div>
              <div className="contact-info-item">
                <p dangerouslySetInnerHTML={{ __html: '📞 ' + (currentLanguage === 'en'
                    ? "Main Branch: <a href='tel:00966545181910' class='phone-number'>00966545181910</a><br />Al-Ahsa Branch: <a href='tel:00966566497730' class='phone-number'>00966566497730</a><br />Cairo Branch: <a href='tel:00201116999260' class='phone-number'>00201116999260</a>"
                    : "الفرع الرئيسي : <a href='tel:00966545181910' class='phone-number'>00966545181910</a><br />فرع الاحساء : <a href='tel:00966566497730' class='phone-number'>00966566497730</a><br />فرع القاهرة : <a href='tel:00201116999260' class='phone-number'>00201116999260</a>")
                }}></p>
              </div>
              <div className="contact-info-item">
                <p>📧 info@ososbnaa.com</p>
              </div>
            </div>
            <div className="footer-column footer-social">
              <h4 className="footer-heading" data-en="Follow Us" data-ar="تابعنا">
                {currentLanguage === 'en' ? 'Follow Us' : 'تابعنا'}
              </h4>
              <div className="social-icons">
                <a href="https://www.facebook.com/profile.php?id=61564818485444&rdid=ZhLi2rJ8ZWSRc7ZV&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CiMDZWsgV%2F#" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.64 9.5 5.45V7.46H6.17v4.09h3.33V23.5h4.33V11.55h3.8L18.77 7.46z"/></svg></a>
                <a href="https://x.com/ososbnaa?s=21" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <a href="https://wa.me/message/A3HLO7PKZADNE1" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
</svg></a>
                <a href="https://www.instagram.com/ososelbnaa?igsh=MTY5OGM4ZHdjaXkyMg==" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg></a>
                <a href="https://www.linkedin.com/company/2ososelbnaa/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom" style={{textAlign: 'center', justifyContent: 'center'}}>
            <p className="copyright-text">&copy; 2025 Osos Consulting. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </Router>
  );
}

export default App;
