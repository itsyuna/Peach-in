import data from '../store/scheduler.js';

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
  const counting = [];
  element.forEach(childEl => {
    let flag = true;
    let count = 0;

    [...childEl.children].reverse().forEach(block => {
      if (flag && block.style.opacity === '0') count += 1;
      else flag = false;
    });

    counting.push(count);
  });
  return counting;
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

const createTimeBlock = (element, { startDay, endDay, id }) => {
  let flag = false;
  element.forEach(childEl => {
    const div = document.createElement('div');
    if (startDay === childEl.dataset.date) flag = true;

    if (flag) {
      div.style.opacity = 1;
      div.style.height = '25px';
      div.style.background = COLORS[id % COLORS.length];
    } else {
      div.style.opacity = 0;
      div.style.height = '25px';
    }
    if (endDay === childEl.dataset.date) flag = false;

    childEl.appendChild(div);
  });
};

const createOpacityBlock = element => {
  const min = getMin(element);
  element.forEach(childEl => {
    for (let i = 0; i < min; i++) {
      const div = document.createElement('div');

      div.style.opacity = 0;
      div.style.height = '25px';

      childEl.appendChild(div);
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
    createOpacityBlock(timeBlockRange);
  });
};

const render = () => {
  const $dates = document.querySelectorAll('.date-grid > div');

  removePreviousBlock($dates);
  paintTimeBlock($dates, data.store.schedules);
  removeChildElement($dates);
};

(async () => {
  await data.fetchSchedules();
  render(); // 초기 렌더링
})();
