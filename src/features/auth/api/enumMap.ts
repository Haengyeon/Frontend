import type { Gender, MbtiSelection } from "@/features/auth/types";
import type { ApiGender, ApiMbti } from "./types";

const GENDER_TO_API: Record<Gender, ApiGender> = {
  male: "MALE",
  female: "FEMALE",
  other: "OTHER",
};

const API_TO_GENDER: Record<ApiGender, Gender> = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};

export function genderToApi(gender: Gender): ApiGender {
  return GENDER_TO_API[gender];
}

export function genderToLocal(gender: ApiGender): Gender {
  return API_TO_GENDER[gender];
}

/** 4개 축이 전부 선택됐을 때만 완성된 MBTI 문자열을 만든다 — 하나라도 비어있으면 undefined(선택 안 함)로 취급. */
export function combineMbti(selection: Partial<MbtiSelection>): ApiMbti | undefined {
  const { EI, SN, TF, JP } = selection;
  if (!EI || !SN || !TF || !JP) return undefined;
  return `${EI}${SN}${TF}${JP}` as ApiMbti;
}

export function splitMbti(mbti: ApiMbti | null | undefined): Partial<MbtiSelection> {
  if (!mbti || mbti.length !== 4) return {};
  const [EI, SN, TF, JP] = mbti;
  return { EI, SN, TF, JP } as MbtiSelection;
}
