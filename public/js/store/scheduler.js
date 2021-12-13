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

export default store;
