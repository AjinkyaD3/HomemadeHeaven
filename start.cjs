const concurrently = require('concurrently');
const { result } = concurrently([
  { 
    command: 'cd server && npm install && npm start',
    name: 'backend',
    prefixColor: 'blue'
  },
  {
    command: 'npm install && npm start',
    name: 'frontend',
    prefixColor: 'green'
  }
], {
  prefix: 'name',
  killOthers: ['failure', 'success'],
  restartTries: 3,
});

result.then(
  () => {
    console.log('All processes completed successfully');
  },
  (err) => {
    console.error('One or more processes failed:', err);
  }
);
