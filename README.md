# 📊 정적 배포 성능 비교: S3 vs CloudFront

## 📘 주요 개념

- **GitHub Actions과 CI/CD 도구**:  
  GitHub Actions는 코드가 푸시되거나 병합될 때 자동으로 테스트, 빌드, 배포 등의 작업을 수행하는 **CI/CD(지속적 통합/배포) 플랫폼**입니다. 코드 변경 시 자동화된 워크플로우를 통해 정적 파일을 S3에 배포하고, 필요 시 CloudFront 캐시를 무효화하는 작업까지 연계할 수 있습니다.

- **S3와 스토리지**:  
  AWS S3(Simple Storage Service)는 안정적이고 확장 가능한 객체 스토리지 서비스입니다. HTML, CSS, JS와 같은 정적 자산을 저장하고, 정적 웹사이트 호스팅 기능을 통해 직접 웹 콘텐츠를 서빙할 수 있습니다.

- **CloudFront와 CDN**:  
  CloudFront는 AWS의 글로벌 CDN(Content Delivery Network) 서비스로, 사용자와 가장 가까운 엣지 로케이션에서 콘텐츠를 제공하여 **지연 시간을 줄이고 성능을 향상**시킵니다. S3를 원본(origin)으로 연결해 캐싱된 정적 콘텐츠를 빠르게 전달합니다.

- **캐시 무효화 (Cache Invalidation)**:  
  CloudFront는 성능을 위해 정적 콘텐츠를 캐시하지만, 배포 후 파일 내용이 변경돼도 URL이 같다면 이전 캐시가 그대로 유지될 수 있습니다. 이를 방지하기 위해 `invalidation` 명령을 통해 CloudFront에 **캐시를 삭제하고 S3에서 다시 가져오도록 강제**할 수 있습니다.

- **Repository secret과 환경변수**:  
  GitHub Actions에서는 배포에 필요한 민감한 정보(AWS Access Key 등)를 `secrets`에 저장하고 `${{ secrets.KEY_NAME }}` 형식으로 사용합니다. 이는 외부 노출 없이 안전하게 환경변수를 관리하고 자동화에 활용할 수 있도록 돕습니다.

<!-- ![Deploy](https://i.imgur.com/9PTKCVv.png) -->
<div align="center">
  <img src="https://i.imgur.com/9PTKCVv.png" alt="deploy" width="400" />
</div>
<br />

## 📁 공통 배포 조건

- **빌드 대상**: Next.js (정적 페이지 + `lodash`, `dayjs` 등 번들 포함)
- **브라우저**: Chrome DevTools
- **모드**: 시크릿 모드 + Disable Cache 체크
- **측정 위치**: 서울
- **리소스 크기 (압축 해제 기준)**: 약 `447 kB`
- **공통 리소스 구성**:
  - JS Chunk 3개
  - Font 2개
  - CSS 1개
  - HTML Document 1개
  - Favicon 1개

<br />

## 🚀 S3 정적 웹사이트 호스팅

- **환경**: AWS S3 정적 웹사이트 호스팅 (`ap-northeast-2`, 서울 리전)
- **URL**: https://hanghae-infra-first.s3-website.ap-northeast-2.amazonaws.com/

<div align="center">
  <img src="https://i.imgur.com/oWMZVR6.png" alt="s3" width="600" />
</div>

### 📐 성능 지표

| 항목                  | 측정값       |
|-----------------------|--------------|
| 요청 수               | 9개           |
| 전송 크기 (Transferred) | `451 kB`      |
| DOMContentLoaded      | `412 ms`     |
| Load 완료             | `565 ms`     |
| 총 완료 시간 (Finish) | `612 ms`     |

> 💡 S3에서는 `/` 요청 시 내부적으로 `index.html`로 매핑되며 별도의 HTTP 리디렉션 요청이 발생하지 않기 때문에, **요청 수가 하나 적은 9개로 기록됨**.

### 🔍 주요 리소스 용량

| 리소스 유형 | 대표 용량 |
|-------------|------------|
| JS Chunk    | 약 53KB, 46KB 등 |
| Font        | 약 30KB 수준 |
| CSS         | 7.6KB |
| Document    | 7.1KB |
| Favicon     | 26.3KB |

<br />

## 🚀 CloudFront CDN 배포

- **환경**: AWS CloudFront (S3 버킷을 원본으로 설정)
- **URL**: https://d1n2f1st4djwiqe.cloudfront.net/

<div align="center">
  <img src="https://i.imgur.com/MKjCWle.png" alt="s3" width="600" />
</div>

### 📐 성능 지표

| 항목                  | 측정값       |
|-----------------------|--------------|
| 요청 수               | 10개          |
| 전송 크기 (Transferred) | `187 kB`      |
| DOMContentLoaded      | `164 ms`     |
| Load 완료             | `189 ms`     |
| 총 완료 시간 (Finish) | `205 ms`     |

> 💡 CloudFront에서는 `/` 요청 시 브라우저가 명시적인 `index.html`로 리디렉션되며 `document / redirect` 요청이 한 번 더 발생하므로, **요청 수가 1개 더 많은 10개로 나타남**.

### 🔍 주요 리소스 용량

| 리소스 유형 | 대표 용량 |
|-------------|------------|
| JS Chunk    | 50.5KB, 42.3KB, 0.8KB |
| Font        | 28.7KB, 31.7KB |
| CSS         | 2.6KB |
| Document    | 2.4KB |
| Favicon     | 26.3KB |
| Redirect    | 0.0KB (상단 HTML 리디렉션)

<br />

## ✅ 결론

- **CloudFront가 모든 측정 지표에서 우수한 성능**을 보여줌
- 전송 크기(Transferred)는 S3 대비 **59% 감소**
- DOMContentLoaded는 약 **60% 이상 개선**
- CloudFront의 Gzip/Brotli 압축, 캐시, TLS 최적화가 성능 향상에 기여
