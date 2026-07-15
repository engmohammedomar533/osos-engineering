import React, { useState } from 'react';
import './OrganizationalChart.css';

/* ─────────────────────────────────────────────────────────────
   Department data — single source of truth for all screen sizes
───────────────────────────────────────────────────────────── */
const departments = [
  {
    id: 'leadership',
    nameEn: 'Leadership',
    nameAr: 'القيادة التنفيذية',
    icon: '⭐',
    accent: '#bda054',
    members: [
      { nameEn: 'Eslam Abu Emira', nameAr: 'إسلام أبو عميرة', titleEn: 'Chief Executive Officer', titleAr: 'الرئيس التنفيذي', isHead: true },
    ],
  },
  {
    id: 'management',
    nameEn: 'Management',
    nameAr: 'الإدارة العليا',
    icon: '🏢',
    accent: '#4a90d9',
    members: [
      { nameEn: 'Abdulrahman Gari',   nameAr: 'عبدالرحمن قاري',  titleEn: 'Managing Director', titleAr: 'المدير الإداري',     isHead: true },
      { nameEn: 'Abdulrahman Fawaz',  nameAr: 'عبدالرحمن فواز',  titleEn: 'General Manager',   titleAr: 'مدير عام' },
      { nameEn: 'Mohammed Ali Saleh', nameAr: 'محمد علي صالح',   titleEn: 'Projects Manager',  titleAr: 'مدير المشروعات' },
    ],
  },
  {
    id: 'architecture',
    nameEn: 'Architectural Engineering',
    nameAr: 'الهندسة المعمارية',
    icon: '🏛️',
    accent: '#e67e22',
    members: [
      { nameEn: 'Bahaa Al-Boushi',   nameAr: 'بهاء البوشي',    titleEn: 'Head of Architectural Department', titleAr: 'مدير القسم المعماري',  isHead: true },
      { nameEn: 'Hisham Mahmoud',    nameAr: 'هشام محمود',     titleEn: 'Architect',                        titleAr: 'مهندس معماري' },
      { nameEn: 'Abdulaziz Salah',   nameAr: 'عبدالعزيز صلاح', titleEn: 'Architect',                        titleAr: 'مهندس معماري' },
      { nameEn: 'Hossam Qashqari',   nameAr: 'حسام قشقري',     titleEn: 'Architect',                        titleAr: 'مهندس معماري' },
      { nameEn: 'Mohammed Al-Jaber', nameAr: 'محمد الجابر',    titleEn: 'Architect',                        titleAr: 'مهندس معماري' },
      { nameEn: 'Mohammed Hazem',    nameAr: 'محمد حازم',      titleEn: 'Architectural Draftsman',          titleAr: 'رسام معماري' },
      { nameEn: 'Tariq Hamdi',       nameAr: 'طارق حمدي',      titleEn: 'Architectural Draftsman',          titleAr: 'رسام معماري' },
      { nameEn: 'Omar Emad',         nameAr: 'عمر عماد',       titleEn: 'Architect',                        titleAr: 'مهندس معماري' },
      { nameEn: 'Mohamed Molham',    nameAr: 'محمد ملهم',      titleEn: 'Architect',                        titleAr: 'مهندس معماري' },
      { nameEn: 'Mohamed Hassan',    nameAr: 'محمد حسن',       titleEn: 'Architectural Supervisor',         titleAr: 'مراقب معماري' },
    ],
  },
  {
    id: 'electrical',
    nameEn: 'Electrical Engineering',
    nameAr: 'الهندسة الكهربائية',
    icon: '⚡',
    accent: '#f1c40f',
    members: [
      { nameEn: 'Ahmed Badran',        nameAr: 'احمد بدران',       titleEn: 'Head of Electrical Department', titleAr: 'مدير قسم الكهرباء', isHead: true },
      { nameEn: 'Mostafa Abdelsalam',  nameAr: 'مصطفى عبدالسلام', titleEn: 'Electrical Engineer',           titleAr: 'مهندس كهرباء' },
      { nameEn: 'Mahmoud Nemr',        nameAr: 'محمود نمر',        titleEn: 'Electrical Engineer',           titleAr: 'مهندس كهرباء' },
      { nameEn: 'Mohammed Raslan',     nameAr: 'محمد رسلان',       titleEn: 'Electrical Supervisor',         titleAr: 'مراقب كهرباء' },
    ],
  },
  {
    id: 'safety',
    nameEn: 'Safety Engineering',
    nameAr: 'هندسة السلامة',
    icon: '🛡️',
    accent: '#e74c3c',
    members: [
      { nameEn: 'Ramadan Yousef',  nameAr: 'رمضان يوسف',  titleEn: 'Head of Safety Department',               titleAr: 'مدير قسم السلامة',          isHead: true },
      { nameEn: 'Ali Al-Qudah',   nameAr: 'علي القضاه',  titleEn: 'Safety Engineer',                          titleAr: 'مهندس سلامة' },
      { nameEn: 'Khalid Al-Subhi', nameAr: 'خالد الصبحي', titleEn: 'Traffic Safety Engineering Specialist',   titleAr: 'مختص هندسة السلامة المرورية' },
    ],
  },
  {
    id: 'surveying',
    nameEn: 'Surveying & GIS',
    nameAr: 'المساحة ونظم المعلومات الجغرافية',
    icon: '📍',
    accent: '#2ecc71',
    members: [
      { nameEn: 'Mahmoud Shabana',   nameAr: 'محمود شبانة',    titleEn: 'Head of Surveying & GIS Department', titleAr: 'مدير قسم المساحة والـ GIS', isHead: true },
      { nameEn: 'Abdulkarim Antar',  nameAr: 'عبدالكريم عنتر', titleEn: 'Surveying Specialist',               titleAr: 'أخصائي مساحة' },
      { nameEn: 'Ahmed Abu Zeid',    nameAr: 'احمد أبو زيد',   titleEn: 'Surveying Technician',               titleAr: 'فني مساحة' },
      { nameEn: 'Mahrous Mohamed',   nameAr: 'محروس محمد',     titleEn: 'Surveying Technician',               titleAr: 'فني مساحة' },
    ],
  },
  {
    id: 'mechanical',
    nameEn: 'Mechanical Engineering',
    nameAr: 'الهندسة الميكانيكية',
    icon: '⚙️',
    accent: '#9b59b6',
    members: [
      { nameEn: 'Ahmed Ali',      nameAr: 'احمد علي',     titleEn: 'Head of Mechanical Department', titleAr: 'مدير قسم الميكانيكا', isHead: true },
      { nameEn: 'Ahmed El-Nemr',  nameAr: 'احمد النمر',   titleEn: 'Mechanical Engineer',           titleAr: 'مهندس ميكانيكا' },
      { nameEn: 'El-Sayed Yousef', nameAr: 'السيد يوسف', titleEn: 'Electrical Supervisor',         titleAr: 'مراقب كهرباء' },
    ],
  },
  {
    id: 'structural',
    nameEn: 'Structural Engineering',
    nameAr: 'الهندسة الإنشائية',
    icon: '🏗️',
    accent: '#1abc9c',
    members: [
      { nameEn: 'Mohamed El-Leithy',      nameAr: 'محمد الليثي',      titleEn: 'Head of Structural Department', titleAr: 'مدير القسم الإنشائي', isHead: true },
      { nameEn: 'Ibrahim Ali',            nameAr: 'ابراهيم علي',      titleEn: 'Structural Engineer',           titleAr: 'مهندس إنشائي' },
      { nameEn: 'Youssef Hossam El-Din',  nameAr: 'يوسف حسام الدين',  titleEn: 'Structural Engineer',           titleAr: 'مهندس إنشائي' },
    ],
  },
  {
    id: 'supervision',
    nameEn: 'Engineering Supervision',
    nameAr: 'الإشراف الهندسي',
    icon: '🔍',
    accent: '#3498db',
    members: [
      { nameEn: 'Ahmed El-Far',       nameAr: 'احمد الفار',      titleEn: 'Head of Engineering Supervision', titleAr: 'مدير قسم الإشراف الهندسي', isHead: true },
      { nameEn: 'Abdullah Bin Afif',  nameAr: 'عبدالله بن عفيف', titleEn: 'Civil Engineer',                  titleAr: 'مهندس مدني' },
      { nameEn: 'Mohamed Nasr',       nameAr: 'محمد نصر',         titleEn: 'Civil Engineer',                  titleAr: 'مهندس مدني' },
      { nameEn: 'Khalid Zein',        nameAr: 'خالد زين',         titleEn: 'Purchasing Manager',              titleAr: 'مدير مشتريات' },
    ],
  },
  {
    id: 'accounting',
    nameEn: 'Accounting',
    nameAr: 'المحاسبة',
    icon: '📊',
    accent: '#fd9644',
    members: [
      { nameEn: 'Mohamed Gaser',   nameAr: 'محمد جاسر',  titleEn: 'Accountant', titleAr: 'محاسب', isHead: true },
      { nameEn: 'Mahmoud Ahmed',   nameAr: 'محمود احمد', titleEn: 'Accountant', titleAr: 'محاسب' },
    ],
  },
  {
    id: 'cairo',
    nameEn: 'Cairo Branch',
    nameAr: 'فرع القاهرة',
    icon: '🏙️',
    accent: '#c0392b',
    members: [
      { nameEn: 'Ahmed El-Azazy',   nameAr: 'احمد العزازي',   titleEn: 'Technical Manager',      titleAr: 'مدير فني', isHead: true },
      { nameEn: 'Mahmoud Reda',     nameAr: 'محمود رضا',      titleEn: 'Architect',              titleAr: 'مهندس معماري' },
      { nameEn: 'Mohamed Gamal',    nameAr: 'محمد جمال',       titleEn: 'Architect',              titleAr: 'مهندس معماري' },
      { nameEn: 'Mohamed Kadry',    nameAr: 'محمد قدري',      titleEn: 'Architect',              titleAr: 'مهندس معماري' },
      { nameEn: 'Doaa Soliman',     nameAr: 'دعاء سليمان',     titleEn: 'Interior Designer',      titleAr: 'مصممة ديكور' },
      { nameEn: 'Tarek Hamdy',      nameAr: 'طارق حمدي',       titleEn: 'Electrical Engineer',      titleAr: 'مهندس كهرباء' },
      { nameEn: 'Israa El-Sawaf',   nameAr: 'إسراء الصواف',    titleEn: 'Electrical Engineer',      titleAr: 'مهندسة كهرباء' },
    ],
  },
];

