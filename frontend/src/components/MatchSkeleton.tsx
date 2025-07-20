// src/components/MatchSkeleton.tsx

export default function MatchSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="p-4">
                <div className="flex items-center justify-center space-x-4">
                    {/* Placeholder for Team 1 */}
                    <div className="flex flex-col items-center w-1/3">
                        <div className="bg-gray-200 rounded-full h-16 w-16"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 mt-2"></div>
                    </div>

                    {/* VS separator */}
                    <div className="h-6 bg-gray-300 rounded w-8"></div>

                    {/* Placeholder for Team 2 */}
                    <div className="flex flex-col items-center w-1/3">
                        <div className="bg-gray-200 rounded-full h-16 w-16"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 mt-2"></div>
                    </div>
                </div>

                {/* Placeholder for Date and Game */}
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mt-2"></div>

                {/* Placeholder for Button */}
                <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto mt-4"></div>
            </div>
        </div>
    );
}