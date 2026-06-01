import Link from 'next/link';
import { User, Briefcase, Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/dates';

export default function PendingReviewScreen({ trabajo, userId }: { trabajo: any, userId: string }) {
  const otroUsuario = trabajo.idRider === userId ? trabajo.driver : trabajo.rider;

  return (
    <div className="min-h-screen bg-[#271033] flex flex-col items-center justify-center px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,4vw,2rem)]">
      <div className="w-full max-w-[600px] flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-[#f500f1]" size={24} />
          <span className="text-[#f500f1] font-bold uppercase tracking-widest text-sm">REVIEW PENDIENTE</span>
        </div>
        <h1 className="text-4xl font-bold text-[#fbdaf9] mb-3 text-center">
          Tenés una review pendiente
        </h1>
        <p className="text-[#c392dd] text-center mb-8">
          Completala antes de seguir usando la app
        </p>

        <div className="w-full bg-[#3a1f52] rounded-xl p-6 border border-[#8d62a5]/20 text-[#fbdaf9]">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-[#8d62a5]" size={20} />
            <span className="font-semibold text-lg">{otroUsuario?.nombre} {otroUsuario?.apellido}</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="text-[#8d62a5]" size={20} />
            <span>{trabajo.tipoDeTrabajo}</span>
          </div>
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="text-[#8d62a5]" size={20} />
            <span className="capitalize">
              {formatDate(trabajo.fechaFin)}
            </span>
          </div>

          <Link
            href={`/reviews/realizar/${trabajo.id}`}
            className="w-full flex items-center justify-center gap-2 bg-[#f500f1] text-[#1a0a2e] py-3 px-4 rounded-lg transform transition-transform duration-300 hover:scale-[1.02] shadow-lg font-semibold"
          >
            Hacer review
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}