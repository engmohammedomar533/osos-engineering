
from fastapi import FastAPI, HTTPException, Depends, APIRouter, UploadFile, File
from pydantic import BaseModel
from . import models
import os
import bcrypt
import vercel_blob
from jose import jwt, JWTError
from datetime import datetime, timedelta
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode

from fastapi.responses import Response

# --- Main FastAPI App Initialization ---
app = FastAPI()

class VercelPathMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            headers = dict(scope.get("headers", []))
            matched_path = headers.get(b"x-matched-path")
            if matched_path:
                scope["path"] = matched_path.decode("utf-8")
        await self.app(scope, receive, send)

app.add_middleware(VercelPathMiddleware)

@app.get("/sitemap.xml", response_class=Response)
def get_sitemap():
    sitemap_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'sitemap.xml')
    try:
        with open(sitemap_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return Response(content=content, media_type="application/xml")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Sitemap not found")


# --- Configuration & Database Connection ---
SECRET_KEY = os.environ.get("SECRET_KEY", "a_very_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

DATABASE_URL = os.environ.get("POSTGRES_URL")
if not DATABASE_URL:
    raise RuntimeError("POSTGRES_URL environment variable is not set.")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = "postgresql+pg8000://" + DATABASE_URL.split("://")[1]

parsed_url = urlparse(DATABASE_URL)
query_params = parse_qs(parsed_url.query)
if 'sslmode' in query_params:
    del query_params['sslmode']
DATABASE_URL = urlunparse(parsed_url._replace(query=urlencode(query_params, doseq=True)))

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Authentication ---
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username

# --- Auth Router ---
auth_router = APIRouter()

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@auth_router.post("/login", response_model=Token)
def login_for_access_token(form_data: UserLogin, db = Depends(get_db)):
    try:
        user = db.query(models.User).filter(models.User.username == form_data.username).first()
        if not user or not verify_password(form_data.password, user.password_hash):
            raise HTTPException(
                status_code=401,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"An unexpected error occurred during login: {e}")
        raise HTTPException(
            status_code=500,
            detail="An internal server error occurred.",
        )

# --- Projects Router ---
projects_router = APIRouter()

class Project(BaseModel):
    title: str
    title_ar: Optional[str] = None
    category: Optional[str] = None
    category_ar: Optional[str] = None
    location: Optional[str] = None
    featured: Optional[bool] = False
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    features_en: Optional[List[str]] = []
    features_ar: Optional[List[str]] = []
    images: Optional[List[str]] = []

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    title_ar: Optional[str] = None
    category: Optional[str] = None
    category_ar: Optional[str] = None
    location: Optional[str] = None
    featured: Optional[bool] = None
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    features_en: Optional[List[str]] = None
    features_ar: Optional[List[str]] = None
    images: Optional[List[str]] = None

@projects_router.get("/get_projects")
def get_projects(db = Depends(get_db)):
    try:
        projects = db.query(models.Project).order_by(models.Project.id).all()
        return projects
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Failed to fetch projects")

@projects_router.post("/add_project", dependencies=[Depends(get_current_user)])
def add_project(project: Project, db = Depends(get_db)):
    try:
        db_project = models.Project(**project.dict())
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return {"message": "Project added successfully", "id": db_project.id}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to add project")

@projects_router.put("/update_project/{project_id}", dependencies=[Depends(get_current_user)])
def update_project(project_id: int, project: ProjectUpdate, db = Depends(get_db)):
    try:
        db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")
        update_data = project.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_project, key, value)
        db.commit()
        return {"message": "Project updated successfully", "id": db_project.id}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update project")

@projects_router.delete("/delete_project/{project_id}", dependencies=[Depends(get_current_user)])
def delete_project(project_id: int, db = Depends(get_db)):
    try:
        db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")
        db.delete(db_project)
        db.commit()
        return {"message": "Project deleted successfully", "id": project_id}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete project")

# --- Credentials Router ---
credentials_router = APIRouter()

class Credential(BaseModel):
    image_url: str

class CredentialUpdate(BaseModel):
    image_url: Optional[str] = None

@credentials_router.get("/get_credentials")
def get_credentials(db = Depends(get_db)):
    try:
        credentials = db.query(models.Credential).order_by(models.Credential.id).all()
        return credentials
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Failed to fetch credentials")

@credentials_router.post("/add_credential", dependencies=[Depends(get_current_user)])
def add_credential(credential: Credential, db = Depends(get_db)):
    try:
        db_credential = models.Credential(image_url=credential.image_url)
        db.add(db_credential)
        db.commit()
        return {"message": "Credential added successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to add credential")

@credentials_router.put("/update_credential/{credential_id}", dependencies=[Depends(get_current_user)])
def update_credential(credential_id: int, credential: CredentialUpdate, db = Depends(get_db)):
    try:
        db_credential = db.query(models.Credential).filter(models.Credential.id == credential_id).first()
        if not db_credential:
            raise HTTPException(status_code=404, detail="Credential not found")
        update_data = credential.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_credential, key, value)
        db.commit()
        return {"message": "Credential updated successfully", "id": db_credential.id}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update credential")

