import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const activities = [
    { user: "Jesus Diaz", action: "Completed analysis for Sample #HDPE-0821.", time: "5 min ago", avatar: { src: "https://placehold.co/40x40.png", fallback: "JD", hint: "man portrait" } },
    { user: "Antonia Figueroa", action: "Logged new batch of PP-R Fusión Socket accessories.", time: "24 min ago", avatar: { src: "https://placehold.co/40x40.png", fallback: "AF", hint: "woman portrait" } },
    { user: "System", action: "Instrument GC-MS 01 calibration is due in 10 days.", time: "1 hour ago", avatar: { src: "", fallback: "SYS", hint: "" } },
    { user: "Victor Lutz", action: "Approved report for Lote #M-PRIM-5532.", time: "3 hours ago", avatar: { src: "https://placehold.co/40x40.png", fallback: "VL", hint: "man portrait" } },
    { user: "Maximiliano M.", action: "Started workflow for Materia Prima - TIO.", time: "8 hours ago", avatar: { src: "https://placehold.co/40x40.png", fallback: "MM", hint: "man glasses" } },
];

export function RecentActivityList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of the most recent actions in the laboratory.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <Avatar>
                                <AvatarImage src={activity.avatar.src} data-ai-hint={activity.avatar.hint} />
                                <AvatarFallback>{activity.avatar.fallback}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm">
                                    <span className="font-medium">{activity.user}</span> {activity.action}
                                </p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
