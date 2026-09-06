export type Gender = "male" | "female" | "other";

export type BasicInfo = {
  name: string;
  birthDate: string;
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
