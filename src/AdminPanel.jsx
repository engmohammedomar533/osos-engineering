import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

// Helper to get the auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

const BLOB_STORAGE_BASE_URL = 'https://pc5a0jgn4xie1mys.public.blob.vercel-storage.com';

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('projects');
  const [message, setMessage] = useState({ text: '', type: '' });

  // State for projects
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '', title_ar: '', category: '', category_ar: '', location: '',
    featured: false, description_en: '', description_ar: '',
    features_en: '', features_ar: '', images: '',
  });

  // State for credentials
  const [credentials, setCredentials] = useState([]);
  const [editingCredential, setEditingCredential] = useState(null);
  const [credentialFormData, setCredentialFormData] = useState({ image_url: '' });

  // State for partners
  const [partners, setPartners] = useState([]);
  const [editingPartner, setEditingPartner] = useState(null);
  const [partnerFormData, setPartnerFormData] = useState({ name: '', logo_url: '' });

  // State for About Us
  const [aboutUsData, setAboutUsData] = useState(null);
  const [aboutUsFormData, setAboutUsFormData] = useState(null);

  // State for Services
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    title_en: '', title_ar: '', description_en: '', description_ar: '', image_url: '', icon_url: ''
  });

  // State for Contact Messages
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchCredentials();
    fetchPartners();
    fetchAboutUs();
    fetchServices();
    fetchContacts();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  // --- Fetching Data ---
  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/get_projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      setProjects(await res.json());
    } catch (error) { showMessage(error.message, 'error'); }
  };

  const fetchCredentials = async () => {
    try {
      const res = await fetch('/api/get_credentials');
      if (!res.ok) throw new Error('Failed to fetch credentials');
      setCredentials(await res.json());
    } catch (error) { showMessage(error.message, 'error'); }
  };

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/get_partner_logos');
      if (!res.ok) throw new Error('Failed to fetch partners');
      setPartners(await res.json());
    } catch (error) { showMessage(error.message, 'error'); }
  };

  const fetchAboutUs = async () => {
    try {
      const res = await fetch('/api/get_about_us');
      if (!res.ok) throw new Error('Failed to fetch about us data');
      const data = await res.json();
      setAboutUsData(data[0]);
      setAboutUsFormData(data[0]);
    } catch (error) { showMessage(error.message, 'error'); }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/get_services');
      if (!res.ok) throw new Error('Failed to fetch services');
      setServices(await res.json());
    } catch (error) { showMessage(error.message, 'error'); }
  };

  const fetchContacts = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await fetch('/api/get-contacts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('loggedIn');
        if (onLogout) onLogout();
        throw new Error('Session expired. Please log in again.');
      }
      if (!res.ok) throw new Error('Failed to fetch contacts');
      setContacts(await res.json());
    } catch (error) {
      if (error.message !== 'Session expired. Please log in again.') {
        showMessage(error.message, 'error');
      }
    }
  };

  const handleContactDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await apiCall(`/api/delete-contact/${id}`, 'DELETE');
        showMessage('Contact message deleted successfully!');
        fetchContacts();
      } catch (error) { showMessage(error.message, 'error'); }
    }
  };

  const handleExportCSV = () => {
    if (contacts.length === 0) {
      showMessage('No contact messages to export.', 'error');
      return;
    }
    
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Message', 'Date'];
    const rows = contacts.map(c => [
      c.id,
      c.name,
      c.phone,
      c.email,
      c.message.replace(/"/g, '""'),
      new Date(c.created_at).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `osos_contacts_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- API Call Helper ---
  const apiCall = async (url, method, body = null) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    };
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(url, options);
    if (res.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('loggedIn');
      if (onLogout) onLogout();
      throw new Error('Session expired. Please log in again.');
    }
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || `HTTP ${res.status}`);
    }
    return res.json();
  };

  // --- Projects CRUD ---
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const url = editingProject ? `/api/update_project/${editingProject.id}` : '/api/add_project';
    const method = editingProject ? 'PUT' : 'POST';
    try {
      await apiCall(url, method, projectFormData);
      showMessage(`Project ${editingProject ? 'updated' : 'added'} successfully!`);
      setEditingProject(null);
      setProjectFormData({ title: '', title_ar: '', category: '', category_ar: '', location: '', featured: false, description_en: '', description_ar: '', features_en: '', features_ar: '', images: '' });
      fetchProjects();
    } catch (error) { showMessage(error.message, 'error'); }
  };

  const handleProjectEdit = (project) => {
    setEditingProject(project);
    setProjectFormData(project);
  };

  const handleProjectDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiCall(`/api/delete_project/${id}`, 'DELETE');
        showMessage('Project deleted successfully!');
        fetchProjects();
      } catch (error) { showMessage(error.message, 'error'); }
    }
  };

  // --- Credentials CRUD ---
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    const url = editingCredential ? `/api/update_credential/${editingCredential.id}` : '/api/add_credential';
    const method = editingCredential ? 'PUT' : 'POST';
    try {
      await apiCall(url, method, credentialFormData);
      showMessage(`Credential ${editingCredential ? 'updated' : 'added'} successfully!`);
      setEditingCredential(null);
      setCredentialFormData({ image_url: '' });
      fetchCredentials();
    } catch (error) { showMessage(error.message, 'error'); }
  };

  const handleCredentialEdit = (credential) => {
    setEditingCredential(credential);
    setCredentialFormData(credential);
  };

  const handleCredentialDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiCall(`/api/delete_credential/${id}`, 'DELETE');
        showMessage('Credential deleted successfully!');
        fetchCredentials();
      } catch (error) { showMessage(error.message, 'error'); }
    }
  };

  // --- Partners CRUD ---
  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    const url = editingPartner ? `/api/update_partner/${editingPartner.id}` : '/api/add_partner';
    const method = editingPartner ? 'PUT' : 'POST';
    try {
      await apiCall(url, method, partnerFormData);
      showMessage(`Partner ${editingPartner ? 'updated' : 'added'} successfully!`);
      setEditingPartner(null);
      setPartnerFormData({ name: '', logo_url: '' });
      fetchPartners();
    } catch (error) { showMessage(error.message, 'error'); }
  };

  const handlePartnerEdit = (partner) => {
    setEditingPartner(partner);
    setPartnerFormData(partner);
  };

  const handlePartnerDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiCall(`/api/delete_partner/${id}`, 'DELETE');
        showMessage('Partner deleted successfully!');
        fetchPartners();
      } catch (error) { showMessage(error.message, 'error'); }
    }
  };

  // --- About Us CRUD ---
  const handleAboutUsSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiCall(`/api/update_about_us/${aboutUsData.id}`, 'PUT', aboutUsFormData);
      showMessage('About Us content updated successfully!');
      fetchAboutUs();
    } catch (error) { showMessage(error.message, 'error'); }
  };

  // --- Services CRUD ---
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const url = editingService ? `/api/update_service/${editingService.id}` : '/api/add_service';
    const method = editingService ? 'PUT' : 'POST';
    try {
      await apiCall(url, method, serviceFormData);
      showMessage(`Service ${editingService ? 'updated' : 'added'} successfully!`);
      setEditingService(null);
      setServiceFormData({ title_en: '', title_ar: '', description_en: '', description_ar: '', image_url: '' });
      fetchServices();
    } catch (error) { showMessage(error.message, 'error'); }
  };

  const handleServiceEdit = (service) => {
    setEditingService(service);
    setServiceFormData(service);
  };

  const handleServiceDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiCall(`/api/delete_service/${id}`, 'DELETE');
        showMessage('Service deleted successfully!');
        fetchServices();
      } catch (error) { showMessage(error.message, 'error'); }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="admin-panel-container">
      <div className="admin-header-row">
        <h2>Admin Panel</h2>
        <button onClick={handleLogout} className="btn-signout">
          Sign Out
        </button>
      </div>
      {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}

      <div className="admin-tabs">
        <button className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Projects</button>
        <button className={`tab-button ${activeTab === 'credentials' ? 'active' : ''}`} onClick={() => setActiveTab('credentials')}>Credentials</button>
        <button className={`tab-button ${activeTab === 'partners' ? 'active' : ''}`} onClick={() => setActiveTab('partners')}>Partners</button>
        <button className={`tab-button ${activeTab === 'about_us' ? 'active' : ''}`} onClick={() => setActiveTab('about_us')}>About Us</button>
        <button className={`tab-button ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Services</button>
        <button className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>Messages</button>
      </div>

      <div className="tab-content">
        {activeTab === 'projects' && (
          <ProjectsManager 
            projects={projects} 
            formData={projectFormData} 
            setFormData={setProjectFormData} 
            handleSubmit={handleProjectSubmit} 
            handleEdit={handleProjectEdit} 
            handleDelete={handleProjectDelete} 
            editingProject={editingProject}
            setEditingProject={setEditingProject}
          />
        )}
        {activeTab === 'credentials' && (
          <CredentialsManager 
            credentials={credentials} 
            formData={credentialFormData} 
            setFormData={setCredentialFormData} 
            handleSubmit={handleCredentialSubmit} 
            handleEdit={handleCredentialEdit}
            handleDelete={handleCredentialDelete} 
            editingCredential={editingCredential}
            setEditingCredential={setEditingCredential}
          />
        )}
        {activeTab === 'partners' && (
          <PartnersManager 
            partners={partners} 
            formData={partnerFormData} 
            setFormData={setPartnerFormData} 
            handleSubmit={handlePartnerSubmit} 
            handleEdit={handlePartnerEdit} 
            handleDelete={handlePartnerDelete} 
            editingPartner={editingPartner}
            setEditingPartner={setEditingPartner}
          />
        )}
        {activeTab === 'about_us' && (
          <AboutUsManager 
            aboutUsData={aboutUsData} 
            formData={aboutUsFormData} 
            setFormData={setAboutUsFormData} 
            handleSubmit={handleAboutUsSubmit} 
          />
        )}
        {activeTab === 'services' && (
          <ServicesManager 
            services={services} 
            formData={serviceFormData} 
            setFormData={setServiceFormData} 
            handleSubmit={handleServiceSubmit} 
            handleEdit={handleServiceEdit} 
            handleDelete={handleServiceDelete} 
            editingService={editingService}
            setEditingService={setEditingService}
          />
        )}
        {activeTab === 'messages' && (
          <ContactsManager 
            contacts={contacts} 
            handleDelete={handleContactDelete} 
            handleExportCSV={handleExportCSV} 
          />
        )}
      </div>
    </div>
  );
};

// --- Sub-components for each tab ---

const ServicesManager = ({ services, formData, setFormData, handleSubmit, handleEdit, handleDelete, editingService, setEditingService }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="form-container">
        <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group"><label>Title (EN)</label><input type="text" name="title_en" value={formData.title_en} onChange={handleChange} required /></div>
          <div className="form-group"><label>Title (AR)</label><input type="text" name="title_ar" value={formData.title_ar} onChange={handleChange} /></div>
          <div className="form-group"><label>Description (EN)</label><textarea name="description_en" value={formData.description_en} onChange={handleChange}></textarea></div>
          <div className="form-group"><label>Description (AR)</label><textarea name="description_ar" value={formData.description_ar} onChange={handleChange}></textarea></div>
          <div className="form-group">
            <label>Image URL</label>
            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} />
            <ImageUploader 
              label="Upload Service Cover" 
              aspectRatio="16:9"
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image_url: url }))} 
              currentImageUrl={formData.image_url}
            />
          </div>
          <div className="form-group">
            <label>Icon URL</label>
            <input type="text" name="icon_url" value={formData.icon_url} onChange={handleChange} />
            <ImageUploader 
              label="Upload Service Icon" 
              aspectRatio="1:1"
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, icon_url: url }))} 
              currentImageUrl={formData.icon_url}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editingService ? 'Update Service' : 'Add Service'}</button>
            {editingService && <button type="button" onClick={() => setEditingService(null)} className="btn btn-secondary">Cancel</button>}
          </div>
        </form>
      </div>
      <div className="list-container">
        <h3>Existing Services</h3>
        <div className="item-list">
          {services.map(s => (
            <div key={s.id} className="item-card">
              <div className="item-card-info"><span>{s.title_en}</span></div>
              <div className="item-actions">
                <button onClick={() => handleEdit(s)} className="btn btn-edit">Edit</button>
                <button onClick={() => handleDelete(s.id)} className="btn btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AboutUsManager = ({ aboutUsData, formData, setFormData, handleSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (e, index, lang, field) => {
    const { value } = e.target;
    const list = [...formData[field][lang]];
    list[index] = value;
    setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: list } }));
  };

  const handleAddItem = (lang, field) => {
    const list = [...formData[field][lang], ""];
    setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: list } }));
  };

  const handleRemoveItem = (index, lang, field) => {
    const list = [...formData[field][lang]];
    list.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: list } }));
  };

  const handleSectionChange = (e, sectionIndex, lang, field) => {
    const { name, value } = e.target;
    const sections = [...formData.work_methodology[lang].sections];
    sections[sectionIndex][name] = value;
    setFormData(prev => ({ ...prev, work_methodology: { ...prev.work_methodology, [lang]: { ...prev.work_methodology[lang], sections } } }));
  };

  const handleSectionItemChange = (e, sectionIndex, itemIndex, lang) => {
    const { value } = e.target;
    const sections = [...formData.work_methodology[lang].sections];
    sections[sectionIndex].items[itemIndex] = value;
    setFormData(prev => ({ ...prev, work_methodology: { ...prev.work_methodology, [lang]: { ...prev.work_methodology[lang], sections } } }));
  };

  const handleAddSectionItem = (sectionIndex, lang) => {
    const sections = [...formData.work_methodology[lang].sections];
    sections[sectionIndex].items.push("");
    setFormData(prev => ({ ...prev, work_methodology: { ...prev.work_methodology, [lang]: { ...prev.work_methodology[lang], sections } } }));
  };

  const handleRemoveSectionItem = (sectionIndex, itemIndex, lang) => {
    const sections = [...formData.work_methodology[lang].sections];
    sections[sectionIndex].items.splice(itemIndex, 1);
    setFormData(prev => ({ ...prev, work_methodology: { ...prev.work_methodology, [lang]: { ...prev.work_methodology[lang], sections } } }));
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div>
      <div className="form-container">
        <h3>Edit About Us Page</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group"><label>Title (EN)</label><input type="text" name="title_en" value={formData.title_en} onChange={handleChange} required /></div>
          <div className="form-group"><label>Title (AR)</label><input type="text" name="title_ar" value={formData.title_ar} onChange={handleChange} /></div>
          <div className="form-group"><label>Description (EN)</label><textarea name="description_en" value={formData.description_en} onChange={handleChange}></textarea></div>
          <div className="form-group"><label>Description (AR)</label><textarea name="description_ar" value={formData.description_ar} onChange={handleChange}></textarea></div>
          
          <h4>Why Choose Us</h4>
          <div className="form-group"><label>Title (EN)</label><input type="text" name="why_choose_us_title_en" value={formData.why_choose_us_title_en} onChange={handleChange} /></div>
          <div className="form-group"><label>Title (AR)</label><input type="text" name="why_choose_us_title_ar" value={formData.why_choose_us_title_ar} onChange={handleChange} /></div>
          
          <h5>Why Choose Us List (EN)</h5>
          {formData.why_choose_us_list_en && formData.why_choose_us_list_en.map((item, index) => (
            <div key={index} className="list-item-editor">
              <input type="text" value={item} onChange={(e) => handleListChange(e, index, 'en', 'why_choose_us_list')} />
              <button type="button" onClick={() => handleRemoveItem(index, 'en', 'why_choose_us_list')}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddItem('en', 'why_choose_us_list')}>Add Item</button>

          <h5>Why Choose Us List (AR)</h5>
          {formData.why_choose_us_list_ar && formData.why_choose_us_list_ar.map((item, index) => (
            <div key={index} className="list-item-editor">
              <input type="text" value={item} onChange={(e) => handleListChange(e, index, 'ar', 'why_choose_us_list')} />
              <button type="button" onClick={() => handleRemoveItem(index, 'ar', 'why_choose_us_list')}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddItem('ar', 'why_choose_us_list')}>Add Item</button>

          <h4>Work Methodology</h4>
          <div className="form-group"><label>Title (EN)</label><input type="text" name="title" value={formData.work_methodology_en.title} onChange={(e) => setFormData(prev => ({...prev, work_methodology_en: {...prev.work_methodology_en, title: e.target.value}}))} /></div>
          <div className="form-group"><label>Title (AR)</label><input type="text" name="title" value={formData.work_methodology_ar.title} onChange={(e) => setFormData(prev => ({...prev, work_methodology_ar: {...prev.work_methodology_ar, title: e.target.value}}))} /></div>

          {formData.work_methodology_en && formData.work_methodology_en.sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h5>Section {sectionIndex + 1} (EN)</h5>
              <div className="form-group"><label>Mini Title</label><input type="text" name="miniTitle" value={section.miniTitle} onChange={(e) => handleSectionChange(e, sectionIndex, 'en')} /></div>
              {section.items && section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="list-item-editor">
                  <input type="text" value={item} onChange={(e) => handleSectionItemChange(e, sectionIndex, itemIndex, 'en')} />
                  <button type="button" onClick={() => handleRemoveSectionItem(sectionIndex, itemIndex, 'en')}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => handleAddSectionItem(sectionIndex, 'en')}>Add Item</button>
            </div>
          ))}

          {formData.work_methodology_ar && formData.work_methodology_ar.sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h5>Section {sectionIndex + 1} (AR)</h5>
              <div className="form-group"><label>Mini Title</label><input type="text" name="miniTitle" value={section.miniTitle} onChange={(e) => handleSectionChange(e, sectionIndex, 'ar')} /></div>
              {section.items && section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="list-item-editor">
                  <input type="text" value={item} onChange={(e) => handleSectionItemChange(e, sectionIndex, itemIndex, 'ar')} />
                  <button type="button" onClick={() => handleRemoveSectionItem(sectionIndex, itemIndex, 'ar')}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => handleAddSectionItem(sectionIndex, 'ar')}>Add Item</button>
            </div>
          ))}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Update About Us</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProjectsManager = ({ projects, formData, setFormData, handleSubmit, handleEdit, handleDelete, editingProject, setEditingProject }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div>
      <div className="form-container">
        <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          {/* Project form fields */}
          <div className="form-group"><label>Title (EN)</label><input type="text" name="title" value={formData.title} onChange={handleChange} required /></div>
          <div className="form-group"><label>Title (AR)</label><input type="text" name="title_ar" value={formData.title_ar} onChange={handleChange} /></div>
          <div className="form-group"><label>Category (EN)</label><input type="text" name="category" value={formData.category} onChange={handleChange} /></div>
          <div className="form-group"><label>Category (AR)</label><input type="text" name="category_ar" value={formData.category_ar} onChange={handleChange} /></div>
          <div className="form-group"><label>Location</label><input type="text" name="location" value={formData.location} onChange={handleChange} /></div>
          <div className="form-group checkbox-group"><label><input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />Featured</label></div>
          <div className="form-group"><label>Description (EN)</label><textarea name="description_en" value={formData.description_en} onChange={handleChange}></textarea></div>
          <div className="form-group"><label>Description (AR)</label><textarea name="description_ar" value={formData.description_ar} onChange={handleChange}></textarea></div>
          <div className="form-group"><label>Features (EN, comma-separated)</label><input type="text" name="features_en" value={formData.features_en} onChange={handleChange} /></div>
          <div className="form-group"><label>Features (AR, comma-separated)</label><input type="text" name="features_ar" value={formData.features_ar} onChange={handleChange} /></div>
          <div className="form-group">
            <label>Image URLs (comma-separated)</label>
            <input type="text" name="images" value={formData.images} onChange={handleChange} />
            <ImageUploader 
              label="Upload Project Image" 
              aspectRatio="16:9"
              onUploadSuccess={(url) => {
                const currentImages = formData.images ? formData.images.split(',').filter(Boolean) : [];
                currentImages.push(url);
                setFormData(prev => ({ ...prev, images: currentImages.join(',') }));
              }} 
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editingProject ? 'Update Project' : 'Add Project'}</button>
            {editingProject && <button type="button" onClick={() => setEditingProject(null)} className="btn btn-secondary">Cancel</button>}
          </div>
        </form>
      </div>
      <div className="list-container">
        <h3>Existing Projects</h3>
        <div className="item-list">
          {projects.map(p => (
            <div key={p.id} className="item-card">
              <div className="item-card-info"><span>{p.title}</span><p>{p.category}</p></div>
              <div className="item-actions">
                <button onClick={() => handleEdit(p)} className="btn btn-edit">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="btn btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CredentialsManager = ({ credentials, formData, setFormData, handleSubmit, handleEdit, handleDelete, editingCredential, setEditingCredential }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="form-container">
        <h3>{editingCredential ? 'Edit Credential' : 'Add New Credential'}</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Image URL</label>
            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} />
            <ImageUploader 
              label="Upload Credential Image" 
              aspectRatio="1:1"
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image_url: url }))} 
              currentImageUrl={formData.image_url}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editingCredential ? 'Update Credential' : 'Add Credential'}</button>
            {editingCredential && <button type="button" onClick={() => setEditingCredential(null)} className="btn btn-secondary">Cancel</button>}
          </div>
        </form>
      </div>
      <div className="list-container">
        <h3>Existing Credentials</h3>
        <div className="item-list">
          {credentials.map(cred => (
            <div key={cred.id} className="item-card">
              <div className="item-card-content">
                <img src={`${BLOB_STORAGE_BASE_URL}${cred.image_url}`} alt="Credential" />
                <p>{cred.image_url}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(cred)} className="btn btn-edit">Edit</button>
                <button onClick={() => handleDelete(cred.id)} className="btn btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PartnersManager = ({ partners, formData, setFormData, handleSubmit, handleEdit, handleDelete, editingPartner, setEditingPartner }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="form-container">
        <h3>{editingPartner ? 'Edit Partner' : 'Add New Partner'}</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Partner Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Logo URL</label>
            <input type="text" name="logo_url" value={formData.logo_url} onChange={handleChange} />
            <ImageUploader 
              label="Upload Partner Logo" 
              aspectRatio="1:1"
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, logo_url: url }))} 
              currentImageUrl={formData.logo_url}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editingPartner ? 'Update Partner' : 'Add Partner'}</button>
            {editingPartner && <button type="button" onClick={() => setEditingPartner(null)} className="btn btn-secondary">Cancel</button>}
          </div>
        </form>
      </div>
      <div className="list-container">
        <h3>Existing Partners</h3>
        <div className="item-list">
          {partners.map(p => (
            <div key={p.id} className="item-card">
              <div className="item-card-content">
                <img src={p.logo_url} alt={p.name} />
                <div className="item-card-info"><span>{p.name}</span></div>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(p)} className="btn btn-edit">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="btn btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Image Uploader Component with Resizing and WebP Compression ---
const ImageUploader = ({ label, onUploadSuccess, currentImageUrl, aspectRatio = 'free' }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [scale, setScale] = useState(1.0);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1200);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError('');

    try {
      const img = new Image();
      img.src = preview;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = img.width;
      let height = img.height;

      let sx = 0;
      let sy = 0;
      let sWidth = img.width;
      let sHeight = img.height;

      if (aspectRatio === '16:9') {
        const targetAspect = 16 / 9;
        if (width / height > targetAspect) {
          sWidth = height * targetAspect;
          sx = (width - sWidth) / 2;
        } else {
          sHeight = width / targetAspect;
          sy = (height - sHeight) / 2;
        }
        width = Math.min(maxWidth, sWidth);
        height = width / targetAspect;
      } else if (aspectRatio === '1:1') {
        const side = Math.min(width, height);
        sx = (width - side) / 2;
        sy = (height - side) / 2;
        sWidth = side;
        sHeight = side;
        width = Math.min(maxWidth, side);
        height = width;
      } else {
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
      }

      canvas.width = width;
      canvas.height = height;

      if (scale !== 1.0 && aspectRatio !== 'free') {
        const zoomWidth = sWidth / scale;
        const zoomHeight = sHeight / scale;
        sx = sx + (sWidth - zoomWidth) / 2;
        sy = sy + (sHeight - zoomHeight) / 2;
        sWidth = zoomWidth;
        sHeight = zoomHeight;
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);

      const webpBlob = await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/webp', quality);
      });

      const formData = new FormData();
      const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      formData.append('file', webpBlob, `${cleanName}.webp`);

      const res = await fetch('/api/upload-media', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to upload image.');
      }

      const data = await res.json();
      let finalUrl = data.url;
      const BLOB_PREFIX = 'https://pc5a0jgn4xie1mys.public.blob.vercel-storage.com';
      if (finalUrl.startsWith(BLOB_PREFIX)) {
        finalUrl = finalUrl.substring(BLOB_PREFIX.length);
      }
      onUploadSuccess(finalUrl);
      setFile(null);
      setPreview('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="image-uploader-wrapper" style={{ marginTop: '0.8rem', padding: '1rem', border: '1px dashed #ccc', borderRadius: '6px', backgroundColor: '#fafafa' }}>
      <div className="uploader-input-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <label className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', margin: 0, display: 'inline-block', cursor: 'pointer' }}>
          <span>{label}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
        {currentImageUrl && (
          <span className="current-url-text" style={{ fontSize: '0.85rem', color: '#6c757d', wordBreak: 'break-all' }}>Current: {currentImageUrl}</span>
        )}
      </div>

      {preview && (
        <div className="uploader-preview-container" style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div className="preview-canvas-box" style={{ flex: '1 1 200px', minWidth: '200px' }}>
            <div className="canvas-placeholder-frame" style={{ position: 'relative' }}>
              <span className="aspect-ratio-indicator" style={{ position: 'absolute', top: '5px', left: '5px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '3px' }}>
                Ratio: {aspectRatio}
              </span>
              <img src={preview} alt="Visual Preview" style={{ 
                maxHeight: '200px', 
                maxWidth: '100%', 
                borderRadius: '8px',
                border: '1px solid #ddd',
                objectFit: aspectRatio === '1:1' ? 'cover' : 'contain',
                aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '1:1' ? '1/1' : 'auto'
              }} />
            </div>
          </div>

          <div className="optimizer-controls" style={{ flex: '2 2 300px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {aspectRatio !== 'free' && (
              <div className="control-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#495057' }}>Zoom/Crop Scale: {scale.toFixed(1)}x</span>
                <input type="range" min="1.0" max="3.0" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
            )}

            <div className="control-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#495057' }}>Quality: {Math.round(quality * 100)}%</span>
              <input type="range" min="0.1" max="1.0" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div className="control-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#495057' }}>Max Dimension: {maxWidth}px</span>
              <input type="range" min="400" max="2000" step="100" value={maxWidth} onChange={(e) => setMaxWidth(parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>

            {error && <p className="uploader-error" style={{ color: '#dc3545', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

            <div className="uploader-actions" style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={handleUpload} disabled={isUploading} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                {isUploading ? 'Uploading...' : 'Optimize & Upload'}
              </button>
              <button type="button" onClick={() => { setFile(null); setPreview(''); }} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#e2e3e5', color: '#383d41' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Contacts Manager Component ---
const ContactsManager = ({ contacts, handleDelete, handleExportCSV }) => {
  return (
    <div>
      <div className="contacts-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3>Contact Messages ({contacts.length})</h3>
        <button onClick={handleExportCSV} className="btn btn-primary btn-export" style={{ backgroundColor: '#28a745', color: '#fff' }}>
          Export to CSV
        </button>
      </div>

      <div className="list-container" style={{ marginTop: 0 }}>
        {contacts.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>No contact messages found.</p>
        ) : (
          <div className="contacts-table-wrapper" style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #dee2e6' }}>
            <table className="contacts-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '1rem', color: '#495057', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '1rem', color: '#495057', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '1rem', color: '#495057', fontWeight: 600 }}>Phone</th>
                  <th style={{ padding: '1rem', color: '#495057', fontWeight: 600, width: '35%' }}>Message</th>
                  <th style={{ padding: '1rem', color: '#495057', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '1rem', color: '#495057', fontWeight: 600, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #dee2e6' }} className="contact-row">
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#212529' }}>{c.name}</td>
                    <td style={{ padding: '1rem' }}><a href={`mailto:${c.email}`} style={{ color: '#007bff', textDecoration: 'none' }}>{c.email}</a></td>
                    <td style={{ padding: '1rem' }}><a href={`tel:${c.phone}`} style={{ color: '#007bff', textDecoration: 'none' }}>{c.phone}</a></td>
                    <td style={{ padding: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.95rem', color: '#495057', lineHeight: 1.5 }}>{c.message}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#6c757d' }}>{new Date(c.created_at).toLocaleString()}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button onClick={() => handleDelete(c.id)} className="btn btn-delete" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;