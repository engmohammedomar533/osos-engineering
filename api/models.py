from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, func, ARRAY, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)

class Project(Base):
    __tablename__ = 'projects'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    title_ar = Column(String(255))
    category = Column(String(255))
    category_ar = Column(String(255))
    location = Column(String(255))
    featured = Column(Boolean, default=False)
    description_en = Column(Text)
    description_ar = Column(Text)
    features_en = Column(ARRAY(Text))
    features_ar = Column(ARRAY(Text))
    images = Column(ARRAY(Text))

class AboutUs(Base):
    __tablename__ = 'about_us'
    
    id = Column(Integer, primary_key=True, index=True)
    title_en = Column(Text, nullable=False)
    title_ar = Column(Text, nullable=False)
    description_en = Column(Text, nullable=False)
    description_ar = Column(Text, nullable=False)
    why_choose_us_title_en = Column(Text)
    why_choose_us_title_ar = Column(Text)
    why_choose_us_list_en = Column(JSON)
    why_choose_us_list_ar = Column(JSON)
    work_methodology_en = Column(JSON)
    work_methodology_ar = Column(JSON)

class Service(Base):
    __tablename__ = 'services'
    
    id = Column(Integer, primary_key=True, index=True)
    title_en = Column(Text, nullable=False)
    title_ar = Column(Text, nullable=False)
    description_en = Column(Text, nullable=False)
    description_ar = Column(Text, nullable=False)
    image_url = Column(Text)
    icon_url = Column(Text)

class Credential(Base):
    __tablename__ = 'credentials'
    
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(Text, nullable=False)

class Partner(Base):
    __tablename__ = 'partners'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    logo_url = Column(Text, nullable=False)

class Contact(Base):
    __tablename__ = 'contacts'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    phone = Column(Text, nullable=False)
    email = Column(Text, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
