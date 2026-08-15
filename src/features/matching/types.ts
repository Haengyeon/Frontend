export type MatchingStatus =
  | "none"
  | "searching"
  | "payment_pending"
  | "confirmed"
  | "completed";

export type MatchingCondition = {
  region: string;
  ageRange: [number, number];
  preferredGender: "male" | "female" | "any";
  availableDates: string[];
  themeIds: string[];
};

export type MatchingTheme = {
  id: string;
  label: string;
  imageUrl: string;
};

export type MatchProfile = {
  attemptId: string;
  name: string;
  age: number;
  job: string;
  interestTags: string[];
  bio: string;
  photoUrl: string;
};
