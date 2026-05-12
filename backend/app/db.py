import psycopg2

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="travelgenie",
        user="postgres",
        password="root"
    )