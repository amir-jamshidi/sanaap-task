import { type PropsWithChildren } from "react";

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className=" py-2 h-full max-w-lg mx-auto relative">
      <div>{children}</div>
      <div className="bg-primary h-64 rounded-b-4xl absolute left-0 right-0 top-0 -z-1"></div>
    </div>
  );
};

export default AppLayout;
