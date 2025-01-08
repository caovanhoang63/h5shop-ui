export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-4xl font-bold text-red-600">404</div>
      <h2 className="text-xl mt-4">Page Not Found</h2>
      <p className="mt-2 text-gray-600">
        Sorry, the page you're looking for doesn't exist.
      </p>
    </div>
  );
};
