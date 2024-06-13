import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Table from "@/components/table";
import TablePlaceholder from "@/components/table-placeholder";
import ExpandingArrow from "@/components/expanding-arrow";

export const dynamic = "force-dynamic";

export default async function Home() {
  const baseUrl = process.env.VERCEL === '1' ? `https://${process.env.VERCEL_BRANCH_URL}` : 'http://localhost:3000';
  console.log('baseUrl', baseUrl);
  const data = await fetch(`${baseUrl}/data.json`);
  console.log('data', data);
  const websites = await data.json();

  return (
    <main className="wrapper">
      <div className="intro">
        <h1 >
          Mural EOI Finder
        </h1>
        <p>Listed below are pages found that matched any one of the tags listed below. Data is scraped from 513 council websites from across NSW, Vic, Tas, SA and WA.</p>
        <p>The data includes a mix of good results and false positives. Use the filters below to hone down your search.</p>
      </div>
      <Suspense fallback={<TablePlaceholder />}>
        <Table websites={websites} />
      </Suspense>
    </main>
  );
}