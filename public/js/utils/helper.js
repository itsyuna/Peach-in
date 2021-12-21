import data from '../store/scheduler.js';

const filterValue = (event, identifier) =>
  [...event.querySelectorAll('input')].filter(node => node.name === identifier)[0].value; // 팝업창의 인풋 값 가져오기
const generateId = () => Math.max(...data.store.schedules.map(schedule => schedule.id), 0) + 1;

const getSchedule = e => ({
  id: generateId(),
  content: filterValue(e.target, 'content'),
  assignee: filterValue(e.target, 'assignee'),
  startDay: filterValue(e.target, 'start'),
  endDay: filterValue(e.target, 'end'),
  status: 0,
  completed: false,
});

export default { getSchedule };
