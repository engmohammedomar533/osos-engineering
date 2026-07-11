from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from .index import get_db, get_current_user
from . import models

about_us_router = APIRouter()

class AboutUs(BaseModel):
    title_en: str
    title_ar: str
    description_en: str
    description_ar: str

class AboutUsUpdate(BaseModel):
    title_en: Optional[str] = None
    title_ar: Optional[str] = None
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    why_choose_us_title_en: Optional[str] = None
    why_choose_us_title_ar: Optional[str] = None
    why_choose_us_list_en: Optional[list] = None
    why_choose_us_list_ar: Optional[list] = None
    work_methodology_en: Optional[dict] = None
    work_methodology_ar: Optional[dict] = None

@about_us_router.get("/get_about_us")
def get_about_us(db: Session = Depends(get_db)):
    try:
        about_us_list = db.query(models.AboutUs).order_by(models.AboutUs.id).all()
        return about_us_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch about_us: {str(e)}")

@about_us_router.put("/update_about_us/{about_us_id}", dependencies=[Depends(get_current_user)])
def update_about_us(about_us_id: int, about_us: AboutUsUpdate, db: Session = Depends(get_db)):
    try:
        db_about_us = db.query(models.AboutUs).filter(models.AboutUs.id == about_us_id).first()
        if not db_about_us:
            raise HTTPException(status_code=404, detail="About us not found")
        update_data = about_us.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_about_us, key, value)
        db.commit()
        return {"message": "About us updated successfully", "id": db_about_us.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update about us: {str(e)}")
