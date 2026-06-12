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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#271033] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#8d62a5]/20 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-[#f500f1]" size={24} />
          <span className="text-[#f500f1] font-bold uppercase tracking-widest text-sm">
            REVIEW{reviewCount !== 1 ? 'S' : ''} PENDIENTE{reviewCount !== 1 ? 'S' : ''}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-[#fbdaf9] mb-6">
          {texto}
        </h1>

        <div className="flex flex-col gap-3">
          <Link
            href={`/reviews/realizar/${primerTrabajoId}`}
            className="w-full flex items-center justify-center gap-2 bg-[#f500f1] text-[#1a0a2e] py-3 px-4 rounded-lg hover:scale-[1.02] transition-transform duration-300 shadow-lg font-semibold"
          >
            Hacer review
            <ArrowRight size={20} />
          </Link>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-transparent text-[#c392dd] border border-[#8d62a5]/40 py-3 px-4 rounded-lg hover:bg-[#3a1f52] transition-colors duration-200 font-semibold cursor-pointer"
          >
            <X size={20} />
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}