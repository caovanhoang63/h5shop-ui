export const FullScreenLoading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div
      className={`${isLoading ? " " : "hidden"} fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 z-[50]`}
    >
      <img src={"/spinner.webp"} className={"size-24"} alt="Loading..." />
    </div>
  );
};
