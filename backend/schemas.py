from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    absolute_magnitude: float = Field(..., ge=5, le=35, description="Absolute magnitude H")
    est_diameter_min_km: float = Field(..., ge=0, le=50, description="Estimated diameter, min (km)")
    est_diameter_max_km: float = Field(..., ge=0, le=50, description="Estimated diameter, max (km)")
    relative_velocity_kph: float = Field(..., ge=0, le=300000, description="Relative velocity (km/h)")
    miss_distance_km: float = Field(..., ge=0, le=200_000_000, description="Miss distance (km)")
    orbital_period_days: float = Field(..., ge=0, le=10000, description="Orbital period (days)")
    semi_major_axis_au: float = Field(..., ge=0, le=20, description="Semi-major axis (AU)")
    eccentricity: float = Field(..., ge=0, le=1, description="Orbital eccentricity")
    inclination_deg: float = Field(..., ge=0, le=180, description="Inclination (deg)")
    min_orbit_intersection_au: float = Field(..., ge=0, le=5, description="Minimum orbit intersection distance (AU)")


class FeatureContribution(BaseModel):
    feature: str
    label: str
    value: float
    importance: float


class PredictionResponse(BaseModel):
    hazardous: bool
    probability: float
    riskLevel: str
    riskColor: str
    topContributors: list[FeatureContribution]
