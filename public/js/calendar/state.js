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
    $dragStartPoint: null,
    $dragEndPoint: null,
  },
  get isDragging() {
    return this._state.isDragging;
  },
  set isDragging(newIsDragging) {
    this._state.isDragging = newIsDragging;
  },
  get $dragStartPoint() {
    return this._state.$dragStartPoint;
  },
  set $dragStartPoint($newDragStartPoint) {
    this._state.$dragStartPoint = $newDragStartPoint;
  },
  get $dragEndPoint() {
    return this._state.$dragEndPoint;
  },
  set $dragEndPoint($newDragEndPoint) {
    this._state.$dragEndPoint = $newDragEndPoint;
  },
};

const timeblock = {
  _state: {
    currentId: 0,
  },
  get isDragging() {
    return this._state.currentId;
  },
  set isDragging(newId) {
    this._state.currentId = newId;
  },
};

export default { currentDate, drag, timeblock };
