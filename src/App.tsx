// src/App.tsx
import { Routes, Route, NavLink } from "react-router-dom"; // BrowserRouter را از اینجا حذف کردیم
import { useUserStore } from "./store/useUserStore";
import HomePage from "./Home";
import UserPage from "./routes/UsersPage";
import MapPage from "./Feature/MapPage";

export default function App() {
  const name = useUserStore((state: any) => state.name);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 flex items-center gap-4 p-4 bg-slate-800 text-white z-50">
        <NavLink to="/" className="hover:underline">Home</NavLink>
        <NavLink to="/users" className="hover:underline">Users</NavLink>
        <NavLink to="/map" className="hover:underline">Map</NavLink>
        <span className="ml-auto font-bold">Hi {name}!</span>
      </nav>

      <main className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/map" element={<MapPage />} />

        </Routes>
      </main>
    </>
  );
}
