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


def collect_items(browser):
    soup = BeautifulSoup(browser.page_source, 'html.parser')
    items = soup.find_all('tr', 'cart_list_no')

    if not items:
        return
    with open('items.txt', 'w') as f:
        for item in items:
            extract_item_info(item, f)


def connect_db():
    client = MongoClient(os.getenv("mongodb_uri"))
    db = client['musinsa']

    if not "items" in db.list_collection_names():
        db.create_collection("items")
    db_items = db["items"]

    return db_items


def extract_item_info(item, f):
    # 상품 브랜드 및 가격
    item_info = item.find('p', {'class': 'list_info'}).find('a')
    item_text = item_info.text.strip()
    id = item_info['href'].split('/')[-2]
    index = item_text.index(']')
    name = item_text[index+1:].strip()
    brand = item_text[1:index].strip()

    # 상품 이미지
    img = 'https:' + item.find('img')['src']

    # 상품 가격
    td_price = item.find('td', {'class': 'td_price'}).find('div')
    original_price = td_price.text.strip().replace(',', '')
    discount_price = None
    if span := td_price.find('span', {'class': 'txt_origin_price'}):
        original_price = span.text.strip().replace(',', '')
        discount_price = list(td_price.children)[-1].strip().replace(',', '')

    price_date = {
        "date": time.strftime('%Y-%m-%d', time.localtime(time.time())),
        "original_price": original_price,
        "discount_price": discount_price if discount_price else 'no_discount'
    }
    print()

    # 상품 정보 출력
    f.write(f"product_id: {id}\n")
    f.write(f"name: {name}\n")
    f.write(f"brand: {brand}\n")
    f.write(f"img_url: {img}\n")
    f.write(
        f"date: {time.strftime('%Y-%m-%d', time.localtime(time.time()))}\n")
    f.write(f"original_price: {original_price}\n")
    f.write(
        f"discount_price: {discount_price if discount_price else 'no_discount'}\n\n")


def crawling():
    browser = webdriver.Safari(executable_path=os.getenv("safaridriver_path"))

    login(browser)
    move_to_cart(browser)
    db_items = connect_db()
    collect_items(browser)

    time.sleep(2)


if __name__ == "__main__":
    crawling()
