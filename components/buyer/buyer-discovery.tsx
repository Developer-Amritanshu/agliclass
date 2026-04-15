"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { Compass, Filter, MapPin, Search, Sparkles } from "lucide-react";

import { KitCard } from "@/components/kit/kit-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBanner } from "@/components/ui/status-banner";
import type { KitView, SchoolView } from "@/lib/data/types";

type Filters = {
  query: string;
  city: string;
  academicYear: string;
};

export function BuyerDiscovery({ schools, kits }: { schools: SchoolView[]; kits: KitView[] }) {
  const [draft, setDraft] = useState<Filters>({ query: "", city: "all", academicYear: "all" });
  const [filters, setFilters] = useState<Filters>({ query: "", city: "all", academicYear: "all" });
  const [isPending, startTransition] = useTransition();

  const cityOptions = useMemo(() => ["all", ...Array.from(new Set(schools.map((school) => school.city))).sort()], [schools]);
  const yearOptions = useMemo(() => ["all", ...Array.from(new Set(kits.map((kit) => kit.academicYear))).sort().reverse()], [kits]);
  const schoolCityMap = useMemo(() => new Map(schools.map((school) => [school.name.toLowerCase(), school.city])), [schools]);

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const matchesQuery = !filters.query || school.name.toLowerCase().includes(filters.query.toLowerCase());
      const matchesCity = filters.city === "all" || school.city === filters.city;
      const matchesYear = filters.academicYear === "all" || kits.some((kit) => kit.schoolName === school.name && kit.academicYear === filters.academicYear);
      return matchesQuery && matchesCity && matchesYear;
    });
  }, [filters, kits, schools]);

  const filteredKits = useMemo(() => {
    return kits.filter((kit) => {
      const kitCity = schoolCityMap.get(kit.schoolName.toLowerCase()) || "";
      const matchesQuery = !filters.query || kit.schoolName.toLowerCase().includes(filters.query.toLowerCase());
      const matchesCity = filters.city === "all" || kitCity === filters.city;
      const matchesYear = filters.academicYear === "all" || kit.academicYear === filters.academicYear;
      return matchesQuery && matchesCity && matchesYear;
    });
  }, [filters, kits, schoolCityMap]);

  function applyFilters() {
    startTransition(() => setFilters(draft));
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-[40px] editorial-frame p-6 md:p-8 lg:p-10">
        <div className="editorial-orb editorial-orb--warm absolute -right-16 top-0 h-56 w-56" />
        <div className="editorial-orb editorial-orb--cool absolute -left-14 bottom-0 h-48 w-48" />
        <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <span className="eyebrow">Buyer discovery</span>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[0.94] tracking-[-0.06em] text-[var(--foreground)] sm:text-5xl">
              Search like a premium storefront. Buy like a parent who already knows the list is right.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-foreground)] md:text-lg">
              Start with school, narrow by city and year, and see only the schools and kits that genuinely belong in your result set.
            </p>

            <div className="mt-8 grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">School name</label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-[var(--muted-foreground)]" />
                  <Input
                    placeholder="Search SGRR, St. Joseph's, GGIC..."
                    className="pl-11"
                    value={draft.query}
                    onChange={(event) => setDraft((current) => ({ ...current, query: event.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">City</label>
                  <Select value={draft.city} onChange={(event) => setDraft((current) => ({ ...current, city: event.target.value }))}>
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>
                        {city === "all" ? "All cities" : city}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Academic year</label>
                  <Select value={draft.academicYear} onChange={(event) => setDraft((current) => ({ ...current, academicYear: event.target.value }))}>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year === "all" ? "All years" : year}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button size="lg" className="gap-2 sm:min-w-[180px]" onClick={applyFilters} loading={isPending}>
                  <Filter className="h-4 w-4" />
                  Search
                </Button>
                <p className="text-sm leading-7 text-[var(--muted-foreground)]">Results update to show only schools and kits matching your current search.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-[34px] bg-[var(--panel)] p-4">
              <Image src="/images/buy-minimal.svg" alt="Premium buyer experience illustration" width={1600} height={1200} className="h-auto w-full rounded-[26px] object-cover" />
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_0.85fr]">
              <div className="rounded-[28px] bg-[var(--panel)] p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Current result set</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-3xl font-bold text-[var(--foreground)]">{filteredSchools.length}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">schools matched</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[var(--foreground)]">{filteredKits.length}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">kits visible</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[28px] bg-[var(--foreground)] p-6 text-white">
                <Compass className="h-5 w-5 text-white/80" />
                <p className="mt-4 text-sm uppercase tracking-[0.16em] text-white/60">Discovery promise</p>
                <p className="mt-2 text-base leading-7 text-white">The page stays focused. No unrelated schools, no noisy catalog sprawl.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Matched schools</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.05em] text-[var(--foreground)] sm:text-4xl">Schools in your current result set</h2>
          </div>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]">
            <MapPin className="h-4 w-4 text-[var(--accent)]" />
            Results stay aligned to your search
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSchools.length ? (
            filteredSchools.map((school) => (
              <article key={school.id} className="editorial-frame rounded-[30px] p-4 transition hover:-translate-y-1">
                <div className="h-44 rounded-[24px] bg-cover bg-center" style={{ backgroundImage: `url(${school.coverImage})` }} />
                <div className="px-2 pb-2 pt-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{school.board} · {school.category}</p>
                  <h3 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">{school.name}</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">{school.city}, {school.medium}</p>
                  <div className="editorial-divider mt-4" />
                  <p className="mt-4 text-sm leading-7 text-[var(--foreground)]">{school.classes.join(" · ") || "School list is being prepared"}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <StatusBanner tone="info" title="No schools found" body="Try a wider city filter or search with a shorter school name." />
            </div>
          )}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Verified kits</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.05em] text-[var(--foreground)] sm:text-4xl">Bundles matching your search</h2>
          </div>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            Search once, browse only relevant kits
          </p>
        </div>
        <div className="mt-6 max-w-2xl">
          <StatusBanner
            tone="pending"
            title={`${filteredSchools.length} schools and ${filteredKits.length} kits match your search`}
            body="Only matching schools and matching kits are shown below. Completeness, used/new mix, and pricing remain visible before checkout."
          />
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {filteredKits.length ? (
            filteredKits.map((kit) => <KitCard key={kit.id} kit={kit} />)
          ) : (
            <div className="lg:col-span-3">
              <StatusBanner tone="info" title="No kits available yet" body="You can request your school through your account and we will notify you when kits go live." />
            </div>
          )}
        </div>
      </section>
    </>
  );
}


