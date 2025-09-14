import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryEntry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { History, User, Bot } from "lucide-react";

interface BuyerHistoryProps {
  history: HistoryEntry[];
}

const formatChangeValue = (key: string, value: any) => {
  if (key.includes("budget") || key.includes("Budget")) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
};

const getChangeDescription = (diff: Record<string, any>) => {
  const changes: string[] = [];

  Object.entries(diff).forEach(([field, change]) => {
    if (change.created) {
      changes.push(
        `Created ${field}: ${formatChangeValue(field, change.created)}`
      );
    } else if (change.added) {
      if (Array.isArray(change.added)) {
        changes.push(`Added ${field}: ${change.added.join(", ")}`);
      } else {
        changes.push(`Added ${field}: ${change.added}`);
      }
    } else if (change.from && change.to) {
      changes.push(
        `Changed ${field} from ${formatChangeValue(
          field,
          change.from
        )} to ${formatChangeValue(field, change.to)}`
      );
    }
  });

  return changes;
};

export function BuyerHistory({ history }: BuyerHistoryProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-accent" />
          Recent History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((entry, index) => {
            const changes = getChangeDescription(entry.diff);
            const isSystem = entry.changedBy === "System";

            return (
              <div key={entry.id} className="relative">
                {/* Timeline line */}
                {index < history.length - 1 && (
                  <div className="absolute left-4 top-8 w-px h-16 bg-border" />
                )}

                <div className="flex gap-3">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    {isSystem ? (
                      <Bot className="h-4 w-4 text-accent" />
                    ) : (
                      <User className="h-4 w-4 text-accent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground">
                        {entry.changedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(entry.changedAt)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      {changes.map((change, changeIndex) => (
                        <p
                          key={changeIndex}
                          className="text-sm text-muted-foreground leading-relaxed"
                        >
                          {change}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {history.length === 0 && (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No history available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
