import fetches from '../utils/fetch.js';

const store = {
  _state: {
    schedules: [],
  },

  get schedules() {
    return this._state.schedules;
  },
  set schedules(newTodos) {
    if (typeof newTodos !== 'object') return;
    this._state.schedules = newTodos;
  },
};

const fetchSchedules = async () => {
  try {
    store.schedules = await fetches.get('/schedules');
  } catch (e) {
    console.log(e);
  }
};

const addSchedules = async schedule => {
  try {
    const newSchedule = await fetches.post('/schedules', schedule);
    store.schedules = [...store.schedules, newSchedule];
  } catch (e) {
    console.log(e);
  }
};

const updateSchedules = async (id, schedule) => {
  try {
    store.schedules = await fetches.patch(`/schedules/${id}`, schedule);
  } catch (e) {
    console.log(e);
  }
};

const removeSchedules = async id => {
  try {
    store.schedules = await fetches.delete(`/schedules/${id}`);
  } catch (e) {
    console.log(e);
  }
};

export default {
  store,
  fetchSchedules,
  addSchedules,
  updateSchedules,
  removeSchedules,
};
