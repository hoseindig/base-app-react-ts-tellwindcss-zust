import { useState, useEffect } from "react";
import { IRREGULAR_VERBS } from "../data/irregularVerbs";

const STORAGE_KEY = "selectedVerbs";

export default function IrregularVerbList() {
  const [selectedVerbs, setSelectedVerbs] = useState<string[]>([]);

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
            .map((v) => (
              <tr
                key={v.base}
                onClick={() => handleRowClick(v.base)}
                className={`cursor-pointer transition-colors ${
                  isSelected(v.base)
                    ? "bg-blue-200 hover:bg-blue-300"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="border p-2">
                  {v.base}
                  {/* {v.isPopular && (
                    <span className="ml-2 text-sm bg-yellow-200 px-2 py-1 rounded">
                      ⭐ Popular
                    </span>
                  )} */}
                </td>
                <td className="border p-2">{v.past}</td>
                <td className="border p-2">{v.pastParticiple}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
