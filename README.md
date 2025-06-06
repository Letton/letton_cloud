# Letton Cloud

Letton Cloud - это современное облачное решение для хранения и управления файлами.

## Архитектура

Проект состоит из следующих компонентов:

- **Backend** - API сервер на NestJS
- **Frontend** - Веб-интерфейс на Next.js
- **Database** - PostgreSQL для хранения метаданных
- **Storage** - MinIO для хранения файлов
- **Proxy** - Nginx для маршрутизации запросов

## 🚀 Быстрый старт

### Предварительные требования

- Docker и Docker Compose
- Git

### Установка и запуск

1. Клонируйте репозиторий:

```bash
git clone git@github.com:Letton/letton_cloud.git
cd letton_cloud
```

2. Создайте файл `.env` в корневой директории проекта по примеру `.env.example`

3. Создайте файл `.env` в фронтэнд директории проекта (letton_cloud_frontend) по примеру `.env.example`. Данный файл понадобиться для сборки образа frontend сервиса

4. Запустите проект:

```bash
docker-compose up -d
```

5. Дождитесь запуска всех сервисов и откройте приложение в браузере: http://localhost

## 🔧 Разработка

### Backend (NestJS)

Для работы с backend локально:

Создайте .env файл по примеру .env.example

```bash
npm install
npm run start:dev
```

Backend будет доступен на http://localhost:8080

### Frontend (Next.js)

Для работы с frontend локально:

Создайте .env файл по примеру .env.example

```bash
npm install
npm run dev
```

Frontend будет доступен на http://localhost:3000

## 🐳 Docker

Проект полностью контейнеризован и использует следующие сервисы:

| Сервис                    | Описание                          | Порты      |
| ------------------------- | --------------------------------- | ---------- |
| **nginx**                 | Reverse proxy                     | 80         |
| **letton_cloud_frontend** | Frontend приложение               | -          |
| **letton_cloud_backend**  | Backend API                       | 8080       |
| **postgres**              | База данных PostgreSQL            | -          |
| **minio**                 | S3-совместимое файловое хранилище | 9000, 9001 |

## 🔒 Безопасность

- **JWT аутентификация** - безопасная аутентификация с JWT токенами
- **Guards защита** - защита роутов с помощью NestJS guards
- **Файловые права** - проверка прав доступа к файлам
- **CORS настройки** - правильная настройка CORS политик

## 🛠️ Технологии

**Backend:**

- NestJS - прогрессивный Node.js фреймворк
- TypeORM - ORM для работы с базой данных
- PostgreSQL - надежная реляционная база данных
- JWT - JSON Web Tokens для аутентификации
- Passport - middleware для аутентификации
- AWS SDK - для работы с MinIO S3 API

**Frontend:**

- Next.js 15 - современный React фреймворк с App Router
- TypeScript - типизированный JavaScript
- Tailwind CSS - utility-first CSS фреймворк
- shadcn/ui - современные React компоненты
- Lucide React - красивые SVG иконки
- Axios - HTTP клиент для API запросов

**Infrastructure:**

- Docker & Docker Compose - контейнеризация приложения
- Nginx - reverse proxy
- MinIO - S3-совместимое объектное хранилище
- PostgreSQL - реляционная база данных

## 📊 Мониторинг

### Доступ к сервисам

- **Приложение**: http://localhost
- **Backend API**: http://localhost:8080
- **MinIO Console**: http://localhost:9001

## Автор проекта

- Комарницкий Егор ИКБО-01-22 (Курсовая работа)
