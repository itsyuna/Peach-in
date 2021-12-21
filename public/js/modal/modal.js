import data from '../store/scheduler.js';
import helper from './helper.js';

const $modalForm = document.querySelector('#modal-form');
const $taskModal = document.querySelector('.task-modal');
const $deleteModal = document.querySelector('.delete-modal');
const $textInput = document.querySelector('.task-input');
const $startDayInput = document.querySelector('.start-day-input');
const $endDayInput = document.querySelector('end-day-input');
const $toggleBtn = document.querySelector('.toggle-btn');
const $updateBtn = document.querySelector('.update-btn');
const $deleteBtn = document.querySelector('.delete-btn');
const $assignee = document.querySelector('.assignee-input');

const modalClose = e => {
  if (e.target.parentNode.classList.contains('task-modal')) $taskModal.style.display = 'none';
  if (e.target.parentNode.classList.contains('delete-modal')) $deleteModal.style.display = 'none';
  if (e.target.dataset.btn === '삭제모달닫기' || e.target.dataset.btn === '삭제모달취소')
    $deleteModal.style.display = 'none';
  if (e.target.dataset.btn === '모달닫기' || e.target.dataset.btn === '모달취소') $taskModal.style.display = 'none';
};

// 수정사항 - 달력에서 드래그한 범위의 start와 end 값 가져오기
const taskModalOpen = e => {
  if (e.target.dataset.btn === '등록') {
    // 스케줄 등록인 경우, 인풋 값을 초기화
    $textInput.value = '';
    $assignee.value = '';
    // start.value
    // end.value
  }
  $taskModal.style.display = 'block';
};

// 수정사항 - div
const updateModalOpen = e => {
  // div는 id값 가지고있음
  // store.schedule를 순회하면서 id에 해당하는 객체 뽑기
  // 해당 객체를 value로 넣기
  const currentId = e.target.dataset.id;
  const schedule = data.store.schedules.filter(({ id }) => id === currentId);

  $textInput.value = schedule.content;
  $assignee.value = schedule.assignee;
  $startDayInput.value = schedule.start;
  $endDayInput.value = schedule.end;

  $taskModal.style.display = 'block';
};

const deleteModalOpen = () => {
  $deleteModal.style.display = 'block';
};

$toggleBtn.addEventListener('click', taskModalOpen);

$updateBtn.addEventListener('click', taskModalOpen);

$deleteBtn.addEventListener('click', deleteModalOpen);

$taskModal.addEventListener('click', e => {
  modalClose(e);
});

// 수정사항 removeSchedules()의 인자로 id값 넘겨주기
$deleteModal.addEventListener('click', async e => {
  await data.fetchSchedules();
  if (e.target.dataset.btn === '삭제') await data.removeSchedules(1);
  modalClose(e);
});

// 수정사항 - if문 안에 e.target.dataset.id, id = e.target.dataset.id
$modalForm.addEventListener('submit', async e => {
  e.preventDefault();
  await data.fetchSchedules();
  if (true) {
    const id = 2;
    const newSchedule = { ...helper.getSchedule(e), id };
    await data.updateSchedules(id, newSchedule);
  } else {
    const newSchedule = helper.getSchedule(e);
    await data.addSchedules(newSchedule);
  }
  $taskModal.style.display = 'none';
});
