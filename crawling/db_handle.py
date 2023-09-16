def rename_field(db_products):
    db_products.update_many({}, {"$rename": {"item_id": "product_id"}})


def remove_fields(db_products):
    db_products.update_many({}, {"$unset": {"price_history.$[].discount": "",
                            "price_history.$[].discount_rate": "", "price_history.$[].discount_amount": ""}})


def set_updated_at(db_products):
    allProducts = db_products.find({})
    for product in allProducts:
        db_products.update_one({"_id": product["_id"]}, {
                               "$set": {"updated_at": product["price_history"][-1]["date"]}})

def set_lowest_price(db_products):
    allProducts = db_products.find({})
    for product in allProducts:
        db_products.update_one({"_id": product["_id"]}, {
                               "$set": {"lowest_price": sorted(product["price_history"], key=lambda x: x["current_price"])[0]["current_price"]}})