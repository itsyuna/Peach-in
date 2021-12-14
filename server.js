import express from 'express';

const PORT = 5555;
const app = express();

app.use(express.static('public'));
app.use(express.json());

// Mock Data
let schedules = [
  {
    id: 1,
    content: 'HTML',
    assignee: '홍정민',
    startDay: new Date(2021, 11, 13),
    endDay: new Date(2021, 11, 20),
    status: 0, // 2
    completed: false, // true
  },
  {
    id: 2,
    content: 'Javascript',
    assignee: '손영산',
    startDay: new Date(2021, 11, 7),
    endDay: new Date(2021, 11, 14),
    status: 0,
    completed: false,
  },
  {
    id: 3,
    content: 'CSS',
    assignee: '이희승',
    startDay: new Date(2021, 11, 1),
    endDay: new Date(2021, 11, 8),
    status: 1,
    completed: false,
  },
  {
    id: 4,
    content: 'React',
    assignee: '이유나',
    startDay: new Date(2021, 11, 20),
    endDay: new Date(2021, 11, 23),
    status: 1,
    completed: false,
  },
  {
    id: 5,
    content: 'Vue',
    assignee: '유지현',
    startDay: new Date(2021, 11, 14),
    endDay: new Date(2021, 11, 15),
    status: 2,
    completed: false,
  },
];

// GET
app.get('/schedules', (req, res) => {
  res.send(schedules);
});
// POST
app.post('/schedules', (req, res) => {
  const newSchedule = req.body; // {id, content, ~~}
  schedules = [...schedules, newSchedule];

  res.send(schedules);
});

// PATCH {status, completed} → 0, 1, 2 (true/false)
app.patch('/schedules/:id', (req, res) => {
  const { id } = req.params;
  const payload = req.body; // status, completed, content

  schedules = schedules.map(schedule => (schedule.id === +id ? { ...schedule, ...payload } : schedule));
  res.send(schedules);
});

// DELETE
app.delete('/schedules/:id', (req, res) => {
  const { id } = req.params;
  schedules = schedules.filter(schedule => schedule.id !== +id);

  res.send(schedules);
});

app.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`);
});
