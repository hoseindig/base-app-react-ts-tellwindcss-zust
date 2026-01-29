import { IRREGULAR_VERBS } from "../data/irregularVerbs";

export default function IrregularVerbList() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Irregular Verbs List</h1>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Base</th>
            <th className="border p-2 text-left">Past</th>
            <th className="border p-2 text-left">Past Participle</th>
          </tr>
        </thead>
        <tbody>
          {IRREGULAR_VERBS.map((v) => (
            <tr key={v.base}>
              <td className="border p-2">{v.base}</td>
              <td className="border p-2">{v.past}</td>
              <td className="border p-2">{v.pastParticiple}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
