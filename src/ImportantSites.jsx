import React, { useState, useRef, useCallback, useEffect } from 'react';
import './ImportantSites.css';
import useSEO from './hooks/useSEO';

/* ─────────────────────────────────────────────────────────────
   Site data
───────────────────────────────────────────────────────────── */
const SITES = [
  // ── Municipal – Makkah ──────────────────────────────────
  {
    id: 'balady',
    nameEn: 'Balady Portal',
    nameAr: 'بوابة بلدي',
    descEn: 'Building permits, municipal licenses and services',
    descAr: 'تراخيص البناء والخدمات البلدية والرخص',
    url: 'https://balady.gov.sa',
    category: 'municipal',
    accent: '#2ecc71',
    icon: '🏛️',
  },
  {
    id: 'makkah-amanah',
    nameEn: 'Makkah Amanah',
    nameAr: 'أمانة العاصمة المقدسة',
    descEn: 'Official municipality of Makkah Al-Mukarramah',
    descAr: 'البوابة الرسمية لأمانة مكة المكرمة',
    url: 'https://makkah.gov.sa',
    category: 'municipal',
    accent: '#27ae60',
    icon: '🕌',
  },
  {
    id: 'makkahda',
    nameEn: 'Makkah Development Authority',
    nameAr: 'هيئة تطوير منطقة مكة المكرمة',
    descEn: 'Regional development projects and planning in Makkah region',
    descAr: 'مشاريع التطوير والتخطيط في منطقة مكة المكرمة',
    url: 'https://makkahda.gov.sa',
    category: 'municipal',
    accent: '#16a085',
    icon: '🏗️',
  },
  {
    id: 'momra',
    nameEn: 'Ministry of Municipal Affairs',
    nameAr: 'وزارة الشؤون البلدية والقروية',
    descEn: 'National municipal and rural planning authority',
    descAr: 'وزارة الشؤون البلدية والقروية والإسكان',
    url: 'https://momra.gov.sa',
    category: 'municipal',
    accent: '#1abc9c',
    icon: '🏢',
  },

  // ── Engineering & Construction ───────────────────────────
  {
    id: 'sbc',
    nameEn: 'Saudi Building Codes (SBC)',
    nameAr: 'كود البناء السعودي',
    descEn: 'Official Saudi building codes and construction standards',
    descAr: 'الأكواد والمعايير الرسمية للبناء في المملكة',
    url: 'https://sbc.gov.sa',
    category: 'engineering',
    accent: '#e67e22',
    icon: '📐',
  },
  {
    id: 'sce',
    nameEn: 'Saudi Council of Engineers',
    nameAr: 'هيئة المهندسين السعوديين',
    descEn: 'Engineer registration, licensing and professional development',
    descAr: 'تسجيل المهندسين وتراخيص ممارسة المهنة',
    url: 'https://www.saudiengineers.org.sa',
    category: 'engineering',
    accent: '#d35400',
    icon: '⚙️',
  },
  {
    id: 'sca',
    nameEn: 'Saudi Contractors Authority',
    nameAr: 'هيئة المقاولين السعوديين',
    descEn: 'Contractor classification, registration, and licensing',
    descAr: 'تصنيف المقاولين وتسجيلهم وتراخيصهم',
    url: 'https://www.sca.org.sa',
    category: 'engineering',
    accent: '#e74c3c',
    icon: '🔨',
  },
  {
    id: 'rega',
    nameEn: 'Real Estate General Authority (REGA)',
    nameAr: 'الهيئة العامة للعقار',
    descEn: 'Real estate regulation, licensing and market data',
    descAr: 'تنظيم العقار وتراخيص الوساطة وبيانات السوق',
    url: 'https://rega.gov.sa',
    category: 'engineering',
    accent: '#c0392b',
    icon: '🏠',
  },

  // ── Government Portals ───────────────────────────────────
  {
    id: 'saudi-gov',
    nameEn: 'Saudi Government Portal',
    nameAr: 'بوابة الحكومة السعودية',
    descEn: 'Unified portal for all Saudi government digital services',
    descAr: 'البوابة الموحدة للخدمات الحكومية الرقمية',
    url: 'https://www.saudi.gov.sa',
    category: 'government',
    accent: '#3498db',
    icon: '🖥️',
  },
  {
    id: 'absher',
    nameEn: 'Absher',
    nameAr: 'أبشر',
    descEn: 'Identity, visas, driving licenses, and government transactions',
    descAr: 'الهوية والتأشيرات ورخص القيادة والمعاملات الحكومية',
    url: 'https://www.absher.sa',
    category: 'government',
    accent: '#2980b9',
    icon: '🪪',
  },
  {
    id: 'etimad',
    nameEn: 'Etimad Platform',
    nameAr: 'منصة اعتماد',
    descEn: 'Government procurement, tenders and contract management',
    descAr: 'المشتريات والمناقصات وإدارة العقود الحكومية',
    url: 'https://etimad.sa',
    category: 'government',
    accent: '#1a5276',
    icon: '📑',
  },
  {
    id: 'muqeem',
    nameEn: 'Muqeem',
    nameAr: 'مقيم',
    descEn: 'Iqama (residency) services for expatriate employees',
    descAr: 'خدمات الإقامة للعمالة الوافدة',
    url: 'https://muqeem.sa',
    category: 'government',
    accent: '#154360',
    icon: '📋',
  },
  {
    id: 'nafath',
    nameEn: 'Nafath (National SSO)',
    nameAr: 'نفاذ',
    descEn: 'National digital identity and single sign-on for government services',
    descAr: 'الهوية الرقمية الوطنية والدخول الموحد للخدمات الحكومية',
    url: 'https://nafath.gov.sa',
    category: 'government',
    accent: '#0a3d62',
    icon: '🔐',
  },

  // ── Utilities ────────────────────────────────────────────
  {
    id: 'sec',
    nameEn: 'Saudi Electricity Company (SEC)',
    nameAr: 'شركة الكهرباء السعودية',
    descEn: 'Electricity connections, bills and new meter applications',
    descAr: 'توصيلات الكهرباء والفواتير وطلبات العدادات',
    url: 'https://www.se.com.sa',
    category: 'utilities',
    accent: '#f39c12',
    icon: '⚡',
  },
  {
    id: 'nwc',
    nameEn: 'National Water Company (NWC)',
    nameAr: 'شركة المياه الوطنية',
    descEn: 'Water connections, meter applications and bill payment',
    descAr: 'توصيلات المياه وطلبات العدادات وسداد الفواتير',
    url: 'https://nwc.com.sa',
    category: 'utilities',
    accent: '#1e8bc3',
    icon: '💧',
  },
  {
    id: 'stc',
    nameEn: 'STC Business',
    nameAr: 'سعودي تيليكوم للأعمال',
    descEn: 'Telecom and fiber internet services for business and sites',
    descAr: 'خدمات الاتصالات والإنترنت للأعمال والمواقع',
    url: 'https://www.stc.com.sa',
    category: 'utilities',
    accent: '#8e44ad',
    icon: '📡',
  },

  // ── Standards & Quality ──────────────────────────────────
  {
    id: 'saso',
    nameEn: 'SASO',
    nameAr: 'هيئة المواصفات والمقاييس',
    descEn: 'Saudi standards, quality specifications and product certification',
    descAr: 'المواصفات السعودية ومتطلبات الجودة وشهادات المنتجات',
    url: 'https://www.saso.gov.sa',
    category: 'standards',
    accent: '#9b59b6',
    icon: '📐',
  },
  {
    id: 'gosi',
    nameEn: 'GOSI',
    nameAr: 'التأمينات الاجتماعية',
    descEn: 'Social insurance registration and contribution management',
    descAr: 'التسجيل في التأمينات وإدارة الاشتراكات',
    url: 'https://www.gosi.gov.sa',
    category: 'standards',
    accent: '#6c3483',
    icon: '🛡️',
  },

  // ── HR & Visas ───────────────────────────────────────────
  {
    id: 'hrsd',
    nameEn: 'Ministry of Human Resources (HRSD)',
    nameAr: 'وزارة الموارد البشرية',
    descEn: 'Labor contracts, work permits and Nitaqat compliance',
    descAr: 'عقود العمل وتصاريح العمل والنطاقات',
    url: 'https://hrsd.gov.sa',
    category: 'hr',
    accent: '#16a085',
    icon: '👷',
  },
  {
    id: 'musaned',
    nameEn: 'Musaned',
    nameAr: 'مساند',
    descEn: 'Domestic and support labor recruitment platform',
    descAr: 'منصة استقدام العمالة المنزلية والمساندة',
    url: 'https://www.musaned.com.sa',
    category: 'hr',
    accent: '#117a65',
    icon: '🤝',
  },

  // ── Development Projects ─────────────────────────────────
  {
    id: 'neom',
    nameEn: 'NEOM',
    nameAr: 'نيوم',
    descEn: 'Saudi Arabia\'s flagship megaproject and smart city development',
    descAr: 'مشروع نيوم العملاق للمدن الذكية في المملكة',
    url: 'https://www.neom.com',
    category: 'development',
    accent: '#0b5394',
    icon: '🌆',
  },
  {
    id: 'roshn',
    nameEn: 'Roshn',
    nameAr: 'روشن',
    descEn: 'Saudi national real estate developer — residential communities',
    descAr: 'المطور العقاري الوطني للمجتمعات السكنية',
    url: 'https://roshn.sa',
    category: 'development',
    accent: '#184f8e',
    icon: '🏘️',
  },
  {
    id: 'wafi',
    nameEn: 'Wafi Housing Program',
    nameAr: 'برنامج وافي للإسكان',
    descEn: 'Off-plan property registration and housing program portal',
    descAr: 'تسجيل العقارات على الخارطة وبرامج الإسكان',
    url: 'https://wafi.housing.gov.sa',
    category: 'development',
    accent: '#1a3a6b',
    icon: '🏡',
  },
];

