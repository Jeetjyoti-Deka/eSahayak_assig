import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  bhkLabels,
  cityLabels,
  propertyTypeLabels,
  sourceLabels,
  statusColors,
  statusLabels,
  timelineLabels,
} from "@/lib/mappings";
import { BuyerData } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Bed,
  Target,
  IndianRupee,
  Clock,
  Users,
  Activity,
  FileText,
  Tag,
} from "lucide-react";

interface BuyerInfoProps {
  buyer: BuyerData;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function BuyerInfo({ buyer }: BuyerInfoProps) {
  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-accent" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{buyer.email || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{buyer.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p className="font-medium">{cityLabels[buyer.city]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={statusColors[buyer.status]}>
                  {statusLabels[buyer.status]}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-accent" />
            Property Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Home className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Property Type</p>
                <p className="font-medium">
                  {propertyTypeLabels[buyer.propertyType]}
                </p>
              </div>
            </div>
            {buyer.bhk && (
              <div className="flex items-center gap-3">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">BHK</p>
                  <p className="font-medium">{bhkLabels[buyer.bhk]} BHK</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Purpose</p>
                <p className="font-medium">{buyer.purpose}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Timeline</p>
                <p className="font-medium">{timelineLabels[buyer.timeline]}</p>
              </div>
            </div>
          </div>

          {(buyer.budgetMin || buyer.budgetMax) && (
            <>
              <Separator />
              <div className="flex items-center gap-3">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Budget Range</p>
                  <p className="font-medium text-lg">
                    {buyer.budgetMin && formatCurrency(buyer.budgetMin)}
                    {buyer.budgetMin && buyer.budgetMax && " - "}
                    {buyer.budgetMax && formatCurrency(buyer.budgetMax)}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Source</p>
                <p className="font-medium">{sourceLabels[buyer.source]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(buyer.updatedAt)}</p>
              </div>
            </div>
          </div>

          {buyer.tags && buyer.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Tags</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {buyer.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {buyer.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Notes</p>
                <p className="text-sm leading-relaxed bg-muted p-3 rounded-md">
                  {buyer.notes}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
