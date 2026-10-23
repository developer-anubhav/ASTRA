"""ASTRA Maritime SQLAlchemy Models

Separates immutable vessel registry metadata from dynamic time-stamped observations.
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Index
from app.db.base import Base, TimestampMixin


class VesselModel(Base, TimestampMixin):
    __tablename__ = "vessels"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    mmsi: Mapped[Optional[str]] = mapped_column(String(32), unique=True, index=True, nullable=True)
    imo: Mapped[Optional[str]] = mapped_column(String(32), index=True, nullable=True)
    call_sign: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    name: Mapped[Optional[str]] = mapped_column(String(128), index=True, nullable=True)
    flag: Mapped[Optional[str]] = mapped_column(String(8), nullable=True)
    vessel_type: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    gross_tonnage: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    length_meters: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    beam_meters: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    draft: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    observations: Mapped[List["VesselObservationModel"]] = relationship(
        "VesselObservationModel",
        back_populates="vessel",
        cascade="all, delete-orphan",
        order_by="desc(VesselObservationModel.observed_at)",
    )


class VesselObservationModel(Base, TimestampMixin):
    __tablename__ = "vessel_observations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    vessel_id: Mapped[str] = mapped_column(String(64), ForeignKey("vessels.id", ondelete="CASCADE"), index=True)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lon: Mapped[float] = mapped_column(Float, nullable=False)
    heading: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    speed_knots: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    course_over_ground: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    nav_status: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    destination: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    eta: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    source_id: Mapped[str] = mapped_column(String(64), nullable=False)
    provenance: Mapped[str] = mapped_column(String(32), default="demonstration", nullable=False)

    vessel: Mapped["VesselModel"] = relationship("VesselModel", back_populates="observations")

    __table_args__ = (
        Index("ix_vessel_obs_coords", "lat", "lon"),
    )
