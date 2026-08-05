import AgentRegistrationPage from "./pages/agent-registration-page";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const App = () => {
  return (
    <TooltipProvider>
      <AgentRegistrationPage />
      <Toaster position="top-center" richColors dir="rtl" />
    </TooltipProvider>
  );
};

export default App;
