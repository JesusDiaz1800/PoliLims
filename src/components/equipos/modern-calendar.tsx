"use client";

import * as React from 'react';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  addMonths,
  subMonths,
  isToday,
  isSameMonth,
  isSameDay,
  parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface CalendarioEvento {
  title: string;
  start: Date;
  color: string;
  equipo: any;
}

interface ModernCalendarProps {
  events: CalendarioEvento[];
  onEventClick: (event: CalendarioEvento) => void;
}

export function ModernCalendar({ events, onEventClick }: ModernCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(new Date());

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth) === 0 ? 6 : getDay(firstDayOfMonth) - 1;

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };
  
  const selectedDayEvents = React.useMemo(() => {
    if (!selectedDay) return [];
    return events.filter(event => isSameDay(event.start, selectedDay));
  }, [events, selectedDay]);

  return (
    <div className="md:grid md:grid-cols-3 md:divide-x md:divide-border">
      <div className="p-4 md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-headline capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
              Hoy
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="border rounded-lg border-transparent" />
          ))}
          {daysInMonth.map(day => {
            const dayEvents = events.filter(event => isSameDay(event.start, day));
            return (
              <div
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                className={cn(
                  'relative aspect-square cursor-pointer rounded-lg border p-2 transition-colors flex flex-col',
                  'bg-background hover:bg-accent/80',
                  isToday(day) && 'bg-accent dark:bg-primary/10 border-primary/50',
                  selectedDay && isSameDay(day, selectedDay) && 'bg-primary/20 dark:bg-primary/20 ring-2 ring-primary',
                  !isSameMonth(day, currentMonth) && 'text-muted-foreground/50'
                )}
              >
                <span
                  className={cn(
                    'font-semibold',
                    isToday(day) && 'text-primary'
                  )}
                >
                  {format(day, 'd')}
                </span>
                <div className="mt-1 flex flex-col gap-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((event, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: event.color }}/>
                           <span className="text-xs truncate font-medium text-muted-foreground">{event.title}</span>
                        </div>
                    ))}
                    {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground/80 mt-1">
                           + {dayEvents.length - 2} más
                        </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <aside className="p-4 border-t md:border-t-0 md:border-l">
        <h3 className="text-lg font-semibold font-headline mb-4 capitalize">
          Eventos del {selectedDay ? format(selectedDay, 'd MMMM', {locale: es}) : 'día'}
        </h3>
        <ScrollArea className="h-56">
            <div className="space-y-3 pr-3">
                {selectedDayEvents.length > 0 ? (
                    selectedDayEvents.map((event, i) => (
                    <button 
                        key={i} 
                        className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-accent transition-colors"
                        onClick={() => onEventClick(event)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-full flex-shrink-0 rounded-full" style={{ backgroundColor: event.color }}/>
                            <div>
                                <p className="font-semibold text-sm">{event.title}</p>
                                <p className="text-xs text-muted-foreground">{event.equipo.marca} {event.equipo.modelo}</p>
                            </div>
                        </div>
                    </button>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center pt-8">No hay eventos para este día.</p>
                )}
            </div>
        </ScrollArea>
      </aside>
    </div>
  );
}
