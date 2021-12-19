import data from '../store/scheduler.js';

const progress = {
  TODO: 0,
  IN_PROGRESS: 1,
  DONE: 2,
  UNCOMPLETED: 3,
};

const removeChildElem = parentElem => {
  [...parentElem.children].forEach(child => {
    child.remove();
  });
};

const insertSchedules = (parent, schedules, isDraggable) => {
  schedules.forEach(schedule => {
    const scheduleElem = `
      <div data-id=${schedule.id} class='kanban-content kanban-draggable' 
      draggable=${isDraggable ? 'true' : 'false'}>
        할 일: ${schedule.content}
        담당자: ${schedule.assignee}
      <div>
    `;
    parent.insertAdjacentHTML('beforeend', scheduleElem);
  });
};

const filterByProgressStatus = progress => data.store.schedules.filter(({ status }) => +status === progress);

const updateUncompleted = async () => {
  await data.fetchSchedules();
  const now = new Date();

  const overEndDaySchedules = data.store.schedules.filter(({ endDay }) => {
    if (now.getFullYear() > new Date(endDay).getFullYear()) return false;
    if (now.getMonth() > new Date(endDay).getMonth()) return false;
    if (now.getDate() > new Date(endDay).getDate()) return false;
    return true;
  });

  const uncompletedSchedules = overEndDaySchedules.filter(({ status }) => +status !== progress.DONE);

  uncompletedSchedules.forEach(({ id }) => {
    data.updateSchedules(id, { completed: true });
  });
};

const renderUncompleted = () => {
  const $kanbanUncompleted = document.querySelector('.kanban-uncompleted');

  removeChildElem($kanbanUncompleted);
  const remainSchedules = data.store.schedules.filter(
    ({ status, completed }) => completed && +status !== progress.DONE
  );
  insertSchedules($kanbanUncompleted, remainSchedules, false);
};

const render = (() => {
  const $kanbanTodo = document.querySelector('.kanban-todo');
  const $kanbanInprogress = document.querySelector('.kanban-inprogress');
  const $kanbanDone = document.querySelector('.kanban-done');
  const $kanbanUncompleted = document.querySelector('.kanban-uncompleted');

  return async () => {
    await data.fetchSchedules();

    const todoSchedules = filterByProgressStatus(progress.TODO);
    const inProgressSchedules = filterByProgressStatus(progress.IN_PROGRESS);
    const doneSchedules = filterByProgressStatus(progress.DONE);
    const uncompletedSchedules = data.store.schedules.filter(({ completed }) => +completed);

    insertSchedules($kanbanTodo, todoSchedules, true);
    insertSchedules($kanbanInprogress, inProgressSchedules, true);
    insertSchedules($kanbanDone, doneSchedules, true);
    insertSchedules($kanbanUncompleted, uncompletedSchedules, true);
  };
})();

const dragEvents = () => {
  let currentDrag;
  let currentStatus;

  return (() => {
    document.querySelectorAll('.kanban-draggable').forEach($draggable => {
      $draggable.addEventListener('dragstart', e => {
        currentDrag = e.target;
        currentStatus = e.target.parentNode.dataset.status;
        currentDrag.style.opacity = 0.5;
      });
      $draggable.addEventListener('dragend', e => {
        e.preventDefault();
        e.target.style.opacity = '';
      });
    });

    document.addEventListener('dragenter', e => {
      e.preventDefault();
      if (!e.target.className.includes('kanban-drop')) return;
      e.target.appendChild(currentDrag);
    });

    document.addEventListener('dragover', e => {
      e.preventDefault();
    });

    document.addEventListener('dragleave', e => {
      e.preventDefault();
    });

    document.querySelectorAll('.kanban-drop').forEach($progressContainer => {
      $progressContainer.addEventListener('drop', async e => {
        e.preventDefault();
        if (!e.target.classList.contains('kanban') && !e.target.classList.contains('kanban-content')) return;

        const id = e.target.dataset.id || e.target.lastChild.dataset.id;
        const status = e.target.dataset.status || e.target.parentNode.dataset.status;

        if (currentStatus === status) return;

        await data.updateSchedules(id, { status });
        await renderUncompleted();
      });
    });
  })();
};

(async () => {
  await updateUncompleted();
  await render();
  await dragEvents();
})();
