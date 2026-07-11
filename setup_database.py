import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from api.models import Base, User, Project, AboutUs, Service, Credential, Partner, Contact

load_dotenv()

DATABASE_URL = os.environ.get('POSTGRES_URL')
if not DATABASE_URL:
    print("Error: POSTGRES_URL environment variable is not set.")
    exit(1)

# Ensure correct pg8000 driver dialect prefix
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+pg8000://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+pg8000://", 1)

engine = create_engine(DATABASE_URL)

print("Initializing PostgreSQL database tables...")
Base.metadata.create_all(bind=engine)
print("All tables ('users', 'projects', 'about_us', 'services', 'credentials', 'partners', 'contacts') initialized successfully.")
