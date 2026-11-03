import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  ViewMode,
  FlowStage,
  DayOption,
  TimeSlot,
  RecommendedSlot,
  ChatMessage,
  ScenarioPreset,
  TeamMember,
  AvailabilityStatus
} from '../types';
import {
  generatePrototypeSlots,
  buildRecommendedCards,
  format24To12
} from '../utils/transitLogic';

interface SchedulerContextType {
  // Navigation & View
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  flowStage: FlowStage;
  setFlowStage: (stage: FlowStage) => void;

  // Transit & Commuter Parameters
  busCutoff: string;
  setBusCutoff: (cutoff: string) => void;
  transitBufferMinutes: number;
  setTransitBufferMinutes: (min: number) => void;
  meetingDuration: number;
  setMeetingDuration: (duration: number) => void;
  meetingDay: DayOption;
  setMeetingDay: (day: DayOption) => void;

  // Slots & Availability State
  slotsToday: TimeSlot[];
  slotsTomorrow: TimeSlot[];
  activeSlots: TimeSlot[];
  bilalSelections: Record<string, AvailabilityStatus>;
  setSlotSelection: (slotId: string, status: AvailabilityStatus) => void;

  // Team & Status
  teamMembers: TeamMember[];
  repliedCount: number;

  // Recommendations & Feedback
  recommendations: RecommendedSlot[];
  confirmedSlot: RecommendedSlot | null;
  pinnedBanner: string | null;

  // Error & Fallback
  isErrorState: boolean;
  recoveryNote: string | null;

  // Synthesis loading
  isSynthesizing: boolean;

  // Scenarios & Evaluator Tools
  scenarioPreset: ScenarioPreset;
  loadScenario: (preset: ScenarioPreset) => void;
  resetAll: () => void;
  showEvaluatorGuide: boolean;
  setShowEvaluatorGuide: (show: boolean) => void;
  showGestaltOverlay: boolean;
  setShowGestaltOverlay: (show: boolean) => void;

  // Action Triggers
  invokeSlotBot: (customText?: string) => void;
  submitBilalAvailability: () => void;
  confirmSlot: (slot: RecommendedSlot) => void;
  executeRecovery: (action: 'suggest_tomorrow' | 'shorten_30m') => void;

  // Chat message logs
  groupMessages: ChatMessage[];
  bilalDmMessages: ChatMessage[];
  sendCustomGroupMessage: (text: string) => void;
}

const SchedulerContext = createContext<SchedulerContextType | undefined>(undefined);

