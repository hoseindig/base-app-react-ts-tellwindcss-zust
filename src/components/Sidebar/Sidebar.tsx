import type { Station } from '../../store/useStationStore';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    inputValue: string;
    onChangeInput: (v: string) => void;
    onReset: () => void;
    stations: Station[];
    selectedStation: Station | null;
    onSelect: (s: Station) => void;
    loading: boolean;
    error: string | null;
}

export default function Sidebar({ isOpen, onClose, inputValue, onChangeInput, onReset, stations, selectedStation, onSelect, loading, error }: Props) {
    return (
        <div className={`absolute top-4 left-4 bottom-4 z-1000 w-80 md:w-96 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl transition-all duration-300 ease-in-out flex flex-col border border-white/20 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0'}`}>

            <div className="p-5 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-black text-blue-800 tracking-tight">PANTO Rail</h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Germany Stations</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
                >
                    ✕
                </button>
            </div>

            <div className="p-4 space-y-3">
                <div className="relative">
                    <input
                        className="w-full p-3 pl-4 bg-gray-100/50 border-none rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all placeholder:text-gray-400 text-sm"
                        placeholder="Search city or station..."
                        value={inputValue}
                        onChange={(e) => onChangeInput(e.target.value)}
                    />
                </div>

                <button
                    onClick={onReset}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-md active:scale-95"
                >
                    Reset Map View
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">
                {loading && <div className="text-center py-10 animate-pulse text-blue-500 font-medium">Loading Stations...</div>}
                {error && <div className="text-red-500 bg-red-50 p-4 rounded-xl text-sm border border-red-100 m-2">{error}</div>}

                {!loading && stations.map(station => (
                    <div
                        key={station.id}
                        onClick={() => onSelect(station)}
                        className={`group mb-1 p-4 rounded-xl cursor-pointer transition-all duration-200 ${selectedStation?.id === station.id
                            ? 'bg-blue-600 text-white shadow-lg scale-[1.02]'
                            : 'hover:bg-blue-50 text-gray-700 hover:pl-6'
                            }`}
                    >
                        <h3 className="font-bold text-sm leading-tight">{station.name}</h3>
                        <p className={`text-[10px] mt-1 font-semibold uppercase ${selectedStation?.id === station.id ? 'text-blue-200' : 'text-gray-400 group-hover:text-blue-400'}`}>
                            📍 {station.city}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
