import { type PropsWithChildren } from "react";

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-[#F6F6F8] h-full max-w-lg mx-auto relative">
      {children}
    </div>
  );
};

export default AppLayout;
