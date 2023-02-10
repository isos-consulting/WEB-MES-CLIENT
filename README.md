# Documents
스마트 팩토리 사업을 위한 생산 관리 시스템 관리자 페이지입니다

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

## 애플리케이션 개발 워크 플로
![image](https://user-images.githubusercontent.com/49608580/217984502-2ddbbbe7-8675-4813-90cc-85ef44a9d08e.png)


## 코드스니펫
- 코드 스니펫을 적용하려면 아래 방법을 따라해주세요
- [File > Preferences > User Snippets > typescriptreact]을 선택합니다
- ./snippets/typescriptreact.json의 내용을 설정 파일에 덮어씌웁니다
- tsx파일 안에서 isos를 타이핑한 후 코드가 자동완성이 되는지 확인합니다

## 페이지 별 권한
- getPermissions(title) 함수를 써서 해당 페이지에 적용될 권한 상태 값을 가져올 수 있습니다
- 인자 값으로 페이지의 제목을 넣습니다, 페이지의 제목은 getPageName() 함수를 사용하여 가져올 수 있습니다
- permssions 변수를 사용해 아래와 같이 응용하여 권한을 적용합니다
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
     <Button disabled={!permissons?.delete_at}>삭제</Button>
     <Button disabled={!permissons?.update_at}>수정</Button>
     <Button disabled={!permissons?.create_at}>신규등록</Button>
)
```