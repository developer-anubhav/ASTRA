"""ASTRA Data Source SQLAlchemy Model"""

from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Boolean, DateTime
from app.db.base import Base, TimestampMixin


class SourceModel(Base, TimestampMixin):
    __tablename__ = "data_sources"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    domain: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="unconfigured", nullable=False)
    base_url: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    last_checked: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_successful: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    rate_limit_note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    license_note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    coverage_note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    attribution_required: Mapped[bool] = mapped_column(Boolean, default=False)
    requires_api_key: Mapped[bool] = mapped_column(Boolean, default=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False)
