import { DealForm } from "./components/deal-form";
import { db } from "@/lib/db/drizzle";
import { companies, projects } from "@/lib/db/schema";

export default async function CreateDealPage() {
  // const companyData = await db
  //   .select({
  //     id: companies.id,
  //     name: companies.name,
  //     classification: companies.classification,
  //   })
  //   .from(companies)
  //   .orderBy(companies.name);

  // const projectData = await db
  //   .select({
  //     id: projects.id,
  //     name: projects.name,
  //     country: projects.country,
  //   })
  //   .from(projects)
  //   .orderBy(projects.name);

  // return (
  //   <DealForm
  //     companyOptions={companyData.map((c) => ({
  //       label: c.name,
  //       value: c.id,
  //       description: c.classification || "",
  //     }))}
  //     projectOptions={projectData.map((p) => ({
  //       label: p.name,
  //       value: p.id,
  //       description: p.country || "",
  //     }))}
  //   />
  // );
  return (<div>Test</div>);
}
