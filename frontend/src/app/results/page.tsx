"use client";

/*import { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";
import Header from "@/components/header";

interface ResultMatch {
    id: number;
    team1: string;
    team1Logo: string;
    team2: string;
    team2Logo: string;
    date: string;
    game: string;
    result: string;
}

export default function Results() {
    const [matches, setMatches] = useState<ResultMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState<string>("all");

    // Моки для результатов матчей
    useEffect(() => {
        const mockResults: ResultMatch[] = [
            {
                id: 1,
                team1: "Team Liquid",
                team1Logo: "/images/logos/team_liquid_logo.png",
                team2: "NAVI",
                team2Logo: "/images/logos/NAVI_Logo.svg.png",
                date: "2025-03-02T15:00:00",
                game: "CS2",
                result: "2:0",
            },
            {
                id: 2,
                team1: "OG",
                team1Logo: "/images/logos/OG.png",
                team2: "Team Spirit",
                team2Logo: "/images/logos/team_spirit.png",
                date: "2025-03-02T18:00:00",
                game: "Dota 2",
                result: "1:2",
            },
            {
                id: 3,
                team1: "Virtus.pro",
                team1Logo: "/images/logos/virtuspro.png",
                team2: "Ninjas in Pyjamas",
                team2Logo: "/images/logos/nip.png",
                date: "2025-03-02T16:00:00",
                game: "CS2",
                result: "2:1",
            },
            // Можно добавить дополнительные результаты...
        ];

        // Имитируем загрузку данных
        setTimeout(() => {
            setMatches(mockResults);
            setLoading(false);
        }, 1000);
    }, []);

    // Фильтрация матчей в зависимости от выбранного фильтра
    const filteredMatches = matches.filter((match) => {
        if (selectedGame === "all") return true;
        return match.game === selectedGame;
    });

    return (
        <>
            <Header />
            <main className="bg-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
                        Результаты матчей
                    </h1>

                    {/!* Фильтр по играм *!/}
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
                            onClick={() => setSelectedGame("CS2")}
                            className={`px-4 py-2 border rounded ${
                                selectedGame === "CS2"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-800"
                            }`}
                        >
                            CS2
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
                    </div>

                    {loading ? (
                        <div className="text-center">Загрузка результатов...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMatches.map((match) => (
                                <ResultCard key={match.id} {...match} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}*/
"use client";

import { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";
import Header from "@/components/header";
import MatchSkeleton from "@/components/MatchSkeleton";

// ИНТЕРФЕЙС СООТВЕТСТВУЕТ ДАННЫМ, ПРИХОДЯЩИМ ОТ БЭКЕНДА
interface ResultMatch {
    id: number;
    team1: string;
    team1_logo_url: string;
    team2: string;
    team2_logo_url: string;
    date: string;
    game: string;
    result: string;
}

export default function Results() {
    const [matches, setMatches] = useState<ResultMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState<string>("all");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/results?game=${selectedGame}`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.statusText}`);
                }
                const data: ResultMatch[] = await response.json();
                setMatches(data);
            } catch (err) {
                setError("Не удалось загрузить результаты матчей. Попробуйте позже.");
                if (err instanceof Error) {
                    console.error(err.message);
                } else {
                    console.error("An unknown error occurred", err);
                }
            }
        };
        fetchResults();
    }, [selectedGame]);

    return (
        <>
            <Header />
            <main className="bg-gray-100 py-8 min-h-screen">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
                        Результаты матчей
                    </h1>

                    <div className="flex justify-center flex-wrap gap-4 mb-8">
                        <button onClick={() => setSelectedGame("all")} className={`px-4 py-2 border rounded ${selectedGame === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-800"}`}>Все</button>
                        <button onClick={() => setSelectedGame("CS2")} className={`px-4 py-2 border rounded ${selectedGame === "CS2" ? "bg-blue-600 text-white" : "bg-white text-gray-800"}`}>CS2</button>
                        <button onClick={() => setSelectedGame("Dota 2")} className={`px-4 py-2 border rounded ${selectedGame === "Dota 2" ? "bg-blue-600 text-white" : "bg-white text-gray-800"}`}>Dota 2</button>
                        <button onClick={() => setSelectedGame("LoL")} className={`px-4 py-2 border rounded ${selectedGame === "LoL" ? "bg-blue-600 text-white" : "bg-white text-gray-800"}`}>LoL</button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(6).fill(0).map((_, index) => <MatchSkeleton key={index} />)}
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 font-bold p-4">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {matches.length > 0 ? (
                                matches.map((match) => (
                                    <ResultCard
                                        key={match.id}
                                        id={match.id}
                                        team1={match.team1}
                                        team2={match.team2}
                                        team1Logo={match.team1_logo_url}
                                        team2Logo={match.team2_logo_url}
                                        date={match.date}
                                        game={match.game}
                                        result={match.result}
                                    />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500">Завершенные матчи не найдены.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
