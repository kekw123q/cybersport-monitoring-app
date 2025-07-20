# import os
# import httpx  # Используем httpx для асинхронных запросов
# from fastapi import FastAPI, HTTPException, Query
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel, Field, HttpUrl
# from typing import List, Optional, Dict, Any
# from dotenv import load_dotenv
# from datetime import datetime
#
# # Загружаем переменные окружения из .env файла
# load_dotenv()
#
# app = FastAPI(
#     title="CyberSport Monitoring API",
#     description="API для получения данных о киберспортивных матчах и новостях",
#     version="1.0.0"
# )
#
# # Настройка CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # URL вашего фронтенда на Next.js
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
# # --- Pydantic Модели (аналоги TypeScript interfaces) ---
# # Эти модели обеспечивают валидацию данных, которые мы отдаем фронтенду
#
# class Team(BaseModel):
#     name: str
#     logo_url: Optional[HttpUrl] = None
#
# class MatchBase(BaseModel):
#     id: int
#     team1: str
#     team1Logo: Optional[str] = Field(None, alias="team1_logo_url")
#     team2: str
#     team2Logo: Optional[str] = Field(None, alias="team2_logo_url")
#     date: datetime
#     game: str
#
# class MatchItem(MatchBase):
#     """ Модель для страницы Расписания """
#     twitchUrl: Optional[HttpUrl] = Field(None, alias="twitch_url")
#
# class ResultItem(MatchBase):
#     """ Модель для страницы Результатов """
#     result: str
#
# class NewsItem(BaseModel):
#     """ Модель для новостей (пока будут моковые данные) """
#     id: int
#     title: str
#     description: str
#     imageUrl: str
#     date: str
#     articleUrl: str
#     game: str
#
#
# # --- Конфигурация API PandaScore ---
# API_BASE_URL = "https://api.pandascore.co"
# API_KEY = os.getenv("PANDASCORE_API_KEY")
#
# if not API_KEY:
#     raise RuntimeError("PANDASCORE_API_KEY не найден в переменных окружения!")
#
# # --- Вспомогательная функция для форматирования данных ---
#
# def format_match_data(match: Dict[str, Any]) -> Dict[str, Any]:
#     """Преобразует данные матча из формата PandaScore в формат, нужный фронтенду."""
#     opponents = match.get("opponents", [])
#     team1_data = opponents[0].get("opponent", {}) if len(opponents) > 0 else {}
#     team2_data = opponents[1].get("opponent", {}) if len(opponents) > 1 else {}
#
#     # Определяем победителя и формируем строку результата
#     winner_id = match.get("winner_id")
#     result_str = "N/A"
#     if winner_id:
#         scores = [res['score'] for res in match.get('results', [])]
#         if winner_id == team1_data.get('id'):
#             result_str = f"{scores[0]}:{scores[1]}"
#         elif winner_id == team2_data.get('id'):
#             result_str = f"{scores[1]}:{scores[0]}" # PandaScore отдает счет по порядку, а не по командам
#         else: # На случай ничьи или других исходов
#             result_str = f"{scores[0]}-{scores[1]}" if len(scores) == 2 else "Draw"
#
#     # Twitch URL
#     official_stream = match.get("official_stream_url")
#     # Иногда стрим есть в списке стримов
#     twitch_stream = next((s['raw_url'] for s in match.get('streams_list', []) if s['language'] == 'ru' or s['main']), official_stream)
#
#     return {
#         "id": match["id"],
#         "team1": team1_data.get("name", "TBD"),
#         "team1_logo_url": team1_data.get("image_url", "/images/placeholder.png"),
#         "team2": team2_data.get("name", "TBD"),
#         "team2_logo_url": team2_data.get("image_url", "/images/placeholder.png"),
#         "date": match["begin_at"],
#         "game": match["videogame"]["name"],
#         "result": result_str,
#         "twitch_url": twitch_stream,
#     }
#
# # --- Эндпоинты API ---
#
# @app.get("/api/schedule", response_model=List[MatchItem])
# async def get_schedule(game: Optional[str] = Query("all", enum=["all", "CS2", "Dota 2"])):
#     """ Эндпоинт для получения расписания будущих и идущих матчей """
#     game_slug = {"CS2": "csgo", "Dota 2": "dota-2"}.get(game)
#
#     params = { "token": API_KEY, "sort": "begin_at", "per_page": 50 }
#     if game_slug:
#         params["filter[videogame]"] = game_slug
#
#     url = f"{API_BASE_URL}/matches/upcoming" # или /matches/running для live-матчей
#
#     async with httpx.AsyncClient() as client:
#         try:
#             response = await client.get(url, params=params)
#             response.raise_for_status() # Вызовет ошибку, если статус не 2xx
#             matches_raw = response.json()
#
#             # Форматируем каждый матч
#             formatted_matches = [format_match_data(match) for match in matches_raw]
#             return formatted_matches
#         except httpx.HTTPStatusError as e:
#             raise HTTPException(status_code=e.response.status_code, detail=f"Ошибка при запросе к PandaScore: {e.response.text}")
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Внутренняя ошибка сервера: {str(e)}")
#
#
# @app.get("/api/results", response_model=List[ResultItem])
# async def get_results(game: Optional[str] = Query("all", enum=["all", "CS2", "Dota 2"])):
#     """ Эндпоинт для получения результатов завершенных матчей """
#     game_slug = {"CS2": "csgo", "Dota 2": "dota-2"}.get(game)
#
#     params = { "token": API_KEY, "sort": "-end_at", "per_page": 50 }
#     if game_slug:
#         params["filter[videogame]"] = game_slug
#
#     url = f"{API_BASE_URL}/matches/past"
#
#     async with httpx.AsyncClient() as client:
#         try:
#             response = await client.get(url, params=params)
#             response.raise_for_status()
#             matches_raw = response.json()
#
#             formatted_matches = [format_match_data(match) for match in matches_raw]
#             return formatted_matches
#         except httpx.HTTPStatusError as e:
#             raise HTTPException(status_code=e.response.status_code, detail=f"Ошибка при запросе к PandaScore: {e.response.text}")
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Внутренняя ошибка сервера: {str(e)}")
#
#
# @app.get("/api/news", response_model=List[NewsItem])
# async def get_news():
#     """
#     Эндпоинт для новостей.
#     API PandaScore не предоставляет новости, поэтому пока возвращаем моковые данные,
#     как на фронтенде. В будущем это можно заменить на парсинг новостного сайта.
#     """
#     return mock_news
#
# # --- Запуск приложения ---
# # Для запуска используйте команду в терминале:
# # uvicorn main:app --reload