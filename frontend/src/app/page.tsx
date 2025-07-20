
/*
import { useEffect, useState } from "react";
import NewsCard from "@/components/NewsCard";
import NewsSkeleton from "@/components/NewsSkeleton";
import Header from "@/components/header";

interface NewsItem {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    date: string;
    articleUrl: string;
    game: string;
}

export default function Home() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState<string>("all");

    // Моки для новостей
    useEffect(() => {

            {
                id: 3,
                title: "Грандиозное мероприятие киберспорта",
                description: "Наблюдайте за самым масштабным событием сезона, которое соберёт лучших команд мира.",
                imageUrl: "/images/Counter-strike_2.jpg",
                date: "2025-03-01",
                articleUrl: "https://esportsworldcup.com/en",
                game: "CS2",
            },
            {
                id: 4,
                title: "Лучшее обновление, которое мы когда-либо видели",
                description: "Valve выпустили самое крупное обновление за последние 5 лет.",
                imageUrl: "/images/Counter-strike_2.jpg",
                date: "2025-03-01",
                articleUrl: "https://example.com/esport-event",
                game: "CS2",
            },
            {
                id: 5,
                title: "Туринир от шейхов",
                description: "Шейхи из ОАЭ анонсировали самый крупный турнир по CS2.",
                imageUrl: "/images/Counter-strike_2.jpg",
                date: "2025-02-28",
                articleUrl: "https://example.com/esport-event",
                game: "Dota 2",
            },
            {
                id: 6,
                title: "Закрытие легендарной игры!",
                description: "Гейб сказал, что закрывает доту...",
                imageUrl: "/images/dota-news.jpg",
                date: "2025-02-28",
                articleUrl: "https://example.com/esport-event",
                game: "Dota 2",
            },
        ];

        setTimeout(() => {
            setNews(mockNews);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredNews = news.filter((item) => {
        if (selectedGame === "all") return true;
        return item.game === selectedGame;
    });

    return (
        <>
            <Header />

            <main className="bg-gray-100">

                {/!* Hero-блок *!/}
                <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-5xl font-bold mb-4">
                            Добро пожаловать в Киберспорт Мир
                        </h1>
                        <p className="text-xl mb-8">
                            Узнайте все о последних новостях, матчах и эксклюзивных трансляциях.
                        </p>

                    </div>
                </section>

                {/!* Секция новостей с фильтром *!/}
                <section className="container mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Последние новости
                    </h2>

                    {/!* Фильтрация по играм *!/}
                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setSelectedGame("all")}
                            className={`px-4 py-2 border rounded ${
                                selectedGame === "all"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-800"
                            }`}
                        >
                            Все
                        </button>
                        <button
                            onClick={() => setSelectedGame("Dota 2")}
                            className={`px-4 py-2 border rounded ${
                                selectedGame === "Dota 2"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-800"
                            }`}
                        >
                            Dota 2
                        </button>
                        <button
                            onClick={() => setSelectedGame("CS2")}
                            className={`px-4 py-2 border rounded ${
                                selectedGame === "CS2"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-800"
                            }`}
                        >
                            CS2
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading
                            ? Array(6)
                                .fill(0)
                                .map((_, index) => <NewsSkeleton key={index} />)
                            : filteredNews.map((item) => (
                                <NewsCard
                                    key={item.id}
                                    title={item.title}
                                    description={item.description}
                                    imageUrl={item.imageUrl}
                                    date={item.date}
                                    articleUrl={item.articleUrl}
                                    game={item.game}
                                />
                            ))}
                    </div>
                </section>
            </main>
        </>
    );
}
*/
"use client";

import { useEffect, useState } from "react";
import NewsCard from "@/components/NewsCard";
import NewsSkeleton from "@/components/NewsSkeleton";
import Header from "@/components/header";

// Интерфейс теперь соответствует данным от FastAPI (snake_case)
interface NewsItem {
    id: string;
    title: string;
    description: string;
    image_url: string; // <-- snake_case
    date: string;
    article_url: string; // <-- snake_case
    game: string;
}

export default function Home() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState<string>("all");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError(null);
            try {
                // Теперь URL включает параметр для фильтрации
                const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/news?game=${selectedGame}`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.statusText}`);
                }
                const data: NewsItem[] = await response.json();
                setNews(data);
            } catch (err: any) {
                setError("Не удалось загрузить новости.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [selectedGame]); // <-- Добавляем selectedGame в массив зависимостей

    const filteredNews = news.filter((item) => {
        if (selectedGame === "all" || selectedGame === "Esports") return true;
        return item.game === selectedGame;
    });

    return (
        <>
            <Header />
            <main className="bg-gray-100 min-h-screen">
                <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-5xl font-bold mb-4">Добро пожаловать в Киберспорт Мир</h1>
                        <p className="text-xl mb-8">Узнайте все о последних новостях, матчах и эксклюзивных трансляциях.</p>
                    </div>
                </section>

                <section className="container mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Последние новости</h2>

                    {/* Фильтры */}
                    <div className="flex justify-center flex-wrap gap-4 mb-8">
                        <button onClick={() => setSelectedGame("all")} className={`px-4 py-2 border rounded ${selectedGame === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-800"}`}>Все</button>
                        <button onClick={() => setSelectedGame("Dota 2")} className={`px-4 py-2 border rounded ${selectedGame === "Dota 2" ? "bg-blue-600 text-white" : "bg-white text-gray-800"}`}>Dota 2</button>
                        <button onClick={() => setSelectedGame("CS2")} className={`px-4 py-2 border rounded ${selectedGame === "CS2" ? "bg-blue-600 text-white" : "bg-white text-gray-800"}`}>CS2</button>

                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(6).fill(0).map((_, index) => <NewsSkeleton key={index} />)}
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 font-bold p-4">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredNews.map((item) => (
                                // ИСПРАВЛЕНО: Явно передаем пропсы, конвертируя snake_case в camelCase
                                <NewsCard
                                    key={item.id}
                                    title={item.title}
                                    description={item.description}
                                    imageUrl={item.image_url}
                                    date={item.date}
                                    articleUrl={item.article_url}
                                    game={item.game}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}