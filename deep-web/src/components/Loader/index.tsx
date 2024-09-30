import Spinner from "@/components/Spinner";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <Spinner size={3} />
    </div>
  );
};

export default Loader;
