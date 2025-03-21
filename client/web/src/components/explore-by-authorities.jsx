import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

export default function ExploreByAuthorities() {
  return (
    <section className="bg-slate-50 py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            <h2 className="text-2xl font-bold tracking-tight">
              Explore by Authorities
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              "Ministry of Defense",
              "Ministry of Railways",
              "Ministry of Road Transport",
              "Ministry of Health",
              "Ministry of Education",
              "Public Works Department",
              "State Electricity Boards",
              "Municipal Corporations",
            ].map((authority) => (
              <Link
                key={authority}
                href="#"
                className="flex items-center rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted"
              >
                <Building2 className="mr-3 h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{authority}</span>
              </Link>
            ))}
          </div>
          <Button variant="link" className="ml-auto flex items-center">
            View all authorities <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
