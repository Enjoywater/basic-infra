
![Deploy](https://i.imgur.com/9PTKCVv.png)

# 📊 S3 정적 배포

## 📁 배포 대상

- **환경**: AWS S3 정적 웹사이트 호스팅 (`ap-northeast-2`, 서울 리전)
- **URL**: https://hanghae-infra-first.s3-website.ap-northeast-2.amazonaws.com/
- **Next.js 상태**: 정적 페이지, 약간의 번들 부하 유도 (`lodash`,  `dayjs` 등 사용)

---

## 🧪 측정 환경

- **브라우저**: Chrome DevTools
- **모드**: 시크릿 모드 + Disable Cache 체크
- **측정 위치**: 서울

---

## 📐 성능 지표

| 항목                  | 측정값       | 설명 |
|-----------------------|--------------|------|
| 요청 수               | 9개           | 폰트, 스크립트, 스타일 등 포함 |
| 전송 크기 (Transferred) | `451 kB`      | 압축 전송 기준 |
| 리소스 크기 (Resources) | `447 kB`      | 압축 해제 기준 |
| DOMContentLoaded      | `412 ms`     | HTML 파싱 완료 시점 |
| Load 완료             | `565 ms`     | 전체 리소스 로딩 완료 시점 |
| 총 완료 시간 (Finish) | `612 ms`     | 마지막 요청 완료 기준 시간 |

---

## 🔍 주요 리소스 요약

| 리소스 유형 | 개수 | 대표 용량 |
|-------------|------|------------|
| JS Chunk    | 3개  | 약 53KB, 46KB 등 |
| Font        | 2개  | 약 30KB 수준 |
| CSS         | 1개  | 7.6KB |
| Document    | 1개  | 7.1KB |
| Favicon     | 1개  | 26.3KB |

---
