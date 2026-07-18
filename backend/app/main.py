from datetime import date, timedelta
from typing import List

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func

from . import models, schemas, auth
from .database import engine, get_db, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TrackFolio API")

# In production, replace "*" with your deployed frontend URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "trackfolio-api"}


# ---------- Auth ----------
@app.post("/auth/register", response_model=schemas.UserOut, status_code=201)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        email=user_in.email, hashed_password=auth.hash_password(user_in.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = auth.create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/auth/me", response_model=schemas.UserOut)
def read_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


# ---------- Applications ----------
@app.post("/applications", response_model=schemas.ApplicationOut, status_code=201)
def create_application(
    app_in: schemas.ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    data = app_in.model_dump()
    data["applied_date"] = data.get("applied_date") or date.today()
    application = models.Application(**data, owner_id=current_user.id)
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@app.get("/applications", response_model=List[schemas.ApplicationOut])
def list_applications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return (
        db.query(models.Application)
        .filter(models.Application.owner_id == current_user.id)
        .order_by(models.Application.created_at.desc())
        .all()
    )


@app.get("/applications/{app_id}", response_model=schemas.ApplicationOut)
def get_application(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    application = _get_owned_application(db, app_id, current_user.id)
    return application


@app.put("/applications/{app_id}", response_model=schemas.ApplicationOut)
def update_application(
    app_id: int,
    app_in: schemas.ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    application = _get_owned_application(db, app_id, current_user.id)
    for field, value in app_in.model_dump(exclude_unset=True).items():
        setattr(application, field, value)
    db.commit()
    db.refresh(application)
    return application


@app.delete("/applications/{app_id}", status_code=204)
def delete_application(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    application = _get_owned_application(db, app_id, current_user.id)
    db.delete(application)
    db.commit()
    return None


def _get_owned_application(db: Session, app_id: int, owner_id: int) -> models.Application:
    application = (
        db.query(models.Application)
        .filter(models.Application.id == app_id, models.Application.owner_id == owner_id)
        .first()
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


# ---------- Dashboard ----------
@app.get("/dashboard", response_model=schemas.DashboardStats)
def dashboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    base_query = db.query(models.Application).filter(
        models.Application.owner_id == current_user.id
    )
    total = base_query.count()

    status_counts = (
        db.query(models.Application.status, func.count(models.Application.id))
        .filter(models.Application.owner_id == current_user.id)
        .group_by(models.Application.status)
        .all()
    )
    by_status = {status.value: count for status, count in status_counts}

    soon_cutoff = date.today() + timedelta(days=7)
    due_soon = (
        base_query.filter(
            models.Application.follow_up_date != None,  # noqa: E711
            models.Application.follow_up_date <= soon_cutoff,
            models.Application.follow_up_date >= date.today(),
        )
        .order_by(models.Application.follow_up_date.asc())
        .all()
    )

    return {"total": total, "by_status": by_status, "due_soon": due_soon}
