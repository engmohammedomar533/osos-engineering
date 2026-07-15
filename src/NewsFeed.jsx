import React, { useState, useEffect } from 'react';
import './NewsFeed.css';
import useSEO from './hooks/useSEO';

const NewsFeed = ({ currentLanguage }) => {
  const lang = currentLanguage || 'en';

  useSEO({
    title: lang === 'en' ? 'News Feed' : 'آخر الأخبار',
    description: lang === 'en'
      ? 'Live construction, real estate, and engineering news feeds from top local and global sources.'
      : 'تغذية مباشرة لآخر أخبار الإنشاءات والعقارات والهندسة من أبرز المصادر المحلية والعالمية.',
  });

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/get_news_feed?lang=${lang}`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(lang === 'en' ? 'Failed to fetch news' : 'فشل تحميل الأخبار');
      }
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [lang]);

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="news-feed-page page-section">
      <div className="container">
        {/* Header Block */}
        <div className="section-header">
          <h2 className="section-title">
            {lang === 'en' ? 'Live News Feed' : 'تغذية الأخبار المباشرة'}
          </h2>
          <p className="section-subtitle">
            {lang === 'en'
              ? 'Real-time engineering and construction updates'
              : 'آخر مستجدات وأخبار الهندسة والإنشاءات لحظة بلحظة'}
          </p>

          <div className="news-status-bar">
            <span className="live-badge">
              <span className="live-dot"></span>
              {lang === 'en' ? 'Live Stream' : 'بث مباشر'}
            </span>
            <button className="news-refresh-btn" onClick={fetchNews} disabled={loading} aria-label="Refresh news">
              🔄 {lang === 'en' ? 'Refresh' : 'تحديث'}
            </button>
          </div>
        </div>

        {/* Content Panel */}
        {loading ? (
          <div className="news-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="news-card skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line line-short"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line line-mid"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="news-error-box">
            <span>⚠️</span>
            <p>{error}</p>
            <button className="btn btn--primary" onClick={fetchNews}>
              {lang === 'en' ? 'Try Again' : 'إعادة المحاولة'}
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="news-empty-box">
            <span>📰</span>
            <p>{lang === 'en' ? 'No recent articles found.' : 'لا توجد مقالات حديثة حالياً.'}</p>
          </div>
        ) : (
          <div className="news-grid">
            {articles.map((item, idx) => (
              <article key={idx} className={`news-card ${item.isMakkah ? 'makkah-priority-card' : ''}`}>
                <div className="news-card-image-wrap">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="news-card-image" loading="lazy" />
                  ) : (
                    <div className="news-blueprint-placeholder">
                      <div className="blueprint-grid-lines"></div>
                      <span className="blueprint-icon">📐</span>
                    </div>
                  )}
                  <span className="news-source-tag">{item.source}</span>
                  {item.isMakkah && (
                    <span className="news-makkah-tag">
                      🕌 {lang === 'en' ? 'Makkah Dev' : 'تطوير مكة'}
                    </span>
                  )}
                </div>
                <div className="news-card-body">
                  <div className="news-meta-row">
                    <span className="news-date">{formatDate(item.pubDate)}</span>
                  </div>
                  <h3 className="news-card-title">
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  </h3>
                  <p className="news-card-desc">{item.description}</p>
                </div>
                <div className="news-card-footer">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-read-more">
                    {lang === 'en' ? 'Read Full Article' : 'قراءة الخبر كاملاً'}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsFeed;
