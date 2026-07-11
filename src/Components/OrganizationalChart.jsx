import React, { useRef, useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import ProfileCard from '../Components/ProfileCard/ProfileCard';
import './OrganizationalChart.css';

const orgChartData = {
  name: 'Eslam Abu Emira',
  attributes: {
    title: 'الرئيس التنفيذي',
  },
  children: [
    {
      name: 'CTO',
      attributes: {
        title: 'Chief Technology Officer',
      },
      children: [
        {
          name: 'Lead Engineer',
          attributes: {
            title: 'Lead Engineer',
          },
        },
        {
          name: 'Software Engineer',
          attributes: {
            title: 'Software Engineer',
          },
        },
      ],
    },
    {
      name: 'CFO',
      attributes: {
        title: 'Chief Financial Officer',
      },
      children: [
        {
          name: 'Accountant',
          attributes: {
            title: 'Accountant',
          },
        },
      ],
    },
  ],
};

const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
}) => (
  <g>
    <circle r={15}></circle>
    <foreignObject {...foreignObjectProps}>
      <div style={{ border: '1px solid #557292', backgroundColor: '#0d2c4f', color: '#ffffff', padding: '10px', borderRadius: '5px' }}>
        <h3 style={{ textAlign: 'center', color: 'white' }}>{nodeDatum.name}</h3>
        <p style={{ textAlign: 'center', color: 'white' }}>{nodeDatum.attributes?.title}</p>
      </div>
    </foreignObject>
  </g>
);

const teamMembers = [
  // Leadership
  { "id": 1, "name": "Eslam Abou Emira", "nameAr": "اسلام ابوعميرة", "title": "Chief Executive Officer", "titleAr": "الرئيس التنفيذي", "department": "Leadership" },
  // Management
  { "id": 2, "name": "Abdulrahman Gari", "nameAr": "عبدالرحمن قاري", "title": "Managing Director", "titleAr": "المدير الاداري", "department": "Management" },
  { "id": 3, "name": "Abdulrahman Fawaz", "nameAr": "عبدالرحمن فواز", "title": "General Manager", "titleAr": "مدير عام", "department": "Management" },
  { "id": 4, "name": "Mohammed Ali Saleh", "nameAr": "محمد علي صالح", "title": "Projects Manager", "titleAr": "مدير المشروعات", "department": "Management" },
  // Architectural Engineering
  { "id": 5, "name": "Bahaa Al-Boushi", "nameAr": "بهاء البوشي", "title": "Head of Architectural Department", "titleAr": "مدير القسم المعماري", "department": "الهندسة المعمارية" },
  { "id": 6, "name": "Hisham Mahmoud", "nameAr": "هشام محمود", "title": "Architect", "titleAr": "مهندس معماري", "department": "الهندسة المعمارية" },
  { "id": 7, "name": "Abdulaziz Salah", "nameAr": "عبدالعزيز صلاح", "title": "Architect", "titleAr": "مهندس معماري", "department": "الهندسة المعمارية" },
  { "id": 8, "name": "Hossam Qashqari", "nameAr": "حسام قشقري", "title": "Architect", "titleAr": "مهندس معماري", "department": "الهندسة المعمارية" },
  { "id": 9, "name": "Mohammed Al-Jaber", "nameAr": "محمد الجابر", "title": "Architect", "titleAr": "مهندس معماري", "department": "الهندسة المعمارية" },
  { "id": 10, "name": "Mohammed Hazem", "nameAr": "محمد حازم", "title": "Architectural Draftsman", "titleAr": "رسام معماري", "department": "الهندسة المعمارية" },
  { "id": 11, "name": "Tariq Hamdi", "nameAr": "طارق حمدي", "title": "Architectural Draftsman", "titleAr": "رسام معماري", "department": "الهندسة المعمارية" },
  // Electrical Engineering
  { "id": 12, "name": "Ahmed Badran", "nameAr": "احمد بدران", "title": "Head of Electrical Department", "titleAr": "مدير قسم الكهرباء", "department": "الهندسة الكهربائية" },
  { "id": 13, "name": "Mostafa Abdelsalam", "nameAr": "مصطفي عبدالسلام", "title": "Electrical Engineer", "titleAr": "مهندس كهرباء", "department": "الهندسة الكهربائية" },
  { "id": 14, "name": "Mahmoud Nemr", "nameAr": "محمود نمر", "title": "Electrical Engineer", "titleAr": "مهندس كهرباء", "department": "الهندسة الكهربائية" },
  { "id": 15, "name": "Mohammed Raslan", "nameAr": "محمد رسلان", "title": "Electrical Supervisor", "titleAr": "مراقب كهرباء", "department": "الهندسة الكهربائية" },
  // Safety Engineering
  { "id": 16, "name": "Ramadan Yousef", "nameAr": "رمضان يوسف", "title": "Head of Safety Department", "titleAr": "مدير قسم السلامة", "department": "هندسة السلامة" },
  { "id": 17, "name": "Ali Al-Qudah", "nameAr": "علي القضاه", "title": "Safety Engineer", "titleAr": "مهندس سلامة", "department": "هندسة السلامة" }
];

