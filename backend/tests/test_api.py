import pytest

from app import Product, create_app, db


@pytest.fixture
def client():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite://",
    })

    with app.app_context():
        db.create_all()

        db.session.add_all([
            Product(
                name="Test Backpack",
                description="A test product",
                price=49.00,
                stock=10,
            ),
            Product(
                name="Test Headphones",
                description="Another test product",
                price=89.00,
                stock=5,
            ),
        ])

        db.session.commit()

        yield app.test_client()

        db.session.remove()
        db.drop_all()


def test_health_endpoint(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json["status"] == "healthy"
    assert response.json["database"] == "connected"


def test_products_endpoint_returns_products(client):
    response = client.get("/api/products")

    assert response.status_code == 200
    assert len(response.json["products"]) == 2

    first_product = response.json["products"][0]

    assert first_product["name"] == "Test Backpack"
    assert first_product["price"] == 49.0
    assert first_product["stock"] == 10


def test_unknown_endpoint_returns_404(client):
    response = client.get("/api/unknown")

    assert response.status_code == 404
