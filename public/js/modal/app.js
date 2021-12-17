const $modalForm = document.querySelector('.modal-form');
const $modalWrap = document.querySelector('.modal-wrap');
const $textInput = document.querySelector('.text-input');
const $toggleBtn = document.querySelector('.toggle-btn');
const $assignee = document.querySelector('.assignee');

// schedules를 store에서 가져와야됨
const generateId = () => Math.max(...schedules.map(schedule => schedule.id), 0) + 1;
const filterValue = (event, identifier) => [...event.target.children].filter(node => node.name === identifier)[0].value; // 팝업창의 인풋 값 가져오기

// store 데이터, 서버 데이터 업데이트할 playload 객체
const getSchedule = e => ({
  id: generateId(),
  content: filterValue(e, 'content'),
  assignee: filterValue(e, 'assignee'),
  startDay: filterValue(e, 'start'),
  endDay: filterValue(e, 'end'),
  status: 0,
  completed: false,
});

// 모달 팝업 화면 close
const modalClose = () => {
  $modalWrap.style.display = 'none';
};

// 모달 팝업 화면 open → 드래그가 끝나는 시점?
$toggleBtn.addEventListener('click', () => {
  $modalWrap.style.display = 'block';
  $textInput.value = '';
  $assignee.value = '';
});

// 모달 팝업 화면 close 방법(부모 화면 클릭 or x 버튼 누르기)
$modalWrap.addEventListener('click', e => {
  if (e.target.matches('.bx') || e.target.matches('.modal-overlay')) {
    modalClose();
  }
});

// 모달 팝업 화면에서 submit 버튼을 누르면 부모 화면에 리턴값을 출력합니다. (캘린더 완성 이후 수정 계획)
$modalForm.addEventListener('submit', e => {
  e.preventDefault();
  const payload = getSchedule(e);

  // store.addSchedules(payload);
  modalClose();
});
