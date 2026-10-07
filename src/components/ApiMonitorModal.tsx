import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  X,
  Play,
  RotateCw,
  Server,
  Key,
  Database,
  ExternalLink,
  Code2,
} from 'lucide-react';

interface ApiMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiMonitorModal: React.FC<ApiMonitorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);

  const [testStopCode, setTestStopCode] = useState('04121');
  const [testServiceNo, setTestServiceNo] = useState('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  // Fetch health on open
  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  const fetchHealth = async () => {
    setHealthLoading(true);
    setHealthError(null);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
    } catch (err: any) {
      setHealthError(err.message || 'Failed to connect to /api/health');
    } finally {
      setHealthLoading(false);
    }
  };

  const handleTestArrival = async () => {
    setApiLoading(true);
    setApiResponse(null);
    setApiStatus(null);
    try {
      const params = new URLSearchParams();
      params.set('BusStopCode', testStopCode.trim());
      if (testServiceNo.trim()) {
        params.set('ServiceNo', testServiceNo.trim());
      }

      const url = `/api/bus-arrival?${params.toString()}`;
      const res = await fetch(url);
      setApiStatus(res.status);
      const data = await res.json();
      setApiResponse(data);
    } catch (err: any) {
      setApiStatus(500);
      setApiResponse({ error: err.message || 'Network request failed' });
    } finally {
      setApiLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded max-w-3xl w-full border border-[#cbd5e1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0f172a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-[#eb651b]" />
            <div>
              <h3 className="font-space font-bold text-lg leading-tight">
                Transit API Gateway & Health Monitor
              </h3>
              <p className="text-[11px] text-slate-400">
                LTA DataMall v3 Integration (`/api/health` & `/api/bus-arrival`)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm text-[#0f172a]">
          {/* Section 1: /api/health Monitor */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#6f2c75]" />
                <span className="font-space font-bold text-xs uppercase tracking-wider text-[#475569]">
                  Endpoint Health Status (/api/health)
                </span>
              </div>
              <button
                onClick={fetchHealth}
                disabled={healthLoading}
                className="cursor-pointer flex items-center gap-1 text-xs text-[#6f2c75] hover:text-[#5a1e62] font-semibold"
              >
                <RotateCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} />
                <span>Ping Health</span>
              </button>
            </div>

            <div className="mt-3">
              {healthLoading && !healthData ? (
                <div className="text-xs text-[#64748b] py-2">Pinging /api/health...</div>
              ) : healthError ? (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{healthError}</span>
                </div>
              ) : healthData ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded border border-[#e2e8f0]">
                    <span className="text-[#64748b] block text-[11px]">System Status</span>
                    <span className="font-space font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {healthData.status}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-[#e2e8f0]">
                    <span className="text-[#64748b] block text-[11px]">Server Uptime</span>
                    <span className="font-mono font-semibold text-[#0f172a] mt-0.5 block">
                      {healthData.uptimeSeconds}s
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-[#e2e8f0]">
                    <span className="text-[#64748b] block text-[11px]">LTA AccountKey</span>
                    <span
                      className={`font-space font-semibold mt-0.5 block ${
                        healthData.ltaConfig?.accountKeyConfigured
                          ? 'text-emerald-700'
                          : 'text-[#d97706]'
                      }`}
                    >
                      {healthData.ltaConfig?.accountKeyConfigured
                        ? 'Configured'
                        : 'Not in .env'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-[#e2e8f0]">
                    <span className="text-[#64748b] block text-[11px]">LTA API Version</span>
                    <span className="font-mono text-[#0f172a] mt-0.5 block">
                      v3 BusArrival
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Section 2: Interactive LTA BusArrival Endpoint Tester */}
          <div className="bg-white border border-[#e2e8f0] rounded p-4 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#f1f5f9]">
              <Database className="w-4 h-4 text-[#eb651b]" />
              <h4 className="font-space font-bold text-sm text-[#0f172a]">
                Test LTA Bus Arrival Endpoint (/api/bus-arrival)
              </h4>
            </div>

            <p className="text-xs text-[#64748b]">
              Calls the live gateway <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">GET /api/bus-arrival?BusStopCode=04121</code> which queries LTA DataMall v3.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-space font-semibold text-[#64748b] uppercase mb-1">
                  BusStopCode (Required)
                </label>
                <input
                  type="text"
                  value={testStopCode}
                  onChange={(e) => setTestStopCode(e.target.value)}
                  placeholder="e.g. 04121"
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded text-xs font-mono font-semibold focus:border-[#6f2c75] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-space font-semibold text-[#64748b] uppercase mb-1">
                  ServiceNo (Optional)
                </label>
                <input
                  type="text"
                  value={testServiceNo}
                  onChange={(e) => setTestServiceNo(e.target.value)}
                  placeholder="e.g. 7 or leave blank"
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded text-xs font-mono focus:border-[#6f2c75] outline-none"
                />
              </div>
            </div>

            {/* Presets and Execute */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                <span className="text-[11px] font-space font-semibold">Presets:</span>
                <button
                  onClick={() => {
                    setTestStopCode('04121');
                    setTestServiceNo('');
                  }}
                  className="cursor-pointer text-[11px] font-mono px-2 py-0.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] rounded text-[#334155]"
                >
                  04121 (City Hall)
                </button>
                <button
                  onClick={() => {
                    setTestStopCode('04121');
                    setTestServiceNo('7');
                  }}
                  className="cursor-pointer text-[11px] font-mono px-2 py-0.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] rounded text-[#334155]"
                >
                  04121 & Service 7
                </button>
                <button
                  onClick={() => {
                    setTestStopCode('09048');
                    setTestServiceNo('190');
                  }}
                  className="cursor-pointer text-[11px] font-mono px-2 py-0.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] rounded text-[#334155]"
                >
                  09048 & Service 190
                </button>
              </div>

              <button
                onClick={handleTestArrival}
                disabled={apiLoading || !testStopCode.trim()}
                className="cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-[#eb651b] hover:bg-[#d9531e] text-white rounded text-xs font-space font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${apiLoading ? 'animate-pulse' : ''}`} />
                <span>{apiLoading ? 'Executing Request...' : 'Send API Request'}</span>
              </button>
            </div>

            {/* Results Display */}
            {apiResponse && (
              <div className="mt-3 pt-3 border-t border-[#f1f5f9]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-space font-semibold text-[#64748b]">
                      HTTP Status:
                    </span>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        apiStatus === 200
                          ? 'bg-emerald-100 text-emerald-800'
                          : apiStatus === 401
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {apiStatus} {apiStatus === 200 ? 'OK' : apiStatus === 401 ? 'Unauthorized (Need Key)' : 'Response'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#94a3b8]">
                    Refreshed: {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <pre className="bg-[#0f172a] text-[#38bdf8] p-3 rounded text-xs font-mono max-h-56 overflow-auto">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between">
          <span className="text-xs text-[#64748b]">
            To configure your API Key permanently, set <code className="font-mono text-[#0f172a] font-bold">LTA_ACCOUNT_KEY</code> in <code className="font-mono">.env</code>.
          </span>
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-space font-bold uppercase tracking-wider rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
