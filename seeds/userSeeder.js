const mongoose = require('mongoose');
const User = require('../models/user');

mongoose.connect('mongodb://localhost:27017/timesheetApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Connection Error:'));
// db.once('open', () => {
//     console.log('Database Connected...')
// });

const seedDB = async () => {
    await User.deleteMany({})
    
    const user1 = new User ({
        firstname: 'Bernard',
        lastname: 'Muller',
        username: 'BernardM',
        email: 'b.mullerjnr@gmail.com',
        isAdmin: true
    });
    

    await user1.save()
    
}

// seedDB().then(() => {
//     console.log('Database seeded...')
//     mongoose.connection.close();
// })


