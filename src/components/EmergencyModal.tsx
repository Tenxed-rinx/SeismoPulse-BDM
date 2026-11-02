import React, { useState } from 'react';
import { PhoneCall, Copy, Check, X, Search, ExternalLink } from 'lucide-react';
import { GLOBAL_HELPLINES } from '../data/safetyHelplines';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('IN');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentEntry =
    GLOBAL_HELPLINES.find((h) => h.code === selectedCountryCode) || GLOBAL_HELPLINES[0];

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const filteredList = GLOBAL_HELPLINES.filter((h) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      h.country.toLowerCase().includes(q) ||
      h.emergencyNumber.includes(q) ||
      h.disasterAgency.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 text-slate-800 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Country Emergency Helplines
            </h2>
            <p className="text-xs text-slate-500">
              National emergency numbers &amp; disaster management agencies
            </p>
          </div>
        </div>

        {/* Active Selected Country Helpline Card */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-rose-900">
            <span className="text-lg">{currentEntry.flag}</span>
            <span>{currentEntry.country} Emergency Hotline</span>
          </div>

          <div className="text-4xl font-extrabold font-mono text-rose-600 tracking-wider">
            {currentEntry.emergencyNumber}
          </div>

          <div className="text-xs font-semibold text-slate-800">
            {currentEntry.disasterAgency}
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <a
              href={`tel:${currentEntry.emergencyNumber}`}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call {currentEntry.emergencyNumber}</span>
            </a>

            <button
              type="button"
              onClick={() => handleCopyNumber(currentEntry.emergencyNumber)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedNumber === currentEntry.emergencyNumber ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Number</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search country or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white text-slate-800"
          />
        </div>

        {/* Scrollable Country Helpline Directory */}
        <div className="overflow-y-auto space-y-1.5 max-h-[220px] pr-1 divide-y divide-slate-100">
          {filteredList.map((entry) => {
            const isSelected = entry.code === currentEntry.code;
            return (
              <button
                key={entry.code}
                type="button"
                onClick={() => setSelectedCountryCode(entry.code)}
                className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected ? 'bg-rose-50 text-rose-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{entry.flag}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{entry.country}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[220px] sm:max-w-[280px]">
                      {entry.disasterAgency}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-rose-600 bg-white px-2 py-0.5 rounded border border-rose-200">
                    {entry.emergencyNumber}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Simple Close */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer mt-1"
        >
          Close
        </button>
      </div>
    </div>
  );
};
