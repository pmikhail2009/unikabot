import telebot
from telebot import types
from openpyxl import Workbook  # для создания Excel
from pathlib import Path

# === НАСТРОЙКИ ===
BOT_TOKEN = "8754275738:AAFnI1Un5AZY9Z6HtqiJ4sFd1tyaZQubxh4"
WEBAPP_URL = "https://ТВОЙ_НИК.github.io/ИМЯ_РЕПОЗИТОРИЯ/"  # GitHub Pages URL
CATALOG_PATH = Path("catalog.xlsx")

bot = telebot.TeleBot(BOT_TOKEN)


# /start — отправляем кнопку, которая открывает мини‑апп
@bot.message_handler(commands=["start"])
def start(message: types.Message):
    user = message.from_user
    kb = types.ReplyKeyboardMarkup(resize_keyboard=True)
    # Кнопка с WebApp
    web_app_info = types.WebAppInfo(url=WEBAPP_URL)
    btn_open = types.KeyboardButton(text="Открыть магазин", web_app=web_app_info)
    kb.add(btn_open)

    text = f"Привет, {user.first_name}! Нажми кнопку ниже, чтобы открыть магазин."
    bot.send_message(message.chat.id, text, reply_markup=kb)


# /create_excel — создаём пустой каталог
@bot.message_handler(commands=["create_excel"])
def create_excel(message: types.Message):
    wb = Workbook()
    ws = wb.active
    ws.title = "Catalog"
    # Заголовки столбцов
    ws.append(["name", "description", "card_photo", "photo2", "photo3", "photo4"])
    wb.save(CATALOG_PATH)

    bot.send_message(
        message.chat.id,
        "Файл catalog.xlsx создан.\n"
        "Заполни его (name, description, card_photo, photo2-4) "
        "и положи в репозиторий вместе с сайтом.",
    )


# Можно добавить простую /help
@bot.message_handler(commands=["help"])
def help_cmd(message: types.Message):
    bot.send_message(
        message.chat.id,
        "/start — открыть кнопку магазина\n"
        "/create_excel — создать файл каталога",
    )


if __name__ == "__main__":
    print("Бот запущен")
    bot.infinity_polling()