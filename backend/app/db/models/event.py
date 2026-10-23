"""ASTRA Global Events SQLAlchemy Models

Persists global geopolitical, environmental, and conflict events.
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Float, DateTime, Text, JSON, Index
from app.db.base import Base, TimestampMixin


class EventModel(Base, TimestampMixin):
    __tablename__ = "events"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False, index=True)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    severity: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    factual_status: Mapped[str] = mapped_column(String(16), nullable=False, index=True)

    lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    lon: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    location_name: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    country: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)

    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    event_updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    source_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    source_name: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    tags: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)

    source_id: Mapped[str] = mapped_column(String(64), nullable=False)
    source_display_name: Mapped[str] = mapped_column(String(128), nullable=False)
    provenance: Mapped[str] = mapped_column(String(32), nullable=False, default="demonstration")
    analysis_note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    __table_args__ = (
        Index("ix_events_category_severity", "category", "severity"),
        Index("ix_events_started_at", "started_at"),
    )
