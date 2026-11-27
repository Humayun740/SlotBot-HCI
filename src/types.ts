export type DayOption = 'today' | 'tomorrow';

export interface TimeSlot {
  id: string;
  day: DayOption;
  startTime: string; // "14:00"
  endTime: string;   // "15:00"
  displayTime: string; // "2:00–3:00"
  displayFull: string; // "Today 2:00 PM – 3:00 PM"
  durationMinutes: number; // 60 or 30
  isPreBlocked: boolean;
  blockedReason?: string;
  bufferBeforeBusMinutes?: number;
}

export type AvailabilityStatus = 'free' | 'conditional' | 'busy' | 'unset';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  initials: string;
  isCommuter: boolean;
  hasReplied: boolean;
  transitCutoff?: string; // "15:30"
}

export interface RecommendedSlot {
  id: string;
  rank: number;
  badgeLabel: 'BEST' | 'ALTERNATIVE';
  day: DayOption;
  timeRange: string; // "Today 2:00–3:00 PM"
  freeCount: number;
  totalMembers: number;
  bufferNote: string; // "ends 30m before bus"
  slot: TimeSlot;
  tagline?: string;
}

export type ViewMode = 'group' | 'bilal_dm' | 'split';

export type FlowStage =
  | 'unrequested'        // Before @SlotBot is invoked
  | 'collecting'         // @SlotBot invoked, waiting for member replies
  | 'synthesizing'       // Loading state (synthesizing constraints)
  | 'recommended'        // 3 ranked cards shown
  | 'fallback_error'     // No viable slot found (error / edge state)
  | 'confirmed';         // Locked & pinned

export interface ChatMessage {
  id: string;
  chat: 'group' | 'bilal_dm';
  senderId: 'alex' | 'bilal' | 'priya' | 'carlos' | 'slotbot' | 'system';
  senderName: string;
  senderRole?: string;
  timestamp: string;
  text: string;
  isBot?: boolean;
  type?: 'text' | 'command' | 'status_pill' | 'recommendation_container' | 'fallback_container' | 'confirmation_pill';
  metadata?: any;
}

export type ScenarioPreset = 'happy_path' | 'no_viable_slots' | 'custom';

