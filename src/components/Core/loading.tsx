import { Spinner } from "../ui/spinner";

const Loading = ({ loading, label }: { loading: boolean; label?: string }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white/80 ${
        loading ? "block" : "hidden"
      }`}
    >
      <div className="flex flex-col items-center gap-8 lg justify-center">
        <Spinner />
        <span>{label}</span>
      </div>
    </div>
  );
};

export default Loading;
