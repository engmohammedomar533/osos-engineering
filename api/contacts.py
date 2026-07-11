from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .index import get_db, get_current_user
from .models import Contact

contacts_router = APIRouter()

class ContactCreate(BaseModel):
    name: str
    phone: str
    email: str
    message: str

@contacts_router.post("/save-contact")
def save_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    try:
        db_contact = Contact(
            name=contact.name,
            phone=contact.phone,
            email=contact.email,
            message=contact.message
        )
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        return {"message": "Contact saved successfully!", "id": db_contact.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save contact: {str(e)}")

@contacts_router.get("/get-contacts", dependencies=[Depends(get_current_user)])
def get_contacts(db: Session = Depends(get_db)):
    try:
        contacts = db.query(Contact).order_by(Contact.created_at.desc()).all()
        return contacts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch contacts: {str(e)}")

@contacts_router.delete("/delete-contact/{contact_id}", dependencies=[Depends(get_current_user)])
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    try:
        db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
        if not db_contact:
            raise HTTPException(status_code=404, detail="Contact not found")
        db.delete(db_contact)
        db.commit()
        return {"message": "Contact deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete contact: {str(e)}")

