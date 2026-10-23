"""ASTRA Aviation SQLAlchemy Models

Separates airframe registration metadata from dynamic telemetry observations.
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Float, Boolean, DateTime, Integer, ForeignKey, Index
from app.db.base import Base, TimestampMixin


class AircraftModel(Base, TimestampMixin):
    __tablename__ = "aircraft"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    icao24: Mapped[Optional[str]] = mapped_column(String(32), unique=True, index=True, nullable=True)
    callsign: Mapped[Optional[str]] = mapped_column(String(32), index=True, nullable=True)
    registration: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    aircraft_type: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    operator: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    origin: Mapped[Optional[str]] = mapped_column(String(8), nullable=True)
    destination: Mapped[Optional[str]] = mapped_column(String(8), nullable=True)
    category: Mapped[str] = mapped_column(String(32), default="unknown", nullable=False)

    observations: Mapped[List["AircraftObservationModel"]] = relationship(
        "AircraftObservationModel",
        back_populates="aircraft",
        cascade="all, delete-orphan",
        order_by="desc(AircraftObservationModel.observed_at)",
    )


class AircraftObservationModel(Base, TimestampMixin):
    __tablename__ = "aircraft_observations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    aircraft_id: Mapped[str] = mapped_column(String(64), ForeignKey("aircraft.id", ondelete="CASCADE"), index=True)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lon: Mapped[float] = mapped_column(Float, nullable=False)
    altitude_meters: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    heading: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    speed_knots: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    vertical_rate_ms: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    squawk: Mapped[Optional[str]] = mapped_column(String(16), nullable=True)
    on_ground: Mapped[bool] = mapped_column(Boolean, default=False)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    source_id: Mapped[str] = mapped_column(String(64), nullable=False)
    provenance: Mapped[str] = mapped_column(String(32), default="demonstration", nullable=False)

    aircraft: Mapped["AircraftModel"] = relationship("AircraftModel", back_populates="observations")

    __table_args__ = (
        Index("ix_aircraft_obs_coords", "lat", "lon"),
    )
