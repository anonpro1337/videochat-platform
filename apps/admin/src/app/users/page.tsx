'use client';

import { useState } from 'react';
import {
  MagnifyingGlass,
  Prohibit,
  CheckCircle,
  UserSwitch,
  DotsThreeVertical,
  CaretDown,
} from '@phosphor-icons/react';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Banned';
  tier: 'Free' | 'Premium' | 'VIP';
  joined: string;
  reports: number;
}

const initialUsers: User[] = [
  { id: '#12485', name: 'Alex Johnson', email: 'alex@example.com', status: 'Active', tier: 'Premium', joined: '2026-05-23', reports: 0 },
  { id: '#12484', name: 'Sarah Williams', email: 'sarah@example.com', status: 'Active', tier: 'Free', joined: '2026-05-23', reports: 1 },
  { id: '#12483', name: 'Mike Brown', email: 'mike@example.com', status: 'Inactive', tier: 'Premium', joined: '2026-05-22', reports: 3 },
  { id: '#12482', name: 'Emma Davis', email: 'emma@example.com', status: 'Active', tier: 'VIP', joined: '2026-05-22', reports: 0 },
  { id: '#12481', name: 'James Wilson', email: 'james@example.com', status: 'Banned', tier: 'Free', joined: '2026-05-21', reports: 7 },
  { id: '#12480', name: 'Olivia Martinez', email: 'olivia@example.com', status: 'Active', tier: 'Premium', joined: '2026-05-21', reports: 2 },
  { id: '#12479', name: 'Liam Anderson', email: 'liam@example.com', status: 'Inactive', tier: 'Free', joined: '2026-05-20', reports: 0 },
  { id: '#12478', name: 'Sophia Taylor', email: 'sophia@example.com', status: 'Active', tier: 'VIP', joined: '2026-05-20', reports: 0 },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState<string>('All');

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search);
    const matchesTier = filterTier === 'All' || u.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const toggleBan = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        return {
          ...u,
          status: u.status === 'Banned' ? 'Active' : 'Banned' as const,
        };
      })
    );
  };

  const tiers = ['All', 'Free', 'Premium', 'VIP'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-text-muted text-sm mt-1">Manage platform users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <MagnifyingGlass
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search users by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glass w-full pl-10 pr-4 py-2.5 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => setFilterTier(t)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                filterTier === t
                  ? 'bg-primary/15 text-primary-light border border-primary/20'
                  : 'bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">ID</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Name</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden sm:table-cell">Email</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Status</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Tier</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden lg:table-cell">Reports</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden lg:table-cell">Joined</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-text-muted font-mono text-xs">{user.id}</td>
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-text-muted hidden sm:table-cell">{user.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Active'
                          ? 'bg-secondary/15 text-secondary'
                          : user.status === 'Banned'
                          ? 'bg-destructive/15 text-destructive'
                          : 'bg-white/5 text-text-muted'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'Active'
                            ? 'bg-secondary'
                            : user.status === 'Banned'
                            ? 'bg-destructive'
                            : 'bg-text-muted'
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.tier === 'VIP'
                          ? 'bg-accent/15 text-accent'
                          : user.tier === 'Premium'
                          ? 'bg-primary/15 text-primary-light'
                          : 'bg-white/5 text-text-muted'
                      }`}
                    >
                      {user.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-muted hidden lg:table-cell">
                    <span className={user.reports > 0 ? 'text-destructive' : ''}>{user.reports}</span>
                  </td>
                  <td className="py-3 px-4 text-text-muted hidden lg:table-cell">{user.joined}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleBan(user.id)}
                        className={`btn-base px-3 py-1.5 text-xs ${
                          user.status === 'Banned'
                            ? 'btn-success'
                            : 'btn-danger'
                        }`}
                      >
                        {user.status === 'Banned' ? (
                          <><CheckCircle size={14} /> Unban</>
                        ) : (
                          <><Prohibit size={14} /> Ban</>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <Users size={40} className="mx-auto mb-3 opacity-50" />
            <p>No users found matching your search</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>Showing {filtered.length} of {users.length} users</span>
      </div>
    </div>
  );
}
