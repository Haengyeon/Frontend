import Image from "next/image";
import type { CourseSummary } from "@/features/course/types";

type CourseCardProps = CourseSummary;

export default function CourseCard({ title, region, imageUrl }: CourseCardProps) {
  return (
    <div className="relative aspect-[3/5] w-36 shrink-0 overflow-hidden rounded-2xl bg-forest-light shadow-md shadow-black/5">
      {imageUrl ? (
        <Image src={imageUrl} alt={title} fill sizes="144px" className="object-cover" />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-forest-light to-forest/40" />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-white p-3 backdrop-blur-sm">
        <p className="text-base font-semibold text-ink">{title}</p>
        <p className="text-xs text-ink/70">{region}</p>
      </div>
    </div>
  );
}
