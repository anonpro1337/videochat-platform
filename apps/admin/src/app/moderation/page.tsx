'use client';

import { useState } from 'react';
import {
  Flag,
  Warning,
  Prohibit,
  SpeakerNone,
  CheckCircle,
  UserCircle,
  Clock,
} from '@phosphor-icons/react';

interface Report {
  id: string;
  reporter: string;
  reportedUser: string;
  reason: string;
  details: string;
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Resolved';
}

const initialReports: Report[] = [
  {
    id: '#RPT-1024',
    reporter: 'Sarah Williams',
    reportedUser: 'Mike Brown',
    reason: 'Inappropriate Behavior',
    details: 'User was sending explicit messages during a video chat session.',
    timestamp: '5 min ago',
    severity: 'High',
    status: 'Pending',
  },
  {
    id: '#RPT-1023',
    reporter: 'Emma Davis',
    reportedUser: 'James Wilson',
    reason: 'Harassment',
    details: 'Repeated harassment and name-calling in public chat rooms.',
    timestamp: '12 min ago',
    severity: 'High',
    status: 'Pending',
  },
  {
    id: '#RPT-1022',
    reporter: 'Alex Johnson',
    reportedUser: 'AnonymousUser87',
    reason: 'Spam',
    details: 'User posting spam links in multiple chat rooms.',
    timestamp: '28 min ago',
    severity: 'Low',
    status: 'Pending',
  },
  {
    id: '#RPT-1021',
    reporter: 'Liam Anderson',
    reportedUser: 'Olivia Martinez',
    reason: 'Underage User',
    details: 'User claims to be 15 years old in their profile.',
    timestamp: '1 hour ago',
    severity: 'High',
    status: 'Pending',
  },
  {
    id: '#RPT-1020',
    reporter: 'Sophia Taylor',
    reportedUser: 'TrollMaster99',
    reason: 'Hate Speech',
    details: 'Racist remarks and hate speech in public chat.',
    timestamp: '2 hours ago',
    severity: 'Medium',
    status: 'Pending',
  },
  {
    id: '#RPT-1019',
    reporter: 'Noah Garcia',
    reportedUser: 'James Wilson',
    reason: 'Impersonation',
    details: 'User pretending to be a moderator and scamming others.',
    timestamp: '3 hours ago',
    severity: 'Medium',
    status: 'Resolved',
  },
];

type Action = 'warn' | 'mute' | 'ban' | 'dismiss';

export default function ModerationPage() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Resolved'>('All');

  const filtered = filterStatus === 'All' ? reports : reports.filter((r) => r.status === filterStatus);

  const handleAction = (reportId: string, action: Action) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return { ...r, status: 'Resolved' as const };
      })
    );
    setSelectedReport(null);
  };

  const severityColors = {
    Low: 'bg-accent/15 text-accent border-accent/20',
    Medium: 'bg-accent/15 text-accent border-accent/20',
    High: 'bg-destructive/15 text-destructive border-destructive/20',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Moderation Queue</h1>
        <p className="text-text-muted text-sm mt-1">Review and handle user reports</p>
      </div>

      <div className="flex gap-2">
        {(['All', 'Pending', 'Resolved'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
              filterStatus === s
                ? 'bg-primary/15 text-primary-light border border-primary/20'
                : 'bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10'
            }`}
          >
            {s} {s !== 'All' && `(${reports.filter((r) => r.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {filtered.map((report) => {
            const isSelected = selectedReport?.id === report.id;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`w-full text-left glass-card-static p-4 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary/30 bg-primary/5'
                    : report.status === 'Resolved'
                    ? 'opacity-60'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        report.severity === 'High'
                          ? 'bg-destructive/15'
                          : 'bg-accent/15'
                      }`}
                    >
                      <Flag
                        size={18}
                        weight="fill"
                        className={
                          report.severity === 'High' ? 'text-destructive' : 'text-accent'
                        }
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{report.reason}</p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            severityColors[report.severity]
                          }`}
                        >
                          {report.severity}
                        </span>
                        {report.status === 'Resolved' && (
                          <span className="text-xs text-secondary">Resolved</span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        Report {report.id} &middot; Reported {report.reportedUser}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <UserCircle size={12} />
                          {report.reporter}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {report.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                  {report.severity === 'High' && report.status === 'Pending' && (
                    <span className="w-2 h-2 rounded-full bg-destructive animate-ping-slow flex-shrink-0 mt-2" />
                  )}
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              <Flag size={40} className="mx-auto mb-3 opacity-50" />
              <p>No reports found</p>
            </div>
          )}
        </div>

        <div>
          {selectedReport ? (
            <div className="glass-card-static p-6 lg:sticky lg:top-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Report Details</h2>
                <span className="text-xs text-text-muted font-mono">{selectedReport.id}</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <UserCircle size={24} className="text-text-muted" />
                  <div>
                    <p className="text-xs text-text-muted">Reported User</p>
                    <p className="font-medium">{selectedReport.reportedUser}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <UserCircle size={24} className="text-text-muted" />
                  <div>
                    <p className="text-xs text-text-muted">Reported By</p>
                    <p className="font-medium">{selectedReport.reporter}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-xs text-text-muted mb-1">Reason</p>
                  <p className="font-medium">{selectedReport.reason}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-xs text-text-muted mb-1">Details</p>
                  <p className="text-sm">{selectedReport.details}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Clock size={14} />
                  <span>Reported {selectedReport.timestamp}</span>
                </div>
              </div>

              {selectedReport.status === 'Pending' && (
                <>
                  <div className="border-t border-border my-6" />
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleAction(selectedReport.id, 'warn')}
                      className="btn-base px-4 py-2.5 text-sm bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25 flex-1 min-w-[100px]"
                    >
                      <Warning size={16} />
                      Warn
                    </button>
                    <button
                      onClick={() => handleAction(selectedReport.id, 'mute')}
                      className="btn-base px-4 py-2.5 text-sm bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25 flex-1 min-w-[100px]"
                    >
                      <SpeakerNone size={16} />
                      Mute
                    </button>
                    <button
                      onClick={() => handleAction(selectedReport.id, 'ban')}
                      className="btn-base px-4 py-2.5 text-sm btn-danger flex-1 min-w-[100px]"
                    >
                      <Prohibit size={16} />
                      Ban
                    </button>
                    <button
                      onClick={() => handleAction(selectedReport.id, 'dismiss')}
                      className="btn-base px-4 py-2.5 text-sm btn-ghost flex-1 min-w-[100px]"
                    >
                      <CheckCircle size={16} />
                      Dismiss
                    </button>
                  </div>
                </>
              )}

              {selectedReport.status === 'Resolved' && (
                <div className="mt-6 p-3 rounded-xl bg-secondary/10 text-secondary text-sm flex items-center gap-2">
                  <CheckCircle size={18} weight="fill" />
                  This report has been resolved
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card-static p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Flag size={48} className="text-text-muted opacity-30 mb-4" />
              <p className="text-text-muted">Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
