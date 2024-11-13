"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { createOrganization } from "@/actions/create-organization";

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organizationName: "",
    companySize: "",
    role: "",
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Use startTransition for Server Action to avoid blocking UI
    startTransition(async () => {
      try {
        // Call the server action to create the organization
        const { subdomain } = await createOrganization(formData);

        // Redirect to the success page on the new subdomain
        router.push(
          `https://${subdomain}.${process.env.NEXT_PUBLIC_DOMAIN}/success?subdomain=${subdomain}`
        );
      } catch (error) {
        console.error("Error creating organization:", error);
        // Handle the error (display message, etc.)
      }
    });
  };

  return (
    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle>SaaS Onboarding</CardTitle>
        <CardDescription>Step {step} of 4</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  placeholder="Acme Inc."
                  value={formData.organizationName}
                  onChange={(e) =>
                    updateFormData("organizationName", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Company Size</Label>
                <RadioGroup
                  value={formData.companySize}
                  onValueChange={(value) =>
                    updateFormData("companySize", value)
                  }
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-10" id="1-10" />
                    <Label htmlFor="1-10">1-10 employees</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="11-50" id="11-50" />
                    <Label htmlFor="11-50">11-50 employees</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="51-200" id="51-200" />
                    <Label htmlFor="51-200">51-200 employees</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="201+" id="201+" />
                    <Label htmlFor="201+">201+ employees</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => updateFormData("role", value)}
                  required
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="product-manager">
                      Product Manager
                    </SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Summary</h3>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-bold">Personal Information</h4>
                    <p className="text-sm">Name: {formData.name}</p>
                    <p className="text-sm">Email: {formData.email}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-bold">Organization Details</h4>
                    <p className="text-sm">
                      Organization: {formData.organizationName}
                    </p>
                    <p className="text-sm">
                      Company Size: {formData.companySize}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-bold">Role Information</h4>
                    <p className="text-sm">Role: {formData.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 1}
        >
          Previous
        </Button>
        {step < 4 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
