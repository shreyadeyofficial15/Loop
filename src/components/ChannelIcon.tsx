import React from 'react';
import {
  Headphones,
  MessageSquare,
  Smartphone,
  Award,
  ShieldCheck,
  Mail,
  ClipboardList,
  Hash,
  Twitter,
} from 'lucide-react';
import { FeedbackChannel } from '../types';

interface ChannelIconProps {
  channel: FeedbackChannel;
  className?: string;
  showLabel?: boolean;
}

export const CHANNEL_CONFIG: Record<
  FeedbackChannel,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  zendesk: {
    label: 'Zendesk',
    icon: Headphones,
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
  },
  intercom: {
    label: 'Intercom',
    icon: MessageSquare,
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
  },
  app_store: {
    label: 'App Store',
    icon: Smartphone,
    color: 'text-sky-700',
    bg: 'bg-sky-50 border-sky-200',
  },
  g2: {
    label: 'G2 Crowd',
    icon: Award,
    color: 'text-orange-700',
    bg: 'bg-orange-50 border-orange-200',
  },
  trustpilot: {
    label: 'Trustpilot',
    icon: ShieldCheck,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
  },
  email: {
    label: 'Inbound Email',
    icon: Mail,
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
  },
  in_app_survey: {
    label: 'In-App Survey',
    icon: ClipboardList,
    color: 'text-indigo-700',
    bg: 'bg-indigo-50 border-indigo-200',
  },
  slack: {
    label: 'Slack Connect',
    icon: Hash,
    color: 'text-pink-700',
    bg: 'bg-pink-50 border-pink-200',
  },
  twitter: {
    label: 'Twitter / X',
    icon: Twitter,
    color: 'text-cyan-700',
    bg: 'bg-cyan-50 border-cyan-200',
  },
};

export function ChannelIcon({ channel, className = 'w-4 h-4', showLabel = false }: ChannelIconProps) {
  const config = CHANNEL_CONFIG[channel] || CHANNEL_CONFIG.zendesk;
  const IconComponent = config.icon;

  if (showLabel) {
    return (
      <span
        id={`channel-badge-${channel}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.bg} ${config.color}`}
      >
        <IconComponent className={className} />
        <span>{config.label}</span>
      </span>
    );
  }

  return <IconComponent className={`${className} ${config.color}`} />;
}