@credentials_router.delete("/delete_credential/{credential_id}", dependencies=[Depends(get_current_user)])
def delete_credential(credential_id: int, db = Depends(get_db)):
    try:
        db_credential = db.query(models.Credential).filter(models.Credential.id == credential_id).first()
        if not db_credential:
            raise HTTPException(status_code=404, detail="Credential not found")
        db.delete(db_credential)
        db.commit()
        return {"message": "Credential deleted successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete credential")

# --- Partners Router ---
partners_router = APIRouter()

class Partner(BaseModel):
    name: str
    logo_url: str

class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None

@partners_router.get("/get_partner_logos")
def get_partner_logos(db = Depends(get_db)):
    try:
        partners = db.query(models.Partner).order_by(models.Partner.id).all()
        return partners
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Failed to fetch partner logos")

@partners_router.post("/add_partner", dependencies=[Depends(get_current_user)])
def add_partner(partner: Partner, db = Depends(get_db)):
    try:
        db_partner = models.Partner(name=partner.name, logo_url=partner.logo_url)
        db.add(db_partner)
        db.commit()
        return {"message": "Partner added successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to add partner")

@partners_router.put("/update_partner/{partner_id}", dependencies=[Depends(get_current_user)])
def update_partner(partner_id: int, partner: PartnerUpdate, db = Depends(get_db)):
    try:
        db_partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
        if not db_partner:
            raise HTTPException(status_code=404, detail="Partner not found")
        update_data = partner.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_partner, key, value)
        db.commit()
        return {"message": "Partner updated successfully", "id": db_partner.id}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update partner")

@partners_router.delete("/delete_partner/{partner_id}", dependencies=[Depends(get_current_user)])
def delete_partner(partner_id: int, db = Depends(get_db)):
    try:
        db_partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
        if not db_partner:
            raise HTTPException(status_code=404, detail="Partner not found")
        db.delete(db_partner)
        db.commit()
        return {"message": "Partner deleted successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete partner")

# --- Media Upload Router ---
media_router = APIRouter()

@media_router.post("/upload-media", dependencies=[Depends(get_current_user)])
async def upload_media(file: UploadFile = File(...)):
    try:
        token = os.environ.get("BLOB_READ_WRITE_TOKEN")
        if not token:
            raise HTTPException(status_code=500, detail="Vercel Blob token is not configured on the server.")
        
        contents = await file.read()
        filename = file.filename
        path = f"uploads/{filename}"
        
        resp = vercel_blob.put(
            path,
            contents,
            options={
                'token': token,
                'allowOverwrite': True
            }
        )
        
        url = resp.get('url')
        if not url:
            raise HTTPException(status_code=500, detail="Failed to upload file to Vercel Blob.")
            
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

from .about_us import about_us_router
from .services import services_router
from .contacts import contacts_router

# --- Include Routers in Main App ---
app.include_router(auth_router, prefix="/api")
app.include_router(projects_router, prefix="/api")
app.include_router(credentials_router, prefix="/api")
app.include_router(partners_router, prefix="/api")
app.include_router(media_router, prefix="/api")
app.include_router(about_us_router, prefix="/api")
app.include_router(services_router, prefix="/api")
app.include_router(contacts_router, prefix="/api")

import requests
import xml.etree.ElementTree as ET
import email.utils
from datetime import datetime
import re

def parse_rss_date(date_str):
    try:
        parsed = email.utils.parsedate_to_datetime(date_str)
        return parsed.isoformat()
    except Exception:
        return date_str

def clean_html(text):
    if not text:
        return ""
    # Remove HTML tags and decodes
    clean = re.compile('<.*?>')
    cleaned = re.sub(clean, '', text)
    return cleaned.strip()

def parse_hmm_date(date_str):
    try:
        parts = date_str.split('-')
        if len(parts) == 3:
            year = int(parts[0])
            month = int(parts[1])
            day = int(parts[2])
            dt = datetime(year, month, day)
            return dt.isoformat()
    except Exception:
        pass
    return date_str

