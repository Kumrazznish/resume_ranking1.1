interface LoadingOverlayProps {
  isVisible: boolean;
  title: string;
  subtitle: string;
  progress: number;
}

export function LoadingOverlay({ isVisible, title, subtitle, progress }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
        {/* Animated spinner */}
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse" />
          </div>
        </div>

        {/* Loading text */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-6">
          {subtitle}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-500">
          {progress}% complete
        </p>

        {/* Processing steps indicator */}
        <div className="flex justify-center space-x-2 mt-4">
          {[0, 1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                progress > step * 20
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}