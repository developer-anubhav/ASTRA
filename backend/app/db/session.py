"""ASTRA Database Session and Connection Management

Handles PostgreSQL/PostGIS connection pooling and asynchronous session lifecycles.
Gracefully handles unconfigured or unreachable database connections.
"""

from typing import AsyncGenerator, Optional, Tuple
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    AsyncEngine,
    create_async_engine,
    async_sessionmaker,
)
from sqlalchemy import text
from app.core.config import settings
from app.core.logging import logger

_engine: Optional[AsyncEngine] = None
_session_factory: Optional[async_sessionmaker[AsyncSession]] = None


def get_engine() -> Optional[AsyncEngine]:
    global _engine
    if _engine is None and settings.DATABASE_URL:
        try:
            # Enforce asyncpg driver if postgresql:// is provided without driver
            db_url = settings.DATABASE_URL
            if db_url.startswith("postgresql://"):
                db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

            _engine = create_async_engine(
                db_url,
                pool_size=settings.DATABASE_POOL_SIZE,
                max_overflow=settings.DATABASE_MAX_OVERFLOW,
                connect_args={"timeout": settings.DATABASE_TIMEOUT_SECONDS},
                echo=settings.DEBUG,
            )
            logger.info("Initialized PostgreSQL database engine.")
        except Exception as e:
            logger.warning("Failed to initialize database engine: %s", str(e))
            _engine = None
    return _engine


def get_session_factory() -> Optional[async_sessionmaker[AsyncSession]]:
    global _session_factory
    engine = get_engine()
    if _session_factory is None and engine is not None:
        _session_factory = async_sessionmaker(
            bind=engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autoflush=False,
        )
    return _session_factory


async def get_db_session() -> AsyncGenerator[Optional[AsyncSession], None]:
    """Dependency for injecting an async database session."""
    factory = get_session_factory()
    if factory is None:
        yield None
        return

    async with factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def close_engine() -> None:
    """Disposes active database engine connection pool."""
    global _engine, _session_factory
    if _engine is not None:
        await _engine.dispose()
        _engine = None
        _session_factory = None
        logger.info("Closed PostgreSQL database engine.")


async def check_db_health() -> Tuple[bool, str, dict]:
    """Checks database connectivity and PostGIS extension status without crashing."""
    if not settings.DATABASE_URL:
        return False, "Database not configured (operating in in-memory / demonstration mode)", {"configured": False}

    engine = get_engine()
    if engine is None:
        return False, "Failed to initialize database engine", {"configured": True, "connected": False}

    try:
        async with engine.connect() as conn:
            # Basic liveness ping
            await conn.execute(text("SELECT 1"))

            # Check for PostGIS extension
            postgis_version = None
            try:
                result = await conn.execute(text("SELECT PostGIS_Version()"))
                row = result.fetchone()
                if row:
                    postgis_version = row[0]
            except Exception:
                postgis_version = "PostGIS extension not enabled"

            return True, "Database connection operational", {
                "configured": True,
                "connected": True,
                "postgis": postgis_version,
            }
    except Exception as e:
        logger.debug("Database health check failed: %s", str(e))
        return False, f"Database unreachable: {str(e)}", {"configured": True, "connected": False}
