export type CourseSummary = {
  courseId: string;
  title: string;
  imageUrl: string;
  region: string;
};

export type MissionStatus = "locked" | "current" | "done";

export type Mission = {
  missionId: string;
  order: number;
  placeName: string;
  description: string;
  status: MissionStatus;
};
