import Image from "next/image";
import type { CourseSummary } from "@/features/course/types";

type CourseCardProps = CourseSummary;

export default function CourseCard({ title, region, imageUrl }: CourseCardProps) {
  return (
    <div className="flex w-36 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-forest-light">
      <div className="relative aspect-[3/4] w-full">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill sizes="144px" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-forest-light to-forest/40" />
        )}
      </div>
      <div className="bg-white p-3">
        <p className="text-base font-semibold text-ink">{title}</p>
        <p className="text-xs text-ink/70">{region}</p>
      </div>
    </div>
  );
}