const OrganizationalChart = ({ currentLanguage }) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const treeContainer = useRef(null);

  const buildTreeData = (members, lang) => {
    const root = {
      name: lang === 'en' ? 'OSOS Leadership' : 'قيادة أسس',
      attributes: {},
      children: [],
    };

    const departments = {};
    const ceo = members.find(member => member.title === 'Chief Executive Officer');
    const directReports = members.filter(member => 
      member.name === 'Abdulrahman Fawaz' ||
      member.name === 'Mohammed Ali Saleh' ||
      member.name === 'Abdulrahman Gari'
    );

    if (ceo) {
      const ceoNode = {
        name: lang === 'en' ? ceo.name : ceo.nameAr,
        attributes: {
          title: lang === 'en' ? ceo.title : ceo.titleAr,
        },
        children: [
          {
            name: lang === 'en' ? 'Abdulrahman Fawaz' : 'عبدالرحمن فواز',
            attributes: {
              title: lang === 'en' ? 'General Manager' : 'مدير عام',
            },
          },
          {
            name: lang === 'en' ? 'Mohammed Ali Saleh' : 'محمد علي صالح',
            attributes: {
              title: lang === 'en' ? 'Projects Manager' : 'مدير المشروعات',
            },
            children: [
              {
                name: lang === 'en' ? 'OSOS Cairo Branch' : 'اسس فرع القاهرة',
                attributes: {},
                children: [
                  {
                    name: lang === 'en' ? 'Abdulaziz Salim' : 'عبدالعزيز سليم',
                    attributes: {
                      title: lang === 'en' ? 'Administrative Manager' : 'مدير اداري',
                    },
                    children: [
                      {
                        name: lang === 'en' ? 'Ahmed El-Azazy' : 'احمد العزازي',
                        attributes: {
                          title: lang === 'en' ? 'Technical Manager' : 'مدير فني',
                        },
                        children: [
                          {
                            name: lang === 'en' ? 'Mechanical Engineering - Cairo Branch' : 'الهندسة الميكانيكية – فرع القاهرة',
                            attributes: {},
                            children: [
                              {
                                name: lang === 'en' ? 'Rahma' : 'رحمة',
                                attributes: {},
                                children: [],
                              },
                              {
                                name: lang === 'en' ? 'Hazem' : 'حازم',
                                attributes: {},
                                children: [],
                              },
                            ],
                          },
                          {
                            name: lang === 'en' ? 'Architectural Engineering - Cairo Branch' : 'الهندسة المعمارية – فرع القاهرة',
                            attributes: {},
                            children: [
                              {
                                name: lang === 'en' ? 'Mostafa Ezz' : 'مصطفي عز',
                                attributes: {},
                                children: [],
                              },
                              {
                                name: lang === 'en' ? 'Mostafa Soliman' : 'مصطفي سليمان',
                                attributes: {},
                                children: [],
                              },
                              {
                                name: lang === 'en' ? 'Mohamed Gamal' : 'محمد جمال',
                                attributes: {},
                                children: [],
                              },
                              {
                                name: lang === 'en' ? 'Karim Ettihamy' : 'كريم التهامي',
                                attributes: {},
                                children: [],
                              },
                            ],
                          },
                          {
                            name: lang === 'en' ? 'Decoration Department - Cairo Branch' : 'قسم الديكور فرع القاهرة',
                            attributes: {},
                            children: [
                              {
                                name: lang === 'en' ? 'Sohaila Yasser' : 'سهيلة ياسر',
                                attributes: {},
                                children: [],
                              },
                              {
                                name: lang === 'en' ? 'Israa Hassan' : 'اسراء حسن',
                                attributes: {},
                                children: [],
                              },
                              {
                                name: lang === 'en' ? 'Doaa' : 'دعاء',
                                attributes: {},
                                children: [],
                              },
                            ],
                          },
                          {
                            name: lang === 'en' ? 'Structural Engineering - Cairo Branch' : 'الهندسة الانشائية – فرع القاهرة',
                            attributes: {},
                            children: [
                              {
                                name: lang === 'en' ? 'Youssef Abdelaziz' : 'يوسف عبدالعزيز',
                                attributes: {},
                                children: [],
                              },
                              {
                                name: lang === 'en' ? 'Shaimaa Majed' : 'شيماء ماجد',
                                attributes: {},
                                children: [],
                              },
                            ],
                          },
                          {
                            name: lang === 'en' ? 'Electrical Engineering - Cairo Branch' : 'الهندسة الكهربائية – فرع القاهرة',
                            attributes: {},
                            children: [
                              {
                                name: lang === 'en' ? 'Israa El-Sawaf' : 'اسراء الصواف',
                                attributes: {},
                                children: [],
                              },
                              {
                                name: lang === 'en' ? 'Tarek Hamdy' : 'طارق حمدي',
                                attributes: {},
                                children: [],
                              },
                              {
                                name: lang === 'en' ? 'Ziad Hossam' : 'زياد حسام',
                                attributes: {},
                                children: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              
              {
                name: lang === 'en' ? 'Architectural Department' : 'القسم المعماري',
                attributes: {},
                children: [
                  {
                    name: lang === 'en' ? 'Bahaa Al-Boushi' : 'بهاء البوشي',
                    attributes: {
                      title: lang === 'en' ? 'Head of Architectural Department' : 'مدير القسم المعماري',
                    },
                    children: [
                      {
                        name: lang === 'en' ? 'Hisham Mahmoud' : 'هشام محمود',
                        attributes: {
                          title: lang === 'en' ? 'Architect' : 'مهندس معماري',
                        },
                      },
                      {
                        name: lang === 'en' ? 'Abdulaziz Salah' : 'عبدالعزيز صلاح',
                        attributes: {
                          title: lang === 'en' ? 'Architect' : 'مهندس معماري',
                        },
                      },
                      {
                        name: lang === 'en' ? 'Hossam Qashqari' : 'حسام قشقري',
                        attributes: {
                          title: lang === 'en' ? 'Architect' : 'مهندس معماري',
                        },
                      },
                      {
                        name: lang === 'en' ? 'Mohammed Al-Jaber' : 'محمد الجابر',
                        attributes: {
                          title: lang === 'en' ? 'Architect' : 'مهندس معماري',
                        },
                      },
                      {
                        name: lang === 'en' ? 'Mohammed Hazem' : 'محمد حازم',
                        attributes: {
                          title: lang === 'en' ? 'Architectural Draftsman' : 'رسام معماري',
                        },
                      },
                      {
                        name: lang === 'en' ? 'Tariq Hamdi' : 'طارق حمدي',
                        attributes: {
                          title: lang === 'en' ? 'Architectural Draftsman' : 'رسام معماري',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: lang === 'en' ? 'Electrical Department' : 'قسم الكهرباء',
                attributes: {},
                children: [
                  {
                    name: lang === 'en' ? 'Ahmed Badran' : 'احمد بدران',
                    attributes: {
                      title: lang === 'en' ? 'Head of Electrical Department' : 'مدير قسم الكهرباء',
                    },
                    children: [
                      {
                        name: lang === 'en' ? 'Mostafa Abdelsalam' : 'مصطفي عبدالسلام',
                        attributes: {
                          title: lang === 'en' ? 'Electrical Engineer' : 'مهندس كهرباء',
                        },
                      },
                      {
                        name: lang === 'en' ? 'Mahmoud Nemr' : 'محمود نمر',
                        attributes: {
                          title: lang === 'en' ? 'Electrical Engineer' : 'مهندس كهرباء',
                        },
                      },
                      {
                        name: lang === 'en' ? 'Mohammed Raslan' : 'محمد رسلان',
                        attributes: {
                          title: lang === 'en' ? 'Electrical Supervisor' : 'مراقب كهرباء',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: lang === 'en' ? 'Safety Department' : 'قسم السلامة',
                attributes: {},
                children: [
                  {
                    name: lang === 'en' ? 'Ramadan Yousef' : 'رمضان يوسف',
                    attributes: {
                      title: lang === 'en' ? 'Head of Safety Department' : 'مدير قسم السلامة',
                    },
                    children: [
                      {
                        name: lang === 'en' ? 'Ali Al-Qudah' : 'علي القضاه',
                        attributes: {
                          title: lang === 'en' ? 'Safety Engineer' : 'مهندس سلامة',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: lang === 'en' ? 'Surveying Engineering Department' : 'الهندسة المساحية',
                attributes: {},
                children: [
                  {
                    name: lang === 'en' ? 'Mahmoud Shabana' : 'محمود شبانة',
                    attributes: {
                      title: lang === 'en' ? 'Head of Surveying and GIS Department' : 'مدير قسم المساحة وال جي اي اس',
                    },
                    children: [
                      {
                        name: lang === 'en' ? 'Abdulkarim Antar' : 'عبدالكريم عنتر',
                        attributes: {
                          title: lang === 'en' ? 'Surveying Specialist' : 'اخصائي مساحة',
                        },
                      },
                      {
                        name: lang === 'en' ? 'Ahmed Abu Zeid' : 'احمد ابو زيد',
                        attributes: {
                          title: lang === 'en' ? 'Surveying Technician' : 'فني مساحة',
                        },
                      },
                      {
                        name: lang === 'en' ? 'Mahrous Mohamed' : 'محروس محمد',
                        attributes: {
                          title: lang === 'en' ? 'Surveying Technician' : 'فني مساحة',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: lang === 'en' ? 'Mechanical Engineering Department' : 'الهندسة الميكانيكية',
                attributes: {},
                children: [
                  {
                    name: lang === 'en' ? 'Ahmed Ali' : 'احمد علي',
                    attributes: {
                      title: lang === 'en' ? 'Head of Mechanical Department' : 'مدير قسم الميكانيكا',
                    },
                    children: [
                      {
                        name: lang === 'en' ? 'Ahmed El-Nemr' : 'احمد النمر',
                        attributes: {
                          title: lang === 'en' ? 'Mechanical Engineer' : 'مهندس ميكانيكا',
                        },
                      },
                      {
                        name: lang === 'en' ? 'El-Sayed Yousef' : 'السيد يوسف',
                        attributes: {
                          title: lang === 'en' ? 'Electrical Supervisor' : 'مراقب كهرباء',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: lang === 'en' ? 'Structural Engineering Department' : 'الهندسة الانشائية',
                attributes: {},
                children: [
                  {
                    name: lang === 'en' ? 'Mohamed El-Leithy' : 'محمد الليثي',
                    attributes: {
                      title: lang === 'en' ? 'Head of Structural Department' : 'مدير القسم الانشائي',
                    },
                    children: [
                      {
                        name: lang === 'en' ? 'Ibrahim Ali' : 'ابراهيم علي',
                        attributes: {
                          title: lang === 'en' ? 'Structural Engineer' : 'مهندس انشائي',
                        },
                      },
                      {
                        name: lang === 'en' ? 'Youssef Hossam El-Din' : 'يوسف حسام الدين',
                        attributes: {
                          title: lang === 'en' ? 'Structural Engineer' : 'مهندس انشائي',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: lang === 'en' ? 'Traffic Studies and Safety Engineering Department' : 'هندسة الدراسات و السلامة المرورية',
                attributes: {},
                children: [
                  {
                    name: lang === 'en' ? 'Khalid Al-Subhi' : 'خالد الصبحي',
                    attributes: {
                      title: lang === 'en' ? 'Traffic Safety Engineering Specialist' : 'مختص هندسة السلامة المرورية',
                    },
                  },
                ],
              },
              {
                name: lang === 'en' ? 'Projects Management Department' : 'ادارة المشروعات',
                attributes: {},
                children: [
                  {
                    name: lang === 'en' ? 'Omar Emad' : 'عمر عماد',
                    attributes: {
                      title: lang === 'en' ? 'Architect' : 'مهندس معماري',
                    },
                  },
                  {
                    name: lang === 'en' ? 'Mohamed Molham' : 'محمد ملهم',
                    attributes: {
                      title: lang === 'en' ? 'Architect' : 'مهندس معماري',
                    },
                  },
                ],
              },
              {
                name: lang === 'en' ? 'Engineering Supervision Department' : 'الاشراف الهندسي',
                attributes: {},
                children: [
                  {
                    name: lang === 'en' ? 'Ahmed El-Far' : 'احمد الفار',
                    attributes: {
                      title: lang === 'en' ? 'Head of Engineering Supervision Department' : 'مدير قسم الاشراف الهندسي',
                    },
                    children: [
                      {
                        name: lang === 'en' ? 'Abdullah Bin Afif' : 'عبدالله بن عفيف',
                        attributes: {
                          title: lang === 'en' ? 'Civil Engineer' : 'مهندس مدني',
                        },
                      },
                      {
                        name: lang === 'en' ? 'Khalid Zein' : 'خالد زين',
                        attributes: {
                          title: lang === 'en' ? 'Purchasing Manager' : 'مدير مشتريات',
                        },
                      },
                      {
                        name: lang === 'en' ? 'Mohamed Nasr' : 'محمد نصر',
                        attributes: {
                          title: lang === 'en' ? 'Civil Engineer' : 'مهندس مدني',
                        },
                      },
                      {
                        name: lang === 'en' ? 'Mohamed Hassan' : 'محمد حسن',
                        attributes: {
                          title: lang === 'en' ? 'Architectural Supervisor' : 'مراقب معماري',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: lang === 'en' ? 'Accounting Department' : 'قسم المحاسبة',
                attributes: {},
                children: [
                  {
                    name: lang === 'en' ? 'Mohamed Gaser' : 'محمد جاسر',
                    attributes: {
                      title: lang === 'en' ? 'Accountant' : 'محاسب',
                    },
                  },
                  {
                    name: lang === 'en' ? 'Mahmoud Ahmed' : 'محمود احمد',
                    attributes: {
                      title: lang === 'en' ? 'Accountant' : 'محاسب',
                    },
                  },
                ],
              },
            ],
          },
          {
                                                                                                                                                      name: lang === 'en' ? 'Abdulrahman Gari' : 'عبدالرحمن قاري',
            attributes: {
              title: lang === 'en' ? 'Managing Director' : 'المدير الاداري',
            },
          },
        ],
      };
      root.children.push(ceoNode);
    }

    

    // Filter out the direct reports and architectural department members from the general departments loop
    const filteredMembers = members.filter(member => 
      member.department !== 'Leadership' && 
      !directReports.some(report => report.id === member.id) &&
      member.department !== 'الهندسة المعمارية' &&
      member.department !== 'الهندسة الكهربائية' &&
      member.department !== 'هندسة السلامة'
    );

    filteredMembers.forEach(member => {
      if (!departments[member.department]) {
        departments[member.department] = {
          name: member.department,
          attributes: {},
          children: [],
        };
        root.children.push(departments[member.department]);
      }
      departments[member.department].children.push({
        name: lang === 'en' ? member.name : member.nameAr,
        attributes: {
          title: lang === 'en' ? member.title : member.titleAr,
        },
      });
    });

    return root;
  };

  const orgChartData = buildTreeData(teamMembers, currentLanguage);

  useEffect(() => {
    if (treeContainer.current) {
      const { width, height } = treeContainer.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height / 4 });
    }
  }, []);

  const foreignObjectProps = { width: 150, height: 100, x: -75, y: -50 };

  return (
    <section className="page-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" data-en="OSOS Company Staff" data-ar="كوادر شركة أسس">
            {currentLanguage === 'en' ? 'OSOS Company Staff' : 'كوادر شركة أسس'}
          </h2>
          <h3 className="section-subtitle" data-en="Main Branch - Makkah" data-ar="الفرع الرئيسي - مكة المكرمة">
            {currentLanguage === 'en' ? 'Main Branch - Makkah' : 'الفرع الرئيسي - مكة المكرمة'}
          </h3>
        </div>
        <div className="org-chart-container" style={{ width: '100%', height: '100vh' }} ref={treeContainer}>
          <Tree
            data={orgChartData}
            translate={translate}
            orientation="vertical"
            renderCustomNodeElement={(rd3tProps) =>
              renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
            }
          />
        </div>

        <div className="mobile-only-cards">
          {simplifiedTeamMembers.map((member, index) => (
            <ProfileCard
              key={index}
              className="shared-card-size"
              avatarUrl={index === 0 ? "/Images/islam.jpg" : ""} // Conditional avatar
              name={currentLanguage === 'en' ? member.name : member.nameAr}
              subtitle={currentLanguage === 'en' ? member.title : member.titleAr} // Pass title to subtitle
              handle="" // No handle in this context
              status="" // No status in this context
              contactText="" // No contact text in this context
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const simplifiedTeamMembers = [
  { name: 'Eslam Abu Emira', nameAr: 'إسلام أبو عميرة', title: 'Chief Executive Officer', titleAr: 'الرئيس التنفيذي' },
  { name: 'Abdulrahman Fawaz', nameAr: 'عبدالرحمن فواز', title: 'General Manager', titleAr: 'مدير عام' },
  { name: 'Mohammed Ali Saleh', nameAr: 'محمد علي صالح', title: 'Projects Manager', titleAr: 'مدير المشروعات' },
  { name: 'Abdulrahman Gari', nameAr: 'عبدالرحمن قاري', title: 'Managing Director', titleAr: 'المدير الاداري' },
  { name: 'Bahaa Al-Boushi', nameAr: 'بهاء البوشي', title: 'Head of Architectural Department', titleAr: 'مدير القسم المعماري' },
  { name: 'Hisham Mahmoud', nameAr: 'هشام محمود', title: 'Architect', titleAr: 'مهندس معماري' },
  { name: 'Abdulaziz Salah', nameAr: 'عبدالعزيز صلاح', title: 'Architect', titleAr: 'مهندس معماري' },
  { name: 'Hossam Qashqari', nameAr: 'حسام قشقري', title: 'Architect', titleAr: 'مهندس معماري' },
  { name: 'Mohammed Al-Jaber', nameAr: 'محمد الجابر', title: 'Architect', titleAr: 'مهندس معماري' },
  { name: 'Mohammed Hazem', nameAr: 'محمد حازم', title: 'Architectural Draftsman', titleAr: 'رسام معماري' },
  { name: 'Tariq Hamdi', nameAr: 'طارق حمدي', title: 'Architectural Draftsman', titleAr: 'رسام معماري' },
  { name: 'Ahmed Badran', nameAr: 'احمد بدران', title: 'Head of Electrical Department', titleAr: 'مدير قسم الكهرباء' },
  { name: 'Mostafa Abdelsalam', nameAr: 'مصطفي عبدالسلام', title: 'Electrical Engineer', titleAr: 'مهندس كهرباء' },
  { name: 'Mahmoud Nemr', nameAr: 'محمود نمر', title: 'Electrical Engineer', titleAr: 'مهندس كهرباء' },
  { name: 'Mohammed Raslan', nameAr: 'محمد رسلان', title: 'Electrical Supervisor', titleAr: 'مراقب كهرباء' },
  { name: 'Ramadan Yousef', nameAr: 'رمضان يوسف', title: 'Head of Safety Department', titleAr: 'مدير قسم السلامة' },
  { name: 'Ali Al-Qudah', nameAr: 'علي القضاه', title: 'Safety Engineer', titleAr: 'مهندس سلامة' },
  { name: 'Mahmoud Shabana', nameAr: 'محمود شبانة', title: 'Head of Surveying and GIS Department', titleAr: 'مدير قسم المساحة وال جي اي اس' },
  { name: 'Abdulkarim Antar', nameAr: 'عبدالكريم عنتر', title: 'Surveying Specialist', titleAr: 'اخصائي مساحة' },
  { name: 'Ahmed Abu Zeid', nameAr: 'احمد ابو زيد', title: 'Surveying Technician', titleAr: 'فني مساحة' },
  { name: 'Mahrous Mohamed', nameAr: 'محروس محمد', title: 'Surveying Technician', titleAr: 'فني مساحة' },
  { name: 'Ahmed Ali', nameAr: 'احمد علي', title: 'Head of Mechanical Department', titleAr: 'مدير قسم الميكانيكا' },
  { name: 'Ahmed El-Nemr', nameAr: 'احمد النمر', title: 'Mechanical Engineer', titleAr: 'مهندس ميكانيكا' },
  { name: 'El-Sayed Yousef', nameAr: 'السيد يوسف', title: 'Electrical Supervisor', titleAr: 'مراقب كهرباء' },
  { name: 'Mohamed El-Leithy', nameAr: 'محمد الليثي', title: 'Head of Structural Department', titleAr: 'مدير القسم الانشائي' },
  { name: 'Ibrahim Ali', nameAr: 'ابراهيم علي', title: 'Structural Engineer', titleAr: 'مهندس انشائي' },
  { name: 'Youssef Hossam El-Din', nameAr: 'يوسف حسام الدين', title: 'Structural Engineer', titleAr: 'مهندس انشائي' },
  { name: 'Khalid Al-Subhi', nameAr: 'خالد الصبحي', title: 'Traffic Safety Engineering Specialist', titleAr: 'مختص هندسة السلامة المرورية' },
  { name: 'Omar Emad', nameAr: 'عمر عماد', title: 'Architect', titleAr: 'مهندس معماري' },
  { name: 'Mohamed Molham', nameAr: 'محمد ملهم', title: 'Architect', titleAr: 'مهندس معماري' },
  { name: 'Ahmed El-Far', nameAr: 'احمد الفار', title: 'Head of Engineering Supervision Department', titleAr: 'مدير قسم الاشراف الهندسي' },
  { name: 'Abdullah Bin Afif', nameAr: 'عبدالله بن عفيف', title: 'Civil Engineer', titleAr: 'مهندس مدني' },
  { name: 'Khalid Zein', nameAr: 'خالد زين', title: 'Purchasing Manager', titleAr: 'مدير مشتريات' },
  { name: 'Mohamed Nasr', nameAr: 'محمد نصر', title: 'Civil Engineer', titleAr: 'مهندس مدني' },
  { name: 'Mohamed Hassan', nameAr: 'محمد حسن', title: 'Architectural Supervisor', titleAr: 'مراقب معماري' },
  { name: 'Mohamed Gaser', nameAr: 'محمد جاسر', title: 'Accountant', titleAr: 'محاسب' },
  { name: 'Mahmoud Ahmed', nameAr: 'محمود احمد', title: 'Accountant', titleAr: 'محاسب' },
  { name: 'Abdulaziz Salim', nameAr: 'عبدالعزيز سليم', title: 'Administrative Manager - Cairo', titleAr: 'مدير اداري - القاهرة' },
  { name: 'Ahmed El-Azazy', nameAr: 'احمد العزازي', title: 'Technical Manager - Cairo', titleAr: 'مدير فني - القاهرة' },
  { name: 'Rahma', nameAr: 'رحمة', title: 'Cairo', titleAr: 'القاهرة' },
  { name: 'Hazem', nameAr: 'حازم', title: 'Cairo', titleAr: 'القاهرة' },
  { name: 'Mostafa Ezz', nameAr: 'مصطفي عز', title: 'Cairo', titleAr: 'القاهرة' },
  { name: 'Mostafa Soliman', nameAr: 'مصطفي سليمان', title: 'Cairo', titleAr: 'القاهرة' },
  { name: 'Mohamed Gamal', nameAr: 'محمد جمال', title: 'Cairo', titleAr: 'القاهرة' },
  { name: 'Karim Ettihamy', nameAr: 'كريم التهامي', title: 'Cairo', titleAr: 'القاهرة' },
  { name: 'Sohaila Yasser', nameAr: 'سهيلة ياسر', title: 'Cairo', titleAr: 'القاهرة' },
  { name: 'Israa Hassan', nameAr: 'اسراء حسن', title: 'Cairo', titleAr: 'القاهرة' },
  { name: 'Doaa', nameAr: 'دعاء', title: 'Cairo', titleAr: 'القاهرة' },
  { name: 'Youssef Abdelaziz', nameAr: 'يوسف عبدالعزيز', title: 'Cairo', titleAr: 'القاهرة' },
  { name: 'Shaimaa Majed', nameAr: 'شيماء ماجد', title: 'Cairo', titleAr: 'القاهرة' },
  { name: 'Israa El-Sawaf', nameAr: 'اسراء الصواف', title: 'Cairo', titleAr: 'القاهرة' },
  { name: 'Tarek Hamdy', nameAr: 'طارق حمدي', title: 'Cairo', titleAr: 'القاهرة' },
  { name: 'Ziad Hossam', nameAr: 'زياد حسام', title: 'Cairo', titleAr: 'القاهرة' },
];

export default OrganizationalChart;