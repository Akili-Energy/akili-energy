import { type BaseModel } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export function PlatformLink({
  data,
  type,
}: {
  data?: BaseModel | BaseModel[];
  type: "deals" | "projects" | "companies";
}) {
  const href = `/platform/${type}`;

  if (Array.isArray(data)) {
    return (
      <div className="font-medium">
        {data.length > 0 ? data.map(({ id, name }, index) => (
          <Link
            key={id}
            href={`${href}/${id}`}
            className="text-akili-blue hover:underline hover:text-blue-800 transition-colors"
          >
            <span className="font-medium">
              {name}
              <ExternalLink className="w-3 h-3 inline ml-1" />
              {index < data.length - 1 ? ", " : ""}
            </span>
          </Link>
        )): "-"}
      </div>
    );
  }

  return (
    <Link
      href={`${href}/${data?.id}`}
      className="text-akili-blue hover:underline hover:text-blue-800 transition-colors"
    >
      <div className="font-medium">
        {data?.name}
        {data ? <ExternalLink className="w-3 h-3 inline ml-1" /> : "-"}
      </div>
    </Link>
  );
}
