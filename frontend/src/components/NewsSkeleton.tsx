export default function NewsSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4">
                <div className="h-4 bg-gray-200 w-1/3 mb-2" />
                <div className="h-6 bg-gray-200 w-2/3 mb-2" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200" />
                    <div className="h-4 bg-gray-200 w-5/6" />
                </div>
            </div>
        </div>
    );
}