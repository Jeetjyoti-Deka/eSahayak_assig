"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBuyerSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof createBuyerSchema>;

export default function NewBuyerPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBuyerSchema),
  });

  const propertyType = watch("propertyType");
  const [tagInput, setTagInput] = useState("");
  const watchedTags = watch("tags") || [];

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue("tags", [...watchedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watchedTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/buyers", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/buyers");
    } else {
      const err = await res.json();
      // TODO: implement toast notification
      alert(err.error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Card className="form-section shadow-xl border-0 bg-card">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-foreground text-balance">
              Real Estate Lead Form
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground text-pretty">
              Help us find your perfect property by providing some details
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information Section */}
              <div className="form-section space-y-6">
                <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-field-focus space-y-2">
                    <Label
                      htmlFor="fullname"
                      className="text-sm font-medium text-card-foreground"
                    >
                      Full Name *
                    </Label>
                    <Input
                      {...register("fullName")}
                      id="fullname"
                      type="text"
                      placeholder="Enter your full name"
                      className="h-12"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="form-field-focus space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-card-foreground"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      {...register("phone")}
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="h-12"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="form-field-focus space-y-2 md:col-span-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-card-foreground"
                    >
                      Email Address
                    </Label>
                    <Input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="h-12"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Budget Range Section */}
              <div className="form-section space-y-6">
                <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                  Budget Range
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-field-focus space-y-2">
                    <Label
                      htmlFor="budgetMin"
                      className="text-sm font-medium text-card-foreground"
                    >
                      Minimum Budget
                    </Label>
                    <Input
                      {...register("budgetMin")}
                      id="budgetMin"
                      type="number"
                      placeholder="₹ 0"
                      className="h-12"
                    />
                    {errors.budgetMin && (
                      <p className="text-sm text-destructive">
                        {errors.budgetMin.message}
                      </p>
                    )}
                  </div>

                  <div className="form-field-focus space-y-2">
                    <Label
                      htmlFor="budgetMax"
                      className="text-sm font-medium text-card-foreground"
                    >
                      Maximum Budget
                    </Label>
                    <Input
                      {...register("budgetMax")}
                      id="budgetMax"
                      type="number"
                      placeholder="₹ 0"
                      className="h-12"
                    />
                    {errors.budgetMax && (
                      <p className="text-sm text-destructive">
                        {errors.budgetMax.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Preferences Section */}
              <div className="form-section space-y-6">
                <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                  Property Preferences
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-field-focus space-y-2">
                    <Label
                      htmlFor="city"
                      className="text-sm font-medium text-card-foreground"
                    >
                      City *
                    </Label>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="h-12 w-full">
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Chandigarh">
                              Chandigarh
                            </SelectItem>
                            <SelectItem value="Mohali">Mohali</SelectItem>
                            <SelectItem value="Zirakpur">Zirakpur</SelectItem>
                            <SelectItem value="Panchkula">Panchkula</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="form-field-focus space-y-2">
                    <Label
                      htmlFor="propertyType"
                      className="text-sm font-medium text-card-foreground"
                    >
                      Property Type *
                    </Label>
                    <Controller
                      name="propertyType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="h-12 w-full">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="Villa">Villa</SelectItem>
                            <SelectItem value="Plot">Plot</SelectItem>
                            <SelectItem value="Office">Office</SelectItem>
                            <SelectItem value="Retail">Retail</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.propertyType && (
                      <p className="text-sm text-destructive">
                        {errors.propertyType.message}
                      </p>
                    )}
                  </div>

                  <div className="form-field-focus space-y-2">
                    <Label
                      htmlFor="bhk"
                      className="text-sm font-medium text-card-foreground"
                    >
                      BHK Configuration
                    </Label>
                    <Controller
                      name="bhk"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={
                            !propertyType ||
                            !["Apartment", "Villa"].includes(propertyType)
                          }
                        >
                          <SelectTrigger className="h-12 w-full">
                            <SelectValue placeholder="Select BHK" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ONE">1 BHK</SelectItem>
                            <SelectItem value="TWO">2 BHK</SelectItem>
                            <SelectItem value="THREE">3 BHK</SelectItem>
                            <SelectItem value="FOUR">4 BHK</SelectItem>
                            <SelectItem value="STUDIO">Studio</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.bhk && (
                      <p className="text-sm text-destructive">
                        {errors.bhk.message}
                      </p>
                    )}
                  </div>

                  <div className="form-field-focus space-y-2">
                    <Label
                      htmlFor="purpose"
                      className="text-sm font-medium text-card-foreground"
                    >
                      Purpose *
                    </Label>
                    <Controller
                      name="purpose"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="h-12 w-full">
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Buy">Buy</SelectItem>
                            <SelectItem value="Rent">Rent</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.purpose && (
                      <p className="text-sm text-destructive">
                        {errors.purpose.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Lead Tracking Section */}
              <div className="form-section space-y-6">
                <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                  Additional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-field-focus space-y-2">
                    <Label
                      htmlFor="source"
                      className="text-sm font-medium text-card-foreground"
                    >
                      How did you hear about us?
                    </Label>
                    <Controller
                      name="source"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="h-12 w-full">
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="Referral">Referral</SelectItem>
                            <SelectItem value="Walk-in">Walk-in</SelectItem>
                            <SelectItem value="Call">Call</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.source && (
                      <p className="text-sm text-destructive">
                        {errors.source.message}
                      </p>
                    )}
                  </div>

                  <div className="form-field-focus space-y-2">
                    <Label
                      htmlFor="timeline"
                      className="text-sm font-medium text-card-foreground"
                    >
                      Timeline
                    </Label>
                    <Controller
                      name="timeline"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="h-12 w-full">
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ZERO_TO_THREE">
                              Within 3 months
                            </SelectItem>
                            <SelectItem value="THREE_TO_SIX">
                              Within 3 to 6 months
                            </SelectItem>
                            <SelectItem value="GREATER_THAN_6">
                              More than 6 months
                            </SelectItem>
                            <SelectItem value="Exploring">Exploring</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.timeline && (
                      <p className="text-sm text-destructive">
                        {errors.timeline.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-field-focus space-y-2">
                  <Label
                    htmlFor="tags"
                    className="text-sm font-medium text-card-foreground"
                  >
                    Tags
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      type="text"
                      placeholder="Add tags (e.g., urgent, premium, etc.)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                      className="h-12"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="outline"
                      className="h-12 px-6 bg-transparent"
                    >
                      Add
                    </Button>
                  </div>
                  {watchedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {watchedTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  {errors.tags && (
                    <p className="text-sm text-destructive">
                      {errors.tags.message}
                    </p>
                  )}
                </div>

                <div className="form-field-focus space-y-2">
                  <Label
                    htmlFor="notes"
                    className="text-sm font-medium text-card-foreground"
                  >
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific requirements or additional information..."
                    {...register("notes")}
                    className="min-h-[120px] resize-none"
                  />
                  {errors.notes && (
                    <p className="text-sm text-destructive">
                      {errors.notes.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="form-button-hover w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Submit Lead Information
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
