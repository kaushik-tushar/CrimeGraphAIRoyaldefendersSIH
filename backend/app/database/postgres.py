import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

def create_db_engine():
    """
    Attempts to connect to PostgreSQL. If connection fails and fallback is enabled,
    falls back to SQLite for local development so that development & testing
    can proceed without requiring a running Docker Postgres instance.
    """
    database_url = settings.DATABASE_URL
    try:
        engine = create_engine(
            database_url,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 2},
            echo=False
        )
        # Test connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Successfully connected to PostgreSQL database.")
        return engine
    except Exception as e:
        if settings.USE_SQLITE_FALLBACK:
            logger.warning(
                f"PostgreSQL connection failed ({e}). Falling back to SQLite database at {settings.DATABASE_FALLBACK_URL}"
            )
            fallback_engine = create_engine(
                settings.DATABASE_FALLBACK_URL,
                connect_args={"check_same_thread": False},
                echo=False
            )
            return fallback_engine
        else:
            logger.error(f"Failed to connect to PostgreSQL: {e}")
            raise e

engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Session:
    """
    FastAPI dependency that yields a database session and guarantees closure.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Create all tables in the database.
    """
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified / created successfully.")
