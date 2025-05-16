# Этап сборки
FROM node:22-alpine AS build

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm i

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Удаляем девелоперские зависимости
RUN npm i

# Этап запуска
FROM node:22-alpine AS production

WORKDIR /app

# Копируем собранное приложение и зависимости
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/.env .env

# Устанавливаем переменные окружения
ENV NODE_ENV=production

# Открываем порт, на котором работает приложение
EXPOSE 8080

# Запускаем приложение
CMD ["npm", "run", "start:prod"]