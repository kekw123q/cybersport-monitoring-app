import os
import httpx
import uuid
from fastapi import FastAPI, HTTPException, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
from datetime import datetime, timedelta # <-- ДОБАВЛЕНО timedelta

load_dotenv()

app = FastAPI(
    title="CyberSport Monitoring API",
    description="API для получения данных о киберспортивных матчах и новостях",
    version="1.0.0"
)

allowed_origins = [
    "http://localhost:3000",
]

# Регулярное выражение для всех адресов Vercel
origin_regex = r"https://cybersport-monitoring.*\.vercel\.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- Pydantic Модели (без изменений) ---
class MatchBase(BaseModel):
    id: int
    team1: str
    team1_logo_url: Optional[str] = None
    team2: str
    team2_logo_url: Optional[str] = None
    date: Optional[datetime] = None
    game: str

class MatchItem(MatchBase):
    twitch_url: Optional[HttpUrl] = None

class ResultItem(MatchBase):
    result: str

class NewsItem(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    date: str
    article_url: HttpUrl
    game: str

# --- API Ключи (без изменений) ---
API_BASE_URL = "https://api.pandascore.co"
PANDASCORE_API_KEY = os.getenv("PANDASCORE_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
NEWS_API_URL = "https://newsapi.org/v2/everything"

if not PANDASCORE_API_KEY:
    raise RuntimeError("PANDASCORE_API_KEY не найден в переменных окружения!")
if not NEWS_API_KEY:
    raise RuntimeError("NEWS_API_KEY не найден в .env.local!")

# --- Функции-помощники (без изменений для матчей, обновлены для новостей) ---
def format_match_data(match: Dict[str, Any]) -> Dict[str, Any]:
    # ... (код этой функции остается без изменений)
    opponents = match.get("opponents", [])
    team1_data = opponents[0].get("opponent", {}) if len(opponents) > 0 else {}
    team2_data = opponents[1].get("opponent", {}) if len(opponents) > 1 else {}
    result_str, score1, score2 = "N/A", 0, 0
    results_list = match.get("results", [])
    if results_list:
        scores_by_id = {item.get("team_id") or item.get("opponent_id"): item.get("score", 0) for item in results_list}
        team1_id, team2_id = team1_data.get("id"), team2_data.get("id")
        score1, score2 = scores_by_id.get(team1_id, 0), scores_by_id.get(team2_id, 0)
    if (score1 == 0 and score2 == 0) and match.get("winner_id"):
        winner_id, team1_id = match.get("winner_id"), team1_data.get("id")
        if winner_id == team1_id: result_str = f"Победа {team1_data.get('name', 'Команда 1')}"
        else: result_str = f"Победа {team2_data.get('name', 'Команда 2')}"
    elif score1 != 0 or score2 != 0: result_str = f"{score1}:{score2}"
    else: result_str = "Завершен"
    twitch_stream, official_stream_url = None, match.get("official_stream_url")
    streams_list = match.get("streams_list", [])
    if streams_list:
        stream_urls = [s.get("raw_url") for s in streams_list if s.get("raw_url")]
        ru_stream = next((s.get("raw_url") for s in streams_list if s.get('language') == 'ru'), None)
        main_stream = next((s.get("raw_url") for s in streams_list if s.get('main')), None)
        twitch_stream = ru_stream or main_stream or official_stream_url or (stream_urls[0] if stream_urls else None)
    elif official_stream_url: twitch_stream = official_stream_url
    team1_logo, team2_logo = team1_data.get("image_url"), team2_data.get("image_url")
    return {"id": match.get("id"),"team1": team1_data.get("name", "TBD"),"team1_logo_url": team1_logo,"team2": team2_data.get("name", "TBD"),"team2_logo_url": team2_logo,"date": match.get("end_at") or match.get("begin_at"),"game": match.get("videogame", {}).get("name", "Unknown Game"),"result": result_str,"twitch_url": twitch_stream}

def format_russian_date_with_time(iso_date_string: Optional[str]) -> str:
    if not iso_date_string: return "Дата не указана"
    try:
        dt_object = datetime.fromisoformat(iso_date_string.replace('Z', '+00:00'))
        months_ru = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
        return f"{dt_object.day} {months_ru[dt_object.month - 1]} {dt_object.year}, {dt_object.strftime('%H:%M')}"
    except (ValueError, TypeError): return "Некорректная дата"

def _get_game_from_title(title: str) -> Optional[str]:
    title_lower = title.lower()
    if "dota 2" in title_lower or "dota2" in title_lower: return "Dota 2"
    if "cs2" in title_lower or "counter-strike 2" in title_lower or "cs:go" in title_lower: return "CS2"
    if "lol" in title_lower or "league of legends" in title_lower: return "LoL"
    return None

# --- API Роутер ---
api_router = APIRouter(prefix="/api")

# --- Эндпоинты для матчей (без изменений) ---
@api_router.get("/results", response_model=List[ResultItem])
async def get_results(game: Optional[str] = Query("all", enum=["all", "CS2", "Dota 2", "LoL"])):
    game_slug_map = {"CS2": "csgo", "Dota 2": "dota2", "LoL": "lol"}
    params = {"token": PANDASCORE_API_KEY, "sort": "-end_at", "per_page": 50}
    if game == "all":
        params["filter[videogame]"] = "cs-go,dota-2,lol"
        url = f"{API_BASE_URL}/matches/past"
    else:
        game_slug = game_slug_map.get(game)
        url = f"{API_BASE_URL}/{game_slug}/matches/past"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return [format_match_data(match) for match in response.json()]

@api_router.get("/schedule", response_model=List[MatchItem])
async def get_schedule(game: Optional[str] = Query("all", enum=["all", "CS2", "Dota 2", "LoL"])):
    game_slug_map = {"CS2": "csgo", "Dota 2": "dota2", "LoL": "lol"}
    params = {"token": PANDASCORE_API_KEY, "sort": "begin_at", "per_page": 75}
    if game == "all":
        params["filter[videogame]"] = "cs-go,dota-2,lol"
        url = f"{API_BASE_URL}/matches/upcoming"
    else:
        game_slug = game_slug_map.get(game)
        url = f"{API_BASE_URL}/{game_slug}/matches"
        params["filter[status]"] = "not_started,running"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code == 404: return []
        response.raise_for_status()
        return [format_match_data(match) for match in response.json()]

# --- УЛУЧШЕННЫЙ ЭНДПОИНТ /news ---
@api_router.get("/news", response_model=List[NewsItem])
async def get_news(game: Optional[str] = Query("all", enum=["all", "CS2", "Dota 2", "LoL"])):

    query_map = {
        "CS2": '("CS2" OR "Counter-Strike 2")',
        "Dota 2": '"Dota 2"',
        "LoL": '("League of Legends" OR "LoL")',
        "all": '("esports" OR "dota 2" OR "cs2" OR "league of legends")'
    }

    # НОВОЕ: Определяем дату 30 дней назад для фильтрации
    from_date = (datetime.now() - timedelta(days=30)).isoformat()

    params = {
        "apiKey": NEWS_API_KEY,
        "q": query_map.get(game, query_map["all"]),
        "searchIn": "title",  # НОВОЕ: Ищем только в заголовках
        "from": from_date,     # НОВОЕ: Только за последний месяц
        "language": "ru",
        "sortBy": "publishedAt",
        "pageSize": 5         # НОВОЕ: Увеличили размер страницы
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(NEWS_API_URL, params=params)
            response.raise_for_status()
            articles = response.json().get("articles", [])

            formatted_news = []
            for article in articles:
                if not article.get("title") or not article.get("url") or article["title"] == "[Removed]":
                    continue

                game_tag = _get_game_from_title(article["title"])
                if not game_tag:
                    continue

                # Финальная проверка, если пользователь искал конкретную игру
                if game != "all" and game_tag != game:
                    continue

                formatted_date = format_russian_date_with_time(article.get("publishedAt"))

                formatted_news.append(
                    NewsItem(
                        id=str(uuid.uuid4()),
                        title=article["title"],
                        description=article.get("description", ""),
                        image_url=article.get("urlToImage"),
                        date=formatted_date,
                        article_url=article["url"],
                        game=game_tag
                    )
                )
            return formatted_news
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Не удалось получить новости от NewsAPI: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Внутренняя ошибка сервера: {e}")

app.include_router(api_router)