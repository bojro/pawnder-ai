import React, { useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
  GestureResponderEvent,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AVAILABILITY_DAYS, AVAILABILITY_HOURS } from '../../utils/shelterConstants';
import { colors, typography, spacing, radii } from '../../utils/theme';

interface AvailabilityGridProps {
  /** The grid state (shelter editing / readOnly display). Keyed "day-hour". */
  grid: Record<string, boolean>;
  /** Called when the grid is changed (shelter editing mode). */
  onChange: (grid: Record<string, boolean>) => void;
  /** If true, no interaction at all (review screen). */
  readOnly?: boolean;

  // ── Picker mode (adopter visit scheduling) ──
  /** When provided, the grid enters "picker" mode. Keys present & true = pet is available. */
  availableSlots?: Record<string, boolean>;
  /** The currently selected cell key in picker mode. */
  selectedCell?: string | null;
  /** Called when an available cell is tapped in picker mode. */
  onSelectCell?: (key: string) => void;
}

/** Format hour number to display label, e.g. 9 → "9 AM", 13 → "1 PM" */
export function formatHour(hour: number): string {
  if (hour === 12) return 'Noon';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

/** Build the grid key from day and hour */
export function cellKey(day: string, hour: number): string {
  return `${day.toLowerCase()}-${hour}`;
}

/** Parse a cell key back into day abbreviation and hour number */
export function parseCellKey(key: string): { day: string; hour: number } | null {
  const match = key.match(/^([a-z]+)-(\d+)$/);
  if (!match) return null;
  return { day: match[1], hour: parseInt(match[2], 10) };
}

const NUM_COLS = AVAILABILITY_DAYS.length;
const NUM_ROWS = AVAILABILITY_HOURS.length;

export default function AvailabilityGrid({
  grid,
  onChange,
  readOnly = false,
  availableSlots,
  selectedCell,
  onSelectCell,
}: AvailabilityGridProps) {
  // Defensive: ensure grid is never undefined (drafts created before this field existed)
  const safeGrid = grid ?? {};

  const isPickerMode = !!availableSlots;

  // Track grid bounds for hit-testing in absolute page coordinates
  const gridLayout = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const gridViewRef = useRef<View | null>(null);
  // Track which cells were toggled during the current gesture to avoid double-toggling
  const toggledCells = useRef<Set<string>>(new Set());
  // Track the "paint mode": true = painting ON, false = painting OFF
  const paintMode = useRef<boolean>(true);

  // Use refs for the latest grid/onChange so PanResponder always reads current values
  const gridRef = useRef(safeGrid);
  gridRef.current = safeGrid;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const onGridLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    gridViewRef.current?.measureInWindow((x: number, y: number, measuredWidth: number, measuredHeight: number) => {
      gridLayout.current = {
        x,
        y,
        width: measuredWidth || width,
        height: measuredHeight || height,
      };
    });
  }, []);

  /** Given absolute page coordinates, return the cell key */
  const getCellFromPosition = useCallback(
    (pageX: number, pageY: number): string | null => {
      const { x, y, width, height } = gridLayout.current;
      if (width === 0 || height === 0) return null;
      const relX = pageX - x;
      const relY = pageY - y;
      if (relX < 0 || relY < 0 || relX > width || relY > height) return null;

      const colIndex = Math.floor((relX / width) * NUM_COLS);
      const rowIndex = Math.floor((relY / height) * NUM_ROWS);

      if (colIndex < 0 || colIndex >= NUM_COLS || rowIndex < 0 || rowIndex >= NUM_ROWS) return null;

      const day = AVAILABILITY_DAYS[colIndex];
      const hour = AVAILABILITY_HOURS[rowIndex];
      return cellKey(day, hour);
    },
    [],
  );

  const handleTouch = useCallback(
    (pageX: number, pageY: number, isStart: boolean) => {
      const key = getCellFromPosition(pageX, pageY);
      if (!key) return;

      const currentGrid = gridRef.current;

      if (isStart) {
        paintMode.current = !currentGrid[key];
        toggledCells.current.clear();
      }

      if (toggledCells.current.has(key)) return;
      toggledCells.current.add(key);

      const newGrid = { ...currentGrid, [key]: paintMode.current };
      onChangeRef.current(newGrid);
    },
    [getCellFromPosition],
  );

  // PanResponder only used for shelter editing mode (not picker or readOnly)
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // Capture phase — claim the gesture BEFORE the parent ScrollView
        onStartShouldSetPanResponderCapture: () => !readOnly && !isPickerMode,
        onMoveShouldSetPanResponderCapture: () => !readOnly && !isPickerMode,
        onStartShouldSetPanResponder: () => !readOnly && !isPickerMode,
        onMoveShouldSetPanResponder: () => !readOnly && !isPickerMode,
        // Prevent the ScrollView from stealing our gesture
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          // Refresh absolute bounds right before processing gesture start
          gridViewRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
            gridLayout.current = { x, y, width, height };
            handleTouch(evt.nativeEvent.pageX, evt.nativeEvent.pageY, true);
          });
        },
        onPanResponderMove: (evt: GestureResponderEvent) => {
          handleTouch(evt.nativeEvent.pageX, evt.nativeEvent.pageY, false);
        },
        onPanResponderRelease: () => {
          toggledCells.current.clear();
        },
      }),
    [readOnly, isPickerMode, handleTouch],
  );

  /** Determine cell style based on mode */
  const getCellStyle = (key: string) => {
    if (isPickerMode) {
      const isAvailable = !!availableSlots![key];
      const isSelected = selectedCell === key;

      if (isSelected) return styles.cellSelected;
      if (isAvailable) return styles.cellAvailable;
      return styles.cellDisabled;
    }
    // Normal editing / readOnly mode
    return safeGrid[key] ? styles.cellActive : styles.cellInactive;
  };

  const handlePickerCellPress = (key: string) => {
    if (!isPickerMode || !onSelectCell) return;
    if (!availableSlots![key]) return; // Can't select unavailable cell
    onSelectCell(key);
  };

  const instructionText = isPickerMode
    ? 'Tap a green slot to pick your visit time'
    : 'Tap and drag to toggle availability';

  return (
    <View style={styles.container}>
      {!readOnly && (
        <Text style={styles.instruction}>{instructionText}</Text>
      )}

      {/* Day headers */}
      <View style={styles.headerRow}>
        <View style={styles.hourLabelSpacer} />
        {AVAILABILITY_DAYS.map((day) => (
          <View key={day} style={styles.dayHeader}>
            <Text style={styles.dayHeaderText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Grid body */}
      <View style={styles.gridBody}>
        {/* Hour labels column */}
        <View style={styles.hourLabelsCol}>
          {AVAILABILITY_HOURS.map((hour) => (
            <View key={hour} style={styles.hourLabelCell}>
              <Text style={styles.hourLabelText}>{formatHour(hour)}</Text>
            </View>
          ))}
        </View>

        {/* The interactive grid */}
        <View
          ref={gridViewRef}
          style={styles.grid}
          onLayout={onGridLayout}
          {...(!isPickerMode && !readOnly ? panResponder.panHandlers : {})}
        >
          {AVAILABILITY_HOURS.map((hour) => (
            <View key={hour} style={styles.row}>
              {AVAILABILITY_DAYS.map((day) => {
                const key = cellKey(day, hour);
                const cellStyle = getCellStyle(key);
                const isSelected = isPickerMode && selectedCell === key;

                if (isPickerMode) {
                  const isAvailable = !!availableSlots![key];
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.cell, cellStyle]}
                      activeOpacity={isAvailable ? 0.6 : 1}
                      onPress={() => handlePickerCellPress(key)}
                      disabled={!isAvailable}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={18} color={colors.white} />
                      )}
                    </TouchableOpacity>
                  );
                }

                return (
                  <View
                    key={key}
                    style={[styles.cell, cellStyle]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const CELL_HEIGHT = 40;

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
  },
  instruction: {
    ...typography.bodySm,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  hourLabelSpacer: {
    width: 52,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dayHeaderText: {
    ...typography.labelMd,
    color: colors.charcoal,
    fontSize: 14,
  },
  gridBody: {
    flexDirection: 'row',
  },
  hourLabelsCol: {
    width: 52,
  },
  hourLabelCell: {
    height: CELL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: spacing.sm,
  },
  hourLabelText: {
    ...typography.bodySm,
    color: colors.gray600,
    fontSize: 11,
  },
  grid: {
    flex: 1,
    borderRadius: radii.xs,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  row: {
    flexDirection: 'row',
    height: CELL_HEIGHT,
  },
  cell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ── Shelter editing mode ──
  cellActive: {
    backgroundColor: colors.green,
  },
  cellInactive: {
    backgroundColor: colors.cream,
  },
  // ── Picker mode (adopter) ──
  cellAvailable: {
    backgroundColor: 'rgba(76, 175, 122, 0.35)', // semi-transparent green
  },
  cellSelected: {
    backgroundColor: colors.teal,
  },
  cellDisabled: {
    backgroundColor: colors.gray100,
  },
});
