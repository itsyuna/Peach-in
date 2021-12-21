// import calendar from

const dragEvents = (() => {
  let isDragging = false;
  let $dragStartPoint;
  let $dragEndPoint;
  let startDate;
  let endDate;

  return () => {
    const $dateGrid = document.querySelector('.date-grid');
    $dateGrid.addEventListener('mousedown', e => {
      isDragging = true;
      $dragStartPoint = e.target;
    });

    $dateGrid.addEventListener('mouseover', e => {
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

    $dateGrid.addEventListener('mouseup', () => {
      isDragging = false;
      /* popup */
      // console.log(startDate.dataset.date);
      // console.log(endDate.dataset.date);
    });
  };
})();

dragEvents();
