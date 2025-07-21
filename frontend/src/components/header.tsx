// src/components/header.tsx
"use client";

import Link from "next/link";
import { useIsVK } from "@/hooks/useIsVK"; // <-- Импортируем наш хук

export default function Header() {
    const isVK = useIsVK(); // <-- Используем хук

    // Если приложение открыто в VK, не показываем Header
    if (isVK) {
        return null;
    }

    // Если не в VK, показываем обычный Header
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Киберспортивный мониторинг</h1>
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