import os
import time

from dotenv import load_dotenv
from bs4 import BeautifulSoup
from pymongo import MongoClient
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

from db_handle import *

load_dotenv()
login_url = 'https://www.musinsa.com/auth/login?referer=https%3A%2F%2Fwww.musinsa.com%2Fapp%2Fcart'


def login(browser):
    browser.get(login_url)

    browser.find_element(By.NAME, 'id').send_keys(os.getenv("MUSINSA_ID"))
    browser.find_element(By.NAME, 'pw').send_keys(os.getenv("MUSINSA_PW"))
    login_button = browser.find_element(By.CLASS_NAME, 'login-button__item')

    login_button.submit()
    time.sleep(5)


# def move_to_cart(browser):
#     cart_button = browser.find_element(By.PARTIAL_LINK_TEXT, '장바구니')
#     cart_button.send_keys(Keys.ENTER)

#     time.sleep(5)


def connect_db():
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client['musinsa']

    if not "products" in db.list_collection_names():
        db.create_collection("products")
    db_products = db["products"]

    return db_products


def get_products(browser):
    soup = BeautifulSoup(browser.page_source, 'html.parser')
    products = soup.find_all('tr', 'cart_list_no')

    return products


def get_price_record(product, original_price):
    td_price = product.find('td', {'class': 'td_price'}).find('div')
    current_price = int(list(td_price.children)[-1].strip().replace(',', ''))

    txt_option = product.find(
        'p', {'class': 'txt_option'}).text.replace("\t", "").replace("\xa0", "").replace("\n", " ").strip().split("/")

    price_record = {
        "date": time.strftime('%Y-%m-%d', time.localtime(time.time())),
        "current_price": current_price,
        "available": True if txt_option[-1] != "품절" else False,
    }

    return price_record


def get_product_info(product):
    # 상품 정보
    product_info = product.find('p', {'class': 'list_info'}).find('a')

    # 상품 id
    product_id = product_info['href'].split('/')[-2]

    # 상품 이름 및 브랜드
    product_text = product_info.text.strip()
    separator = product_text.index(']')
    name = product_text[separator+1:].strip()
    brand = product_text[1:separator].strip()

    # 상품 이미지
    small_img_url = 'https:' + product.find('img')['src']
    # 사이즈 옵션은 3가지가 있음 [62, 500, big]
    img_url = "big".join(small_img_url.rsplit("62", 1))

    # 상품 정가
    td_price = product.find('td', {'class': 'td_price'}).find('div')
    original_price = None
    if span := td_price.find('span', {'class': 'txt_origin_price'}):
        original_price = int(span.text.strip().replace(',', ''))
    else:
        original_price = int(td_price.text.strip().replace(',', ''))

    # 상품 현재 가격
    price_record = get_price_record(product, original_price)

    product_info = {
        "product_id": product_id,
        "name": name,
        "brand": brand,
        "img_url": img_url,
        "original_price": original_price,
        'updated_at': time.strftime('%Y-%m-%d', time.localtime(time.time())),
        "price_history": [price_record]
    }

    return product_info


def save_products(db_products, products):
    for product in products:
        product_info = product.find('p', {'class': 'list_info'}).find('a')
        product_id = product_info['href'].split('/')[-2]

        filter = {"product_id": product_id}
        product_from_DB = db_products.find_one(filter)

        if product_from_DB:
            updated_at = product_from_DB['updated_at']
            current_date = time.strftime(
                '%Y-%m-%d', time.localtime(time.time()))
            if updated_at == current_date:
                continue

            original_price = product_from_DB['original_price']
            price_record = get_price_record(product, original_price)

            update = {"$push": {"price_history": price_record}, "$set": {
                "updated_at": time.strftime('%Y-%m-%d', time.localtime(time.time()))}}
            db_products.update_one(filter, update)
        else:
            product_info = get_product_info(product)
            db_products.insert_one(product_info)


def crawling():
    # Configure Chrome options for headless browsing
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Enable headless mode
    chrome_options.add_argument("--disable-gpu")  # Disable GPU usage
    chrome_options.set_capability(
        "unhandledPromptBehavior", "dismiss")  # Disable alert

    # Create a Service object with the path to chromedriver
    service = Service(executable_path=os.getenv("CHROME_DRIVER_PATH"))

    # Create a Chrome WebDriver instance with the Service object and Chrome options
    browser = webdriver.Chrome(
        service=service, options=chrome_options)

    login(browser)
    # move_to_cart(browser)
    db_products = connect_db()
    products = get_products(browser)

    if not products:
        return

    save_products(db_products, products)
    time.sleep(2)


if __name__ == "__main__":
    with open(os.getenv("LOG_FILE_PATH"), 'a') as f:
        try:
            crawling()
            f.write(
                f"{time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))} : SUCCESS\n")
        except Exception as e:
            f.write(
                f"{time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))} : ERROR : - {str(e)}\n")
