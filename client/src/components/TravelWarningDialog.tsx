import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { TravelWarning } from '../types/travel';

interface TravelWarningDialogProps {
  warning: TravelWarning | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TravelWarningDialog: React.FC<TravelWarningDialogProps> = ({ warning, ...rest }) => {
  if (!warning) return null;
  // Mounted fresh on every open, so each visit rolls a new variant and starts at step one.
  return <WarningContent warning={warning} {...rest} />;
};

const WarningContent: React.FC<TravelWarningDialogProps & { warning: TravelWarning }> = ({
  warning,
  onConfirm,
  onCancel
}) => {
  const [variant] = useState(() => warning.variants[Math.floor(Math.random() * warning.variants.length)]);
  const [isDoubleCheck, setIsDoubleCheck] = useState(false);

  const title = isDoubleCheck && warning.doubleCheck ? warning.doubleCheck.title : variant.title;
  const message = isDoubleCheck && warning.doubleCheck ? warning.doubleCheck.message : variant.message;
  const confirmText = isDoubleCheck && warning.doubleCheck ? warning.doubleCheck.confirmButtonText : warning.confirmButtonText;
  const handleConfirm = () => {
    if (warning.doubleCheck && !isDoubleCheck) setIsDoubleCheck(true);
    else onConfirm();
  };

  return (
    <div onMouseDown={e => { if (e.target === e.currentTarget) onCancel(); }} id="travel-warning-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 dark:bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border-2 border-amber-500/80 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 text-center relative overflow-hidden">
        
        {/* Animated Warning Icon Header */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-3xl shadow-inner">
          {warning.icon || '⚠️'}
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" /> {isDoubleCheck ? 'Final Confirmation' : 'Regional Humorous Advisory'}
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-serif-heading">
            {title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed px-2">
            {message}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            id="warning-cancel-btn"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {warning.cancelButtonText}
          </button>

          <button
            id="warning-confirm-btn"
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            {confirmText}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
