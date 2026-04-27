# Контрольная работа №1 по дисциплине «Фронтенд и бэкенд разработка»

## 1. Общая информация

Собран проект по практикам №1-6.
Тематика проекта: интернет-магазин средневекового оружия и доспехов.

Ключевая идея итоговой версии: данные всех практик сведены в общий каталог (`shared/catalog.js`), который используется разными частями работы.

## 2. Что реализовано по практикам

# Практика №1 (CSS-препроцессоры)
Необходимо реализовать карточку товара (содержимое: название, описание,
фотография) с применением переменных (минимум 2), миксина (минимум 1) и
использованием вложенной структуры селекторов на любом из двух препроцессоров (SASS или LESS).

Сделана карточка товара в отдельной мини-странице с использованием SASS:
CSS — это язык стилей для веб-страниц.
Он отвечает за внешний вид HTML: цвета, шрифты, отступы, размеры, расположение блоков.
- переменные;
- миксин;
- вложенные селекторы.

Папка: `practice-1-medieval-card`

# Практика №2 (CRUD API)
Необходимо реализовать API, которое предоставляет CRUD операции для списка
товаров (просмотр всех товаров, просмотр товара по id, добавление товара,
редактирование товара, удаление товара). Объект товара должен содержать
следующие поля: id, название, стоимость.

Реализовано API с CRUD-операциями для списка товаров в формате:
- `id`
- `name`
- `price`

Папка: `practice-2-medieval-api`

Эндпоинты:
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`

# Практика №3 (тестирование API)

Сделан отчет с тестированием:
- локального API из практики №2;
- внешнего API.

Папка: `practice-3-api-testing`  
Файлы: `generate_report.ps1`, `report.md`

# Практика №4 (React + Express)

Собрано единое fullstack-приложение:
- backend на Express (`localhost:3000`);
- frontend на React (`localhost:3001`);
- каталог из 30 товаров;
- поиск и фильтрация по категориям;
- сделана карточка товара со всеми данными.

Папка: `practice-4-fullstack`

# Практика №5 (Swagger)

Подключена интерактивная документация Swagger:
- `swagger-jsdoc`
- `swagger-ui-express`

Адрес:
- `http://localhost:3000/api-docs`

Папка: `practice-5-swagger`

# Практика №6 (подготовка и проверка)

Сделана проверка работоспособности и подготовка проекта к сдаче.

Файлы:
- `practice-6-smoke-check.ps1`
- `practice-6-smoke-check.txt`

## 3. Единая архитектура проекта

### Общий источник данных

Каталог товаров хранится в:
- `shared/catalog.js`

Этот файл используется в:
- `practice-2-medieval-api/server.js`
- `practice-4-fullstack/backend/server.js`
- `practice-5-swagger/server.js`

### Состав каталога

В каталоге 30 товаров.

Структура записи товара (full-версия):
- `id`
- `name`
- `category`
- `description`
- `era`
- `origin`
- `material`
- `price`
- `stock`
- `rating`
- `image`

## 4. Изображения товаров

Изображения фронтенд берет по пути:
- `practice-4-fullstack/frontend/assets/products/`

Файлы:

1. `arming-sword.jpg`
2. `longsword.jpg`
3. `falchion.jpg`
4. `messer.jpg`
5. `dane-axe.jpg`
6. `bearded-axe.jpg`
7. `flanged-mace.jpg`
8. `lucerne-hammer.jpg`
9. `spear.jpg`
10. `halberd.jpg`
11. `pollaxe.jpg`
12. `english-longbow.jpg`
13. `composite-bow.jpg`
14. `windlass-crossbow.jpg`
15. `heater-shield.jpg`
16. `pavise-shield.jpg`
17. `round-shield.jpg`
18. `buckler.jpg`
19. `mail-hauberk.jpg`
20. `coat-of-plates.jpg`
21. `brigandine.jpg`
22. `gambeson.jpg`
23. `bascinet.jpg`
24. `sallet.jpg`
25. `great-helm.jpg`
26. `hourglass-gauntlets.jpg`
27. `sabatons.jpg`
28. `gorget.jpg`
29. `rondel-dagger.jpg`
30. `baselard.jpg`

## 5. Установка и запуск

## Требования
- Node.js 18+
- npm

## Установка зависимостей

Для PowerShell (с учетом политики выполнения):

```powershell
npm.cmd install

## Запуск практики №4

Терминал 1:

```powershell
npm.cmd run task4:api

Терминал 2:

```powershell
npm.cmd run task4:web

Открыть:
- `http://localhost:3001`

## Запуск Swagger

```powershell
npm.cmd run task5

Открыть:
- `http://localhost:3000/api-docs`

## Запуск API практики №2

```powershell
npm.cmd run task2