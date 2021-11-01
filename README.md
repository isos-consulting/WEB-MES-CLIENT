[작성자: 윤보라]
[마지막 작성일자: 2021-07-02]
[문서버전: v0.0.2]



**** 이슈 ****
1. 이분할 화면은 템플릿 작업 진행중이라 1분할 화면만 작업할수 있음
2. ts에서 this 사용하면 오류나는 현상 아직 안고침
3. side-navbar 사용하면 key에러로그가 발생하는데 아직 안고침



* * *
📦[프로젝트 아키텍처]
client/
├─── node_modules/
├─── public/
├─── src/
     ├─── components/
          ├─── pages/
               ├─── adm/
               ├─── aut/
               ├─── inv/
               ├─── mat/
                    ├─── income-history.page.tsx
                    ├─── order.page.tsx
                    └─── index.ts
               ├─── out/
               ├─── prd/
               ├─── qms/
               ├─── sal/
               └─── std/
          ├─── templates/
               ├─── grid-double/
                    ├─── grid-double.template.tsx
                    └─── index.ts
               ├─── grid-single/
               ├─── login/
               ├─── monitoring/
               └─── ...
          ├─── UI/
               ├─── button/
                    ├─── button.ui.interface.ts
                    ├─── button.ui.styled.tsx
                    ├─── button.ui.tsx
                    └─── index.ts
               ├─── button-group/
               ├─── checkbox/
               ├─── checkbox-group/
               ├─── combobox/
               ├─── input-ui-groupbox/
               ├─── container
               └─── ...
     ├─── fonts/
     ├─── functions/
     ├─── hooks/
     ├─── images/
     ├─── recoils/
     ├─── styles/
     ├─── app.tsx
     ├─── index.tsx
     └─── ...
└─── ...



* * *
❗📦[parcel 번들러 사용시 유의사항]
1. 해당 프로젝트를 parcel 1버전을 사용합니다.

2. parcel에선 절대경로 설정을 지원하지 않기 때문에 별도로 babel에서 설정해야 합니다.
     설정하는 법 --- 1. tsconfig.json 파일을 열고 baseUrl과 path항목을 수정합니다.
                         {
                              ...
                              "baseUrl": "./src", //기준이 되는 위치
                              "paths": { //import alias 정의
                                   "~/*": ["./*"],
                                   "~components/*": ["./components/*"],
                                   "~recoils/*": ["./recoils/*"],
                                   "~styles/*": ["./styles/*"],
                                   "~images/*": ["./images/*"]
                              },
                              ...
                         }
                     2. babel-plugin-root-import 모듈을 설치합니다. (yarn add -D babel-plugin-root-import)
                     3. root에 .babelrc 파일에서(없으면 새파일로 만들면 됨) 아래 내용을 plugins항목안에 붙여넣습니다.
                        (rootPathSuffix = 기존경로, rootPathPrefix = 치환될 경로명)
                         {
                              ...

                              "plugins": [
                              ...

                                   ["babel-plugin-root-import", {"paths":[{
                                        "rootPathSuffix": "./src",
                                        "rootPathPrefix": "~/"
                                   }, {
                                        "rootPathSuffix": "./src/components",
                                        "rootPathPrefix": "~components/"
                                   }, {
                                        "rootPathSuffix": "./src/recoils",
                                        "rootPathPrefix": "~recoils/"
                                   }, {
                                        "rootPathSuffix": "./src/styles",
                                        "rootPathPrefix": "~styles/"
                                   }, {
                                        "rootPathSuffix": "./src/images",
                                        "rootPathPrefix": "~images/"
                                   }]}],

                                   ...
                              ]
                         }
                     5. .babelrc 파일에서 지정한 경로와 tsconfig에서 지정한 경로가 일치하는지 확인합니다.
                     6. .ts 또는 .tsx 파일을 하나 만들후 import가 잘 되는지 테스트 합니다.
                        (개발환경인 vscode에서는 tsconfig.json 파일 기준으로 설정을 인식하기 때문에 개발환경에서 오류가 생긴다면 tsconfig에서 지정한 경로를 다시 확인해야 합니다.)
                     7. yarn start한 후 import 오류가 나는지 확인합니다.
                        (컴파일에서 발생되는 오류는 .babelrc와 연관있으므로 여기서 지정한 경로를 다시 확인해야 합니다.)

3. parcel에서 sass, scss 를 object형식으로 import하기 위해선 추가적인 설정이 더 필요합니다.
     설정하는 법 --- 1. 아래의 패키지 모듈을 기입된 버전으로 설치합니다.
                         {
                              "autoprefixer": "^9.8.6",
                              "postcss-modules": "^3.2.2",
                              "sass": 버전 상관無,
                         }
                     2. root에 .postcssrc파일에 아래와 같은 내용을 작성합니다.
                         {
                              "modules": true,
                              "plugins": {
                                   "autoprefixer": {
                                        "grid": true
                                   }
                              }
                         }
                     3. yarn start를 한 후 콘솔에 postcss관련 오류가 발생하는지, object처럼 사용하는 스타일 속성들이 제대로 적용되는지 확인합니다.




