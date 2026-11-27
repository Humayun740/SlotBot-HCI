import { TimeSlot, DayOption, RecommendedSlot } from '../types';

/**
 * Converts "HH:MM" (24-hour) string to minutes from midnight
 */
export function timeStringToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Converts minutes from midnight to 12-hour formatted time (e.g., 900 -> "3:00 PM")
 */
export function minutesTo12Hour(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m < 10 ? `0${m}` : m;
  return `${displayH}:${displayM} ${period}`;
}

/**
 * Formats 24h string to clean 12h display (e.g., "14:00" -> "2:00 PM")
 */
export function format24To12(timeStr: string): string {
  return minutesTo12Hour(timeStringToMinutes(timeStr));
}

/**
 * Core Commuter Rule Check:
 * Slot is unviable if (Slot End Time + bufferMinutes > Bus Cutoff)
 */
export function evaluateSlotTransitViability(
  endTimeStr: string,
  busCutoffStr: string,
  bufferMinutes: number = 30
): {
  isViable: boolean;
  minutesRemainingBeforeBus: number;
  reason?: string;
} {
  const endMin = timeStringToMinutes(endTimeStr);
  const cutoffMin = timeStringToMinutes(busCutoffStr);
  
  const requiredFreeUntil = endMin + bufferMinutes;
  const minutesRemainingBeforeBus = cutoffMin - endMin;

  if (requiredFreeUntil > cutoffMin) {
    const formattedCutoff = format24To12(busCutoffStr);
    return {
      isViable: false,
      minutesRemainingBeforeBus,
      reason: `Blocked: ${formattedCutoff} transit cutoff`
    };
  }

  return {
    isViable: true,
    minutesRemainingBeforeBus
  };
}

/**
 * Default standard slots generator for the prototype
 */
export function generatePrototypeSlots(
  day: DayOption = 'today',
  durationMinutes: number = 60,
  busCutoffStr: string = '15:30',
  bufferMinutes: number = 30,
  overrideCutoff: boolean = false
): TimeSlot[] {
  if (day === 'today') {
    if (durationMinutes === 60) {
      // Screen 2 Wireframe: 2:00-3:00, 3:00-4:00, 4:00-5:00
      const blocks = [
        { start: '14:00', end: '15:00', label: '2:00–3:00' },
        { start: '15:00', end: '16:00', label: '3:00–4:00' },
        { start: '16:00', end: '17:00', label: '4:00–5:00' }
      ];

      return blocks.map(block => {
        const viability = evaluateSlotTransitViability(block.end, busCutoffStr, bufferMinutes);
        const isBlocked = overrideCutoff ? false : !viability.isViable;
        return {
          id: `today-${block.start.replace(':', '')}-${block.end.replace(':', '')}`,
          day: 'today',
          startTime: block.start,
          endTime: block.end,
          displayTime: block.label,
          displayFull: `Today ${format24To12(block.start)} – ${format24To12(block.end)}`,
          durationMinutes: 60,
          isPreBlocked: isBlocked,
          blockedReason: isBlocked ? viability.reason : undefined,
          bufferBeforeBusMinutes: viability.minutesRemainingBeforeBus
        };
      });
    } else {
      // 30-minute fallback blocks
      const blocks = [
        { start: '13:00', end: '13:30', label: '1:00–1:30' },
        { start: '13:15', end: '13:45', label: '1:15–1:45' },
        { start: '14:00', end: '14:30', label: '2:00–2:30' },
        { start: '14:30', end: '15:00', label: '2:30–3:00' },
        { start: '15:00', end: '15:30', label: '3:00–3:30' }
      ];

      return blocks.map(block => {
        const viability = evaluateSlotTransitViability(block.end, busCutoffStr, bufferMinutes);
        const isBlocked = overrideCutoff ? false : !viability.isViable;
        return {
          id: `today-30m-${block.start.replace(':', '')}-${block.end.replace(':', '')}`,
          day: 'today',
          startTime: block.start,
          endTime: block.end,
          displayTime: block.label,
          displayFull: `Today ${format24To12(block.start)} – ${format24To12(block.end)} (30 min)`,
          durationMinutes: 30,
          isPreBlocked: isBlocked,
          blockedReason: isBlocked ? viability.reason : undefined,
          bufferBeforeBusMinutes: viability.minutesRemainingBeforeBus
        };
      });
    }
  } else {
    // Tomorrow slots (Alternative recovery path)
    const cutoffMin = timeStringToMinutes(busCutoffStr);
    const blocks =
      cutoffMin < timeStringToMinutes('15:30')
        ? [
            { start: '10:00', end: '11:00', label: '10:00–11:00' },
            { start: '11:00', end: '12:00', label: '11:00–12:00' },
            { start: '12:30', end: '13:30', label: '12:30–1:30' }
          ]
        : [
            { start: '11:00', end: '12:00', label: '11:00–12:00' },
            { start: '13:00', end: '14:00', label: '1:00–2:00' },
            { start: '14:00', end: '15:00', label: '2:00–3:00' }
          ];

    return blocks.map(block => {
      const viability = evaluateSlotTransitViability(block.end, busCutoffStr, bufferMinutes);
      return {
        id: `tomorrow-${block.start.replace(':', '')}-${block.end.replace(':', '')}`,
        day: 'tomorrow',
        startTime: block.start,
        endTime: block.end,
        displayTime: block.label,
        displayFull: `Tomorrow ${format24To12(block.start)} – ${format24To12(block.end)}`,
        durationMinutes: 60,
        isPreBlocked: !viability.isViable,
        blockedReason: viability.reason,
        bufferBeforeBusMinutes: viability.minutesRemainingBeforeBus
      };
    });
  }
}

