export type CourseSummary = {
  courseId: string;
  title: string;
  imageUrl: string;
  region: string;
  description: string;
};

export type Mission = {
  missionId: string;
  order: number;
  placeName: string;
  location: string;
  description: string;
  imageUrl: string;
  done: boolean;
};

export type StampRegion = {
  name: string;
  visited: boolean;
};
