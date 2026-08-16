export type Gender = "male" | "female" | "other";

export type BasicInfo = {
  name: string;
  age: number;
  gender: Gender;
  jobCategory: string;
  isJobCategoryPrivate: boolean;
};

export type MbtiSelection = {
  EI: "E" | "I";
  SN: "S" | "N";
  TF: "T" | "F";
  JP: "J" | "P";
};

export type ProfileDraft = {
  basicInfo: BasicInfo;
  photos: string[];
  bio: string;
  mbti: MbtiSelection;
  isMbtiPrivate: boolean;
  interestTags: string[];
};
