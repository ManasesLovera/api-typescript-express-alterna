import express, {Request, Response} from 'express';
const app = express();
const port = 3000;

//middleware
app.use(express.json());

app.use('/', express.static('public'))

type User = {
    id: number,
    userName: string
}
// array with objects of users
const users: User[] = [
    {
        id: 1,
        userName: 'Manases'
    },
    {
        id: 2,
        userName: 'Cesar'
    },
    {
        id: 3,
        userName: 'Juan Elias'
    }
]

app.get('/', (req:Request, res:Response) => {
  res.send('<h1>Hello World!</h1>');
});

// GET method that shows all the info
app.get('/users', (req:Request, res:Response) => {
    res.status(200).json(users);
});

// Get method you can find an especific user by using the id parameter
app.get('/users/:id', (req:Request, res:Response) => {

    // This if statement verifies that the id parameter is a number
    if(isNaN(parseInt(req.params.id))) {
        return res.status(400).json( {
            statusCode: 400,
            statusValue: 'Bad Request',
            Message: 'El valor incertado no es un numero'
        })
    }

    // return the user if the user exists, if not, return null
    const user:User|null = users.find( (user) => user.id.toString() === req.params.id) ?? null

    // If the user does not exist it will return a 404 'Not Found' response
    if(!user) {
        return res.status(404).json( {
            statusCode: 404,
            statusValue: 'Not Found',
            Message: `The user with the id ${req.params.id} doesn't exist`
        })
    }
    // If the user does exist it will return the json object of the user
    res.json(user);
});

// Method post to add the user to the list
app.post('/users', (req:Request, res:Response) => {

    // This variable is what we receive in the boby, and it's the data the user wants us to add
    const {userName} = req.body;

    // This will return the user if it already exist
    const user:User|null = users.find( user => user.userName === userName) ?? null;

    // If the user already exists, it will return a 400 error message saying that the user already exists
    if(user) {
        return res.status(400).json( {
            statusCode: 400,
            statusValue: 'Bad Request',
            Message: `User: "${user.userName}" already exists`
        })
    }
    // If the user does not exist, it will create a new user with the users length plus 1 and the
    // username the request.body contains
    const newUser:User = {
        id: users.length+1,
        userName
    }
    // This will add the user to the  list of users
    users.push(newUser);
    // And finally this will return the user that was added to the list
    res.status(201).json(newUser);
})

// This method will update the user name of the list
app.put('/users', (req:Request, res:Response) => { 
    // We will receive the user name we have on file according to the user, and the new user
    // that the user wants us to update
    const {userName, newUserName} = req.body;

    // Confirming if the user is not inserting the same value
    if(userName === newUserName) {
        return res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request: Invalid',
            Message: 'This user has already this user name'
        })
    }

    // This will return the index of the user in the list if it exists
    const userIndex:number = users.findIndex( user => user.userName === userName)
    
    //If the user doesn't exist this will return a 404 response
    if (userIndex == -1) {
        return res.status(404).json( {
            statusCode: 404,
            statusValue: 'Not Found',
            Message: 'User not found'
        })
    }
    // If the user does exist we will update the user name
    users[userIndex].userName = newUserName;
    // Now we return a json with the user updated
    res.status(200).json(users[userIndex]);

})
// Method delete a user
app.delete('/users/:id', (req:Request, res:Response) => {

    // This will return the index of the user in the list if it exists
    const userIndex:number = users.findIndex(user => user.id === Number.parseInt(req.params.id))

    //If the user doesn't exist this will return a 404 response
    if (userIndex == -1) {
        return res.status(404).json( {
            statusCode: 404,
            statusValue: 'Not Found',
            Message: 'User not found'
        })
    }
    // This will delete the user from the list
    users.splice(userIndex, 1)
    // This will send all the users without the user deleted
    res.status(200).json(users)
})

// The server is listening 
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});