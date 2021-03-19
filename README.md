#REST APIs

### PORT - 5001
### MongoDB - Localhost

1. POST : '/' - Insert documents
2. GET: '/replace' - Remove duplicate dates (all duplicate dates for all users) 
3. PUT: '/' - req.query.task - 'entry' or 'workdone' - update the task based on a given date - req.body: {entry or workdone, reportingDate, regNo}
4. GET: '/attendance' - attendance for all users based on registration number


## Starting application
1. npm i
2. npm start
