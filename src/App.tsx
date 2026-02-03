// src/App.tsx
import { Routes, Route, NavLink } from "react-router-dom"; // BrowserRouter را از اینجا حذف کردیم
import { useUserStore } from "./store/useUserStore";
import MapPage from "./Feature/MapPage";
import AboutPage from "./routes/About";
import NotFoundPage from "./routes/NotFound";
import TestPage from "./routes/Testpage";
import IrregularVerbQuiz from "./pages/IrregularVerbQuiz";
import IrregularVerbList from "./pages/IrregularVerbList";
import Words504 from "./pages/Words504";

export default function App() {
  const name = useUserStore((state: any) => state.name);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 flex items-center gap-4 p-4 bg-slate-800 text-white z-50">
        <NavLink to="/" className="hover:underline">
          Map
        </NavLink>
        <NavLink to="/about" className="hover:underline">
          About
        </NavLink>
        <NavLink to="/test" className="hover:underline">
          Test
        </NavLink>

        <NavLink to="/IrregularVerbQuiz" className="hover:underline">
          IrregularVerbQuiz
        </NavLink>
        <NavLink to="/IrregularVerbList" className="hover:underline">
          IrregularVerbList
        </NavLink>
        <NavLink to="/words-504" className="hover:underline">
          504 Words
        </NavLink>
        <span className="ml-auto font-bold">Hi {name}!</span>
      </nav>

      <main className="pt-16">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/IrregularVerbQuiz" element={<IrregularVerbQuiz />} />
          <Route path="/IrregularVerbList" element={<IrregularVerbList />} />
          <Route path="/words-504" element={<Words504 />} />
          {/* Fallback for unknown routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
