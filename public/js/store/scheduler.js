const store = {
  _state: {
    todos: ['haha', 'hihi'],
  },

  get todos() {
    return this._state.todos;
  },
  set todos(newTodos) {
    if (typeof newTodos !== 'object') return;
    this._state.todos = newTodos;
  },
};

export default store;
