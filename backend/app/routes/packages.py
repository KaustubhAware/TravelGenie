# =====================================================
# app/routes/packages.py
# =====================================================

from fastapi import APIRouter

from app.db import get_connection

router = APIRouter()

# =====================================================
# GET ALL PACKAGES
# =====================================================

@router.get("/packages")
def get_packages():

    conn = get_connection()

    cur = conn.cursor()

    cur.execute("""
        SELECT
            id,
            title,
            destination,
            duration,
            price,
            description,
            image,
            services
        FROM packages
        ORDER BY id DESC
    """)

    rows = cur.fetchall()

    packages = []

    for row in rows:

        packages.append({
            "id": row[0],
            "title": row[1],
            "destination": row[2],
            "duration": row[3],
            "price": row[4],
            "description": row[5],
            "image": row[6],
            "services": row[7]
        })

    cur.close()

    conn.close()

    return {
        "packages": packages
    }

# =====================================================
# ADD PACKAGE
# =====================================================

@router.post("/packages")
def add_package(data: dict):

    conn = get_connection()

    cur = conn.cursor()

    cur.execute("""
        INSERT INTO packages
        (
            title,
            destination,
            duration,
            price,
            description,
            image,
            services
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s)
    """, (
        data["title"],
        data["destination"],
        data["duration"],
        data["price"],
        data["description"],
        data["image"],
        data["services"]
    ))

    conn.commit()

    cur.close()

    conn.close()

    return {
        "message": "Package added successfully"
    }

# =====================================================
# UPDATE PACKAGE
# =====================================================

@router.put("/packages/{id}")
def update_package(id: int, data: dict):

    conn = get_connection()

    cur = conn.cursor()

    cur.execute("""
        UPDATE packages
        SET
            title = %s,
            destination = %s,
            duration = %s,
            price = %s,
            description = %s,
            image = %s,
            services = %s
        WHERE id = %s
    """, (
        data["title"],
        data["destination"],
        data["duration"],
        data["price"],
        data["description"],
        data["image"],
        data["services"],
        id
    ))

    conn.commit()

    cur.close()

    conn.close()

    return {
        "message": "Package updated successfully"
    }

# =====================================================
# DELETE PACKAGE
# =====================================================

@router.delete("/packages/{id}")
def delete_package(id: int):

    conn = get_connection()

    cur = conn.cursor()

    cur.execute("""
        DELETE FROM packages
        WHERE id = %s
    """, (id,))

    conn.commit()

    cur.close()

    conn.close()

    return {
        "message": "Package deleted successfully"
    }