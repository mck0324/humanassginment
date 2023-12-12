##
코드 작성시 가장 까다로웠던 부분보다는 테이블 구조를 어떻게 만들지를 가장 고민을 했던거 같습니다.체크리스트 부분이 일단 공통적인 체크리스트 부분이 있으며 개개인마다 추가,삭제,수정 등을 할 수 있다고 하셨기에 user와 checklist로만으로는 구성이 안된다고 생각하여 테이블을 하나 더 만들어서 유저마다 상태(ex)완료,완료취소,삭제,삭제취소 등)를 관리할 수 있게 만들었습니다.
처음에는 user와 checklist로만으로는 구성을 진행 했으나 그렇게하면 관리하기가 너무 어려워지고 checklist가 유저마다 무작정 늘어날것으로 판단을 했으며 그래서 usercheckliststatus테이블로 통합관리를 할 수 있도록 만들었습니다.
또한 GraphQL을 많이 사용해보지 않았기에 Controller로 시작되는것이 아닌 resolover로
시작되는 부분에서 헷갈리는 부분이 있었지만 파라미터 넣는부분만 다를 뿐 크게 다르다고 판단되지 않았기에 첫 Query를 작성하는데 시간이 걸렸지만 익숙해졌습니다.
또한 데이터를 트랜잭션을 이용하여 처리해야하는 기능들이 있었는데 resolver부분에서 trycatch를 이용하여 트랜잭션을 할지service부분에서 trycatch를 이용하여 트랜잭션을 할지 어떤 부분에서 사용해야 가장 효율적인가 생각을 많이 했습니다.
제가 내린 판단은 동시에 일어나야하고 문제가 있을시 롤백을 해야하기에 리졸버에서 트랜잭션을 적용해주는게 좋다고 판달을 했습니다. 

- 프론트 개발자는 앱에서 userSeq 를 header 에 `userSeq: 1` 과 같이 보내 서버에 본인임을 인증을 합니다.라고 명세에 있었기에 header부분에 userseq:1
이런식으로 넣으면 user정보를 확인하며 원하는 기능을 사용할 수 있습니다.

- 유저 본인의 정보 조회
Query:getUser

- 주차별로 체크리스트 조회 (createdAt 을 기준으로 한 pagination 이 필요합니다.)
Query:getWeeksCheckList

- 유저 본인의 정보 수정
Mutation:updateUser

- 완료 체크
Mutation:updateIsCompleteCheckList

- 완료 체크 해제
Mutation:updateIsInCompleteCheckList

- 리스트에 아이템 추가
Mutation:makeCheckList

- 아이템 수정
Mutation:updateCheckListContent

- 아이템 삭제
Mutation:updateIsDeleteCheckList

- 아이템 삭제 취소
Mutation:updateCancelDeleteCheckList

src
  checklist(체크리스트 목록)
    entities(체크리스트 엔티티)
    repository(체크리스트 레파지토리)
    service(체크리스트 서비스 로직처리)
  pagination(페이지네이션)
    dto
  user(유저 정보 관리)
    entities(유저 엔티티)
    graphql(유저 type graphql)
    guard(간단한 회원유무 확인)
    resolver(유저 데이터를 받는 리졸버)
    repository(유저 레파지토리)
    service(유저 서비스 로직처리)
  userchecklist(유저체크리스트 상태 통합관리)
    entities(유저체크리스트 상태 통합관리 엔티티)
    graphql(유저체크리스트 상태 통합관리 type )
    guard(간단한 회원유무 확인)
    resolver(유저체크리스트 상태 통합관리 데이터를 받는 리졸버)
    repository(유저체크리스트 상태 통합관리 레파지토리)
    service(유저체크리스트 상태 통합관리 서비스 로직처리)


##
env구성

.env

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=
DB_PASSWORD=
DB_NAME=

##
npm run start시 seeds파일과 유저1계정이 생성이 됩니다.
회원가입의 로직이 붙고 한다면 굳이 유저1계정을 seed할 필요없이 진행하겠지만 체크리스트 통합 관리를위해 생성하였습니다.