@app.get("/api/get_news_feed")
def get_news_feed(lang: str = "en"):
    if lang == "ar":
        feeds = [
            {"source": "صحيفة مكة", "url": "https://makkahnewspaper.com/rss"},
            {"source": "أرقام العقارية", "url": "https://www.argaam.com/ar/rss/categoryrss/categoryid/143"},
            {"source": "جريدة الرياض - العقار", "url": "https://www.alriyadh.com/section.realestate.xml"}
        ]
        makkah_keywords = ["مكة", "المقدسة", "الحرم", "المشاعر", "جبل عمر", "مسار", "وجهة مسار", "الرصيفة", "الكعبة"]
    else:
        feeds = [
            {"source": "ENR (Engineering News)", "url": "https://www.enr.com/rss/articles"},
            {"source": "ArchDaily (Architecture)", "url": "https://www.archdaily.com/feed"}
        ]
        makkah_keywords = ["makkah", "mecca", "holy mosque", "haram", "jabal omar", "masar", "rusaifa", "holy sites"]

    articles = []
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    # Fetch from Holy Makkah Municipality API
    try:
        hmm_url = "https://hmm.gov.sa/hmm_mgr/api/new_portal/api/News.php"
        hmm_res = requests.get(hmm_url, headers=headers, timeout=6)
        if hmm_res.status_code == 200:
            hmm_data = hmm_res.json()
            # The articles list is under the 'data' key
            items = hmm_data.get("data", [])
            for item in items:
                title = item.get("title", "")
                desc = item.get("description", "")
                img_url = item.get("img", "")
                date_str = item.get("date", "")
                news_id = item.get("id", "")
                
                title_clean = title.strip()
                desc_clean = clean_html(desc)[:200] + "..." if desc else ""
                
                # Dynamic link pointing to the exact municipality news article detail page
                link = f"https://hmm.gov.sa/news-details?id={news_id}"
                
                articles.append({
                    "title": title_clean,
                    "link": link,
                    "pubDate": parse_hmm_date(date_str),
                    "pubDateRaw": date_str,
                    "description": desc_clean,
                    "source": "أمانة العاصمة المقدسة" if lang == "ar" else "Holy Makkah Municipality",
                    "imageUrl": img_url,
                    "isMakkah": True  # Always True since it's the Makkah Municipality
                })
    except Exception as e:
        # Silently fail HMM API and proceed to RSS feeds
        pass

    for feed in feeds:
        try:
            res = requests.get(feed["url"], headers=headers, timeout=6)
            if res.status_code != 200:
                continue
            
            root = ET.fromstring(res.content)
            items = root.findall(".//item")
            for item in items[:15]:
                title_node = item.find("title")
                link_node = item.find("link")
                pub_date_node = item.find("pubDate")
                desc_node = item.find("description")
                
                title = title_node.text if title_node is not None and title_node.text else ""
                link = link_node.text if link_node is not None and link_node.text else ""
                pub_date_raw = pub_date_node.text if pub_date_node is not None and pub_date_node.text else ""
                desc_raw = desc_node.text if desc_node is not None and desc_node.text else ""
                
                image_url = ""
                enclosure = item.find("enclosure")
                if enclosure is not None:
                    image_url = enclosure.get("url", "")
                
                if not image_url:
                    for child in item:
                        if 'content' in child.tag and child.get("url"):
                            image_url = child.get("url")
                            break
                            
                if not image_url and desc_raw:
                    img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', desc_raw)
                    if img_match:
                        image_url = img_match.group(1)

                title_clean = title.strip()
                desc_clean = clean_html(desc_raw)[:200] + "..." if desc_raw else ""
                
                is_makkah = any(kw in title_clean.lower() or kw in desc_clean.lower() for kw in makkah_keywords)

                articles.append({
                    "title": title_clean,
                    "link": link.strip(),
                    "pubDate": parse_rss_date(pub_date_raw),
                    "pubDateRaw": pub_date_raw,
                    "description": desc_clean,
                    "source": feed["source"],
                    "imageUrl": image_url,
                    "isMakkah": is_makkah
                })
        except Exception as e:
            continue

    try:
        articles.sort(key=lambda x: (not x["isMakkah"], x["pubDate"]), reverse=True)
    except Exception:

        # Fallback to date sort only if compound key fails
        try:
            articles.sort(key=lambda x: x["pubDate"], reverse=True)
        except Exception:
            pass

    return articles

# Optional: Add a root endpoint for discovery
@app.get("/api")
def read_root():
    return {"message": "Welcome to the Osos API"}

