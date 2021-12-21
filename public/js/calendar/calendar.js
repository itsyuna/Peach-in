import data from '../store/scheduler.js';
import helper from '../modal/helper.js';

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

const dragEvents = (() => {
  let isDragging = false;
  let $dragStartPoint;
  let $dragEndPoint;
  let startDate = null;
  let endDate = null;

  return () => {
    const $dateGrid = document.querySelector('.date-grid');
    $dateGrid.addEventListener('mousedown', e => {
      isDragging = true;
      $dragStartPoint = e.target;
    });

    $dateGrid.addEventListener('mouseover', e => {
      if (!e.target.dataset.id) return;
      if (!isDragging) return;

      [...$dateGrid.children].forEach($date => {
        $date.dataset.isvisited = 0;
      });

      $dragEndPoint = e.target;

      const descending =
        new Date($dragStartPoint.dataset.date).getTime() < new Date($dragEndPoint.dataset.date).getTime();
      startDate = descending ? $dragStartPoint : $dragEndPoint;
      endDate = descending ? $dragEndPoint : $dragStartPoint;

      let currentDate = startDate;
      while (true) {
        currentDate.dataset.isvisited = 1;
        if (currentDate === endDate) break;
        currentDate = currentDate.nextElementSibling;
      }

      [...$dateGrid.children].forEach($date => {
        const selectedDate = 'rgb(250, 250, 210, 0.5)';
        const unselectedDate = 'transparent';
        $date.style.backgroundColor = +$date.dataset.isvisited === 1 ? selectedDate : unselectedDate;
      });
    });

    $dateGrid.addEventListener('mouseup', e => {
      if (!startDate) return;
      isDragging = false;
      let $dragStartPoint = null;
      let $dragEndPoint = null;
      let startDate = null;
      let endDate = null;
      /* popup */
      // console.log(startDate.dataset.date);
      // console.log(endDate.dataset.date);
      taskModalOpen(e, startDate.dataset.date, endDate.dataset.date);
    });
  };
})();

const $modalForm = document.querySelector('#modal-form');
const $taskModal = document.querySelector('.task-modal');
const $deleteModal = document.querySelector('.delete-modal');
const $textInput = document.querySelector('.task-input');
const $startDayInput = document.querySelector('.start-day-input');
const $endDayInput = document.querySelector('.end-day-input');
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
function taskModalOpen(start, end) {
  // 스케줄 등록인 경우, 인풋 값을 초기화
  $textInput.value = '';
  $assignee.value = '';
  $startDayInput.value = start;
  $endDayInput.value = end;
  $taskModal.style.display = 'block';
}

// 수정사항 - div
function updateModalOpen(e) {
  // div는 id값 가지고있음
  // store.schedule를 순회하면서 id에 해당하는 객체 뽑기
  // 해당 객체를 value로 넣기

  const currentId = e.target.dataset.id;
  const schedule = data.store.schedules.filter(({ id }) => id === +currentId);

  $textInput.value = schedule[0].content;
  $assignee.value = schedule[0].assignee;
  $startDayInput.value = schedule[0].startDay;
  $endDayInput.value = schedule[0].endDay;

  $taskModal.style.display = 'block';
}

function deleteModalOpen() {
  $deleteModal.style.display = 'block';
}

// $toggleBtn.addEventListener('click', taskModalOpen);

// $updateBtn.addEventListener('click', taskModalOpen);

// $deleteBtn.addEventListener('click', deleteModalOpen);

$taskModal.addEventListener('click', e => {
  modalClose(e);
});

// 수정사항 removeSchedules()의 인자로 id값 넘겨주기
$deleteModal.addEventListener('click', async e => {
  if (e.target.dataset.btn === '삭제') {
    console.log('삭제');
    await data.removeSchedules(e.target.dataset.id);
  }
  modalClose(e);
});

