'use client';

import { useState } from 'react';
import {
  Gear,
  Bell,
  Lock,
  Palette,
  Globe,
  Database,
  Shield,
  Envelope,
  Image,
  ToggleLeft,
} from '@phosphor-icons/react';

interface SettingSection {
  id: string;
  label: string;
  icon: typeof Gear;
  items: { label: string; description: string; type: 'toggle' | 'input' | 'select'; value: string | boolean }[];
}

const settingsSections: SettingSection[] = [
  {
    id: 'general',
    label: 'General',
    icon: Gear,
    items: [
      { label: 'Site Name', description: 'The name of your platform', type: 'input', value: 'ChatVibe' },
      { label: 'Site Description', description: 'Brief description for SEO', type: 'input', value: 'Connect with people worldwide through random video chat.' },
      { label: 'Maintenance Mode', description: 'Disable access for non-admin users', type: 'toggle', value: false },
    ],
  },
  {
    id: 'moderation',
    label: 'Moderation',
    icon: Shield,
    items: [
      { label: 'Auto-Moderation', description: 'AI-powered content filtering', type: 'toggle', value: true },
      { label: 'Max Reports Before Ban', description: 'Auto-ban users after X reports', type: 'input', value: '5' },
      { label: 'Profanity Filter', description: 'Block profane language in chats', type: 'toggle', value: true },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    items: [
      { label: 'Email Alerts', description: 'Receive email for new reports', type: 'toggle', value: true },
      { label: 'Push Notifications', description: 'Browser push for critical alerts', type: 'toggle', value: false },
      { label: 'Report Digest', description: 'Daily summary of moderation activity', type: 'toggle', value: true },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    icon: Lock,
    items: [
      { label: 'Two-Factor Auth', description: 'Require 2FA for admin accounts', type: 'toggle', value: true },
      { label: 'Session Timeout', description: 'Auto-logout after inactivity', type: 'select', value: '30 minutes' },
      { label: 'IP Whitelist', description: 'Restrict admin access to IPs', type: 'toggle', value: false },
    ],
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState(settingsSections);
  const [saved, setSaved] = useState(false);

  const activeSectionData = settings.find((s) => s.id === activeSection);

  const handleToggle = (sectionId: string, itemIndex: number) => {
    setSettings((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        const newItems = [...section.items];
        const item = { ...newItems[itemIndex] };
        item.value = !item.value;
        newItems[itemIndex] = item;
        return { ...section, items: newItems };
      })
    );
  };

  const handleInputChange = (sectionId: string, itemIndex: number, value: string) => {
    setSettings((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        const newItems = [...section.items];
        const item = { ...newItems[itemIndex] };
        item.value = value;
        newItems[itemIndex] = item;
        return { ...section, items: newItems };
      })
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-text-muted text-sm mt-1">Manage platform configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-48 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {settings.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-primary/15 text-primary-light border border-primary/20'
                    : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                }`}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 glass-card-static p-6">
          {activeSectionData && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                  <activeSectionData.icon size={18} className="text-primary-light" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{activeSectionData.label}</h2>
                </div>
              </div>

              <div className="space-y-6">
                {activeSectionData.items.map((item, index) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                    </div>

                    {item.type === 'toggle' && (
                      <button
                        onClick={() => handleToggle(activeSectionData.id, index)}
                        className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
                          item.value ? 'bg-primary' : 'bg-white/10'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                            item.value ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    )}

                    {item.type === 'input' && (
                      <input
                        type="text"
                        value={item.value as string}
                        onChange={(e) => handleInputChange(activeSectionData.id, index, e.target.value)}
                        className="input-glass px-3 py-1.5 text-sm w-40 text-right flex-shrink-0"
                      />
                    )}

                    {item.type === 'select' && (
                      <select
                        value={item.value as string}
                        onChange={(e) => handleInputChange(activeSectionData.id, index, e.target.value)}
                        className="input-glass px-3 py-1.5 text-sm w-36 flex-shrink-0 bg-bg-card cursor-pointer"
                      >
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>4 hours</option>
                        <option>Never</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
                <button onClick={handleSave} className="btn-base btn-primary px-6 py-2.5 text-sm">
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
                <button className="btn-base btn-ghost px-6 py-2.5 text-sm">
                  Reset
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
