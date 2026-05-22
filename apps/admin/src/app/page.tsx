'use client';

import { useState } from 'react';
import {
  Users,
  UserCircle,
  Heartbeat,
  CurrencyDollar,
  Flag,
  ArrowUp,
  ArrowDown,
  Plus,
  Eye,
  UserSwitch,
  Bell,
} from '@phosphor-icons/react';

const stats = [
  { label: 'Total Users', value: '12,847', change: '+12%', icon: Users, color: 'from-primary to-blue', up: true },
  { label: 'Online Now', value: '1,423', change: '+8%', icon: UserCircle, color: 'from-secondary to-emerald-400', up: true },
  { label: 'Active Matches', value: '847', change: '-3%', icon: Heartbeat, color: 'from-pink to-rose-400', up: false },
  { label: 'Revenue Today', value: '$3,842', change: '+22%', icon: CurrencyDollar, color: 'from-accent to-yellow-400', up: true },
  { label: 'Pending Reports', value: '23', change: '+5', icon: Flag, color: 'from-destructive to-red-400', up: false },
];

const recentUsers = [
  { id: '#12485', name: 'Alex Johnson', email: 'alex@example.com', status: 'Active', tier: 'Premium', joined: '2 min ago' },
  { id: '#12484', name: 'Sarah Williams', email: 'sarah@example.com', status: 'Active', tier: 'Free', joined: '5 min ago' },
  { id: '#12483', name: 'Mike Brown', email: 'mike@example.com', status: 'Inactive', tier: 'Premium', joined: '12 min ago' },
  { id: '#12482', name: 'Emma Davis', email: 'emma@example.com', status: 'Active', tier: 'VIP', joined: '18 min ago' },
  { id: '#12481', name: 'James Wilson', email: 'james@example.com', status: 'Banned', tier: 'Free', joined: '25 min ago' },
];

const revenueData = [
  { day: 'Mon', value: 1200 },
  { day: 'Tue', value: 1900 },
  { day: 'Wed', value: 1600 },
  { day: 'Thu', value: 2400 },
  { day: 'Fri', value: 2100 },
  { day: 'Sat', value: 2800 },
  { day: 'Sun', value: 2200 },
];

const quickActions = [
  { label: 'New Announcement', icon: Bell, color: 'from-primary to-purple-400' },
  { label: 'Add User', icon: Plus, color: 'from-secondary to-emerald-400' },
  { label: 'Review Reports', icon: Flag, color: 'from-destructive to-red-400' },
  { label: 'View Analytics', icon: Eye, color: 'from-blue to-cyan-400' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">Overview of your platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card-static p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} weight="fill" className="text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-secondary' : 'text-destructive'}`}>
                {stat.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-text-muted text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card-static p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue (This Week)</h2>
          <div className="flex items-end gap-3 h-48">
            {revenueData.map((item) => {
              const maxVal = Math.max(...revenueData.map((d) => d.value));
              const height = (item.value / maxVal) * 100;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs text-text-muted">${(item.value / 1000).toFixed(1)}k</span>
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-primary to-primary-light transition-all duration-500 hover:opacity-80 min-h-[4px]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-text-muted">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card-static p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-left"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                  <action.icon size={16} weight="fill" className="text-white" />
                </div>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card-static p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Users</h2>
          <button className="btn-base btn-ghost px-3 py-2 text-xs">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">ID</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Name</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden sm:table-cell">Email</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Status</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Tier</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium hidden lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-text-muted">{user.id}</td>
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
                  <td className="py-3 px-4 text-text-muted text-right hidden lg:table-cell">{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
