"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Bike, LogOut, MapPinned, PackageCheck, Save, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBanner } from "@/components/ui/status-banner";
import type { DriverDashboardView } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils";

type FeedbackState = {
  status: "idle" | "saving" | "error" | "success";
  title?: string;
  body?: string;
};

export function DriverDashboard({ dashboard }: { dashboard: DriverDashboardView }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({ status: "idle" });
  const [city, setCity] = useState(dashboard.profile?.city ?? "");
  const [serviceAreas, setServiceAreas] = useState((dashboard.profile?.serviceAreas ?? []).join(", "));
  const [vehicleType, setVehicleType] = useState(dashboard.profile?.vehicleType ?? "Scooter");
  const [availabilityStatus, setAvailabilityStatus] = useState(dashboard.profile?.availabilityStatus ?? "available");
  const [acceptsPickup, setAcceptsPickup] = useState(dashboard.profile?.acceptsPickup ?? true);
  const [acceptsDelivery, setAcceptsDelivery] = useState(dashboard.profile?.acceptsDelivery ?? true);

  const profileReady = Boolean(dashboard.profile);
  const totalTasks = dashboard.pickupAssignments.length + dashboard.deliveryAssignments.length;
  const serviceAreaList = useMemo(
    () => serviceAreas.split(",").map((part) => part.trim()).filter(Boolean),
    [serviceAreas],
  );

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function saveProfile() {
    setFeedback({ status: "saving", title: "Saving driver profile", body: "Updating your availability and service areas." });

    try {
      const response = await fetch("/api/drivers/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          service_areas: serviceAreaList,
          vehicle_type: vehicleType,
          availability_status: availabilityStatus,
          accepts_pickup: acceptsPickup,
          accepts_delivery: acceptsDelivery,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Could not save your profile.");
      }

      setFeedback({ status: "success", title: "Driver profile updated", body: "Your availability is now ready for the admin team to assign work." });
      router.refresh();
    } catch (error) {
      setFeedback({
        status: "error",
        title: error instanceof Error ? error.message : "Could not save your profile.",
        body: "Please review the details and try again.",
      });
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Driver hub</p>
            <h1 className="mt-2 font-display text-4xl text-[var(--foreground)]">{dashboard.user.fullName}</h1>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{dashboard.user.email} · {dashboard.user.phone}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} loading={loggingOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <Truck className="h-5 w-5 text-[var(--accent-strong)]" />
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">Pickup jobs</p>
          <p className="mt-2 font-display text-4xl text-[var(--foreground)]">{dashboard.pickupAssignments.length}</p>
        </Card>
        <Card>
          <PackageCheck className="h-5 w-5 text-[var(--accent-strong)]" />
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">Delivery jobs</p>
          <p className="mt-2 font-display text-4xl text-[var(--foreground)]">{dashboard.deliveryAssignments.length}</p>
        </Card>
        <Card>
          <Bike className="h-5 w-5 text-[var(--accent-strong)]" />
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">Current status</p>
          <p className="mt-2 font-display text-4xl capitalize text-[var(--foreground)]">{availabilityStatus}</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Profile</p>
              <h2 className="mt-2 font-display text-3xl text-[var(--foreground)]">{profileReady ? "Update driver availability" : "Complete your driver profile"}</h2>
            </div>
            <Badge tone="accent">{totalTasks} active tasks</Badge>
          </div>
          <div className="mt-6 grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">City</label>
              <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Dehradun" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Service areas</label>
              <Input value={serviceAreas} onChange={(event) => setServiceAreas(event.target.value)} placeholder="Rajpur Road, Clement Town, Ballupur" />
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">Separate localities with commas so admins can match you faster.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Vehicle type</label>
                <Select value={vehicleType} onChange={(event) => setVehicleType(event.target.value)}>
                  <option value="Scooter">Scooter</option>
                  <option value="Bike">Bike</option>
                  <option value="Cycle">Cycle</option>
                  <option value="Car">Car</option>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Availability</label>
                <Select value={availabilityStatus} onChange={(event) => setAvailabilityStatus(event.target.value as "available" | "busy" | "offline")}>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </Select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-[20px] border border-[var(--border)] bg-[var(--panel)] p-4 text-sm text-[var(--foreground)]">
                <input type="checkbox" checked={acceptsPickup} onChange={(event) => setAcceptsPickup(event.target.checked)} />
                Accept pickup jobs
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-[20px] border border-[var(--border)] bg-[var(--panel)] p-4 text-sm text-[var(--foreground)]">
                <input type="checkbox" checked={acceptsDelivery} onChange={(event) => setAcceptsDelivery(event.target.checked)} />
                Accept delivery jobs
              </label>
            </div>
            {feedback.status !== "idle" && feedback.title ? (
              <StatusBanner
                tone={feedback.status === "error" ? "error" : feedback.status === "success" ? "success" : "pending"}
                title={feedback.title}
                body={feedback.body}
              />
            ) : null}
            <Button onClick={saveProfile} loading={feedback.status === "saving"}>
              <Save className="h-4 w-4" />
              Save profile
            </Button>
          </div>
        </Card>

        <div className="grid gap-6">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Pickup assignments</p>
                <h2 className="mt-2 font-display text-3xl text-[var(--foreground)]">Books to collect</h2>
              </div>
              <Badge tone="neutral">{dashboard.pickupAssignments.length}</Badge>
            </div>
            <div className="mt-5 grid gap-4">
              {dashboard.pickupAssignments.length ? dashboard.pickupAssignments.map((submission) => (
                <div key={submission.id} className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">{submission.sellerName}</p>
                      <h3 className="mt-1 text-xl font-semibold text-[var(--foreground)]">{submission.schoolName}</h3>
                      <p className="mt-2 text-sm text-[var(--muted-foreground)]">{submission.classLabel} · {submission.academicYear}</p>
                    </div>
                    <Badge tone="accent">{submission.pickupStatus.replaceAll("_", " ")}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{submission.statusNote || "Review complete. Coordinate pickup timing from the ops team."}</p>
                </div>
              )) : <StatusBanner tone="info" title="No pickup jobs yet" body="Once the ops team assigns pickups, they will show up here." />}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Delivery assignments</p>
                <h2 className="mt-2 font-display text-3xl text-[var(--foreground)]">Orders to deliver</h2>
              </div>
              <Badge tone="neutral">{dashboard.deliveryAssignments.length}</Badge>
            </div>
            <div className="mt-5 grid gap-4">
              {dashboard.deliveryAssignments.length ? dashboard.deliveryAssignments.map((order) => (
                <div key={order.id} className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">{order.buyerName}</p>
                      <h3 className="mt-1 text-xl font-semibold text-[var(--foreground)]">{order.schoolName}</h3>
                      <p className="mt-2 text-sm text-[var(--muted-foreground)]">{order.classLabel}</p>
                    </div>
                    <Badge tone="accent">{order.status.replaceAll("_", " ")}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-[var(--muted-foreground)]">
                    <span>{order.deliveryWindow}</span>
                    <span className="font-medium text-[var(--foreground)]">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              )) : <StatusBanner tone="info" title="No delivery jobs yet" body="Assigned orders will appear here as soon as the ops team schedules them." />}
            </div>
          </Card>
        </div>
      </div>

      {profileReady ? (
        <Card>
          <div className="flex items-start gap-3">
            <MapPinned className="mt-1 h-5 w-5 text-[var(--accent-strong)]" />
            <div>
              <h2 className="font-display text-2xl text-[var(--foreground)]">Current service area</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                {dashboard.profile?.city} · {(dashboard.profile?.serviceAreas ?? []).join(", ")}
              </p>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
