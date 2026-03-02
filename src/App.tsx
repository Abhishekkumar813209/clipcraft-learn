import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { DashboardView } from "./components/DashboardView";
import { SourceLibraryView } from "./components/SourceLibraryView";
import { AddClipsView } from "./components/AddClipsView";
import { TopicView } from "./components/TopicView";
import { PlaylistBrowserView } from "./components/PlaylistBrowserView";
import { VideoPlayerView } from "./components/VideoPlayerView";
import { PdfReaderView } from "./components/PdfReaderView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Index />}>
              <Route index element={<DashboardView />} />
              <Route path="sources" element={<SourceLibraryView />} />
              <Route path="sources/:sourceId" element={<PlaylistBrowserView />} />
              <Route path="clips" element={<AddClipsView />} />
              <Route path="player/:videoId" element={<VideoPlayerView />} />
              <Route path="pdf" element={<PdfReaderView />} />
              <Route path="topic" element={<TopicView />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