/**
 * Builds the 3 ranked recommendation cards matching Deliverable D4 Part B Screen 3:
 * Rank 1: BEST: Today 2:00–3:00 PM (4/4 free, ends 30m before bus)
 * Rank 2: Tomorrow 1:00–2:00 PM (4/4 free · Ends 90m before bus)
 * Rank 3: Tomorrow 2:00–3:00 PM (4/4 free · Ends 30m before bus)
 */
export function buildRecommendedCards(
  viableSlotsToday: TimeSlot[],
  viableSlotsTomorrow: TimeSlot[],
  durationMinutes: number = 60,
  day: DayOption = 'today'
): RecommendedSlot[] {
  const recommendations: RecommendedSlot[] = [];

  if (day === 'tomorrow') {
    // Tomorrow recommendations (e.g., from [Suggest Tomorrow] recovery action)
    const viableTomorrow = viableSlotsTomorrow.filter(s => !s.isPreBlocked);
    if (viableTomorrow.length > 0) {
      recommendations.push({
        id: 'rec-tmrw-1',
        rank: 1,
        badgeLabel: 'BEST',
        day: 'tomorrow',
        timeRange: `Tomorrow ${format24To12(viableTomorrow[0].startTime)} – ${format24To12(viableTomorrow[0].endTime)}`,
        freeCount: 4,
        totalMembers: 4,
        bufferNote: `ends ${viableTomorrow[0].bufferBeforeBusMinutes} min before bus`,
        slot: viableTomorrow[0],
        tagline: 'Recommended next-day morning window with optimal transit buffer'
      });

      if (viableTomorrow.length > 1) {
        recommendations.push({
          id: 'rec-tmrw-2',
          rank: 2,
          badgeLabel: 'ALTERNATIVE',
          day: 'tomorrow',
          timeRange: `Tomorrow ${format24To12(viableTomorrow[1].startTime)} – ${format24To12(viableTomorrow[1].endTime)}`,
          freeCount: 4,
          totalMembers: 4,
          bufferNote: `ends ${viableTomorrow[1].bufferBeforeBusMinutes} min before bus`,
          slot: viableTomorrow[1],
          tagline: 'Alternative afternoon block before transit departure'
        });
      }

      if (viableTomorrow.length > 2) {
        recommendations.push({
          id: 'rec-tmrw-3',
          rank: 3,
          badgeLabel: 'ALTERNATIVE',
          day: 'tomorrow',
          timeRange: `Tomorrow ${format24To12(viableTomorrow[2].startTime)} – ${format24To12(viableTomorrow[2].endTime)}`,
          freeCount: 4,
          totalMembers: 4,
          bufferNote: `ends ${viableTomorrow[2].bufferBeforeBusMinutes} min before bus`,
          slot: viableTomorrow[2],
          tagline: 'Final viable window meeting the 30-min buffer requirement'
        });
      }
    }
    return recommendations;
  }

  if (durationMinutes === 60) {
    // If today 2:00-3:00 is viable, it's Rank 1 BEST
    const primaryToday = viableSlotsToday.find(s => !s.isPreBlocked);
    if (primaryToday) {
      recommendations.push({
        id: 'rec-1',
        rank: 1,
        badgeLabel: 'BEST',
        day: 'today',
        timeRange: `Today ${format24To12(primaryToday.startTime)} – ${format24To12(primaryToday.endTime)}`,
        freeCount: 4,
        totalMembers: 4,
        bufferNote:
          primaryToday.bufferBeforeBusMinutes !== undefined && primaryToday.bufferBeforeBusMinutes > 0
            ? `ends ${primaryToday.bufferBeforeBusMinutes} min before bus`
            : 'Transit cutoff overridden for today',
        slot: primaryToday,
        tagline: 'Best mutual availability today with guaranteed transit safety'
      });

      // Rank 2: Tomorrow 1:00-2:00 PM
      recommendations.push({
        id: 'rec-2',
        rank: 2,
        badgeLabel: 'ALTERNATIVE',
        day: 'tomorrow',
        timeRange: 'Tomorrow 1:00–2:00 PM',
        freeCount: 4,
        totalMembers: 4,
        bufferNote: 'Ends 90m before bus',
        slot: {
          id: 'tomorrow-13-14',
          day: 'tomorrow',
          startTime: '13:00',
          endTime: '14:00',
          displayTime: '1:00–2:00',
          displayFull: 'Tomorrow 1:00 PM – 2:00 PM',
          durationMinutes: 60,
          isPreBlocked: false,
          bufferBeforeBusMinutes: 90
        },
        tagline: 'Team fully free with comfortable pre-departure window'
      });

      // Rank 3: Tomorrow 2:00-3:00 PM
      recommendations.push({
        id: 'rec-3',
        rank: 3,
        badgeLabel: 'ALTERNATIVE',
        day: 'tomorrow',
        timeRange: 'Tomorrow 2:00–3:00 PM',
        freeCount: 4,
        totalMembers: 4,
        bufferNote: 'Ends 30m before bus',
        slot: {
          id: 'tomorrow-14-15',
          day: 'tomorrow',
          startTime: '14:00',
          endTime: '15:00',
          displayTime: '2:00–3:00',
          displayFull: 'Tomorrow 2:00 PM – 3:00 PM',
          durationMinutes: 60,
          isPreBlocked: false,
          bufferBeforeBusMinutes: 30
        },
        tagline: 'Standard commuter-safe slot tomorrow'
      });
    }
  } else {
    // 30-minute recalculated recommendations
    const viable30m = viableSlotsToday.filter(s => !s.isPreBlocked);
    if (viable30m.length > 0) {
      recommendations.push({
        id: 'rec-30m-1',
        rank: 1,
        badgeLabel: 'BEST',
        day: 'today',
        timeRange: `Today ${format24To12(viable30m[0].startTime)} – ${format24To12(viable30m[0].endTime)} (30 min)`,
        freeCount: 4,
        totalMembers: 4,
        bufferNote: `ends ${viable30m[0].bufferBeforeBusMinutes}m before bus`,
        slot: viable30m[0],
        tagline: 'Shortened duration allows safe same-day meeting'
      });

      if (viable30m.length > 1) {
        recommendations.push({
          id: 'rec-30m-2',
          rank: 2,
          badgeLabel: 'ALTERNATIVE',
          day: 'today',
          timeRange: `Today ${format24To12(viable30m[1].startTime)} – ${format24To12(viable30m[1].endTime)} (30 min)`,
          freeCount: 4,
          totalMembers: 4,
          bufferNote: `ends ${viable30m[1].bufferBeforeBusMinutes}m before bus`,
          slot: viable30m[1],
          tagline: 'Alternative 30-min window before commuter cutoff'
        });
      }

      recommendations.push({
        id: 'rec-30m-3',
        rank: 3,
        badgeLabel: 'ALTERNATIVE',
        day: 'tomorrow',
        timeRange: 'Tomorrow 1:00–1:30 PM (30 min)',
        freeCount: 4,
        totalMembers: 4,
        bufferNote: 'Ends 120m before bus',
        slot: {
          id: 'tomorrow-30m-13-1330',
          day: 'tomorrow',
          startTime: '13:00',
          endTime: '13:30',
          displayTime: '1:00–1:30',
          displayFull: 'Tomorrow 1:00 PM – 1:30 PM (30 min)',
          durationMinutes: 30,
          isPreBlocked: false,
          bufferBeforeBusMinutes: 120
        },
        tagline: 'Next-day option with generous margin'
      });
    }
  }

  return recommendations;
}
