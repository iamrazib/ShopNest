from app import Product, create_app, db


app = create_app()

with app.app_context():
    db.create_all()

    existing_product = db.session.execute(
        db.select(Product.id).limit(1)
    ).first()

    if existing_product is None:
        products = [
            Product(
                name="Everyday Backpack",
                description="A durable backpack for work, study and travel.",
                price=49.00,
                stock=25,
            ),
            Product(
                name="Wireless Headphones",
                description="Comfortable wireless headphones with clear sound.",
                price=89.00,
                stock=18,
            ),
            Product(
                name="Insulated Water Bottle",
                description="Reusable insulated bottle for everyday use.",
                price=24.50,
                stock=40,
            ),
        ]

        db.session.add_all(products)
        db.session.commit()

        print("Initial product records created successfully.")

    else:
        print("Product records already exist. No seed required.")
