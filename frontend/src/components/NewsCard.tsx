"use client";

import Image from "next/image";

interface NewsCardProps {
    title: string;
    description: string;
    imageUrl: string;
    date: string;
    articleUrl?: string;
    game: string; // новое свойство
}

export default function NewsCard({
                                     title,
                                     description,
                                     imageUrl,
                                     date,
                                     articleUrl,
                                     game,
                                 }: NewsCardProps) {
    const content = (
        <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {imageUrl ? (
                <div className="relative h-48">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            ) : (
                <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Изображение отсутствует</span>
                </div>
            )}

            <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">{date}</p>
                <p className="text-sm text-gray-500 mb-2">Игра: {game}</p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600 line-clamp-3">{description}</p>
            </div>
        </article>
    );

    if (articleUrl) {
        return (
            <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                {content}
            </a>
        );
    }

    return content;
}
