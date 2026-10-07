import React from 'react';
import { AlertTriangle, X, CheckCircle, ShieldAlert, Bus } from 'lucide-react';
import { ServiceAdvisory } from '../data/transitData';

interface ServiceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  advisories: ServiceAdvisory[];
  onSelectService: (serviceNo: string) => void;
}

export const ServiceAlertsModal: React.FC<ServiceAlertsModalProps> = ({
  isOpen,
  onClose,
  advisories,
  onSelectService,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded max-w-2xl w-full border border-[#cbd5e1] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#6f2c75] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#eb651b]" />
            <h3 className="font-space font-bold text-lg">
              Metropolitan Transit Service Advisories
            </h3>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1 rounded hover:bg-white/20 transition-colors text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Advisory List */}
        <div className="p-5 overflow-y-auto space-y-4">
          {advisories.map((advisory) => {
            const isWarning = advisory.severity === 'warning';
            return (
              <div
                key={advisory.id}
                className={`p-4 rounded border ${
                  isWarning
                    ? 'bg-[#fffbeb] border-[#fde68a]'
                    : 'bg-[#f8fafc] border-[#e2e8f0]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {isWarning ? (
                      <AlertTriangle className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-space font-bold text-sm sm:text-base text-[#0f172a]">
                        {advisory.title}
                      </h4>
                      <span className="text-[11px] font-mono text-[#64748b]">
                        {advisory.id} · {advisory.date}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-space font-bold uppercase px-2 py-0.5 rounded ${
                      advisory.status === 'Active'
                        ? 'bg-[#dc2626] text-white'
                        : advisory.status === 'Scheduled'
                        ? 'bg-[#d97706] text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {advisory.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#475569] mt-3 leading-relaxed">
                  {advisory.details}
                </p>

                {advisory.servicesAffected.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#e2e8f0] flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-space font-semibold text-[#64748b]">
                      Affected Services:
                    </span>
                    {advisory.servicesAffected.map((srv) => (
                      <button
                        key={srv}
                        onClick={() => {
                          onSelectService(srv);
                          onClose();
                        }}
                        className="cursor-pointer px-2 py-0.5 bg-[#6f2c75] text-white text-xs font-space font-bold rounded hover:bg-[#5a1e62] transition-colors"
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 bg-[#6f2c75] hover:bg-[#5a1e62] text-white text-xs font-space font-bold uppercase tracking-wider rounded transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
