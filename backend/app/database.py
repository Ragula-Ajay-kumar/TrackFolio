import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Set DATABASE_URL env var for Postgres in production, e.g.
# postgresql://user:password@host:5432/dbname
# Defaults to local SQLite file so it runs with zero setup.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./trackfolio.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
