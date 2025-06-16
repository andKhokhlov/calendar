# Calendar Application

## Prerequisites

- Docker Desktop (https://www.docker.com/products/docker-desktop)
- Git (опционально, для клонирования репозитория)

## Quick Start

1. Установите Docker Desktop
2. Запустите Docker Desktop и дождитесь его полной загрузки
3. Запустите приложение:

   - Двойной клик по файлу `start.bat`
   - Или выполните в терминале: `docker-compose up --build`

4. Откройте приложение в браузере:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3001

## Структура проекта

```
calendar/
├── backend/           # Backend сервер (Node.js + Express)
├── src/              # Frontend приложение (Angular)
├── docker-compose.yml # Конфигурация Docker
├── Dockerfile        # Конфигурация для Frontend
└── backend/
    └── Dockerfile    # Конфигурация для Backend
```

## Доступные команды

### Запуск приложения

```bash
docker-compose up --build
```

### Остановка приложения

```bash
docker-compose down
```

### Просмотр логов

```bash
docker-compose logs -f
```

## База данных

- PostgreSQL запускается автоматически в Docker
- Данные сохраняются между перезапусками
- Порт: 5432
- Пользователь: postgres
- Пароль: root
- База данных: calendar

## Troubleshooting

### Если приложение не запускается

1. Убедитесь, что Docker Desktop запущен
2. Проверьте, что порты 4200, 3001 и 5432 свободны
3. Попробуйте перезапустить Docker Desktop

### Если база данных не подключается

1. Проверьте логи контейнера postgres:
   ```bash
   docker-compose logs postgres
   ```
2. Убедитесь, что файл `backend/init.sql` существует

### Если нужно сбросить базу данных

1. Остановите контейнеры:
   ```bash
   docker-compose down -v
   ```
2. Запустите заново:
   ```bash
   docker-compose up --build
   ```

## Разработка

### Для разработчиков

Если вы хотите разрабатывать приложение локально (без Docker):

1. Установите зависимости:

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   npm install
   ```

2. Запустите PostgreSQL локально

3. Запустите приложение:

   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   npm start
   ```

## Поддержка

При возникновении проблем:

1. Проверьте раздел Troubleshooting
2. Убедитесь, что все порты свободны
3. Проверьте логи контейнеров
4. Перезапустите Docker Desktop
