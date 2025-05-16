# Этап сборки
FROM node:18-alpine AS build

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Удаляем девелоперские зависимости
RUN npm ci --only=production

# Этап запуска
FROM node:18-alpine AS production

WORKDIR /app

# Копируем собранное приложение и зависимости
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Устанавливаем переменные окружения
ENV NODE_ENV=production

# Открываем порт, на котором работает приложение
EXPOSE 3000

# Запускаем приложение
CMD ["node", "dist/main"]