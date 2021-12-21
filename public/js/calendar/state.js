const currentDate = {
  _state: {
    month: 0,
    year: 0,
  },

  get month() {
    return this._state.month;
  },
  set month(newMonth) {
    this._state.month = newMonth;
  },

  get year() {
    return this._state.year;
  },
  set year(newYear) {
    this._state.year = newYear;
  },
};

const drag = {
  _state: {
    isDragging: false,
  },
  get isDragging() {
    return this._state.isDragging;
  },
  set isDragging(newIsDragging) {
    this._state.isDragging = newIsDragging;
  },
};

export default { currentDate, drag };
