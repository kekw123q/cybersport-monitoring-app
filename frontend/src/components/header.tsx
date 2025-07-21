"use client";

import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-white shadow-md">
            {/*
              Адаптивные классы Tailwind:
              - По умолчанию (mobile): flex-col (элементы в столбик), items-center (по центру), gap-4 (отступ между ними).
              - На экранах 'md' и больше: flex-row (в ряд), justify-between (по краям).
            */}
            <div className="container mx-auto px-4 py-4
                            flex flex-col items-center text-center gap-4
                            md:flex-row md:justify-between md:text-left">

                <h1 className="text-2xl font-bold">
                    Киберспортивный мониторинг
                </h1>

                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/" className="text-gray-700 hover:text-gray-900">
                                Главная
                            </Link>
                        </li>
                        <li>
                            <Link href="/Schedule" className="text-gray-700 hover:text-gray-900">
                                Расписание
                            </Link>
                        </li>
                        <li>
                            <Link href="/results" className="text-gray-700 hover:text-gray-900">
                                Результаты
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}