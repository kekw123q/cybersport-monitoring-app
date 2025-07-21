// frontend/src/hooks/useIsVK.ts

"use client";

import { useState, useEffect } from "react";

export const useIsVK = (): boolean => {
    const [isVK, setIsVK] = useState(false);

    useEffect(() => {
        // Этот код выполнится только на клиенте (в браузере) один раз
        // и проверит, есть ли в URL параметр 'vk_user_id'.
        // Это самый надежный признак запуска через VK Mini Apps.
        const hasVkParams =
            typeof window !== "undefined" && window.location.search.includes("vk_user_id=");

        setIsVK(hasVkParams);

    }, []); // Пустой массив зависимостей гарантирует, что эффект выполнится один раз.

    return isVK;
};