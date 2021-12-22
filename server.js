import express from 'express';

const PORT = 5678;
const app = express();

app.use(express.static('public'));
app.use(express.json());

// Mock Data
let schedules = [
  {
    id: 1,
    content: 'HTML',
    assignee: '홍정민',
    startDay: '2021-12-12',
    endDay: '2021-12-15',
    status: 0, // 2
    completed: false, // true
  },
  {
    id: 2,
    content: 'Javascript',
    assignee: '손영산',
    startDay: '2021-12-07',
    endDay: '2021-12-12',
    status: 0,
    completed: false,
  },
  {
    id: 3,
    content: 'CSS',
    assignee: '이희승',
    startDay: '2021-12-01',
    endDay: '2021-12-05',
    status: 1,
    completed: false,
  },
  {
    id: 4,
    content: 'React',
    assignee: '이유나',
    startDay: '2021-12-20',
    endDay: '2021-12-23',
    status: 1,
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

  res.send(newSchedule);
});

// PATCH {status, completed} → 0, 1, 2 (true/false)
app.patch('/schedules/:id', (req, res) => {
  const { id } = req.params;
  const newSchedule = req.body; // status, completed, content: ;

  schedules = schedules.map(schedule => (schedule.id === +id ? { ...schedule, ...newSchedule } : schedule));

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
