import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './AboutUs.css';
import ShinyText from './TextAnimations/ShinyText/ShinyText.jsx';
import AnimatedContent from './Animations/AnimatedContent/AnimatedContent.jsx';
import useSEO from './hooks/useSEO';

const AboutUs = ({ currentLanguage }) => {
  useSEO({
    title: currentLanguage === 'en' ? 'About Us' : 'من نحن',
    description: currentLanguage === 'en'
      ? 'Learn about OSOS Engineering history, choose our surveying and GIS services, and discover our work methodology.'
      : 'تعرف على تاريخ أسس البناء للاستشارات الهندسية، لماذا تختار خدماتنا الهندسية، واكتشف منهجية عملنا الاحترافية.',
    keywords: 'About OSOS, engineering consultant history, surveying methodology, GIS consultancy, أسس البناء'
  });

  const [aboutUsData, setAboutUsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({}); // track accordion states

  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        const response = await axios.get('/api/get_about_us');
        setAboutUsData(response.data[0]);
        
        // Initialize first section of methodology as expanded by default
        if (response.data[0]) {
          setExpandedSections({ 0: true });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching about us data:', error);
        setLoading(false);
      }
    };

    fetchAboutUsData();
  }, []);

  useEffect(() => {
    // Register the plugin if not already registered
    gsap.registerPlugin(ScrollTrigger);
    
    // Wait for the accordion CSS height transitions (0.4s) to fully finish before recalculating trigger points
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 450);

    return () => clearTimeout(timer);
  }, [expandedSections]);

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="about-us-container page-section">
        <div className="about-loading">Loading About details...</div>
      </div>
    );
  }

  if (!aboutUsData) {
    return (
      <div className="about-us-container page-section">
        <div className="about-error">No content available.</div>
      </div>
    );
  }

  const content = {
    en: {
      title: aboutUsData.title_en,
      intro: aboutUsData.description_en,
      whyChooseUsTitle: aboutUsData.why_choose_us_title_en,
      whyChooseUsList: aboutUsData.why_choose_us_list_en,
      workMethodology: aboutUsData.work_methodology_en,
      statsHeader: 'Osos in Numbers',
    },
    ar: {
      title: aboutUsData.title_ar,
      intro: aboutUsData.description_ar,
      whyChooseUsTitle: aboutUsData.why_choose_us_title_ar,
      whyChooseUsList: aboutUsData.why_choose_us_list_ar,
      workMethodology: aboutUsData.work_methodology_ar,
      statsHeader: 'أسس في أرقام',
    }
  };

  const statsData = {
    en: [
      { number: '1437 H', label: 'Established (2016 G)' },
      { number: '15+', label: 'Major Completed Projects' },
      { number: 'ISO 9001', label: 'Quality & Process Certified' },
      { number: '100%', label: 'Excellence & Commitment' }
    ],
    ar: [
      { number: '١٤٣٧ هـ', label: 'تأسست في مكة (٢٠١٦ م)' },
      { number: '+١٥', label: 'مشاريع كبرى منفذة' },
      { number: 'ISO 9001', label: 'شهادة الجودة العالمية' },
      { number: '١٠٠٪', label: 'التزام ودقة هندسية' }
    ]
  };

  const currentContent = content[currentLanguage];
  const currentStats = statsData[currentLanguage];

  return (
    <div className="about-us-container page-section">
      {/* Hero Section Split-Layout */}
      <div className="about-hero-section">
        <div className="about-hero-text">
          <AnimatedContent delay={0.1}>
            <h1 className="about-page-title">{currentContent.title}</h1>
          </AnimatedContent>
          <AnimatedContent delay={0.2}>
            <p className="about-intro-paragraph">{currentContent.intro}</p>
          </AnimatedContent>
        </div>

        <div className="about-hero-stats">
          <AnimatedContent delay={0.25}>
            <h3 className="stats-grid-header">{currentContent.statsHeader}</h3>
          </AnimatedContent>
          <div className="stats-badge-grid">
            {currentStats.map((stat, idx) => (
              <AnimatedContent key={idx} delay={0.3 + idx * 0.08}>
                <div className="stat-badge-card">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </div>

      <div className="about-section-divider"></div>

      {/* "Why Choose Us" Modern Card Grid */}
      <div className="why-choose-section">
        <AnimatedContent delay={0.3}>
          <h2 className="about-sub-title">{currentContent.whyChooseUsTitle}</h2>
        </AnimatedContent>
        
        <div className="why-choose-grid">
          {currentContent.whyChooseUsList.map((item, index) => (
            <AnimatedContent key={index} delay={0.4 + index * 0.08}>
              <div className="why-choose-card">
                <div className="why-choose-card-badge">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <p className="why-choose-card-text">{item}</p>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>

      <div className="about-section-divider"></div>

      {/* "Work Methodology" Vertical Interactive Timeline */}
      <div className="methodology-section">
        <AnimatedContent delay={0.5}>
          <h2 className="about-sub-title">{currentContent.workMethodology.title}</h2>
        </AnimatedContent>

        <div className="timeline-container">
          <div className="timeline-track-line"></div>

          {currentContent.workMethodology.sections.map((section, sectionIndex) => {
            const isExpanded = !!expandedSections[sectionIndex];
            
            return (
              <AnimatedContent key={sectionIndex} delay={0.6 + sectionIndex * 0.1}>
                <div className={`timeline-step-block ${isExpanded ? 'active' : ''}`}>
                  {/* Timeline Pulse Marker */}
                  <div className="timeline-pulse-node" onClick={() => toggleSection(sectionIndex)}>
                    <div className="pulse-dot"></div>
                  </div>

                  {/* Step Card Accordion */}
                  <div className="timeline-card">
                    <div 
                      className="timeline-card-header" 
                      onClick={() => toggleSection(sectionIndex)}
                    >
                      <h3>{section.miniTitle}</h3>
                      <span className="accordion-chevron-icon">{isExpanded ? '▲' : '▼'}</span>
                    </div>

                    <div className={`timeline-card-body ${isExpanded ? 'expanded' : 'collapsed'}`}>
                      {section.items && section.items.length > 0 && (
                        <ul className="timeline-bullet-list">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      )}

                      {/* Nested Subsections */}
                      {section.subSections && section.subSections.map((subSection, subSectionIndex) => (
                        <div key={subSectionIndex} className="timeline-nested-block">
                          <h4 className="nested-mini-title">{subSection.miniTitle}</h4>
                          {subSection.items && (
                            <ul className="timeline-bullet-list nested-list">
                              {subSection.items.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                              ))}
                            </ul>
                          )}

                          {/* Nested Sub-Subsections */}
                          {subSection.sections && subSection.sections.map((nestedSection, nestedSectionIndex) => (
                            <div key={nestedSectionIndex} className="timeline-deep-nested-block">
                              <h5 className="deep-nested-mini-title">{nestedSection.miniTitle}</h5>
                              <ul className="timeline-bullet-list deep-nested-list">
                                {nestedSection.items && nestedSection.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedContent>
            );
          })}
        </div>
      </div>
      <div style={{ height: '40px' }}></div>
    </div>
  );
};

export default AboutUs;