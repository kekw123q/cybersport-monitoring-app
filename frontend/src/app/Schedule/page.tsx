"use client";
import { useEffect, useState } from "react";
import MatchCard from "@/components/MatchCard";
import MatchSkeleton from "@/components/MatchSkeleton";
import Header from "@/components/header";

interface MatchItem {
    id: number;
    team1: string;
    team1_logo_url: string;
    team2: string;
    team2_logo_url: string;
    date: string;
    game: string;
    twitch_url?: string;
}

export default function Schedule() {
    const [matches, setMatches] = useState<MatchItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState<string>("all");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/schedule?game=${selectedGame}`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.statusText}`);
                }
                const data: MatchItem[] = await response.json();
                setMatches(data);
            } catch (err: unknown) { // <-- ИСПРАВЛЕНО
                if (err instanceof Error) {
                    setError(`Не удалось загрузить расписание: ${err.message}`);
                } else {
                    setError("Не удалось загрузить расписание. Произошла неизвестная ошибка.");
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, [selectedGame]);

    return (
        <>
            <Header />
            <main className="bg-gray-100 py-8 min-h-screen">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
                        Расписание матчей
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
                                    <MatchCard
                                        key={match.id}
                                        id={match.id}
                                        team1={match.team1}
                                        team2={match.team2}
                                        team1Logo={match.team1_logo_url}
                                        team2Logo={match.team2_logo_url}
                                        date={match.date}
                                        game={match.game}
                                        twitchUrl={match.twitch_url}
                                    />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500">Предстоящие матчи не найдены.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}