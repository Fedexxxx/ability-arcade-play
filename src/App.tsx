import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import RequireExplorer from "@/components/RequireExplorer";
import { AgeDensityProvider } from "@/contexts/AgeDensityContext";
import OnboardingPage from "./pages/OnboardingPage";
import BasecampPage from "./pages/BasecampPage";
import JourneyPage from "./pages/JourneyPage";
import ExplorePage from "./pages/ExplorePage";
import SuperpowerPage from "./pages/SuperpowerPage";
import ModulePage from "./pages/ModulePage";
import ModuleVictoryPage from "./pages/ModuleVictoryPage";
import SuperpowerVictoryPage from "./pages/SuperpowerVictoryPage";
import ChallengePage from "./pages/ChallengePage";
import MissionsPage from "./pages/MissionsPage";
import AchievementsPage from "./pages/AchievementsPage";
import MasteryGalleryPage from "./pages/MasteryGalleryPage";
import ProfilePage from "./pages/ProfilePage";
import ShopPage from "./pages/ShopPage";
import CustomizePage from "./pages/CustomizePage";
import CharacterQAPage from "./pages/CharacterQAPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Onboarding (no nav, no gate) */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          {/* Sherpa Go journey — gated behind explorer profile */}
          <Route
            path="*"
            element={
              <RequireExplorer>
                <AgeDensityProvider>
                  <Routes>
                    <Route path="/" element={<BasecampPage />} />
                    <Route path="/journey" element={<JourneyPage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/superpower/:id" element={<SuperpowerPage />} />
                    <Route path="/module/:spId/:modId" element={<ModulePage />} />
                    <Route path="/module/:spId/:modId/victory" element={<ModuleVictoryPage />} />
                    <Route path="/superpower/:id/victory" element={<SuperpowerVictoryPage />} />
                    <Route path="/challenge/:spId/:modId/:chId" element={<ChallengePage />} />
                    {/* Legacy routes still reachable from older internal links */}
                    <Route path="/missions" element={<MissionsPage />} />
                    <Route path="/achievements" element={<AchievementsPage />} />
                    <Route path="/mastery" element={<MasteryGalleryPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/tienda" element={<ShopPage />} />
                    <Route path="/personalizar" element={<CustomizePage />} />
                    <Route path="/qa/characters" element={<CharacterQAPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <BottomNav />
                </AgeDensityProvider>
              </RequireExplorer>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
