import Link from 'next/link';
import { AlertCircle, ArrowRight, X } from 'lucide-react';

interface PendingReviewScreenProps {
  reviewCount: number;
  primerTrabajoId: string;
  onClose: () => void;
}

export default function PendingReviewScreen({
  reviewCount,
  primerTrabajoId,
  onClose,
}: PendingReviewScreenProps) {
  const texto =
    reviewCount === 1
      ? 'Tienes 1 review pendiente'
      : `Tienes ${reviewCount} reviews pendientes`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#271033] rounded-2xl p-8 max-w-md w-full mx-4 border border-brand-accent-soft/20 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-brand-accent-strong" size={24} />
          <span className="text-brand-accent-strong font-bold uppercase tracking-widest text-sm">
            REVIEW{reviewCount !== 1 ? 'S' : ''} PENDIENTE{reviewCount !== 1 ? 'S' : ''}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-[#fbdaf9] mb-6">
          {texto}
        </h1>

        <div className="flex flex-col gap-3">
          <Link
            href={`/reviews/realizar/${primerTrabajoId}`}
            className="w-full flex items-center justify-center gap-2 bg-brand-accent-strong text-white py-3 px-4 rounded-lg hover:scale-[1.02] transition-transform duration-300 shadow-lg font-semibold"
          >
            Hacer review
            <ArrowRight size={20} />
          </Link>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-transparent text-[#c392dd] border border-brand-accent-soft/40 py-3 px-4 rounded-lg hover:bg-[#3a1f52] transition-colors duration-200 font-semibold cursor-pointer"
          >
            <X size={20} />
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}