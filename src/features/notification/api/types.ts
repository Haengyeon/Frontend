// 실서버(/api-json) 기준. 웹 푸시(FCM) 등록 토큰은 별도 API(POST/DELETE /notifications/tokens)로
// 관리하는데, 그건 브라우저에서 Firebase 클라이언트 SDK로 토큰을 발급받아야 해서
// (apiKey/projectId/messagingSenderId/VAPID key 등 프론트용 Firebase 설정 필요) 아직 연동 못했다.
// 여기서는 그 설정 없이도 가능한 "설정 조회/변경"만 다룬다.
export type NotificationSettingResponse = {
  pushEnabled: boolean;
};

export type UpdateNotificationSettingRequest = {
  pushEnabled: boolean;
};
