import os
import time

from dotenv import load_dotenv
from bs4 import BeautifulSoup
from pymongo import MongoClient
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

load_dotenv()
login_url = 'https://www.musinsa.com/auth/login?referer=https%3A%2F%2Fwww.musinsa.com%2Fapp%2F'


def login(browser):
    browser.get(login_url)

    browser.find_element(By.NAME, 'id').send_keys(os.getenv("musinsa_id"))
    browser.find_element(By.NAME, 'pw').send_keys(os.getenv("musinsa_pw"))
    login_button = browser.find_element(By.CLASS_NAME, 'login-button__item')

    login_button.submit()
    time.sleep(3)


def move_to_cart(browser):
    cart_button = browser.find_element(By.PARTIAL_LINK_TEXT, '장바구니')
    cart_button.send_keys(Keys.ENTER)

    time.sleep(3)


def connect_db():
    client = MongoClient(os.getenv("mongodb_uri"))
    db = client['musinsa']

    if not "products" in db.list_collection_names():
        db.create_collection("products")
    db_products = db["products"]

    return db_products


def get_products(browser):
    soup = BeautifulSoup(browser.page_source, 'html.parser')
    products = soup.find_all('tr', 'cart_list_no')

    return products


def save_products(db_products, products):
    for item in products:
        item_info = item.find('p', {'class': 'list_info'}).find('a')
        item_id = item_info['href'].split('/')[-2]

        item_from_DB = db_products.find_one({"item_id": item_id})

        if item_from_DB:
            original_price = item_from_DB['original_price']
            price_record = get_price_record(item, original_price)
            db_products.update_one({"item_id": item_id}, {
                "$push": {"price_history": price_record}})
        else:
            product_info = get_product_info(item)
            db_products.insert_one(product_info)


def get_price_record(item, original_price):
    td_price = item.find('td', {'class': 'td_price'}).find('div')
    current_price = int(list(td_price.children)[-1].strip().replace(',', ''))

    price_record = {
        "date": time.strftime('%Y-%m-%d', time.localtime(time.time())),
        "current_price": current_price,
        "discount_rate": int((original_price - current_price) / original_price * 100),
        "discount_amount": original_price - current_price,
        "discount": True if original_price == current_price else False
    }

    return price_record


def get_product_info(item):
    # 상품 정보
    item_info = item.find('p', {'class': 'list_info'}).find('a')

    # 상품 id
    item_id = item_info['href'].split('/')[-2]

    # 상품 이름 및 브랜드
    item_text = item_info.text.strip()
    separator = item_text.index(']')
    name = item_text[separator+1:].strip()
    brand = item_text[1:separator].strip()

    # 상품 이미지
    img = 'https:' + item.find('img')['src']

    # 상품 정가
    td_price = item.find('td', {'class': 'td_price'}).find('div')
    original_price = None
    if span := td_price.find('span', {'class': 'txt_origin_price'}):
        original_price = int(span.text.strip().replace(',', ''))
    else:
        original_price = int(td_price.text.strip().replace(',', ''))

    # 상품 현재 가격
    price_record = get_price_record(item, int(original_price))

    product_info = {
        "item_id": item_id,
        "name": name,
        "brand": brand,
        "img_url": img,
        "original_price": original_price,
        "price_history": [price_record]
    }

    return product_info


def crawling():
    browser = webdriver.Safari(executable_path=os.getenv("safaridriver_path"))

    login(browser)
    move_to_cart(browser)
    db_products = connect_db()
    products = get_products(browser)

    if not products:
        return

    save_products(db_products, products)

    time.sleep(2)


if __name__ == "__main__":
    crawling()
