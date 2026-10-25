# 📊 GamePulse — Gaming & Activity Personal Analytics Dashboard

> Полнофункциональный веб-сервис для анализа личной игровой активности, времени и расходов с интерактивными графиками, загрузкой CSV/JSON, аналитикой на pandas и базой данных PostgreSQL / SQLite.

![Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Stack](https://img.shields.io/badge/pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)
![Stack](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Stack](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Stack](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Stack](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Stack](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🎯 О проекте

**GamePulse** — это аналитический дашборд разработчика/геймера. Пользователь загружает файлы истории игр (CSV или JSON), а приложение моментально рассчитывает ключевые KPI, строит визуализации и предоставляет фильтрацию по жанрам, платформам и временным диапазонам.

### ✨ Ключевые возможности:
1. **Загрузка и парсинг файлов (CSV / JSON)**:
   - Интеллектуальное сопоставление колонок (поддерживает синонимы: `game`/`title`, `genre`/`category`, `cost`/`money_spent` и т.д.).
   - Автоматическая валидация типов, дат и пустых значений через **pandas** и **Pydantic**.
   - Возможность загрузить встроенный реалистичный демо-датасет в 1 клик.
2. **Аналитические метрики и KPI**:
   - Суммарное время в часах и днях чистого геймплея.
   - Финансовые расходы и метрика **стоимости часа развлечений** ($/час).
   - Топ игра по наигранному времени.
   - Любимый жанр / категория.
   - Количество уникальных игр и активных дней.
3. **Интерактивные графики (Chart.js)**:
   - **Динамика по месяцам**: комбинированный график (Bar: часы геймплея + Line: динамика расходов в $).
   - **Категории и жанры**: Donut-диаграмма с долями процентов.
   - **Рейтинг Топ-10 игр**: горизонтальный Bar Chart.
   - **Платформы**: распределение между PC, PlayStation, Xbox, Switch и др.
4. **Фильтрация и поиск в реальном времени**:
   - Полнотекстовый поиск по названию игры.
   - Фильтры по жанрам и платформам.
   - Выбор диапазона дат и быстрые пресеты ("30 дней", "90 дней", "Все время").
   - Все графики и KPI мгновенно пересчитываются под выбранные фильтры!
5. **Журнал активности (Таблица)**:
   - Сортировка, пагинация, бейджи жанров, система оценок (звезды 1.0–10.0), заметки.
   - Ручное добавление новых сессий через модальное окно и удаление записей.

---

## 🏗️ Архитектура и стек технологий

```
gaming-activity-dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI инициализация, CORS, lifespan
│   │   ├── config.py          # Pydantic Settings
│   │   ├── database.py        # SQLAlchemy Engine & Session
│   │   ├── models.py          # ORM модели (Activity, ImportBatch)
│   │   ├── schemas.py         # Pydantic v2 схемы валидации и DTO
│   │   ├── crud.py            # Операции с базой данных
│   │   ├── analytics.py       # Аналитический движок на pandas + SQL
│   │   ├── routers/           # Модульные эндпоинты (activities, analytics, upload)
│   │   └── sample_data/       # Готовые CSV и JSON датасеты
│   ├── tests/                 # Автотесты (pytest + TestClient)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/        # UI-компоненты (Navbar, KpiCards, FiltersBar, Charts, Table, Modals)
│   │   ├── services/api.js    # API-клиент
│   │   ├── App.jsx            # Корневой компонент состояния
│   │   └── index.css          # Стили Tailwind CSS и Dark Glass UI
│   ├── nginx.conf             # Продакшн reverse proxy для Docker
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml         # Оркестрация: PostgreSQL 16 + FastAPI + Frontend/Nginx
├── .env.example
└── README.md
```

| Уровень | Технологии | Назначение |
| :--- | :--- | :--- |
| **Backend** | Python 3.11, FastAPI, SQLAlchemy 2.0 | Высокопроизводительный асинхронный REST API |
| **Data Engine** | pandas, NumPy | Быстрая агрегация временных рядов, группировка, KPI |
| **Database** | PostgreSQL 16 (Docker) / SQLite (локально) | Надежное реляционное хранение данных |
| **Frontend** | React 18, Vite, Tailwind CSS | Реактивный пользовательский интерфейс в Dark Mode |
| **Визуализация** | Chart.js, react-chartjs-2, Lucide Icons | Анимированные интерактивные диаграммы |
| **DevOps** | Docker, Docker Compose, Nginx | Контейнеризация и запуск одной командой |
| **Тестирование**| pytest, TestClient | Комплексные автотесты бизнес-логики и API |

---

## 🚀 Быстрый запуск

### Вариант 1: Запуск через Docker Compose (Рекомендуется)

Требуется установленный [Docker Desktop](https://www.docker.com/).

```bash
# 1. Склонируйте или перейдите в папку проекта:
cd gaming-activity-dashboard

# 2. Запустите все сервисы (PostgreSQL + Backend + Frontend):
docker compose up --build
```

После старта перейдите в браузере:
- 🌐 **Frontend (Дашборд):** [http://localhost:3000](http://localhost:3000)
- 📚 **Swagger API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- 📖 **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### Вариант 2: Локальный запуск для разработки (Без Docker)

Проект настроен так, что при локальном запуске автоматически использует локальную базу данных SQLite — **никакой сторонней настройки СУБД не требуется**!

#### 1. Запуск Backend:
```bash
cd backend

# Создайте и активируйте виртуальное окружение:
python -m venv venv

# Windows (PowerShell / CMD):
.\venv\Scripts\activate

# Linux / macOS:
source venv/bin/activate

# Установите зависимости:
pip install -r requirements.txt

# Запустите сервер FastAPI:
uvicorn app.main:app --reload --port 8000
```
*Backend будет доступен по адресу:* `http://localhost:8000` (Документация: `http://localhost:8000/docs`).

#### 2. Запуск Frontend:
В отдельном окне терминала:
```bash
cd frontend

# Установите зависимости:
npm install

# Запустите dev-сервер:
npm run dev
```
*Frontend будет доступен по адресу:* `http://localhost:5173`.

---

## 🧪 Запуск тестов

В проекте написаны автотесты, проверяющие эндпоинты, математику аналитики pandas, загрузку файлов и CRUD:

```bash
cd backend
.\venv\Scripts\python.exe -m pytest
```

Все тесты выполняются в изолированной in-memory SQLite базе данных.

---

## 📁 Формат файлов для импорта

Приложение принимает файлы `.csv` и `.json`.

### Пример CSV (`gaming_activity.csv`):
```csv
title,category,platform,date,hours_played,money_spent,rating,notes
Baldur's Gate 3,RPG,PC,2026-05-02,4.5,59.99,10.0,Bought the game! Created Wizard
Cyberpunk 2077,RPG,PC,2026-06-01,3.5,29.99,9.5,Phantom Liberty expansion
Counter-Strike 2,Shooter,PC,2026-07-12,1.5,0.0,8.0,Premier matches
Elden Ring,Action RPG,PS5,2026-08-02,4.0,0.0,9.5,Messmer boss battle
```

### Пример JSON (`gaming_activity.json`):
```json
[
  {
    "title": "Black Myth: Wukong",
    "category": "Action RPG",
    "platform": "PC",
    "date": "2026-08-20",
    "hours_played": 4.5,
    "money_spent": 59.99,
    "rating": 9.6,
    "notes": "Chapter 1 completed"
  }
]
```

> **Совет:** Вы можете нажать кнопку **«Демо данные»** в верхнем меню дашборда, чтобы мгновенно загрузить готовые реалистичные данные за несколько месяцев!

---

## 💼 Что этот проект демонстрирует на собеседованиях:

1. **FastAPI & REST API Architecture**:
   - Чистая многослойная архитектура: `routers` -> `crud` -> `analytics` -> `database`/`models`.
   - Использование Pydantic v2 для строгой типизации входных параметров и DTO ответов.
   - Автодокументация OpenAPI/Swagger из коробки.
2. **Data Processing & Pandas**:
   - Преобразование неструктурированных файлов (CSV/JSON с разными диалектами разделителей и синонимами названий).
   - Расчет агрегатов, скользящих метрик и временных рядов (Time-series) на pandas.
3. **Database & SQL**:
   - Двухуровневая поддержка: PostgreSQL (через psycopg2 в Docker) и SQLite (локально для тестов и быстрой разработки).
   - Индексы по полям фильтрации (`date`, `category`, `platform`, `title`).
4. **Modern Frontend & Visualization**:
   - Красивый адаптивный интерфейс (Tailwind CSS, Glassmorphism).
   - Интерактивные графики Chart.js с поддержкой двойных осей Y (часы и деньги).
   - Фильтры с динамическим пересчетом без перезагрузки страниц.
5. **DevOps & Containerization**:
   - Multi-stage Dockerfile для фронтенда с минимизацией размера образа через Nginx.
   - Docker Compose с healthcheck для базы данных PostgreSQL.

---

## 📄 Лицензия
MIT License. Проект открыт для свободного использования, модификации и добавления в личное портфолио!
