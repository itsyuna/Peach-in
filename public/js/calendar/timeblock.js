import data from '../store/scheduler.js';
import helper from '../utils/helper.js';
import kanban from '../kanban/kanban.js';
import state from './state.js';

let curId;

const $taskModal = document.querySelector('.task-modal');
const $updateModal = document.querySelector('.update-modal');
const $deleteModal = document.querySelector('.delete-modal');
const $textInput = document.querySelector('.task-input');
const $startDayInput = document.querySelector('.start-day-input');
const $endDayInput = document.querySelector('.end-day-input');
const $assignee = document.querySelector('.assignee-input');

const modalClose = async e => {
  $taskModal.style.display = 'none';
  $deleteModal.style.display = 'none';
  $updateModal.style.display = 'none';

  render();
  kanban.renderKan();
};

function updateModalOpen(e) {
  const currentId = e.target.parentNode.dataset.id;
  const schedule = data.store.schedules.filter(({ id }) => id === +currentId);

  $textInput.value = schedule[0].content;
  $assignee.value = schedule[0].assignee;
  $startDayInput.value = schedule[0].startDay;
  $endDayInput.value = schedule[0].endDay;

  $updateModal.style.display = 'block';

  curId = currentId;
}

function deleteModalOpen(e) {
  $deleteModal.style.display = 'block';
  curId = e.target.parentNode.dataset.id;
}

$taskModal.addEventListener('submit', async e => {
  e.preventDefault();
  const newSchedule = { ...helper.getSchedule(e) };
  data.addSchedules(newSchedule);

  modalClose(e);
});

[...document.querySelectorAll('.cancel-btn')].forEach(deleteBtn => {
  deleteBtn.addEventListener('click', e => {
    modalClose(e);
    state.drag.isDragging = false;
  });
});

$updateModal.addEventListener('submit', async e => {
  e.preventDefault();
  const { content, assignee, startDay, endDay } = { ...helper.getSchedule(e) };
  const id = +curId;
  await data.updateSchedules(id, {
    content,
    assignee,
    startDay,
    endDay,
  });
  modalClose(e);
});

$deleteModal.addEventListener('click', async e => {
  if (e.target.dataset.btn === '삭제') {
    await data.removeSchedules(curId);
  }
  modalClose(e);
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

const createTimeBlock = (element, { content, assignee, startDay, endDay, id }, range) => {
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
                <article class="task-info">
                    <section class="task-row">
                      <span class="task-cell icon-col"><i class="bx bx-pencil"></i></span>
                      <span class="task-cell head-col">${content}</span>
                    </section>
                    <section class="task-row">
                      <span class="task-cell icon-col"
                        ><i class="bx bx-calendar-alt"></i
                      ></span>
                      <span class="task-cell text-col">${startDay} ~ ${endDay}</span>
                    </section>
                    <section class="task-row">
                      <span class="task-cell icon-col"><i class="bx bx-user"></i></span>
                      <span class="task-cell text-col">${assignee}</span>
                    </section>
                  </article>   
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

      const editIcon = document.createElement('i');
      editIcon.classList.add('bx');
      editIcon.classList.add('bx-edit-alt');
      editIcon.style.color = 'grey';

      timeBlock.appendChild(editIcon);
      timeBlock.appendChild(closeIcon);

      timeBlock.style.display = 'flex';
      timeBlock.style.alignItems = 'center';
      timeBlock.style.justifyContent = 'right';
    }

    childEl.appendChild(timeBlock);
  });
  const transparentElemNum = [];
  range.forEach($date => {
    let transparentCnt = 0;
    let isTransparent = true;

    const childrenElem = [...$date.children];
    childrenElem.pop();

    childrenElem.reverse().forEach(timeblock => {
      if (isTransparent && !+timeblock.style.opacity) transparentCnt++;
      else isTransparent = false;
    });
    transparentElemNum.push(transparentCnt);
  });

  const REMOVE_NUM = Math.min(...transparentElemNum, Infinity);
  range.forEach($date => {
    const newList = [...$date.children];
    newList.pop();
    newList.reverse().forEach((child, idx) => {
      if (idx < REMOVE_NUM) child.remove();
    });
  });
  range.forEach($date => {
    for (let i = 0; i < REMOVE_NUM; i++) {
      const timeBlock = document.createElement('div');
      timeBlock.style.opacity = 0;
      timeBlock.style.height = '20px';
      $date.appendChild(timeBlock);
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
    createTimeBlock(element, schedule, timeBlockRange);
  });
};

const renderTimeBlock = async () => {
  const $dates = document.querySelectorAll('.date-grid > div');
  await data.fetchSchedules();

  removePreviousBlock($dates);
  paintTimeBlock($dates, data.store.schedules);
  removeChildElement($dates);
};

function editTimeBlock() {
  document.querySelectorAll('.bx-edit-alt').forEach(editIcon =>
    editIcon.addEventListener('click', e => {
      if (!e.target.classList.contains('bx-edit-alt')) return;
      updateModalOpen(e);
    })
  );
}

function deleteTimeBlock() {
  document.querySelectorAll('.bx-trash').forEach(icon =>
    icon.addEventListener('click', e => {
      if (!e.target.classList.contains('bx-trash')) return;
      deleteModalOpen(e);
    })
  );
}

async function render() {
  await renderTimeBlock();
  await editTimeBlock();
  await deleteTimeBlock();
}

export default { render };
