"""ASTRA Space SQLAlchemy Models

Separates satellite catalog identity from time-stamped Keplerian orbital element sets.
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Index
from app.db.base import Base, TimestampMixin


class SatelliteModel(Base, TimestampMixin):
    __tablename__ = "satellites"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    norad_id: Mapped[Optional[int]] = mapped_column(Integer, unique=True, index=True, nullable=True)
    cospar_id: Mapped[Optional[str]] = mapped_column(String(32), index=True, nullable=True)
    name: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    country: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    launch_date: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    sat_type: Mapped[str] = mapped_column(String(32), default="unknown", nullable=False)
    operational_status: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    elements: Mapped[List["OrbitalElementModel"]] = relationship(
        "OrbitalElementModel",
        back_populates="satellite",
        cascade="all, delete-orphan",
        order_by="desc(OrbitalElementModel.epoch)",
    )


class OrbitalElementModel(Base, TimestampMixin):
    __tablename__ = "orbital_elements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    satellite_id: Mapped[str] = mapped_column(String(64), ForeignKey("satellites.id", ondelete="CASCADE"), index=True)
    epoch: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    inclination: Mapped[float] = mapped_column(Float, nullable=False)
    raan: Mapped[float] = mapped_column(Float, nullable=False)
    eccentricity: Mapped[float] = mapped_column(Float, nullable=False)
    argument_of_perigee: Mapped[float] = mapped_column(Float, nullable=False)
    mean_anomaly: Mapped[float] = mapped_column(Float, nullable=False)
    mean_motion: Mapped[float] = mapped_column(Float, nullable=False)
    perigee_km: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    apogee_km: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    period_minutes: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    source_id: Mapped[str] = mapped_column(String(64), nullable=False)

    satellite: Mapped["SatelliteModel"] = relationship("SatelliteModel", back_populates="elements")
