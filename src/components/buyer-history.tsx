import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bhkLabels, timelineLabels } from "@/lib/mappings";
import { HistoryEntry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { BHK, Timeline } from "@prisma/client";
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

const getChangeDescription = (diff: HistoryEntry["diff"]) => {
  const changes: string[] = [];

  if (diff.action === "CREATE") {
    changes.push("Buyer created");
  }

  if (diff.action === "UPDATE") {
    Object.entries(diff.fields).forEach(([field, { from, to }]) => {
      if (field === "timeline") {
        changes.push(
          `Changed timeline from ${formatChangeValue(
            field,
            timelineLabels[from as Timeline]
          )} to ${formatChangeValue(field, timelineLabels[to as Timeline])}`
        );
        return;
      }
      if (field === "bhk") {
        if (from === null && to === null) {
          return;
        }
        if (from === null && to !== null) {
          changes.push(
            `Added bhk: ${formatChangeValue(field, bhkLabels[to as BHK])}`
          );
          return;
        }
        if (from !== null && to === null) {
          changes.push(
            `Removed bhk: ${formatChangeValue(field, bhkLabels[from as BHK])}`
          );
          return;
        }
        changes.push(
          `Changed bhk from ${formatChangeValue(
            field,
            bhkLabels[from as BHK]
          )} to ${formatChangeValue(field, bhkLabels[to as BHK])}`
        );
        return;
      }
      if (field === "notes") {
        changes.push(`Changed notes`);
        return;
      }
      if (field === "tags") {
        if (from.length === 0 && to.length === 0) {
          return;
        }

        if (from.length === 0 && to.length > 0) {
          changes.push(`Added tags: ${to.join(", ")}`);
        }

        if (from.length > 0 && to.length === 0) {
          changes.push(`Removed tags: ${from.join(", ")}`);
        }

        if (from.length > 0 && to.length > 0) {
          const addedTags = to.filter((tag: string) => !from.includes(tag));
          const removedTags = from.filter((tag: string) => !to.includes(tag));

          if (addedTags.length > 0) {
            changes.push(`Added tags: ${addedTags.join(", ")}`);
          }

          if (removedTags.length > 0) {
            changes.push(`Removed tags: ${removedTags.join(", ")}`);
          }
        }

        return;
      }
      changes.push(
        `Changed ${field} from ${formatChangeValue(
          field,
          from
        )} to ${formatChangeValue(field, to)}`
      );
    });
  }

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
                        {entry.changedByUser.role === "ADMIN"
                          ? "Admin"
                          : entry.changedByUser.name ||
                            entry.changedByUser.email}
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
