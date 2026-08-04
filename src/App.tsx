import AgentRegistrationPage from "./pages/agent-registration-page";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <>
      <AgentRegistrationPage />
      <Toaster position="top-center" richColors dir="rtl" />
    </>
  );
};

export default App;
