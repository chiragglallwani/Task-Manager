export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen dark:bg-gray-900 bg-white flex flex-col items-center justify-center">
      {children}
    </div>
  );
};
