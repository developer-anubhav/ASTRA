"""Initial ASTRA schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-24 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Optional PostGIS extension creation if superuser permissions allow
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")

    # 1. Sources table
    op.create_table(
        "sources",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("domain", sa.String(length=32), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("base_url", sa.String(length=256), nullable=True),
        sa.Column("last_checked", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_successful", sa.DateTime(timezone=True), nullable=True),
        sa.Column("rate_limit_note", sa.String(length=256), nullable=True),
        sa.Column("license_note", sa.String(length=256), nullable=True),
        sa.Column("coverage_note", sa.Text(), nullable=True),
        sa.Column("attribution_required", sa.Boolean(), nullable=False, default=False),
        sa.Column("requires_api_key", sa.Boolean(), nullable=False, default=False),
        sa.Column("is_demo", sa.Boolean(), nullable=False, default=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_sources_domain", "sources", ["domain"])
    op.create_index("ix_sources_status", "sources", ["status"])

    # 2. Vessels table
    op.create_table(
        "vessels",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("mmsi", sa.String(length=32), nullable=True, unique=True),
        sa.Column("imo", sa.String(length=32), nullable=True),
        sa.Column("call_sign", sa.String(length=32), nullable=True),
        sa.Column("name", sa.String(length=128), nullable=True),
        sa.Column("flag", sa.String(length=8), nullable=True),
        sa.Column("vessel_type", sa.String(length=32), nullable=False),
        sa.Column("gross_tonnage", sa.Integer(), nullable=True),
        sa.Column("length_meters", sa.Float(), nullable=True),
        sa.Column("beam_meters", sa.Float(), nullable=True),
        sa.Column("draft", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_vessels_vessel_type", "vessels", ["vessel_type"])
    op.create_index("ix_vessels_name", "vessels", ["name"])

    # 3. Vessel Observations
    op.create_table(
        "vessel_observations",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("vessel_id", sa.String(length=64), sa.ForeignKey("vessels.id", ondelete="CASCADE"), nullable=False),
        sa.Column("lat", sa.Float(), nullable=False),
        sa.Column("lon", sa.Float(), nullable=False),
        sa.Column("heading", sa.Float(), nullable=True),
        sa.Column("speed_knots", sa.Float(), nullable=True),
        sa.Column("course_over_ground", sa.Float(), nullable=True),
        sa.Column("nav_status", sa.String(length=64), nullable=True),
        sa.Column("destination", sa.String(length=128), nullable=True),
        sa.Column("eta", sa.DateTime(timezone=True), nullable=True),
        sa.Column("observed_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("source_id", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_vessel_observations_vessel_id", "vessel_observations", ["vessel_id"])
    op.create_index("ix_vessel_observations_observed_at", "vessel_observations", ["observed_at"])

    # 4. Aircraft table
    op.create_table(
        "aircraft",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("icao24", sa.String(length=24), nullable=True, unique=True),
        sa.Column("callsign", sa.String(length=32), nullable=True),
        sa.Column("registration", sa.String(length=32), nullable=True),
        sa.Column("aircraft_type", sa.String(length=32), nullable=True),
        sa.Column("operator", sa.String(length=128), nullable=True),
        sa.Column("origin", sa.String(length=8), nullable=True),
        sa.Column("destination", sa.String(length=8), nullable=True),
        sa.Column("category", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_aircraft_category", "aircraft", ["category"])
    op.create_index("ix_aircraft_callsign", "aircraft", ["callsign"])

    # 5. Aircraft Observations
    op.create_table(
        "aircraft_observations",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("aircraft_id", sa.String(length=64), sa.ForeignKey("aircraft.id", ondelete="CASCADE"), nullable=False),
        sa.Column("lat", sa.Float(), nullable=False),
        sa.Column("lon", sa.Float(), nullable=False),
        sa.Column("altitude_meters", sa.Float(), nullable=True),
        sa.Column("heading", sa.Float(), nullable=True),
        sa.Column("speed_knots", sa.Float(), nullable=True),
        sa.Column("vertical_rate_ms", sa.Float(), nullable=True),
        sa.Column("squawk", sa.String(length=16), nullable=True),
        sa.Column("on_ground", sa.Boolean(), nullable=False, default=False),
        sa.Column("observed_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("source_id", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_aircraft_observations_aircraft_id", "aircraft_observations", ["aircraft_id"])
    op.create_index("ix_aircraft_observations_observed_at", "aircraft_observations", ["observed_at"])

    # 6. Satellites table
    op.create_table(
        "satellites",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("norad_id", sa.Integer(), nullable=True, unique=True),
        sa.Column("cospar_id", sa.String(length=32), nullable=True),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("country", sa.String(length=64), nullable=True),
        sa.Column("launch_date", sa.String(length=32), nullable=True),
        sa.Column("sat_type", sa.String(length=32), nullable=False),
        sa.Column("operational_status", sa.String(length=128), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_satellites_sat_type", "satellites", ["sat_type"])
    op.create_index("ix_satellites_name", "satellites", ["name"])

    # 7. Orbital Elements table
    op.create_table(
        "orbital_elements",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("satellite_id", sa.String(length=64), sa.ForeignKey("satellites.id", ondelete="CASCADE"), nullable=False),
        sa.Column("epoch", sa.DateTime(timezone=True), nullable=False),
        sa.Column("inclination", sa.Float(), nullable=False),
        sa.Column("raan", sa.Float(), nullable=False),
        sa.Column("eccentricity", sa.Float(), nullable=False),
        sa.Column("argument_of_perigee", sa.Float(), nullable=False),
        sa.Column("mean_anomaly", sa.Float(), nullable=False),
        sa.Column("mean_motion", sa.Float(), nullable=False),
        sa.Column("b_star_drag_term", sa.Float(), nullable=True),
        sa.Column("rev_at_epoch", sa.Integer(), nullable=True),
        sa.Column("semimajor_axis_km", sa.Float(), nullable=True),
        sa.Column("perigee_km", sa.Float(), nullable=True),
        sa.Column("apogee_km", sa.Float(), nullable=True),
        sa.Column("period_minutes", sa.Float(), nullable=True),
        sa.Column("source_id", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_orbital_elements_satellite_id", "orbital_elements", ["satellite_id"])
    op.create_index("ix_orbital_elements_epoch", "orbital_elements", ["epoch"])

    # 8. Events table
    op.create_table(
        "events",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("title", sa.String(length=256), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=32), nullable=False),
        sa.Column("severity", sa.String(length=16), nullable=False),
        sa.Column("factual_status", sa.String(length=16), nullable=False),
        sa.Column("lat", sa.Float(), nullable=True),
        sa.Column("lon", sa.Float(), nullable=True),
        sa.Column("location_name", sa.String(length=256), nullable=True),
        sa.Column("country", sa.String(length=64), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("event_updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("source_url", sa.String(length=512), nullable=True),
        sa.Column("source_name", sa.String(length=128), nullable=True),
        sa.Column("tags", sa.JSON(), nullable=True),
        sa.Column("source_id", sa.String(length=64), nullable=False),
        sa.Column("source_display_name", sa.String(length=128), nullable=False),
        sa.Column("provenance", sa.String(length=32), nullable=False, server_default="demonstration"),
        sa.Column("analysis_note", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_events_category", "events", ["category"])
    op.create_index("ix_events_severity", "events", ["severity"])
    op.create_index("ix_events_started_at", "events", ["started_at"])


def downgrade() -> None:
    op.drop_table("events")
    op.drop_table("orbital_elements")
    op.drop_table("satellites")
    op.drop_table("aircraft_observations")
    op.drop_table("aircraft")
    op.drop_table("vessel_observations")
    op.drop_table("vessels")
    op.drop_table("sources")
