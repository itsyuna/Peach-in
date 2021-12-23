import state from './state.js';

const BACKGROUND_COLOR = {
  visibility: 'rgb(250, 250, 210, 0.5)',
  inVisibility: 'transparent',
};

function taskModalOpen(start, end) {
  document.querySelector('.task-input').value = '';
  document.querySelector('.assignee-input').value = '';
  document.querySelector('.start-day-input').value = start;
  document.querySelector('.end-day-input').value = end;
  document.querySelector('.task-modal').style.display = 'block';
}

const dragEvents = (() => {
  state.drag.isDragging = false;
  state.drag.$dragStartPoint = null;
  state.drag.$dragEndPoint = null;
  let startDate = null;
  let endDate = null;

  return () => {
    const $dateGrid = document.querySelector('.date-grid');
    $dateGrid.addEventListener('mousedown', e => {
      if (e.target.classList.contains('timeblock')) return;
      if (e.target.parentNode.classList.contains('timeblock')) return;
      state.drag.isDragging = true;
      state.drag.$dragStartPoint = e.target.dataset.date ? e.target : e.target.parentNode;
    });

    $dateGrid.addEventListener('mouseover', e => {
      if (e.target.classList.contains('timeblock')) return;
      if (e.target.parentNode.classList.contains('timeblock')) return;
      if (!state.drag.isDragging) return;

      [...$dateGrid.children].forEach($date => {
        $date.dataset.isvisited = 0;
      });

      state.drag.$dragEndPoint = e.target.dataset.date ? e.target : e.target.parentNode;

      const descending =
        new Date(state.drag.$dragStartPoint.dataset.date).getTime() <
        new Date(state.drag.$dragEndPoint.dataset.date).getTime();

      startDate = descending ? state.drag.$dragStartPoint : state.drag.$dragEndPoint;
      endDate = descending ? state.drag.$dragEndPoint : state.drag.$dragStartPoint;

      let currentDate = startDate;

      while (true) {
        currentDate.dataset.isvisited = 1;
        if (currentDate.dataset.date === endDate.dataset.date) break;
        currentDate = currentDate.nextElementSibling;
      }

      [...$dateGrid.children].forEach($date => {
        $date.style.backgroundColor =
          +$date.dataset.isvisited === 1 ? BACKGROUND_COLOR.visibility : BACKGROUND_COLOR.inVisibility;
      });
    });

    $dateGrid.addEventListener('mouseup', () => {
      if (!startDate) return;
      taskModalOpen(startDate.dataset.date, endDate.dataset.date);

      [...$dateGrid.children].forEach($date => {
        $date.dataset.isvisited = 0;
        $date.style.backgroundColor = BACKGROUND_COLOR.inVisibility;
      });
      state.drag.isDragging = false;
      state.drag.$dragStartPoint = null;
      state.drag.$dragEndPoint = null;
      startDate = null;
      endDate = null;
    });
  };
})();

export default { dragEvents };
