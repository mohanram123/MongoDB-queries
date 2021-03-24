#Mongoose plugin use cases

### PORT - 5001
### MongoDB - Changed to Cluster

### Routes for the main use case:
1. POST : '/' - Insert documents
2. GET: '/replace' - Remove duplicate dates (all duplicate dates for all users) 
3. PUT: '/' - req.query.task - 'entry' or 'workdone' - update the task based on a given date - req.body: {entry or workdone, reportingDate, regNo}
4. GET: '/attendance' - attendance for all users based on registration number

### Other routes with their mongoose-plugin
1. /people : uses 'mongoose-unique-array' - post and put routes
2. /email : uses 'mongoose-hidden' - post and get routes
3. /students: uses - 'mongoose-long','mongoose-sequence','mongoose-delete' - post, get and delete routes
4. The above are the popularly used plugins in mongoose.

## Starting application
1. npm i
2. npm start
