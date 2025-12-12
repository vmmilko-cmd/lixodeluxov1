export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-sm font-light text-gray-600">
            Lixodeluxo — Un proyecto de donación y reutilización
          </p>
          <p className="text-xs font-light text-gray-500 mt-2">
            {new Date().getFullYear()} · Compartiendo para un futuro sostenible
          </p>
        </div>
      </div>
    </footer>
  );
};
