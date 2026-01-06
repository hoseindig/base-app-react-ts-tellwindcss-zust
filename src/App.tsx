// src/App.tsx
import { Routes, Route } from "react-router-dom"; // BrowserRouter را از اینجا حذف کردیم
import { useUserStore } from "./store/useUserStore";
import HomePage from "./Home";

export default function App() {
  // برای حل خطای Implicit Any، تایپ state را مشخص کردیم
  const name = useUserStore((state: any) => state.name);

  return (
    <>
      {/* استفاده از Fragment به جای روتور اضافی */}
      <nav className="p-4 bg-slate-800 text-white flex gap-4">
        <h1 className="font-bold">سلام {name}!</h1>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* سایر مسیرها فقط با کامپوننت Route اینجا اضافه می‌شوند */}
      </Routes>
    </>
  );
}
