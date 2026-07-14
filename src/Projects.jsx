import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Projects.css';
import Carousel from './Components/Carousel/Carousel';
import useSEO from './hooks/useSEO';
import SkeletonCard from './Components/SkeletonCard/SkeletonCard';

const Projects = ({ currentLanguage }) => {
  useSEO({
    title: currentLanguage === 'en' ? 'Our Projects' : 'مشاريعنا',
    description: currentLanguage === 'en'
      ? 'Browse OSOS Engineering portfolio of completed and ongoing projects, including GIS implementations, surveying operations, and architectural designs.'
      : 'تصفح معرض مشاريع أسس البناء للاستشارات الهندسية المنجزة والجاري العمل عليها، بما في ذلك تطبيقات نظم المعلومات الجغرافية، العمليات المساحية والتصاميم المعمارية.',
    keywords: 'OSOS projects portfolio, engineering projects Saudi Arabia, survey works, architectural showcases Makkah, GIS projects, مشاريع هندسية'
  });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  // Drag-to-scroll for desktop filter tabs
  const tabsRef = useRef(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  const onTabsMouseDown = useCallback((e) => {
    dragState.current = { isDown: true, startX: e.pageX - tabsRef.current.offsetLeft, scrollLeft: tabsRef.current.scrollLeft, moved: false };
    tabsRef.current.classList.add('dragging');
  }, []);

  const onTabsMouseLeave = useCallback(() => {
    dragState.current.isDown = false;
    tabsRef.current?.classList.remove('dragging');
  }, []);

  const onTabsMouseUp = useCallback(() => {
    dragState.current.isDown = false;
    tabsRef.current?.classList.remove('dragging');
  }, []);

  const onTabsMouseMove = useCallback((e) => {
    if (!dragState.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    if (Math.abs(walk) > 4) dragState.current.moved = true;
    tabsRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  }, []);

  useEffect(() => {
    fetch('/api/get_projects', { cache: 'no-store' }) // Corrected API endpoint
      .then(response => response.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setActiveCategory('All');
  }, [currentLanguage]);

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling under drawer
  };

  const closeProjectModal = () => {
    setShowProjectModal(false);
    setSelectedProject(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  // Extract unique categories based on active language
  const getUniqueCategories = () => {
    const rawCats = projects.map(p => 
      currentLanguage === 'en' ? p.category : p.category_ar
    ).filter(Boolean);
    return ['All', ...new Set(rawCats)];
  };

  const categories = getUniqueCategories();

  // Filter projects by category
  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => {
        const cat = currentLanguage === 'en' ? p.category : p.category_ar;
        return cat === activeCategory;
      });

  return (
    <div className="projects-page page-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" data-en="Our Projects" data-ar="مشاريعنا">
            {currentLanguage === 'en' ? 'Our Projects' : 'مشاريعنا'}
          </h2>
          <p className="section-subtitle" data-en="Showcasing our engineering achievements" data-ar="عرض إنجازاتنا الهندسية">
            {currentLanguage === 'en' ? 'Showcasing our engineering achievements' : 'عرض إنجازاتنا الهندسية'}
          </p>
        </div>

        {/* Sliding Category Filter Tabs — drag-scrollable on desktop */}
        {!loading && projects.length > 0 && (
          <div className="filter-tabs-container">
            <div
              className="filter-tabs"
              ref={tabsRef}
              onMouseDown={onTabsMouseDown}
              onMouseLeave={onTabsMouseLeave}
              onMouseUp={onTabsMouseUp}
              onMouseMove={onTabsMouseMove}
            >
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    // Don't fire click if the user was dragging
                    if (!dragState.current.moved) setActiveCategory(cat);
                  }}
                >
                  {cat === 'All' ? (currentLanguage === 'en' ? 'All' : 'الكل') : cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Projects Grid Display */}
        {loading ? (
          <div className="projects-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map(project => {
              // Extract first image that is not a video for card preview cover
              const getCardImage = (images) => {
                if (!images || images.length === 0) return '';
                const nonVideo = images.find(img => !img.toLowerCase().endsWith('.mp4') && !img.toLowerCase().endsWith('.webm') && !img.toLowerCase().endsWith('.mov'));
                return nonVideo || images[0];
              };
              const firstImageRaw = getCardImage(project.images);
              const cleanedPath = firstImageRaw
                .replace('/public/OurProjects', '')
                .replace('/OurProjects', '')
                .replace(/^\//, '')
                .replace(/ /g, '%20');
              const cardImageUrl = firstImageRaw
                ? `https://pc5a0jgn4xie1mys.public.blob.vercel-storage.com/${cleanedPath}`
                : '/Images/Back01.jpg';

              const projectVideo = project.images?.find(img => 
                img.toLowerCase().endsWith('.mp4') || 
                img.toLowerCase().endsWith('.webm') || 
                img.toLowerCase().endsWith('.mov')
              );
              let videoUrl = '';
              if (projectVideo) {
                const cleanedVideoPath = projectVideo
                  .replace('/public/OurProjects', '')
                  .replace('/OurProjects', '')
                  .replace(/^\//, '')
                  .replace(/ /g, '%20');
                videoUrl = `https://pc5a0jgn4xie1mys.public.blob.vercel-storage.com/${cleanedVideoPath}`;
              }

              return (
                <div 
                  key={project.id} 
                  className="project-card"
                  onClick={() => openProjectModal(project)}
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                >
                  <div className="project-card-image-wrapper">
                    <img src={cardImageUrl} alt={currentLanguage === 'en' ? project.title : project.title_ar} loading="lazy" />
                    {projectVideo && (
                      <video
                        src={videoUrl}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className={`project-card-hover-video ${hoveredProjectId === project.id ? 'active' : ''}`}
                        ref={el => {
                          if (el) {
                            if (hoveredProjectId === project.id) {
                              el.play().catch(() => {});
                            } else {
                              el.pause();
                              el.currentTime = 0;
                            }
                          }
                        }}
                      />
                    )}
                    <div className="project-card-overlay">
                      <span className="project-card-category-tag">
                        {currentLanguage === 'en' ? project.category : project.category_ar}
                      </span>
                    </div>
                  </div>
                  <div className="project-card-details">
                    <h3>{currentLanguage === 'en' ? project.title : project.title_ar}</h3>
                    <p className="project-card-location">
                      <span className="location-pin-icon">📍</span>
                      {project.location}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-projects-found">
            <p>{currentLanguage === 'en' ? 'No projects found in this category.' : 'لم يتم العثور على مشاريع في هذا القسم.'}</p>
          </div>
        )}

        {/* Modern Split-Screen Detail Drawer */}
        {showProjectModal && selectedProject && (
          <div className="drawer-backdrop" onClick={closeProjectModal}>
            <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
              <button className="drawer-close-btn" onClick={closeProjectModal}>&times;</button>
              
              <div className="drawer-body-layout">
                {/* Left Side: Media Carousel */}
                <div className="drawer-media-column">
                  {(() => {
                    const mediaForProject = [];
                    if (selectedProject.images) {
                      selectedProject.images.forEach(url => {
                        const type = url.endsWith('.mp4') ? 'video' : 'photo';
                        const cleanedPath = url
                          .replace('/public/OurProjects', '')
                          .replace('/OurProjects', '')
                          .replace(/^\//, '')
                          .replace(/ /g, '%20');
                        mediaForProject.push({
                          type: type,
                          url: `https://pc5a0jgn4xie1mys.public.blob.vercel-storage.com/${cleanedPath}`,
                          title: currentLanguage === 'en' ? selectedProject.title : selectedProject.title_ar
                        });
                      });
                    }
                    return mediaForProject.length > 0 ? (
                      <Carousel items={mediaForProject} />
                    ) : (
                      <div className="drawer-no-media">
                        {currentLanguage === 'en' ? 'No media available' : 'لا يوجد وسائط متاحة'}
                      </div>
                    );
                  })()}
                </div>

                {/* Right Side: Specifications and Description */}
                <div className="drawer-info-column">
                  <div className="drawer-header-meta">
                    <span className="drawer-category-badge">
                      {currentLanguage === 'en' ? selectedProject.category : selectedProject.category_ar}
                    </span>
                    <span className="drawer-location-badge">
                      <span className="location-pin-icon">📍</span> {selectedProject.location}
                    </span>
                  </div>

                  <h2 className="drawer-title-heading">
                    {currentLanguage === 'en' ? selectedProject.title : selectedProject.title_ar}
                  </h2>

                  <hr className="drawer-line-divider" />

                  <div className="drawer-description-block">
                    <h4>{currentLanguage === 'en' ? 'Project Description' : 'وصف المشروع'}</h4>
                    <p className="drawer-description-text">
                      {currentLanguage === 'en' ? selectedProject.description_en : selectedProject.description_ar}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;