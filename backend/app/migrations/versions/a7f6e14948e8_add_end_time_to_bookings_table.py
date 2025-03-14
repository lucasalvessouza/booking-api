"""Add end time to bookings table

Revision ID: a7f6e14948e8
Revises: 87dd43829e3c
Create Date: 2025-03-04 10:24:47.387815

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a7f6e14948e8'
down_revision: Union[str, None] = '87dd43829e3c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('bookings', sa.Column('end_time', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('bookings', 'end_time')
    # ### end Alembic commands ###
