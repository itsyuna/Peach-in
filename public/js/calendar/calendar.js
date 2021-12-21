const $calendarGrid = document.querySelector('.calendar-grid');
const $prevBtn = document.querySelector('.prev-btn');
const $nextBtn = document.querySelector('.next-btn');
const $month = document.querySelector('.this-month');
const $year = document.querySelector('.this-year');

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

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

$month.innerText = MONTH_NAMES[currentMonth];
$year.innerText = currentYear;

const renderDates = (year, month) => {
  $calendarGrid.innerHTML = `<div class="days-grid">${DAY_NAMES.map(v => `<div>${v}</div>`).join('')}</div>`;

  const $dateGrid = document.createElement('div');
  $dateGrid.classList.add('date-grid');
  $calendarGrid.appendChild($dateGrid);

  // 이번달 1일 day index
  const getFirstDay = new Date(year, month, 1).getDay();

  // 이번달 마지막일 day index
  const getLastDay = new Date(year, month + 1, 0).getDay();

  // 이번달 마지막 date
  const lastDateOfThisMonth = new Date(year, month + 1, 0).getDate();

  // 저번달 마지막 date
  const lastDateOfLastMonth = new Date(year, month, 0).getDate();

  // dataset
  // 저번달 dates
  for (let i = 1; i <= getFirstDay; i++) {
    const YEAR = `${month - 1 === -1 ? year - 1 : year}`;
    const MONTH = `${month - 1 === -1 ? '12' : month < 10 ? '0' + month : month}`;
    const DATE = `${lastDateOfLastMonth - getFirstDay + i}`;

    $dateGrid.innerHTML += `
    <div data-date="${YEAR}-${MONTH}-${DATE}" data-isvisited="0" class="prev-month">
      ${DATE}
    </div>`;
  }

  // 이번달 dates
  for (let i = 1; i <= lastDateOfThisMonth; i++) {
    const YEAR = year;
    const MONTH = `${month + 1 < 10 ? '0' + (month + 1) : month + 1}`;
    const DATE = `${i < 10 ? '0' + i : i}`;

    const formattedDate = new Date(today.getTime() + 9 * 60 * 60000).toISOString().slice(0, 10);

    $dateGrid.innerHTML += `
    <div data-date="${year}-${MONTH}-${DATE}" data-isvisited="0" class="${
      `${YEAR}-${MONTH}-${DATE}` === formattedDate ? 'today' : 'dates'
    }">${i}</div>`;
  }

  // 다음달 dates
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
  const JANUARY = 0;
  const DECEMBER = 11;

  // prev-btn
  $prevBtn.addEventListener('click', () => {
    if (currentMonth === JANUARY) {
      currentMonth = DECEMBER;
      currentYear--;
    } else {
      currentMonth--;
    }
    renderDates(currentYear, currentMonth);
    $month.innerText = MONTH_NAMES[currentMonth];
    $year.innerText = currentYear;
  });

  // next-btn
  $nextBtn.addEventListener('click', () => {
    if (currentMonth === DECEMBER) {
      currentMonth = JANUARY;
      currentYear++;
    } else {
      currentMonth++;
    }
    renderDates(currentYear, currentMonth);

    $month.innerText = MONTH_NAMES[currentMonth];
    $year.innerText = currentYear;
  });
};

const renderCalendar = () => {
  prevNextArrows();
  renderDates(currentYear, currentMonth);
};

export default renderCalendar();