from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional, List

from .index import get_db, get_current_user
from . import models

services_router = APIRouter()

class Service(BaseModel):
    id: int
    title_en: str
    title_ar: str
    description_en: str
    description_ar: str
    image_url: Optional[str] = None
    icon_url: Optional[str] = None

class ServiceCreate(BaseModel):
    title_en: str
    title_ar: str
    description_en: str
    description_ar: str
    image_url: Optional[str] = None
    icon_url: Optional[str] = None

class ServiceUpdate(BaseModel):
    title_en: Optional[str] = None
    title_ar: Optional[str] = None
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    image_url: Optional[str] = None
    icon_url: Optional[str] = None

@services_router.get("/get_services", response_model=List[Service])
def get_services(db: Session = Depends(get_db)):
    try:
        services = db.query(models.Service).order_by(models.Service.id).all()
        return services
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch services: {str(e)}")

@services_router.post("/add_service", response_model=Service, dependencies=[Depends(get_current_user)])
def add_service(service: ServiceCreate, db: Session = Depends(get_db)):
    try:
        db_service = models.Service(**service.dict())
        db.add(db_service)
        db.commit()
        db.refresh(db_service)
        return db_service
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to add service: {str(e)}")

@services_router.put("/update_service/{service_id}", response_model=Service, dependencies=[Depends(get_current_user)])
def update_service(service_id: int, service: ServiceUpdate, db: Session = Depends(get_db)):
    try:
        db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
        if not db_service:
            raise HTTPException(status_code=404, detail="Service not found")
        update_data = service.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_service, key, value)
        db.commit()
        db.refresh(db_service)
        return db_service
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update service: {str(e)}")

@services_router.delete("/delete_service/{service_id}", dependencies=[Depends(get_current_user)])
def delete_service(service_id: int, db: Session = Depends(get_db)):
    try:
        db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
        if not db_service:
            raise HTTPException(status_code=404, detail="Service not found")
        db.delete(db_service)
        db.commit()
        return {"message": "Service deleted successfully", "id": service_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete service: {str(e)}")