export const SchedulerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('group');
  const [flowStage, setFlowStage] = useState<FlowStage>('collecting');

  // Commuter parameters
  const [busCutoff, setBusCutoff] = useState<string>('15:30'); // Default 3:30 PM
  const [transitBufferMinutes, setTransitBufferMinutes] = useState<number>(30); // 30 min buffer
  const [meetingDuration, setMeetingDuration] = useState<number>(60); // 60 min default
  const [meetingDay, setMeetingDay] = useState<DayOption>('today');

  // Bilal's selections: 2:00-3:00 default 'free'
  const [bilalSelections, setBilalSelections] = useState<Record<string, AvailabilityStatus>>({
    'today-1400-1500': 'free'
  });

  // Flow & State
  const [scenarioPreset, setScenarioPreset] = useState<ScenarioPreset>('happy_path');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [confirmedSlot, setConfirmedSlot] = useState<RecommendedSlot | null>(null);
  const [pinnedBanner, setPinnedBanner] = useState<string | null>(null);
  const [recoveryNote, setRecoveryNote] = useState<string | null>(null);

  // Evaluator helpers
  const [showEvaluatorGuide, setShowEvaluatorGuide] = useState<boolean>(false);
  const [showGestaltOverlay, setShowGestaltOverlay] = useState<boolean>(false);

  // Team definition
  const teamMembers: TeamMember[] = [
    { id: 'bilal', name: 'Bilal (You)', role: 'Commuter Student (Bus: 3:30 PM)', avatarColor: 'bg-emerald-600', initials: 'B', isCommuter: true, hasReplied: flowStage !== 'collecting' && flowStage !== 'unrequested', transitCutoff: busCutoff },
    { id: 'alex', name: 'Alex', role: 'Group Lead', avatarColor: 'bg-indigo-600', initials: 'A', isCommuter: false, hasReplied: true },
    { id: 'priya', name: 'Priya', role: 'Teammate', avatarColor: 'bg-amber-600', initials: 'P', isCommuter: false, hasReplied: true },
    { id: 'carlos', name: 'Carlos', role: 'Teammate', avatarColor: 'bg-purple-600', initials: 'C', isCommuter: false, hasReplied: true },
  ];

  // Calculate slots dynamically based on current busCutoff and buffer
  const slotsToday = useMemo(() => {
    return generatePrototypeSlots('today', meetingDuration, busCutoff, transitBufferMinutes);
  }, [meetingDuration, busCutoff, transitBufferMinutes]);

  const slotsTomorrow = useMemo(() => {
    return generatePrototypeSlots('tomorrow', meetingDuration, busCutoff, transitBufferMinutes);
  }, [meetingDuration, busCutoff, transitBufferMinutes]);

  const activeSlots = meetingDay === 'today' ? slotsToday : slotsTomorrow;

  // Determine if all slots today are blocked or if scenario forces no viable slots
  const hasViableTodaySlot = useMemo(() => {
    if (scenarioPreset === 'no_viable_slots') return false;
    return slotsToday.some(s => !s.isPreBlocked);
  }, [slotsToday, scenarioPreset]);

  // Recommendations calculation
  const recommendations = useMemo(() => {
    if (!hasViableTodaySlot && meetingDay === 'today' && meetingDuration === 60) {
      return [];
    }
    return buildRecommendedCards(slotsToday, slotsTomorrow, meetingDuration, meetingDay);
  }, [slotsToday, slotsTomorrow, meetingDuration, hasViableTodaySlot, meetingDay]);

  const isErrorState = flowStage === 'fallback_error' || (flowStage === 'recommended' && recommendations.length === 0);

  // Group Messages
  const [groupMessages, setGroupMessages] = useState<ChatMessage[]>([
    {
      id: 'g-1',
      chat: 'group',
      senderId: 'alex',
      senderName: 'Alex',
      timestamp: '12:40 PM',
      text: 'Can we find an hour to meet today?'
    },
    {
      id: 'g-2',
      chat: 'group',
      senderId: 'bilal',
      senderName: 'You',
      timestamp: '12:41 PM',
      text: '@SlotBot meeting today, 1 hour'
    },
    {
      id: 'g-3',
      chat: 'group',
      senderId: 'slotbot',
      senderName: 'SlotBot',
      isBot: true,
      timestamp: '12:41 PM',
      text: "I sent private messages to all members to check availability. I'll share ranked options here once everyone replies."
    }
  ]);

  // Private DM messages with Bilal
  const [bilalDmMessages, setBilalDmMessages] = useState<ChatMessage[]>([
    {
      id: 'dm-1',
      chat: 'bilal_dm',
      senderId: 'slotbot',
      senderName: 'SlotBot',
      isBot: true,
      timestamp: '12:41 PM',
      text: 'Alex requested a 1-hour project meeting. Please indicate your availability below. Your commuter transit cutoff (3:30 PM) will be automatically protected.'
    }
  ]);

  // Replied count: 3 of 4 if waiting for Bilal, 4 of 4 if Bilal submitted
  const repliedCount = flowStage === 'collecting' || flowStage === 'unrequested' ? 3 : 4;

  // Handle slot selection toggle for Bilal
  const setSlotSelection = (slotId: string, status: AvailabilityStatus) => {
    setBilalSelections(prev => ({
      ...prev,
      [slotId]: status
    }));
  };

  // Trigger @SlotBot invocation in group chat
  const invokeSlotBot = (customText?: string) => {
    const promptText = customText || '@SlotBot meeting today, 1 hour';
    const now = '12:41 PM';

    setFlowStage('collecting');
    setConfirmedSlot(null);
    setPinnedBanner(null);

    setGroupMessages([
      {
        id: 'g-1',
        chat: 'group',
        senderId: 'alex',
        senderName: 'Alex',
        timestamp: '12:40 PM',
        text: 'Can we find an hour to meet today?'
      },
      {
        id: `g-${Date.now()}-you`,
        chat: 'group',
        senderId: 'bilal',
        senderName: 'You',
        timestamp: now,
        text: promptText
      },
      {
        id: `g-${Date.now()}-bot`,
        chat: 'group',
        senderId: 'slotbot',
        senderName: 'SlotBot',
        isBot: true,
        timestamp: now,
        text: "I sent private messages to all members to check availability. I'll share ranked options here once everyone replies."
      }
    ]);
  };

  // Submit Bilal's availability from DM
  const submitBilalAvailability = () => {
    // 8-State UI requirement: Loading state
    setIsSynthesizing(true);
    setFlowStage('synthesizing');

    setTimeout(() => {
      setIsSynthesizing(false);

      if (!hasViableTodaySlot || scenarioPreset === 'no_viable_slots') {
        // Fallback error state
        setFlowStage('fallback_error');
        // Add SlotBot error message to group
        setGroupMessages(prev => [
          ...prev,
          {
            id: `g-${Date.now()}-err`,
            chat: 'group',
            senderId: 'slotbot',
            senderName: 'SlotBot',
            isBot: true,
            timestamp: '12:45 PM',
            text: 'SCHEDULING ISSUE: No slots found with a 30-min buffer.',
            type: 'fallback_container'
          }
        ]);
      } else {
        // Happy path recommendations
        setFlowStage('recommended');
        setGroupMessages(prev => [
          ...prev,
          {
            id: `g-${Date.now()}-rec`,
            chat: 'group',
            senderId: 'slotbot',
            senderName: 'SlotBot',
            isBot: true,
            timestamp: '12:45 PM',
            text: 'Everyone has replied. Ranked for all 4 members, with a 30-min transit buffer.',
            type: 'recommendation_container'
          }
        ]);
      }

      // Automatically focus or prompt user to view group recommendations if not in split view
      if (viewMode === 'bilal_dm') {
        setViewMode('group');
      }
    }, 1200);
  };

  // Confirm slot
  const confirmSlot = (slot: RecommendedSlot) => {
    setConfirmedSlot(slot);
    setFlowStage('confirmed');
    const banner = `📌 Project meeting confirmed for ${slot.timeRange} in Seminar Room 4B`;
    setPinnedBanner(banner);

    // Add confirmation message to group chat
    setGroupMessages(prev => [
      ...prev,
      {
        id: `g-${Date.now()}-conf`,
        chat: 'group',
        senderId: 'slotbot',
        senderName: 'SlotBot',
        isBot: true,
        timestamp: '12:46 PM',
        text: `✅ Meeting locked! ${slot.timeRange} has been scheduled on everyone's calendar. Bilal leaves 30m safe buffer before the ${format24To12(busCutoff)} university bus.`
      }
    ]);
  };

  // Recovery actions for Error / Fallback state
  const executeRecovery = (action: 'suggest_tomorrow' | 'shorten_30m') => {
    if (action === 'suggest_tomorrow') {
      setMeetingDay('tomorrow');
      setMeetingDuration(60);
      setFlowStage('recommended');
      setRecoveryNote('Switched to tomorrow slots. Commuter transit cutoff preserved.');
      setGroupMessages(prev => [
        ...prev,
        {
          id: `g-${Date.now()}-recov1`,
          chat: 'group',
          senderId: 'bilal',
          senderName: 'You',
          timestamp: '12:46 PM',
          text: 'Selected recovery option: Suggest Tomorrow'
        },
        {
          id: `g-${Date.now()}-recov1-bot`,
          chat: 'group',
          senderId: 'slotbot',
          senderName: 'SlotBot',
          isBot: true,
          timestamp: '12:46 PM',
          text: 'Here are the ranked 1-hour slots for tomorrow, respecting all transit buffers:',
          type: 'recommendation_container'
        }
      ]);
    } else if (action === 'shorten_30m') {
      setMeetingDuration(30);
      setMeetingDay('today');
      setFlowStage('recommended');
      setRecoveryNote('Recalculated for 30-minute meeting duration.');
      setGroupMessages(prev => [
        ...prev,
        {
          id: `g-${Date.now()}-recov2`,
          chat: 'group',
          senderId: 'bilal',
          senderName: 'You',
          timestamp: '12:46 PM',
          text: 'Selected recovery option: Shorten to 30 min'
        },
        {
          id: `g-${Date.now()}-recov2-bot`,
          chat: 'group',
          senderId: 'slotbot',
          senderName: 'SlotBot',
          isBot: true,
          timestamp: '12:46 PM',
          text: 'Recalculated viable windows for a 30-minute duration. A safe 30-min buffer is maintained before the bus cutoff:',
          type: 'recommendation_container'
        }
      ]);
    }
  };

  // Scenario presets
  const loadScenario = (preset: ScenarioPreset) => {
    setScenarioPreset(preset);
    setConfirmedSlot(null);
    setPinnedBanner(null);
    setRecoveryNote(null);

    if (preset === 'happy_path') {
      setBusCutoff('15:30');
      setTransitBufferMinutes(30);
      setMeetingDuration(60);
      setMeetingDay('today');
      setBilalSelections({ 'today-1400-1500': 'free' });
      setFlowStage('collecting');
      setGroupMessages([
        {
          id: 'g-1',
          chat: 'group',
          senderId: 'alex',
          senderName: 'Alex',
          timestamp: '12:40 PM',
          text: 'Can we find an hour to meet today?'
        },
        {
          id: 'g-2',
          chat: 'group',
          senderId: 'bilal',
          senderName: 'You',
          timestamp: '12:41 PM',
          text: '@SlotBot meeting today, 1 hour'
        },
        {
          id: 'g-3',
          chat: 'group',
          senderId: 'slotbot',
          senderName: 'SlotBot',
          isBot: true,
          timestamp: '12:41 PM',
          text: "I sent private messages to all members to check availability. I'll share ranked options here once everyone replies."
        }
      ]);
    } else if (preset === 'no_viable_slots') {
      // Commuter cutoff at 2:15 PM (14:15) or team schedule collision
      setBusCutoff('14:15'); // 2:15 PM -> All 2:00-3:00, 3:00-4:00, 4:00-5:00 slots violate buffer!
      setTransitBufferMinutes(30);
      setMeetingDuration(60);
      setMeetingDay('today');
      setBilalSelections({});
      setFlowStage('collecting');
      setGroupMessages([
        {
          id: 'g-1',
          chat: 'group',
          senderId: 'alex',
          senderName: 'Alex',
          timestamp: '12:40 PM',
          text: 'Can we find an hour to meet today?'
        },
        {
          id: 'g-2',
          chat: 'group',
          senderId: 'bilal',
          senderName: 'You',
          timestamp: '12:41 PM',
          text: '@SlotBot meeting today, 1 hour'
        },
        {
          id: 'g-3',
          chat: 'group',
          senderId: 'slotbot',
          senderName: 'SlotBot',
          isBot: true,
          timestamp: '12:41 PM',
          text: "I sent private messages to all members to check availability. I'll share ranked options here once everyone replies."
        }
      ]);
    }
  };

  const resetAll = () => {
    loadScenario('happy_path');
  };

  const sendCustomGroupMessage = (text: string) => {
    if (!text.trim()) return;
    const now = '12:43 PM';

    if (text.toLowerCase().includes('@slotbot')) {
      invokeSlotBot(text);
      return;
    }

    setGroupMessages(prev => [
      ...prev,
      {
        id: `g-${Date.now()}`,
        chat: 'group',
        senderId: 'bilal',
        senderName: 'You',
        timestamp: now,
        text
      }
    ]);
  };

  return (
    <SchedulerContext.Provider
      value={{
        viewMode,
        setViewMode,
        flowStage,
        setFlowStage,
        busCutoff,
        setBusCutoff,
        transitBufferMinutes,
        setTransitBufferMinutes,
        meetingDuration,
        setMeetingDuration,
        meetingDay,
        setMeetingDay,
        slotsToday,
        slotsTomorrow,
        activeSlots,
        bilalSelections,
        setSlotSelection,
        teamMembers,
        repliedCount,
        recommendations,
        confirmedSlot,
        pinnedBanner,
        isErrorState,
        recoveryNote,
        isSynthesizing,
        scenarioPreset,
        loadScenario,
        resetAll,
        showEvaluatorGuide,
        setShowEvaluatorGuide,
        showGestaltOverlay,
        setShowGestaltOverlay,
        invokeSlotBot,
        submitBilalAvailability,
        confirmSlot,
        executeRecovery,
        groupMessages,
        bilalDmMessages,
        sendCustomGroupMessage
      }}
    >
      {children}
    </SchedulerContext.Provider>
  );
};

export const useScheduler = () => {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error('useScheduler must be used within a SchedulerProvider');
  }
  return context;
};
