export const LoadingSpinner: React.FC = () => {
    return (
        <div className="relative">
            <div className="absolute animate-spin w-10 h-10">
                <div className="w-full h-5 border-4 border-b-0 border-blue-800 rounded-t-full" />
            </div>
            <div className="w-10 h-10 border-4 border-blue-300 rounded-full" />
        </div>
    );
};
