[PAGE]
1. 폴더명이 변경되었음 (ex: basic => std), B/E와 명칭을 통일시킴
2. 파일명이 변경되었음 (ex: PgEmp.tsx => emp.page.tsx), 변경된 명칭에 대한 규칙은 README.md파일을 참고바람
3. gridStateHook => useGridState로 명칭 변경됨
4. popupStateHook => usePopupState로 명칭 변경됨
5. 페이지내에 'pageState'라는 페이지 데이터나 액션을 다루는 함수가 새로 추가되었음, 페이지 작업할때 반드시 사용해야함
6. pageState는 현재 useSingleGridPageState()와 useDoubleGridPageState() 두 종류가 있음 (1분할 그리드용, 2분할 그리드용)
   각각 화면에 맞는 함수를 쓰면됨
7. pageState를 선언할때 변수의 순서가 안맞으면 에러가 나기 때문에 선언 순서를 뒤로 맞춰줘야함 (dept.page.tsx 파일의 변수,함수 선언 순서 참고)
8. 특별한 경우가 아니라면 이전처럼 이벤트를 일일히 써줄 필요가 없지만 다르게 동작해야 되는 경우라면 템플릿에 해당 이벤트를 이전처럼 직접 작성해서 넣어줘야함
9. subUrl => uriPath로 명칭 변경됨
10. ❗❗poupable 옵션이 제거됨, format:'popup'으로 써서 사용할 것 (수정 가능하게 하려면 editable:true도 같이 사용)❗❗
11. ❗❗템플릿에 값을 넘길때, editGrid=true를 넘기지 않으면 수정버튼들이 활성화 되지 않음❗❗



[SCSS]
1. 이제 SCSS import했다고 오류가 나진 않을거임 (대신 ctrl+LClick으로 해당 파일 이동이 안됨;)



[STYLED_COMPONENT]
1. UI > 해당컴포넌트폴더 > 컴포넌트명.ui.styled.tsx 로 명칭 변경함
2. const Base___ = () => {}   <<이런 함수가 있을텐데(ex: button) 예전 프로젝트에서 콘솔을 보면 btnType, colorType등의 커스텀 속성을 사용했을때 에러 로그가 뜨는 현상을 보았을건데, 그걸 방지하기 위한 컴포넌트임
   애초에 이전에 그런 에러가 발생하던 이유는, antd lib에서 사용하는 button에는 위에서 말한 속성이 존재하지 않는데 해당 속성을 삽입했기 때문임
   그래서 antd에서 사용중인 속성과, 새로 추가한 속성을 모두 갖고있는 컴포넌트를 만들어서 그 컴포넌트에 스타일을 씌운후 해당 컴포넌트를 사용함으로서 에러가 없어진것
   여튼 신규 추가된 속성이 있다? => base컴포넌트를 만들어서 에러를 발생시키지 않을 것! <<이게 중요



[SIDE_BAR]
1. ❗❗사이드바의 메뉴를 추가하려면 side-navbar.ui.model.ts << 여기 파일에서 추가하면됨 (데이터를 올바르게 추가시키면 알아서 뚝딱 생기게 바꿈)❗❗
2. ❗❗컴포넌트명도 제대로 써서 해서 메뉴는 추가됐는데 메뉴 들어가면 페이지가 안나온다?
   => 1. 해당 페이지파일의 컴포넌트를 export했는지 확인
      2. page > index.ts 파일에도 export했는지 확인