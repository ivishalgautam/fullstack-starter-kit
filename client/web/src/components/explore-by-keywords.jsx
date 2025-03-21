import { ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function ExploreByKeywords() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            <h2 className="text-2xl font-bold tracking-tight">
              Explore by Keywords
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[
              { label: "Construction", icon: "/icons/construction.svg" },
              { label: "Healthcare", icon: "/icons/healthcare.svg" },
              { label: "Education", icon: "/icons/education.svg" },
              { label: "Infrastructure", icon: "/icons/infrastructure.svg" },
              { label: "Defense", icon: "/icons/defense.svg" },
              { label: "Energy", icon: "/icons/energy.svg" },
              { label: "Agriculture", icon: "/icons/agriculture.svg" },
              { label: "Transportation", icon: "/icons/transportation.svg" },
              {
                label: "Telecommunications",
                icon: "/icons/telecommunication.svg",
              },
              { label: "Mining", icon: "/icons/mining.svg" },
              { label: "IT Services", icon: "/icons/it-service.svg" },
              {
                label: "Water & Sanitation",
                icon: "/icons/water-and-sanitation.svg",
              },
            ].map((keyword) => (
              <Link
                key={keyword.label}
                href="#"
                className="rounded-lg border bg-card p-4 text-center shadow-sm transition-colors hover:bg-muted"
              >
                <div class="mx-auto size-16 p-2">
                  <Image
                    width={100}
                    height={100}
                    src={keyword.icon}
                    alt={keyword.label}
                  />
                </div>
                <div className="font-medium">{keyword.label}</div>
              </Link>
            ))}
          </div>
          <Button variant="link" className="ml-auto flex items-center">
            View all keywords <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
