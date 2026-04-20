# Practice 3 - API Testing Report

Generated at: 2026-04-19 19:52:16

## Part 1. Testing local API from Practice 2 (3 requests)

### 1) GET /api/products
URL: http://localhost:3000/api/products
```json
[
    {
        "id":  1,
        "name":  "Длинный меч \u0027Северный Ворон\u0027",
        "price":  24500
    },
    {
        "id":  2,
        "name":  "Кольчуга усиленная",
        "price":  31800
    },
    {
        "id":  3,
        "name":  "Боевой топор кузни Арнольда",
        "price":  19200
    }
]
```

### 2) POST /api/products
URL: http://localhost:3000/api/products
Body:
```json
{
    "price":  14300,
    "name":  "Garrison Crossbow"
}
```
Response:
```json
{
    "id":  4,
    "name":  "Garrison Crossbow",
    "price":  14300
}
```

### 3) PATCH /api/products/:id
URL: http://localhost:3000/api/products/4
Body:
```json
{
    "price":  15100
}
```
Response:
```json
{
    "id":  4,
    "name":  "Garrison Crossbow",
    "price":  15100
}
```

## Part 2. External API (5 requests)
Selected API: TheSportsDB
API key: 3 (public test key in URL)

### 1) GET searchteams.php?t=Arsenal
URL: https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Arsenal
```json
{
    "strTeam":  "Arsenal",
    "strCountry":  "England",
    "strLeague":  "English Premier League"
}
```

### 2) GET searchteams.php?t=Real Madrid
URL: https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Real%20Madrid
```json
{
    "strTeam":  "Real Madrid",
    "strCountry":  "Spain",
    "strLeague":  "Spanish La Liga"
}
```

### 3) GET searchteams.php?t=Bayern Munich
URL: https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Bayern%20Munich
```json
{
    "strTeam":  "Bayern Munich",
    "strCountry":  "Germany",
    "strLeague":  "German Bundesliga"
}
```

### 4) GET searchteams.php?t=Juventus
URL: https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Juventus
```json
{
    "strTeam":  "Juventus",
    "strCountry":  "Italy",
    "strLeague":  "Italian Serie A"
}
```

### 5) GET searchteams.php?t=Manchester City
URL: https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Manchester%20City
```json
{
    "strTeam":  "Manchester City",
    "strCountry":  "England",
    "strLeague":  "English Premier League"
}
```

## Conclusion
- 3 local CRUD requests were tested.
- 5 external API requests were executed.
- All outputs are collected in this single report file.
