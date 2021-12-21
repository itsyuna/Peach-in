import data from './store/scheduler.js';
import calendar from './calendar/calendar.js';
import drag from './calendar/dragevent.js';
import timeblock from './calendar/timeblock.js';
import kanban from './kanban/kanban.js';

const renderCalendar = async () => {
  await data.fetchSchedules();
  calendar.render();
  drag.dragEvents();
  timeblock.render();
  kanban.renderKan();
};

renderCalendar();
