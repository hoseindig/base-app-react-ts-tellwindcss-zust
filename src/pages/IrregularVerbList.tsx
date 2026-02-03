import { useState, useEffect } from "react";
import { IRREGULAR_VERBS } from "../data/irregularVerbs";

const STORAGE_KEY = "selectedVerbs";

export default function IrregularVerbList() {
  const [selectedVerbs, setSelectedVerbs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // بارگذاری داده‌های ذخیره شده هنگام بارگیری صفحه
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSelectedVerbs(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading selected verbs:", error);
      }
    }
  }, []);

  // ذخیره انتخاب‌ها در localStorage
  const handleRowClick = (verbBase: string) => {
    setSelectedVerbs((prev) => {
      const updated = prev.includes(verbBase)
        ? prev.filter((v) => v !== verbBase)
        : [...prev, verbBase];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isSelected = (verbBase: string) => selectedVerbs.includes(verbBase);

  const clearAllSelections = () => {
    setSelectedVerbs([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // متوقف کردن صدای قبلی
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Irregular Verbs List</h1>
        {selectedVerbs.length > 0 && (
          <button
            onClick={clearAllSelections}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            حذف همه انتخاب‌ها ({selectedVerbs.length})
          </button>
        )}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="جستجو کنید..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
        />
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Base</th>
            <th className="border p-2 text-left">Past</th>
            <th className="border p-2 text-left">Past Participle</th>
          </tr>
        </thead>
        <tbody>
          {[...IRREGULAR_VERBS]
            .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
            .filter(
              (v) =>
                v.base.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.past.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.pastParticiple
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()),
            )
            .map((v, i) => (
              <tr
                key={v.base + i}
                onClick={() => handleRowClick(v.base)}
                className={`cursor-pointer transition-colors ${
                  isSelected(v.base)
                    ? "bg-blue-200 hover:bg-blue-300"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="border p-2">
                  <div className="flex items-center gap-2">
                    <span>{v.base}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(v.base);
                      }}
                      className="text-xl hover:scale-110 transition-transform"
                      title="تلفظ کنید"
                    >
                      🔊
                    </button>
                  </div>
                </td>
                <td className="border p-2">
                  <div className="flex items-center gap-2">
                    <span>{v.past}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(v.past);
                      }}
                      className="text-xl hover:scale-110 transition-transform"
                      title="تلفظ کنید"
                    >
                      🔊
                    </button>
                  </div>
                </td>
                <td className="border p-2">
                  <div className="flex items-center gap-2">
                    <span>{v.pastParticiple}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(v.pastParticiple);
                      }}
                      className="text-xl hover:scale-110 transition-transform"
                      title="تلفظ کنید"
                    >
                      🔊
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
