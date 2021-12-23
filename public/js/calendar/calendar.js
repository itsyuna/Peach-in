import state from './state.js';
import timeblock from './timeblock.js';
import dragevent from './dragevent.js';

const $calendarGrid = document.querySelector('.calendar-grid');

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const today = new Date();

state.currentDate.month = today.getMonth();
state.currentDate.year = today.getFullYear();

const renderDates = () => {
  const { year } = state.currentDate;
  const { month } = state.currentDate;

  document.querySelector('.this-month').innerText = MONTH_NAMES[state.currentDate.month];
  document.querySelector('.this-year').innerText = state.currentDate.year;
  $calendarGrid.innerHTML = `
  <div class="days-grid">
    ${DAY_NAMES.map(dayName => `<div>${dayName}</div>`).join('')}</div>`;

  const $dateGrid = document.createElement('div');
  $dateGrid.classList.add('date-grid');
  $calendarGrid.appendChild($dateGrid);

  const getFirstDay = new Date(year, month, 1).getDay();
  const getLastDay = new Date(year, month + 1, 0).getDay();
  const lastDateOfThisMonth = new Date(year, month + 1, 0).getDate();
  const lastDateOfLastMonth = new Date(year, month, 0).getDate();

  for (let i = 1; i <= getFirstDay; i++) {
    const YEAR = `${month - 1 === -1 ? year - 1 : year}`;
    const MONTH = `${month - 1 === -1 ? '12' : month < 10 ? '0' + month : month}`;
    const DATE = `${lastDateOfLastMonth - getFirstDay + i}`;

    $dateGrid.innerHTML += `
    <div data-date="${YEAR}-${MONTH}-${DATE}" data-isvisited="0" class="prev-month">
      ${DATE}
    </div>`;
  }

  for (let i = 1; i <= lastDateOfThisMonth; i++) {
    const YEAR = year;
    const MONTH = `${month + 1 < 10 ? '0' + (month + 1) : month + 1}`;
    const DATE = `${i < 10 ? '0' + i : i}`;

    const formattedDate = new Date(today.getTime() + 9 * 60 * 60000).toISOString().slice(0, 10);

    $dateGrid.innerHTML += `
    <div data-date="${year}-${MONTH}-${DATE}" data-isvisited="0" 
    class="${`${YEAR}-${MONTH}-${DATE}` === formattedDate ? 'today' : 'dates'}">${i}</div>`;
  }

  for (let i = 1; i <= 13 - getLastDay; i++) {
    const YEAR = `${month + 2 === 13 ? year + 1 : year}`;
    const MONTH = `${month + 2 === 13 ? '01' : month + 2 < 10 ? '0' + (month + 2) : month + 2}`;
    const DATE = `${'0' + i}`;

    $dateGrid.innerHTML += `
    <div data-date="${YEAR}-${MONTH}-${DATE}" data-isvisited="0" class="next-month">${i} 
    </div>`;
  }
};

const prevNextArrows = () => {
  const JANUARY_NUM = 0;
  const DECEMBER_NUM = 11;

  document.querySelector('.prev-btn').addEventListener('click', () => {
    if (state.currentDate.month === JANUARY_NUM) {
      state.currentDate.month = DECEMBER_NUM;
      state.currentDate.year -= 1;
    } else {
      state.currentDate.month -= 1;
    }
    renderDates();
    timeblock.render();
    dragevent.dragEvents();
  });

  document.querySelector('.next-btn').addEventListener('click', () => {
    if (state.currentDate.month === DECEMBER_NUM) {
      state.currentDate.month = JANUARY_NUM;
      state.currentDate.year += 1;
    } else {
      state.currentDate.month += 1;
    }
    renderDates();
    timeblock.render();
    dragevent.dragEvents();
  });
};

const render = () => {
  renderDates();
  prevNextArrows();
};

export default { render };