/* Helper: get initials from a name */
const getInitials = (name) =>
  name.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/* ─────────────────────────────────────────────────────────────
   Single department accordion card
───────────────────────────────────────────────────────────── */
const DeptCard = ({ dept, lang, isOpen, onToggle }) => {
  const name   = lang === 'en' ? dept.nameEn : dept.nameAr;
  const head   = dept.members.find((m) => m.isHead);
  const headName = head ? (lang === 'en' ? head.nameEn : head.nameAr) : null;

  return (
    <div
      className={`dept-card ${isOpen ? 'open' : ''}`}
      style={{ '--dept-accent': dept.accent }}
      onClick={onToggle}
    >
      {/* ── Card header (always visible) ── */}
      <div className="dept-card-header">
        <div className="dept-icon-wrap">
          <span className="dept-icon" role="img" aria-label={name}>{dept.icon}</span>
        </div>
        <div className="dept-meta">
          <span className="dept-name">{name}</span>
          {headName && (
            <span className="dept-head">
              {lang === 'en' ? 'Head: ' : 'المدير: '}
              <strong>{headName}</strong>
            </span>
          )}
        </div>
        <div className="dept-right">
          <span className="dept-count">{dept.members.length}</span>
          <svg
            className="dept-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ── Expandable member list ── */}
      <div className="dept-card-body">
        <div className="dept-card-body-inner">
          <ul className="member-list">
            {dept.members.map((m, i) => {
              const mName  = lang === 'en' ? m.nameEn  : m.nameAr;
              const mTitle = lang === 'en' ? m.titleEn : m.titleAr;
              return (
                <li key={i} className={`member-row ${m.isHead ? 'member-row--head' : ''}`}>
                  <div
                    className="member-avatar"
                    style={{ background: dept.accent }}
                  >
                    {getInitials(mName)}
                  </div>
                  <div className="member-info">
                    <span className="member-name">{mName}</span>
                    <span className="member-title">{mTitle}</span>
                  </div>
                  {m.isHead && (
                    <span className="head-badge" aria-label="Department Head">★</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main page component
───────────────────────────────────────────────────────────── */
const OrganizationalChart = ({ currentLanguage }) => {
  const lang = currentLanguage || 'en';
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  const totalStaff = departments.reduce((sum, d) => sum + d.members.length, 0);

  return (
    <section className="team-page page-section">
      <div className="container">
        {/* Section header */}
        <div className="section-header">
          <h2 className="section-title">
            {lang === 'en' ? 'OSOS Company Staff' : 'كوادر شركة أسس'}
          </h2>
          <p className="section-subtitle">
            {lang === 'en' ? 'Main Branch — Makkah Al-Mukarramah' : 'الفرع الرئيسي — مكة المكرمة'}
          </p>
          {/* Summary stats bar */}
          <div className="team-stats">
            <div className="team-stat">
              <span className="team-stat-value">{totalStaff}+</span>
              <span className="team-stat-label">{lang === 'en' ? 'Team Members' : 'أعضاء الفريق'}</span>
            </div>
            <div className="team-stat">
              <span className="team-stat-value">{departments.length}</span>
              <span className="team-stat-label">{lang === 'en' ? 'Departments' : 'الأقسام'}</span>
            </div>
            <div className="team-stat">
              <span className="team-stat-value">2</span>
              <span className="team-stat-label">{lang === 'en' ? 'Branches' : 'الفروع'}</span>
            </div>
          </div>
        </div>

        {/* Department accordion grid */}
        <div className="team-grid">
          {departments.map((dept) => (
            <DeptCard
              key={dept.id}
              dept={dept}
              lang={lang}
              isOpen={openId === dept.id}
              onToggle={() => toggle(dept.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrganizationalChart;