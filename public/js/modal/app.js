const $modalForm = document.querySelector('.modal-form');
const $modalWrap = document.querySelector('.modal-wrap');
const $textInput = document.querySelector('.text-input');
const $toggleBtn = document.querySelector('.toggle-btn');
const $assignee = document.querySelector('.assignee');
const $startDay = document.querySelector('.start-day');
const $endDay = document.querySelector('.end-day');

const schedules = [
  {
    id: 1,
    content: 'HTML',
    assignee: '홍정민',
    startDay: new Date(2021, 11, 13),
    endDay: new Date(2021, 11, 20),
    status: 0, // 2
    completed: false, // true
  },
  {
    id: 2,
    content: 'Javascript',
    assignee: '손영산',
    startDay: new Date(2021, 11, 7),
    endDay: new Date(2021, 11, 14),
    status: 0,
    completed: false,
  },
  {
    id: 3,
    content: 'CSS',
    assignee: '이희승',
    startDay: new Date(2021, 11, 1),
    endDay: new Date(2021, 11, 8),
    status: 1,
    completed: false,
  },
  {
    id: 4,
    content: 'React',
    assignee: '이유나',
    startDay: new Date(2021, 11, 20),
    endDay: new Date(2021, 11, 23),
    status: 1,
    completed: false,
  },
  {
    id: 5,
    content: 'Vue',
    assignee: '유지현',
    startDay: new Date(2021, 11, 14),
    endDay: new Date(2021, 11, 15),
    status: 2,
    completed: false,
  },
];

const COLOR = [
  '#9775FA',
  '#D25565',
  '#F06595',
  '#FFA94D',
  '#495057',
  '#A9E34B',
  '#74C0FC',
  '#63E6BE',
  '#4D638C',
  '#0056B0',
  '#6B3F2F',
  '#CC38AC',
  '#3355DB',
  '#502F21',
  '#870D47',
  '#1F47A3',
  '#33A7B4',
  '#7EA0C5',
  '#FE4D01',
  '#FED235',
  '#73D54A',
  '#D5D656',
  '#3FA9F5',
  '#fe9e16',
  '#bb80d2',
  '#6BC9BB',
  '#07AA85',
];

const pickColor = () => COLOR[Math.floor(Math.random() * COLOR.length)];
const generateId = () => Math.max(...schedules.map(schedule => schedule.id), 0) + 1;
const filterValue = (event, identifier) => [...event.target.children].filter(node => node.name === identifier)[0].value; // 팝업창의 인풋 값 가져오기

// store 데이터, 서버 데이터 업데이트할 playload 객체
const getPayload = e => ({
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

let start = 6;
let end = 9;

// 캘린더에 타임블럭스 지정
const timeBlock = () => {
  const start = new Date($startDay.value).getDate();
  const end = new Date($endDay.value).getDate();
  const duration = [...document.querySelector('.grid').children].slice(start - 1, end);
  const background = pickColor();
  const siblings = new Array(duration.length).fill(0);
  let siblingNumber = 0;

  duration.forEach((cell, idx) => {
    siblings[idx] = cell.children.length;
  });

  siblingNumber = Math.max(...siblings, 0);

  const turn = siblings.map(sibling => siblingNumber - sibling);

  duration.forEach((cell, idx) => {
    const div = document.createElement('div');

    if (idx === 0) div.textContent = `${$textInput.value}`; // 일정 글씨
    if (idx === 0) div.style.borderRadius = '7px 0 0 7px';
    if (idx === duration.length - 1) div.style.borderRadius = '0 7px 7px 0';

    div.classList.add('timeline');
    div.style.background = background;
    div.style.top = `${turn[idx] * 25}px`;

    cell.appendChild(div);
  });
};

// 모달 팝업 화면 open → 드래그가 끝나는 시점?
$toggleBtn.addEventListener('click', () => {
  $modalWrap.style.display = 'block';
  // $startDay.value = getStartDate();
  // $endtDay.value = getEndDate();
  $startDay.value = new Date(2021, 11, start);
  $endDay.value = new Date(2021, 11, end);
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
  timeBlock();
  const payload = getPayload(e);

  start++;
  end++;
  // store.addSchedules(payload);
  modalClose();
});
