/*
"use client";

import Image from "next/image";

interface ResultCardProps {
    team1: string;
    team1Logo: string;
    team2: string;
    team2Logo: string;
    date: string;
    game: string;
    result: string; // окончательный счет матча, например, "2:0", "1:2" и т.п.
}

export default function ResultCard({
                                       team1,
                                       team1Logo,
                                       team2,
                                       team2Logo,
                                       date,
                                       game,
                                       result,
                                   }: ResultCardProps) {
    return (
        <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
                {/!* Блок с логотипами и названиями команд *!/}
                <div className="flex items-center justify-center space-x-4">
                    <div className="flex flex-col items-center">
                        <Image
                            src={team1Logo}
                            alt={team1}
                            width={64}
                            height={64}
                            className="object-cover"
                        />
                        <p className="mt-2 text-sm font-medium text-gray-900">{team1}</p>
                    </div>
                    <span className="text-xl font-bold text-gray-700">VS</span>
                    <div className="flex flex-col items-center">
                        <Image
                            src={team2Logo}
                            alt={team2}
                            width={64}
                            height={64}
                            className="object-cover"
                        />
                        <p className="mt-2 text-sm font-medium text-gray-900">{team2}</p>
                    </div>
                </div>

                {/!* Дата матча и название игры *!/}
                <p className="mt-4 text-center text-sm text-gray-500">
                    {new Date(date).toLocaleString()}
                </p>
                <p className="mt-2 text-center text-sm text-gray-600">{game}</p>

                {/!* Результат матча *!/}
                <div className="mt-4 text-center">
          <span className="px-3 py-1 bg-green-600 text-white text-lg font-bold rounded-full">
            {result}
          </span>
                </div>
            </div>
        </article>
    );
}
*/
"use client";

import Image from "next/image";

// Интерфейс описывает, какие пропсы (props) ожидает компонент.
// Названия здесь (team1Logo) должны совпадать с теми, которые
// вы передаете со страницы.
interface ResultCardProps {
    id: number; // Рекомендуется добавить ID, хотя он и не используется для отображения
    team1: string;
    team1Logo: string;
    team2: string;
    team2Logo: string;
    date: string;
    game: string;
    result: string;
}

export default function ResultCard({
                                       team1,
                                       team1Logo,
                                       team2,
                                       team2Logo,
                                       date,
                                       game,
                                       result,
                                   }: ResultCardProps) {
    // Эта логика определяет, какой URL использовать: тот, что пришел, или заглушку.
    // Она правильная и обрабатывает случаи, когда team1Logo/team2Logo равны null или пустой строке.
    const logo1Src = team1Logo ? team1Logo : '/images/placeholder.png';
    const logo2Src = team2Logo ? team2Logo : '/images/placeholder.png';

    return (
        <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
                <div className="flex items-center justify-center space-x-4">
                    {/* Блок для первой команды */}
                    <div className="flex flex-col items-center text-center w-1/3">
                        <Image
                            src={logo1Src}
                            alt={team1}
                            width={64}
                            height={64}
                            className="object-contain h-16 w-16" // object-contain лучше для логотипов
                        />
                        <p className="mt-2 text-sm font-medium text-gray-900 truncate">{team1}</p>
                    </div>

                    <span className="text-xl font-bold text-gray-700">VS</span>

                    {/* Блок для второй команды */}
                    <div className="flex flex-col items-center text-center w-1/3">
                        <Image
                            src={logo2Src}
                            alt={team2}
                            width={64}
                            height={64}
                            className="object-contain h-16 w-16"
                        />
                        <p className="mt-2 text-sm font-medium text-gray-900 truncate">{team2}</p>
                    </div>
                </div>

                {/* Дата и игра */}
                <p className="mt-4 text-center text-sm text-gray-500">
                    {date
                        ? new Date(date).toLocaleString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })
                        : 'Дата не указана'
                    }
                </p>
                <p className="mt-2 text-center text-sm text-gray-600">{game}</p>

                {/* Результат матча */}
                <div className="mt-4 text-center">
                    <span className="px-3 py-1 bg-green-600 text-white text-lg font-bold rounded-full">
                        {result}
                    </span>
                </div>
            </div>
        </article>
    );
}