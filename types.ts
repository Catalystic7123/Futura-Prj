
export interface LocationState {
  preset: string;
  latitude: number;
  longitude: number;
  direction: 'E' | 'W';
  timezone: string;
}

export interface DateAndTimeState {
  date: string;
  time: string;
  scan: number;
  step: number;
  count: number;
}

export interface PriceMatrixState {
  high: number;
  low: number;
  scale: number;
  preview: number;
}

export interface TimeMappingState {
  mode: string;
  minDeg: number;
  tolerance: number;
  requireBoth: boolean;
  lahiri: boolean;
  audioAlert: boolean;
}

export interface ScanResult {
  id: number;
  dateTime: string;
  asc: number;
  timeTarget: number;
  deltaAscPrice: number;
  deltaAscTime: number;
  match: string;
  quantumNotes: string;
  isSquare?: boolean;
}

export type ScanStatus = 'IDLE' | 'SCANNING' | 'LIVE' | 'HALTED';
