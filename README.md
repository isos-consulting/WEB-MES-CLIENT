# Documents
스마트 팩토리 생산 관리 시스템의 관리자 페이지입니다

## Develop
웹 애플리케이션을 시작하려면 이 명령어를 실행해주세요
```
yarn start
```

API 통신을 하기 위한 API 서버 주소를 변경하기를 원한다면 아래 2가지 방법 중 하나를 선택하세요  
> <p style="color: red">✔주의</p> 
> Git 원격 저장소에는 아래 변경한 내용이 반영될 경우 문제가 발생할 수 있습니다. develop 혹은 master 브랜치에 병합할 때는 아래 변경했던 내용을 되돌려주세요!
- .evn 파일 파일에서 VITE_BASE_URL의 값을 변경합니다
```
// .env
VITE_BASE_URL="여기에 변경하고자 하는 API URL을 입력해주세요"
```
- comm.function.ts 파일의 baseURL 변수의 값을 변경합니다
```ts
// comm.function.ts
const baseURL = "여기에 변경하고자 하는 API URL을 입력해주세요"
```

단위 테스트 도구는 `Jest`를 사용합니다. 이 명령어를 실행해주세요
```bash
yarn test
혹은
yarn test:watch
```

종단간 테스트 도구는 `playwright`를 사용합니다. 이 명령어를 실행해주세요
```bash
yarn e2e:test
혹은
yarn e2e:codegen-dev
```

## Git 원격 저장소에 반영
소스 코드를 git 원격 저장소에 반영하기 전 아래 명령어를 실행하여 정상 작동하는지 확인해주세요
```sh
yarn tsc
```

## 코드스니펫
- 코드 스니펫을 적용하려면 아래 방법을 따라해주세요
- [File > Preferences > User Snippets > typescriptreact]을 선택합니다
- ./snippets/typescriptreact.json의 내용을 설정 파일에 덮어씌웁니다
- tsx파일 안에서 isos를 타이핑한 후 코드가 자동완성이 되는지 확인합니다

## 페이지 별 권한
- getPermissions(title) 함수를 써서 해당 페이지에 적용될 권한 상태 값을 가져올 수 있습니다
- 인자 값으로 페이지의 제목을 넣습니다, 페이지의 제목은 getPageName() 함수를 사용하여 가져올 수 있습니다
- permissions 변수를 사용해 아래와 같이 응용하여 권한을 적용합니다
  (permission 변수는 페이지별 궎나 적용 코드 예시를 참고해주세요)
### 페이지별 권한 적용 코드 예시
```tsx
const title = getPageName(); // BOM 관리
const permissions = getPermissions(title);
     
console.log(permissions); // {
                          //      create_at: true,
                          //      update_at: false,
                          //      delete_at: true,
                          //      read_at: true,
                          // }

return (
     <Button disabled={!permissions?.delete_at}>삭제</Button>
     <Button disabled={!permissions?.update_at}>수정</Button>
     <Button disabled={!permissions?.create_at}>신규등록</Button>
)
```

## 개선 목록
앞으로 이 프로젝트를 개선하기 위해 진행할 개선 목록입니다.

### 코드 품질 개선
- [ ] [#46](https://github.com/isos-consulting/WEB-MES-CLIENT/issues/46) react typescript 의존성 추가
- [ ] [#47](https://github.com/isos-consulting/WEB-MES-CLIENT/issues/47) CUD API를 요청하는 공통 함수를 사용하지 않도록 변경
- [ ] [#48](https://github.com/isos-consulting/WEB-MES-CLIENT/issues/48) template 화면의 커스터마이즈를 유연하게 할 수 있도록 변경

### 사용자 경험 개선
- [ ] [#49](https://github.com/isos-consulting/WEB-MES-CLIENT/issues/49) 데이터 조회 속도 최적화
- [ ] [#50](https://github.com/isos-consulting/WEB-MES-CLIENT/issues/50) 사용자가 선택한 행의 포커스를 유지할 수 있게 변경
- [ ] [#51](https://github.com/isos-consulting/WEB-MES-CLIENT/issues/51) 사용자 매뉴얼 추가
- [ ] [#52](https://github.com/isos-consulting/WEB-MES-CLIENT/issues/52) 데이터 등록할 때 필수 조건에 대한 설정을 편리하게 할 수 있도록 변경 수 있도록 변경
- [ ] [#53](https://github.com/isos-consulting/WEB-MES-CLIENT/issues/53) 한 화면에서 데이터 생성, 수정을 처리할 수 있게 변경
- [ ] [#54](https://github.com/isos-consulting/WEB-MES-CLIENT/issues/54) 메뉴 클릭시 화면 전환이 아닌 탭을 추가하는 방식으로 변경
