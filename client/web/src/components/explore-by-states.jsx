import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, MapPin } from "lucide-react";

export default function ExploreByStates() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            <h2 className="text-2xl font-bold tracking-tight">
              Explore by States
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[
              "Maharashtra",
              "Delhi",
              "Tamil Nadu",
              "Karnataka",
              "Gujarat",
              "Uttar Pradesh",
              "West Bengal",
              "Telangana",
              "Rajasthan",
              "Kerala",
              "Haryana",
              "Punjab",
            ].map((state) => (
              <Link
                key={state}
                href="#"
                className="flex h-24 items-center justify-center rounded-lg border bg-card p-4 text-center shadow-sm transition-colors hover:bg-muted"
              >
                <span className="font-medium">{state}</span>
              </Link>
            ))}
          </div>
          <Button variant="link" className="ml-auto flex items-center">
            View all states <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
