
"use client";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Button } from '../ui/button';

interface CalendarioEquiposProps {
    eventos: any[];
    onEventClick: (eventInfo: any) => void;
}

export function CalendarioEquipos({ eventos, onEventClick }: CalendarioEquiposProps) {
    return (
        <div className="bg-card p-4 rounded-lg border">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={eventos}
                locale={esLocale}
                eventClick={onEventClick}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                }}
                height="auto"
                contentHeight="auto"
                dayMaxEvents={true}
                buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                }}
            />
        </div>
    );
}
