import { memo } from "react";

const Loader = memo(({ loading }: { loading: boolean }) => {
  if (!loading) return;
  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-2 items-center justify-center bg-accent w-fit p-2 rounded-2xl">
        <div className="animate-bounce delay-75 bg-foreground transition-all rounded-full w-fit h-fit p-1" />
        <div className="animate-bounce delay-150 bg-foreground transition-all rounded-full w-fit h-fit p-1" />
        <div className="animate-bounce delay-300 bg-foreground transition-all rounded-full w-fit h-fit p-1" />
      </div>
    </div>
  );
});
Loader.displayName = "Loader";

export default Loader;