const CATEGORIES = [
  { id: 'all',         labelEn: 'All Sites',          labelAr: 'جميع المواقع',      icon: '🌐' },
  { id: 'municipal',  labelEn: 'Municipal – Makkah',  labelAr: 'البلديات – مكة',    icon: '🏛️' },
  { id: 'engineering',labelEn: 'Engineering',          labelAr: 'الهندسة والبناء',   icon: '🏗️' },
  { id: 'government', labelEn: 'Government Portals',   labelAr: 'البوابات الحكومية', icon: '🖥️' },
  { id: 'utilities',  labelEn: 'Utilities',            labelAr: 'المرافق',           icon: '⚡' },
  { id: 'standards',  labelEn: 'Standards & HR',       labelAr: 'المعايير والموارد', icon: '📐' },
  { id: 'hr',         labelEn: 'HR & Visas',           labelAr: 'الموارد البشرية',   icon: '👷' },
  { id: 'development',labelEn: 'Mega Projects',        labelAr: 'المشاريع الكبرى',   icon: '🌆' },
];

const PINNED_KEY = 'osos_pinned_sites';

/* ─────────────────────────────────────────────────────────────
   Site card
───────────────────────────────────────────────────────────── */
const SiteCard = ({ site, lang, isPinned, onTogglePin }) => {
  const name = lang === 'en' ? site.nameEn : site.nameAr;
  const desc = lang === 'en' ? site.descEn : site.descAr;

  return (
    <div className="site-card" style={{ '--site-accent': site.accent }}>
      <div className="site-card-header">
        <div className="site-icon-wrap">
          <span className="site-icon" role="img" aria-label={name}>{site.icon}</span>
        </div>
        <button
          className={`site-pin-btn ${isPinned ? 'pinned' : ''}`}
          onClick={(e) => { e.preventDefault(); onTogglePin(site.id); }}
          title={isPinned ? (lang === 'en' ? 'Unpin' : 'إلغاء التثبيت') : (lang === 'en' ? 'Pin to top' : 'تثبيت في الأعلى')}
          aria-label={isPinned ? 'Unpin site' : 'Pin site to top'}
        >
          ★
        </button>
      </div>
      <div className="site-card-body">
        <h3 className="site-name">{name}</h3>
        <p className="site-desc">{desc}</p>
      </div>
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className="site-visit-btn"
        aria-label={`Visit ${name}`}
      >
        {lang === 'en' ? 'Visit Site' : 'زيارة الموقع'}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────── */
const ImportantSites = ({ currentLanguage }) => {
  const lang = currentLanguage || 'en';

  useSEO({
    title: lang === 'en' ? 'Important Sites' : 'المواقع المهمة',
    description: lang === 'en'
      ? 'Quick access to all important Saudi government and engineering portals for OSOS Engineering team — Balady, SBC, SEC, Absher, Etimad and more.'
      : 'وصول سريع لجميع البوابات الحكومية والهندسية المهمة لفريق أسس البناء — بلدي، كود البناء، الكهرباء، أبشر، اعتماد والمزيد.',
  });

  const [search, setSearch]   = useState('');
  const [category, setCategory] = useState('all');
  const [pinned, setPinned]   = useState(() => {
    try { return JSON.parse(localStorage.getItem(PINNED_KEY)) || []; }
    catch { return []; }
  });

  // Persist pinned to localStorage
  useEffect(() => {
    localStorage.setItem(PINNED_KEY, JSON.stringify(pinned));
  }, [pinned]);

  const togglePin = useCallback((id) => {
    setPinned(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  }, []);

  // Drag-to-scroll for category tabs
  const tabsRef = useRef(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false });

  const onMouseDown = (e) => {
    drag.current = { down: true, startX: e.pageX - tabsRef.current.offsetLeft, scrollLeft: tabsRef.current.scrollLeft, moved: false };
    tabsRef.current.classList.add('dragging');
  };
  const onMouseLeave = () => { drag.current.down = false; tabsRef.current?.classList.remove('dragging'); };
  const onMouseUp    = () => { drag.current.down = false; tabsRef.current?.classList.remove('dragging'); };
  const onMouseMove  = (e) => {
    if (!drag.current.down) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - drag.current.startX) * 1.5;
    if (Math.abs(walk) > 4) drag.current.moved = true;
    tabsRef.current.scrollLeft = drag.current.scrollLeft - walk;
  };

  // Filter logic
  const query = search.toLowerCase().trim();
  const filtered = SITES.filter(s => {
    const matchCat  = category === 'all' || s.category === category;
    const matchText = !query ||
      s.nameEn.toLowerCase().includes(query) ||
      s.nameAr.includes(query) ||
      s.descEn.toLowerCase().includes(query) ||
      s.descAr.includes(query);
    return matchCat && matchText;
  });

  const pinnedSites   = filtered.filter(s => pinned.includes(s.id));
  const unpinnedSites = filtered.filter(s => !pinned.includes(s.id));

  return (
    <section className="sites-page page-section">
      <div className="container">

        {/* ── Header ── */}
        <div className="section-header">
          <h2 className="section-title">
            {lang === 'en' ? 'Important Sites' : 'المواقع المهمة'}
          </h2>
          <p className="section-subtitle">
            {lang === 'en'
              ? 'Quick access to all government and engineering portals'
              : 'وصول سريع لجميع البوابات الحكومية والهندسية'}
          </p>
        </div>

        {/* ── Search bar ── */}
        <div className="sites-search-wrap">
          <span className="sites-search-icon" aria-hidden="true">🔍</span>
          <input
            id="sites-search"
            type="text"
            className="sites-search"
            placeholder={lang === 'en' ? 'Search portals…' : 'ابحث عن بوابة…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
          />
          {search && (
            <button className="sites-search-clear" onClick={() => setSearch('')} aria-label="Clear search">✕</button>
          )}
        </div>

        {/* ── Category tabs ── */}
        <div className="sites-tabs-container">
          <div
            className="sites-tabs"
            ref={tabsRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`sites-tab ${category === cat.id ? 'active' : ''}`}
                onClick={() => { if (!drag.current.moved) setCategory(cat.id); }}
              >
                <span>{cat.icon}</span>
                <span>{lang === 'en' ? cat.labelEn : cat.labelAr}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Pinned section ── */}
        {pinnedSites.length > 0 && (
          <div className="sites-section">
            <h3 className="sites-section-label">
              <span>★</span> {lang === 'en' ? 'Pinned' : 'المثبتة'}
            </h3>
            <div className="sites-grid">
              {pinnedSites.map(s => (
                <SiteCard key={s.id} site={s} lang={lang} isPinned={true} onTogglePin={togglePin} />
              ))}
            </div>
          </div>
        )}

        {/* ── All results ── */}
        {unpinnedSites.length > 0 ? (
          <div className="sites-section">
            {pinnedSites.length > 0 && (
              <h3 className="sites-section-label">
                🌐 {lang === 'en' ? 'All Sites' : 'جميع المواقع'}
              </h3>
            )}
            <div className="sites-grid">
              {unpinnedSites.map(s => (
                <SiteCard key={s.id} site={s} lang={lang} isPinned={false} onTogglePin={togglePin} />
              ))}
            </div>
          </div>
        ) : (
          !pinnedSites.length && (
            <div className="sites-empty">
              <span>🔍</span>
              <p>{lang === 'en' ? 'No sites match your search.' : 'لا توجد مواقع تطابق بحثك.'}</p>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default ImportantSites;
