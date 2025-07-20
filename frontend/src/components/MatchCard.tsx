"use client";

import Image from "next/image";

// Интерфейс компонента ожидает пропсы в camelCase, это хорошая практика.
interface MatchCardProps {
    id: number;
    team1: string;
    team1Logo: string;
    team2: string;
    team2Logo: string;
    date: string;
    game: string;
    twitchUrl?: string;
}

export default function MatchCard({
                                      team1,
                                      team1Logo,
                                      team2,
                                      team2Logo,
                                      date,
                                      game,
                                      twitchUrl,
                                  }: MatchCardProps) {
    // Внутренняя логика компонента сама решает, что показать: логотип или заглушку.
    const logo1Src = team1Logo ? team1Logo : '/images/placeholder.png';
    const logo2Src = team2Logo ? team2Logo : '/images/placeholder.png';

    return (
        <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
                <div className="flex items-center justify-center space-x-4">
                    <div className="flex flex-col items-center text-center w-1/3">
                        <Image
                            src={logo1Src}
                            alt={team1}
                            width={64}
                            height={64}
                            className="object-contain h-16 w-16"
                        />
                        <p className="text-sm font-medium text-gray-900 mt-2 truncate">{team1}</p>
                    </div>

                    <span className="text-xl font-bold text-gray-700">VS</span>

                    <div className="flex flex-col items-center text-center w-1/3">
                        <Image
                            src={logo2Src}
                            alt={team2}
                            width={64}
                            height={64}
                            className="object-contain h-16 w-16"
                        />
                        <p className="text-sm font-medium text-gray-900 mt-2 truncate">{team2}</p>
                    </div>
                </div>

                <p className="text-sm text-gray-500 mt-4 text-center">
                    {date
                        ? new Date(date).toLocaleString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                        : 'Дата не указана'
                    }
                </p>
                <p className="text-sm text-gray-600 mt-2 text-center">{game}</p>

                {twitchUrl && (
                    <div className="mt-4 text-center">
                        <a
                            href={twitchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                        >
                            Смотреть на Twitch
                        </a>
                    </div>
                )}
            </div>
        </article>
    );
}