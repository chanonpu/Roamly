import React, { useState } from 'react';
import { CheckSquare, Square, X, Plus } from 'lucide-react';
import { PackingItem } from '../types/travel';

interface PackingChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  packingList: PackingItem[];
  onUpdateList: (newList: PackingItem[]) => void;
  destinationName: string;
}

export const PackingChecklistModal: React.FC<PackingChecklistModalProps> = ({
  isOpen,
  onClose,
  packingList = [],
  onUpdateList,
  destinationName
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory] = useState<PackingItem['category']>('Essentials');

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    const updated = packingList.map(item => 
      item.id === id ? { ...item, packed: !item.packed } : item
    );
    onUpdateList(updated);
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const newItem: PackingItem = {
      id: `p_${Date.now()}`,
      category: newItemCategory,
      item: newItemText.trim(),
      packed: false
    };
    onUpdateList([...packingList, newItem]);
    setNewItemText('');
  };

  const packedCount = packingList.filter(p => p.packed).length;
  const progressPercent = packingList.length ? Math.round((packedCount / packingList.length) * 100) : 0;

  return (
    <div onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }} id="packing-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-heading">
                Packing Checklist for {destinationName}
              </h3>
              <p className="text-xs text-stone-500">
                {packedCount} of {packingList.length} items packed ({progressPercent}%)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Add Item Form */}
        <div className="flex items-center gap-2 text-xs">
          <input
            type="text"
            value={newItemText}
            onChange={e => setNewItemText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddItem(); }}
            placeholder="Add custom packing item..."
            className="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
          <button
            onClick={handleAddItem}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 text-white font-bold flex items-center gap-1 hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Items List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {packingList.map(p => (
            <div
              key={p.id}
              onClick={() => toggleItem(p.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                p.packed
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-stone-400 line-through'
                  : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:border-emerald-500'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {p.packed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-stone-300 shrink-0" />
                )}
                <span className="font-medium">{p.item}</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-300">
                {p.category}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
