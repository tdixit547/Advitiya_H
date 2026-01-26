// ============================================
// SMART LINK HUB - Analog Clock Time Picker
// Draggable clock hands for time selection
// ============================================

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface TimeValue {
  hour: number;   // 1-12
  minute: number; // 0-59
  period: 'AM' | 'PM';
}

export function formatTime(time: TimeValue): string {
  const hourStr = time.hour.toString().padStart(2, '0');
  const minStr = time.minute.toString().padStart(2, '0');
  return `${hourStr}:${minStr} ${time.period}`;
}

export function parseTime(timeStr: string): TimeValue {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (match) {
    return {
      hour: parseInt(match[1]) || 12,
      minute: parseInt(match[2]) || 0,
      period: (match[3]?.toUpperCase() as 'AM' | 'PM') || 'AM'
    };
  }
  return { hour: 12, minute: 0, period: 'AM' };
}

interface AnalogClockPickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  label?: string;
}

export default function AnalogClockPicker({ value, onChange, label }: AnalogClockPickerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<'hour' | 'minute' | null>(null);

  const clockSize = 180;
  const center = clockSize / 2;
  const hourHandLength = 40;
  const minuteHandLength = 55;
  const numberRadius = 70;

  // Calculate hand angles
  const hourAngle = ((value.hour % 12) / 12) * 360 + (value.minute / 60) * 30 - 90;
  const minuteAngle = (value.minute / 60) * 360 - 90;

  const getAngleFromEvent = useCallback((e: MouseEvent | TouchEvent): number => {
    if (!svgRef.current) return 0;
    
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left - center;
    const y = clientY - rect.top - center;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    
    return angle;
  }, [center]);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging) return;
    e.preventDefault();

    const angle = getAngleFromEvent(e);

    if (dragging === 'minute') {
      const newMinute = Math.round((angle / 360) * 60) % 60;
      onChange({ ...value, minute: newMinute });
    } else if (dragging === 'hour') {
      let newHour = Math.round((angle / 360) * 12);
      if (newHour === 0) newHour = 12;
      onChange({ ...value, hour: newHour });
    }
  }, [dragging, value, onChange, getAngleFromEvent]);

  const handleEnd = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);

      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleEnd);
      };
    }
  }, [dragging, handleMove, handleEnd]);

  const handleHourStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging('hour');
  };

  const handleMinuteStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging('minute');
  };

  const togglePeriod = () => {
    onChange({ ...value, period: value.period === 'AM' ? 'PM' : 'AM' });
  };

  // Quick adjustment buttons
  const adjustHour = (delta: number) => {
    let newHour = value.hour + delta;
    if (newHour > 12) newHour = 1;
    if (newHour < 1) newHour = 12;
    onChange({ ...value, hour: newHour });
  };

  const adjustMinute = (delta: number) => {
    let newMinute = value.minute + delta;
    if (newMinute >= 60) newMinute = 0;
    if (newMinute < 0) newMinute = 55;
    onChange({ ...value, minute: newMinute });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <span className="text-sm font-medium text-[#9A9A9A]">
          {label}
        </span>
      )}
      
      {/* Clock Face */}
      <div className="relative">
        <svg
          ref={svgRef}
          width={clockSize}
          height={clockSize}
          className="select-none"
          style={{ 
            touchAction: 'none',
            background: 'linear-gradient(145deg, #111, #1a1a1a)',
            borderRadius: '50%',
            border: '2px solid #333',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Clock face background */}
          <circle
            cx={center}
            cy={center}
            r={center - 2}
            fill="#111"
            stroke="#333"
            strokeWidth="2"
          />
          
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => {
            const angle = ((i + 1) / 12) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const x = center + Math.cos(rad) * numberRadius;
            const y = center + Math.sin(rad) * numberRadius;
            
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="500"
                fill="#E6E6E6"
              >
                {i + 1}
              </text>
            );
          })}

          {/* Minute ticks */}
          {[...Array(60)].map((_, i) => {
            if (i % 5 === 0) return null; // Skip hour positions
            const angle = (i / 60) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const innerR = center - 8;
            const outerR = center - 4;
            
            return (
              <line
                key={i}
                x1={center + Math.cos(rad) * innerR}
                y1={center + Math.sin(rad) * innerR}
                x2={center + Math.cos(rad) * outerR}
                y2={center + Math.sin(rad) * outerR}
                stroke="#333"
                strokeWidth="1"
              />
            );
          })}

          {/* Hour hand */}
          <g
            onMouseDown={handleHourStart}
            onTouchStart={handleHourStart}
            style={{ cursor: dragging === 'hour' ? 'grabbing' : 'grab' }}
          >
            <line
              x1={center}
              y1={center}
              x2={center + Math.cos((hourAngle * Math.PI) / 180) * hourHandLength}
              y2={center + Math.sin((hourAngle * Math.PI) / 180) * hourHandLength}
              stroke="#00C853"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle
              cx={center + Math.cos((hourAngle * Math.PI) / 180) * hourHandLength}
              cy={center + Math.sin((hourAngle * Math.PI) / 180) * hourHandLength}
              r="8"
              fill="#00C853"
              fillOpacity="0.3"
            />
          </g>

          {/* Minute hand */}
          <g
            onMouseDown={handleMinuteStart}
            onTouchStart={handleMinuteStart}
            style={{ cursor: dragging === 'minute' ? 'grabbing' : 'grab' }}
          >
            <line
              x1={center}
              y1={center}
              x2={center + Math.cos((minuteAngle * Math.PI) / 180) * minuteHandLength}
              y2={center + Math.sin((minuteAngle * Math.PI) / 180) * minuteHandLength}
              stroke="#E6E6E6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx={center + Math.cos((minuteAngle * Math.PI) / 180) * minuteHandLength}
              cy={center + Math.sin((minuteAngle * Math.PI) / 180) * minuteHandLength}
              r="6"
              fill="#E6E6E6"
              fillOpacity="0.3"
            />
          </g>

          {/* Center dot */}
          <circle
            cx={center}
            cy={center}
            r="6"
            fill="#00C853"
            style={{ filter: 'drop-shadow(0 0 5px #00C853)' }}
          />
        </svg>
      </div>

      {/* Time Display and Controls */}
      <div className="flex items-center gap-2">
        {/* Hour controls */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => adjustHour(1)}
            className="text-xs p-1 hover:opacity-70 text-[#00C853]"
          >
            ▲
          </button>
          <span className="text-2xl font-mono font-bold w-10 text-center text-[#00C853]">
            {value.hour.toString().padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={() => adjustHour(-1)}
            className="text-xs p-1 hover:opacity-70 text-[#00C853]"
          >
            ▼
          </button>
        </div>

        <span className="text-2xl font-bold text-white">:</span>

        {/* Minute controls */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => adjustMinute(5)}
            className="text-xs p-1 hover:opacity-70 text-[#9A9A9A]"
          >
            ▲
          </button>
          <span className="text-2xl font-mono font-bold w-10 text-center text-white">
            {value.minute.toString().padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={() => adjustMinute(-5)}
            className="text-xs p-1 hover:opacity-70 text-[#9A9A9A]"
          >
            ▼
          </button>
        </div>

        {/* AM/PM Toggle */}
        <button
          type="button"
          onClick={togglePeriod}
          className="ml-2 px-3 py-2 rounded-lg font-bold text-sm transition-colors"
          style={{
            backgroundColor: value.period === 'AM' 
              ? 'rgba(0, 200, 83, 0.2)' 
              : 'rgba(255, 152, 0, 0.2)',
            color: value.period === 'AM' ? '#00C853' : '#ff9800',
            border: `1px solid ${value.period === 'AM' ? '#00C853' : '#ff9800'}`
          }}
        >
          {value.period}
        </button>
      </div>

      {/* Instructions */}
      <p className="text-xs text-center text-[#666]">
        Drag clock hands or use arrows to adjust time
      </p>
    </div>
  );
}
