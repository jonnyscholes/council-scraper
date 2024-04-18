import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Table from "@/components/table";
import TablePlaceholder from "@/components/table-placeholder";
import ExpandingArrow from "@/components/expanding-arrow";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await fetch(`data.json`);
  const websites = await data.json();

  return (
    <main className="wrapper">
      <h1 >
        Data
      </h1>
      <Suspense fallback={<TablePlaceholder />}>
        <Table websites={websites} />
      </Suspense>
    </main>
  );
}