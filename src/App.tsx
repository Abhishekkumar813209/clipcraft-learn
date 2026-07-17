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
import { SavedQuizzesView } from "./components/SavedQuizzesView";
import QuizTest from "./pages/QuizTest";
import QuizAnalysis from "./pages/QuizAnalysis";
import UpscMotivation from "./pages/UpscMotivation";
import SscLayout from "./pages/SscLayout";
import SscSubject from "./pages/SscSubject";
import SscDashboard from "./pages/SscDashboard";
import SscPractice from "./pages/SscPractice";
import SscPracticeSession from "./pages/SscPracticeSession";
import NqtLayout from "./pages/NqtLayout";
import NqtDashboard from "./pages/NqtDashboard";
import NqtPractice from "./pages/NqtPractice";
import NqtPracticeSession from "./pages/NqtPracticeSession";
import BpscLayout from "./pages/BpscLayout";
import BpscDashboard from "./pages/BpscDashboard";
import BpscPractice from "./pages/BpscPractice";
import BpscPracticeSession from "./pages/BpscPracticeSession";
import BpscMains from "./pages/BpscMains";
import BpscMainsQuestion from "./pages/BpscMainsQuestion";
import BpscPyqPractice from "./pages/BpscPyqPractice";
import BpscPyqUpload from "./pages/BpscPyqUpload";
import BpscPyqSession from "./pages/BpscPyqSession";
import RbiLayout from "./pages/RbiLayout";
import RbiDashboard from "./pages/RbiDashboard";
import RbiPractice from "./pages/RbiPractice";
import RbiPracticeSession from "./pages/RbiPracticeSession";
import RbiPyqPractice from "./pages/RbiPyqPractice";
import RbiPyqUpload from "./pages/RbiPyqUpload";
import RbiPyqAnalysis from "./pages/RbiPyqAnalysis";
import RbiPyqSession from "./pages/RbiPyqSession";
import HumorCoach from "./pages/HumorCoach";
import ProductivityCoach from "./pages/ProductivityCoach";
import GdPrep from "./pages/GdPrep";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminUpload from "./pages/admin/AdminUpload";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminUsers from "./pages/admin/AdminUsers";
import DailyQuiz from "./pages/DailyQuiz";
import BlackBookHub from "./pages/BlackBookHub";
import BlackBookPractice from "./pages/BlackBookPractice";
import BlackBookBrowse from "./pages/BlackBookBrowse";
import BlackBookDuelNew from "./pages/BlackBookDuelNew";
import BlackBookDuel from "./pages/BlackBookDuel";
import BlackBookHistory from "./pages/BlackBookHistory";
import SscRoots from "./pages/SscRoots";
import SscRootsPractice from "./pages/SscRootsPractice";
import OAuthConsent from "./pages/OAuthConsent";
import SscEnglishIdioms from "./pages/SscEnglishIdioms";
import SscEnglishOws from "./pages/SscEnglishOws";
import SscEnglishSynAnt from "./pages/SscEnglishSynAnt";
import SscGrammar from "./pages/SscGrammar";
import SscGrammarTopic from "./pages/SscGrammarTopic";
import SscGrammarSetup from "./pages/SscGrammarSetup";
import SscPosVerbBasicPractice from "./pages/SscPosVerbBasicPractice";
import SscSynAntPractice from "./pages/SscSynAntPractice";
import SscMathsCalculation from "./pages/SscMathsCalculation";
import SscMathsCalcQuiz from "./pages/SscMathsCalcQuiz";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

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
            <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
            <Route path="/" element={<Index />}>
              <Route index element={<DashboardView />} />
              <Route path="sources" element={<SourceLibraryView />} />
              <Route path="sources/:sourceId" element={<PlaylistBrowserView />} />
              <Route path="clips" element={<AddClipsView />} />
              <Route path="player/:videoId" element={<VideoPlayerView />} />
              <Route path="pdf" element={<PdfReaderView />} />
              <Route path="quizzes" element={<SavedQuizzesView />} />
              <Route path="upsc" element={<UpscMotivation />} />
              <Route path="topic/:topicId" element={<TopicView />} />
            </Route>
            <Route path="/quizzes/:quizId" element={<QuizTest />} />
            <Route path="/quizzes/:quizId/analysis" element={<QuizAnalysis />} />
            <Route path="/ssc" element={<ProtectedRoute><SscLayout /></ProtectedRoute>}>
              <Route index element={<SscDashboard />} />
              <Route path="practice" element={<SscPractice />} />
              <Route path="practice/:topic" element={<SscPracticeSession />} />
              <Route path="blackbook" element={<BlackBookHub />} />
              <Route path="blackbook/browse" element={<BlackBookBrowse />} />
              <Route path="blackbook/browse/:category" element={<BlackBookBrowse />} />
              <Route path="blackbook/practice" element={<BlackBookPractice />} />
              <Route path="blackbook/practice/:category" element={<BlackBookPractice />} />
              <Route path="blackbook/history" element={<BlackBookHistory />} />
              <Route path="roots" element={<SscRoots />} />
              <Route path="roots/practice" element={<SscRootsPractice />} />
              
              <Route path="english" element={<SscSubject />} />
              <Route path="english/idioms" element={<SscEnglishIdioms />} />
              <Route path="english/ows" element={<SscEnglishOws />} />
              <Route path="english/synant" element={<SscEnglishSynAnt />} />
              <Route path="english/synant/practice" element={<SscSynAntPractice />} />
              <Route path="english/grammar" element={<SscGrammar />} />
              <Route path="english/grammar/:pos" element={<SscGrammarTopic />} />
              <Route path="english/grammar/:pos/basic" element={<SscGrammarSetup />} />
              <Route path="english/grammar/:pos/basic/practice" element={<SscPosVerbBasicPractice />} />
              <Route path="maths" element={<SscSubject />} />
              <Route path="maths/calculation" element={<SscMathsCalculation />} />
              <Route path="maths/calculation/:chapter" element={<SscMathsCalcQuiz />} />
              <Route path="reasoning" element={<SscSubject />} />
              <Route path="gk" element={<SscSubject />} />

              <Route path="duel/new" element={<BlackBookDuelNew />} />
              <Route path="duel/:id" element={<BlackBookDuel />} />
            </Route>
            <Route path="/nqt" element={<ProtectedRoute><NqtLayout /></ProtectedRoute>}>
              <Route index element={<NqtDashboard />} />
              <Route path="practice" element={<NqtPractice />} />
              <Route path="practice/:topic" element={<NqtPracticeSession />} />
            </Route>
            <Route path="/bpsc" element={<ProtectedRoute><BpscLayout /></ProtectedRoute>}>
              <Route index element={<BpscDashboard />} />
              <Route path="practice" element={<BpscPractice />} />
              <Route path="practice/:topic" element={<BpscPracticeSession />} />
              <Route path="mains" element={<BpscMains />} />
              <Route path="mains/:paper" element={<BpscMains />} />
              <Route path="mains/q/:id" element={<BpscMainsQuestion />} />
              <Route path="pyq" element={<BpscPyqPractice />} />
              <Route path="pyq/practice" element={<BpscPyqSession />} />
              <Route path="pyq/upload" element={<BpscPyqUpload />} />
            </Route>
            <Route path="/rbi" element={<ProtectedRoute><RbiLayout /></ProtectedRoute>}>
              <Route index element={<RbiDashboard />} />
              <Route path="practice" element={<RbiPractice />} />
              <Route path="practice/:topic" element={<RbiPracticeSession />} />
              <Route path="pyq" element={<RbiPyqPractice />} />
              <Route path="pyq/upload" element={<RbiPyqUpload />} />
              <Route path="pyq/analysis" element={<RbiPyqAnalysis />} />
              <Route path="pyq/practice" element={<RbiPyqSession />} />
            </Route>
            <Route path="/humor" element={<ProtectedRoute><HumorCoach /></ProtectedRoute>} />
            <Route path="/productivity" element={<ProtectedRoute><ProductivityCoach /></ProtectedRoute>} />
            <Route path="/gd" element={<ProtectedRoute><GdPrep /></ProtectedRoute>} />
            <Route path="/quiz/daily" element={<ProtectedRoute><DailyQuiz /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="books" element={<AdminBooks />} />
              <Route path="upload" element={<AdminUpload />} />
              <Route path="questions" element={<AdminQuestions />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
