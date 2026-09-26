"use client";

import { useEffect } from "react";
import { useCourseDetail } from "@/features/course/api/useCourseApi";
import { sigunguCodeOf } from "@/features/matching/lib/sigunguNames";
import { mapCellsOfSigungu } from "@/features/course/lib/sigunguMapCells";

type ExperienceCellsCollectorProps = {
  courseId: string;
  onCells: (courseId: string, cells: string[]) => void;
};

// 화면에 아무것도 안 그리는 데이터 전용 컴포넌트. 완료 코스 목록(GET /courses/history)엔
// isExperience가 없어서(스펙엔 있다고 했지만 실서버 DTO엔 빠져있음), 지도에 체험 코스를
// 반영하려면 코스 하나하나를 상세 조회해서 직접 확인하는 수밖에 없다 — 목록 아이템 개수만큼
// 이 컴포넌트를 렌더링해서 각자 자기 코스만 확인하고 결과를 부모에 보고한다.
export default function ExperienceCellsCollector({ courseId, onCells }: ExperienceCellsCollectorProps) {
  const { data } = useCourseDetail(courseId);

  useEffect(() => {
    if (!data?.isExperience) return;

    const cells = data.sigunguNames.flatMap((name) => {
      const code = sigunguCodeOf(data.region, name);
      return mapCellsOfSigungu(data.region, code);
    });

    if (cells.length > 0) onCells(courseId, cells);
  }, [data, courseId, onCells]);

  return null;
}
