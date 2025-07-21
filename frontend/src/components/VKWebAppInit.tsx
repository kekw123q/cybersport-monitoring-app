// src/components/VKWebAppInit.tsx
"use client";

import { useEffect } from 'react';
import vkBridge from '@vkontakte/vk-bridge';

export const VKWebAppInit = () => {
    useEffect(() => {
        // Проверяем, что мы не на сервере
        if (typeof window !== 'undefined') {
            // Отправляем событие для инициализации VK Mini App
            vkBridge.send('VKWebAppInit');
        }
    }, []);

    // Этот компонент ничего не отображает в DOM
    return null;
};