* * *
📂[폴더 네이밍 규칙]
1.src폴더의 바로 하위 폴더는 큰 기능 단위(그룹)로만 생성한다. (예시: component를 모아두는 폴더 => components, image를 모아두는 폴더 => images, ... 등등)
2.상세 폴더는 상세한 기능의 명칭 또는 라우팅의 이름 단위로 생성한다. (예시: component > pages > std,
                                                                            component > templates > login > ...)
3.그룹형 폴더를 만들때는 복수형으로 지정한다. (예시: hooks, functions, components, pages ... 등등)




* * *
📄[파일 네이밍 규칙]
1.파일 이름의 각 파트 구분자는 마침표를 사용한다.
2.파일명의 파트는 아래와 같은 순서로 구성된다.
  -명칭(파일의 고유 이름)
  -기능단위 (예를들면 UI, page, template, hook, ... 등등)
  -유형의 속성(해당 파일의 역할)
  -확장자
3.파일명의 파트는 기능 단위까지만 들어갈수도 있다. (예시: color.style.scss, atom-family.recoil.ts)
4.파일 명칭은 스네이크 케이스 형식으로 작성한다. (예시: date-picker, grid-double, checkbox-group)

파일 네이밍 예시) my-component.ui.interface.ts
                  my-colors.style.ts




* * *
🔧[변수 & 함수 네이밍 규칙]
1. 컴포넌트(UI, page, template 같은 HTMLElement 형식)는 파스칼케이스 형식으로 작성한다. (예시: MyComopnent)
2. 일반 변수 및 함수는 카멜케이스 형식으로 작성한다. (예시: myConst, myFunction, myValInfo)
3. enum형식의 상수는 어퍼케이스 형식으로 작성한다. (예시: MY_TYPES)
4. 컴포넌트, 함수, 변수 등의 이름을 붙일때 넘버링은 하지 않는다. (예시: myFunction2, variableType1, variableType2)
5. 컴포넌트(UI제외) 유형의 함수와 type, interface 유형의 클래스는 명칭앞에 구분자가 붙는다.
  -인터페이스: I
  -타입: T
  -페이지: Pg
  -템플릿: Tp
  -스타일드컴포넌트: Sc

  구분 적용예시) IMyProps, TMyType, PgMypage, TpMyTemplate, ScMyStyledComponent

6. 변수 중에서 특수한 변수의 이름 앞에는 구분자가 붙는다.
   (recoil처럼 하나의 파일 안에서만이 아닌 공통적으로 쓰이는 유형의 변수라 일반 변수와의 구분이 필요한 경우)
  -recoil atom: at
  -recoil atomFamily: af
  -recoil selector: sl
  -recoil selectorFamily: sf

  구분 적용예시) atTodo, slTodoInfo, ...




* * *
💡[코드스니펫]
1. 스니펫 설정 파일은 ./snitppets 안에 들어있습니다.
2. 스니펫 적용하는 법 --- 1. vscode 왼쪽 상단 File > Preferences > User Snippets 선택후 typescriptreact를 선택합니다.
                          2. 설정 파일이 열리면 ./snippets/typescriptreact.json의 내용을 설정 파일에 덮어씌웁니다.
                          3. tsx파일 안에서 isos를 타이핑한 후 코드가 자동완성이 되는지 확인합니다.




* * *
🌵[권한 적용법]
1. getPermissions(title) 함수를 써서 해당 페이지에 적용될 권한 상태 값을 가져올 수 있습니다.
2. 인자 값으로 페이지의 제목을 넣습니다. 페이지의 제목은 getPageName() 함수를 사용하여 가져올 수 있습니다. (아래는 사용 예시)
예시)
     const title = getPageName(); // BOM 관리
     const permissions = getPermissions(title);
     
     console.log(permissions); //   {
                               //        create_at: true,
                               //        update_at: false,
                               //        delete_at: true,
                               //        read_at: true,
                               //   }

3. 위에서 세팅된 permssions 변수를 사용해 아래와 같이 응용하여 권한을 적용합니다.
   (아래는 응용 예시이므로 실제 적용된 방법과 다를 수 있습니다.)
예시)
     ...
     return (
          <Button disabled={!permissons?.delete_at}>삭제</Button>
          <Button disabled={!permissons?.update_at}>수정</Button>
          <Button disabled={!permissons?.create_at}>신규등록</Button>
     )