// 수정사항 - if문 안에 e.target.dataset.id, id = e.target.dataset.id
$modalForm.addEventListener('submit', async e => {
  e.preventDefault();
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

// --------------------------------------------------> 타임블록

const COLORS = [
  '#F15F5F',
  '#F29661',
  '#F2CB61',
  '#E5D85C',
  '#BCE55C',
  '#86E57F',
  '#5CD1E5',
  '#6799FF',
  '#6B66FF',
  '#A566FF',
  '#F361DC',
  '#F361A6',
  '#A6A6A6',
  '#8C8C8C',
];

const getCounting = element => {
  const limpidityElementCounting = [];
  element.forEach(childEl => {
    let flag = true;
    let count = 0;

    [...childEl.children].reverse().forEach(block => {
      if (flag && block.style.opacity === '0') count += 1;
      else flag = false;
    });

    limpidityElementCounting.push(count);
  });
  return limpidityElementCounting;
};

const getMin = element => Math.min(...getCounting(element), Infinity);

const removeChildElement = element => {
  const min = getMin(element);
  element.forEach(child => {
    for (let i = 0; i < min; i++) {
      child.removeChild(child.lastChild);
    }
  });
};

const createTimeBlock = (element, { content, assignee, startDay, endDay, id }) => {
  let flag = false;
  element.forEach(childEl => {
    const timeBlock = document.createElement('div');
    if (startDay === childEl.dataset.date) flag = true;

    if (flag) {
      timeBlock.classList.add('timeblock');
      timeBlock.classList.add('tooltip');
      timeBlock.style.opacity = 1;
      timeBlock.style.height = '20px';
      timeBlock.dataset.id = id;
      timeBlock.style.background = COLORS[id % COLORS.length];
      timeBlock.innerHTML = `<div class="tooltip-text">   
                <div class="task-info">
                    <div class="task-row">
                      <span class="task-cell icon-col"><i class="bx bx-pencil"></i></span>
                      <span class="task-cell head-col">${content}</span>
                    </div>
                    <div class="task-row">
                      <span class="task-cell icon-col"
                        ><i class="bx bx-calendar-alt"></i
                      ></span>
                      <span class="task-cell text-col">${startDay} ~ ${endDay}</span>
                    </div>
                    <div class="task-row">
                      <span class="task-cell icon-col"><i class="bx bx-user"></i></span>
                      <span class="task-cell text-col">${assignee}</span>
                    </div>
                  </div>   
                </div>`;
    } else {
      timeBlock.style.opacity = 0;
      timeBlock.style.height = '20px';
    }

    if (endDay === childEl.dataset.date) {
      flag = false;
      const closeIcon = document.createElement('i');
      closeIcon.classList.add('bx');
      closeIcon.classList.add('bx-trash');
      closeIcon.style.color = 'grey';

      timeBlock.appendChild(closeIcon);
      timeBlock.style.display = 'flex';
      timeBlock.style.alignItems = 'center';
      timeBlock.style.justifyContent = 'right';
    }

    childEl.appendChild(timeBlock);
  });
};

const createLimpidityBlock = element => {
  const min = getMin(element);
  element.forEach(childEl => {
    for (let i = 0; i < min; i++) {
      const limpidityBlock = document.createElement('div');

      limpidityBlock.style.opacity = 0;
      limpidityBlock.style.height = '20px';

      childEl.appendChild(limpidityBlock);
    }
  });
};

const getTimeBlockRange = (element, { startDay, endDay }) => {
  let start;
  let end;

  element.forEach((childEl, idx) => {
    if (startDay === childEl.dataset.date) start = idx;
    if (endDay === childEl.dataset.date) end = idx + 1;
  });

  return [...element].slice(start, end);
};

const removePreviousBlock = element => {
  element.forEach(childEl => {
    [...childEl.children].forEach(timeBlock => {
      timeBlock.remove();
    });
  });
};

const paintTimeBlock = (element, schedules) => {
  schedules.forEach(schedule => {
    const timeBlockRange = getTimeBlockRange(element, schedule);

    removeChildElement(timeBlockRange);
    createTimeBlock(element, schedule);
    createLimpidityBlock(timeBlockRange);
  });
};

const renderTimeBlock = () => {
  const $dates = document.querySelectorAll('.date-grid > div');

  removePreviousBlock($dates);
  paintTimeBlock($dates, data.store.schedules);
  removeChildElement($dates);
};

function timeBlockEvents() {
  document.querySelectorAll('.timeblock').forEach(timeblock =>
    timeblock.addEventListener('dblclick', e => {
      if (!e.target.classList.contains('timeblock')) return;
      updateModalOpen(e);
    })
  );
}

function deleteTimeBlock() {
  document.querySelectorAll('.bx-trash').forEach(icon =>
    icon.addEventListener('click', e => {
      if (!e.target.classList.contains('bx-trash')) return;
      console.log(e);
      deleteModalOpen();
    })
  );
}

const renderCalendar = async () => {
  await data.fetchSchedules();
  prevNextArrows();
  renderDates(currentYear, currentMonth);
  dragEvents();
  renderTimeBlock();
  timeBlockEvents();
  deleteTimeBlock();
};

renderCalendar();
