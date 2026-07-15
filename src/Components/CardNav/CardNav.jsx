import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from 'react-router-dom';
import ScrollVelocity from '../../TextAnimations/ScrollVelocity/ScrollVelocity';
import "./CardNav.css";

const CardNav = ({
  items,
  currentLanguage = "en",
  customButton = null,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeAll = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  // Setup text for the ticker
  const tickerTexts = currentLanguage === 'en'
    ? ['OSOS Engineering & Consulting  •  Architecture  •  GIS  •  Surveying  •  Planning']
    : ['أسس البناء للاستشارات الهندسية  •  معماري  •  مساحة  •  نظم معلومات جغرافية  •  تخطيط'];

  return (
    <div className={`osos-nav-wrapper ${isMobile ? 'is-mobile' : ''}`}>
      {/* ── Top Engineering Ticker Bar ── */}
      <div className="osos-ticker-bar">
        <ScrollVelocity
          texts={tickerTexts}
          velocity={0.06}
          className="osos-ticker-text"
          numCopies={2}
        />
      </div>

      {/* ── Main Navigation Bar ── */}
      <header className="osos-nav-header">
        <div className="osos-nav-container">
          
          {/* Logo Section */}
          <Link to="/" className="osos-logo-link" onClick={closeAll}>
            <img src="/Images/logo.png" alt="OSOS Logo" className="osos-logo-img" />
            <div className="osos-logo-text">
              <span className="logo-title">OSOS</span>
              <span className="logo-subtitle">{currentLanguage === 'en' ? 'ENGINEERING' : 'للاستشارات الهندسية'}</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          {!isMobile && (
            <nav className="osos-desktop-menu">
              {items.map((group, idx) => (
                <div 
                  key={idx}
                  className="osos-nav-item-group"
                  onMouseEnter={() => setActiveDropdown(idx)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className={`osos-nav-trigger ${activeDropdown === idx ? 'active' : ''}`}>
                    {currentLanguage === 'en' ? group.label_en : group.label_ar}
                    <svg className="osos-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div className={`osos-nav-dropdown ${activeDropdown === idx ? 'show' : ''}`}>
                    <div className="osos-dropdown-grid">
                      {group.links.map((lnk, lIdx) => (
                        <NavLink 
                          key={lIdx}
                          to={lnk.href}
                          className={({ isActive }) => `osos-dropdown-link ${isActive ? 'active' : ''}`}
                          onClick={closeAll}
                        >
                          <div className="link-bullet"></div>
                          <span className="link-text">{currentLanguage === 'en' ? lnk.label_en : lnk.label_ar}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          )}

          {/* Action Area (Lang switcher & Mobile Hamburger) */}
          <div className="osos-action-area">
            {customButton}
            
            {isMobile && (
              <button 
                className={`osos-hamburger ${mobileMenuOpen ? 'open' : ''}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ── Mobile Sidebar Drawer ── */}
      {isMobile && (
        <>
          <div 
            className={`osos-mobile-backdrop ${mobileMenuOpen ? 'show' : ''}`} 
            onClick={closeAll}
          />
          <div className={`osos-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
            
            {/* Drawer Header */}
            <div className="osos-drawer-header">
              <img src="/Images/logo.png" alt="OSOS Logo" className="osos-drawer-logo" />
              <button className="osos-drawer-close" onClick={closeAll}>✕</button>
            </div>

            {/* Drawer Content / Accordions */}
            <div className="osos-drawer-content">
              {items.map((group, idx) => {
                const isExpanded = expandedMobileGroup === idx;
                return (
                  <div key={idx} className="osos-drawer-group">
                    <button 
                      className={`osos-drawer-trigger ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => setExpandedMobileGroup(isExpanded ? null : idx)}
                    >
                      {currentLanguage === 'en' ? group.label_en : group.label_ar}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <div className={`osos-drawer-links ${isExpanded ? 'show' : ''}`}>
                      {group.links.map((lnk, lIdx) => (
                        <NavLink 
                          key={lIdx}
                          to={lnk.href}
                          className={({ isActive }) => `osos-drawer-link ${isActive ? 'active' : ''}`}
                          onClick={closeAll}
                        >
                          {currentLanguage === 'en' ? lnk.label_en : lnk.label_ar}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer with scrolling branding */}
            <div className="osos-drawer-footer">
              <div className="osos-drawer-tagline">
                {currentLanguage === 'en' ? 'Engineering Excellence' : 'التميز الهندسي لمستقبل مستدام'}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default CardNav;
