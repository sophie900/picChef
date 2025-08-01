from typing import Optional
from sqlalchemy import ForeignKey, String, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column



class Base(DeclarativeBase):
    pass



class SavedRecipe(Base):
    __tablename__ = 'saved_recipe'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    link: Mapped[str] = mapped_column(String())
    image: Mapped[str] = mapped_column(String())
    note: Mapped[Optional[str]]  # Optional note attached to each recipe
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'))  # User that saved the recipe

    def __repr__(self) -> str:
        return f'SavedRecipe(id={self.id!r}, name={self.name!r}, link={self.link!r}, image={self.image!r}, note={self.note!r}, user_id={self.user_id!r})'



class User(Base):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(100))
    display_name: Mapped[Optional[str]]


# Enforce foreign key constraints!
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    try:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
    finally:
        cursor.close()
