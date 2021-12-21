import state from './state.js';

function taskModalOpen(start, end) {
  document.querySelector('.task-input').value = '';
  document.querySelector('.assignee-input').value = '';
  document.querySelector('.start-day-input').value = start;
  document.querySelector('.end-day-input').value = end;
  document.querySelector('.task-modal').style.display = 'block';
}

const dragEvents = (() => {
  state.drag.isDragging = false;
  let $dragStartPoint;
  let $dragEndPoint;
  let startDate = null;
  let endDate = null;

  return () => {
    const $dateGrid = document.querySelector('.date-grid');
    $dateGrid.addEventListener('mousedown', e => {
      if (e.target.classList.contains('timeblock')) return;
      state.drag.isDragging = true;
      $dragStartPoint = e.target.dataset.date ? e.target : e.target.parentNode;
    });

    $dateGrid.addEventListener('mouseover', e => {
      if (!state.drag.isDragging) return;

      [...$dateGrid.children].forEach($date => {
        $date.dataset.isvisited = 0;
      });

      $dragEndPoint = e.target.dataset.date ? e.target : e.target.parentNode;

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

    $dateGrid.addEventListener('mouseup', () => {
      if (!startDate) return;
      taskModalOpen(startDate.dataset.date, endDate.dataset.date);
      // 식별자 reset
      [...$dateGrid.children].forEach($date => {
        $date.dataset.isvisited = 0;
        $date.style.backgroundColor = 'transparent';
      });
      state.drag.isDragging = false;
      $dragStartPoint = null;
      $dragEndPoint = null;
      startDate = null;
      endDate = null;
    });
  };
})();

export default { dragEvents };
