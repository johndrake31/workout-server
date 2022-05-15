//3rd party
const express = require('express');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//local tools
const Workout = require('./models/workout');
const Workout = require('./models/exercise');
const User = require('./models/user');
const res = require('express/lib/response');
const app = express();

//Calls()
app.use(express.json());

// const getUserById = userId => {
//     return User.findById(userId)
//         .then(user => {
//             return user
//         })
//         .catch(err =>{throw err})
// }

app.use('/graphql', graphqlHttp.graphqlHTTP({
    //2 args: where to find scheme, rootValue: {resolvers}
    schema: buildSchema(`
        type Exercise {
            _id: ID!
            title: String!
            sets: [Number]
            weight: Number
            timed: Boolean
            timer: Float
            metric: Boolean
            notes: String!
            reps: [Float]
            uri: String
            imgUrl: String
            uuid: String
            workout: Workout!
        }

        type Workout {
            _id: ID!
            mainTitle: String
            discriptionShort: String
            discriptionExtra: String
            weekDuration:  [Float]
            restBreakSecs: Number
            daysPerWeek:  [Float] 
            imgUrl: String
            creator: User!
        }

        type User {
            _id: ID!
            email: String!
            password: String
            createEvents: [Workout!]

        }

        input ExerciseInput {
            title: String!
            sets: [Number]
            weight: Number
            timed: Boolean
            timer: Float
            metric: Boolean
            notes: String!
            reps: [Float]
            uri: String
            imgUrl: String
            uuid: String
            workout: String!
        }
        input WorkoutInput {
            mainTitle: String!
            discriptionShort: String
            discriptionExtra: String
            weekDuration:  [Float]
            restBreakSecs: Number
            daysPerWeek:  [Float] 
            imgUrl: String
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
            users: [User!]!
            userById(UserId: String): [User!]!
        }

        type RootMutation {
            createEvent(EventInput: EventInput): Event
            createUser(UserInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
        `
    ),
    rootValue: {
        events: () => {
            //populate() adds relationships that mongoose is aware of.
            return Event.find().populate('creator');
        },
        users: () => {
            return User.find();
        },
        userById: (arg) => {
            return User.find({ _id: arg.UserId });
        },

        createEvent: (args) => {
            // new Event comes from Mango
            const event = new Event({
                title: args.EventInput.title,
                discription: args.EventInput.discription,
                price: +args.EventInput.price,
                date: new Date(args.EventInput.date),
                creator: args.EventInput.creator, //"6262ac03cbf9105359356110"
            })
            let createdEvent;
            //async opperation
            return event
                .save()
                .then((result) => {
                    //because we need to return the _doc before we move on to updating th user
                    createdEvent = { ...result._doc }
                    return User.findById(args.EventInput.creator)
                })
                .then(user => {
                    if (!user) {
                        throw new Error('User not found');
                    }
                    user.createEvents.push(event);
                    return user.save()
                })
                .then(result => {
                    return createdEvent;
                })
                .catch(
                    (err) => {
                        console.log(err);
                        throw err;
                    })
        },

        createUser: (args) => {
            return User.findOne({ email: args.UserInput.email }).then((user) => {
                if (user) {
                    throw new Error('User already exists')
                }
                return bcrypt.hash(args.UserInput.password, 12)
            })
                .then((hashedPass) => {
                    const user = new User({
                        email: args.UserInput.email,
                        password: hashedPass
                    });
                    return user.save()
                })
                .then((result) => {
                    return { ...result._doc, password: null, _id: result.id }
                })
                .catch((err) => { throw err })
        }

    },
    graphiql: true
})
);

mongoose.connect(
    'mongodb://127.0.0.1:27017/event-graphql-db'
    // `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.kgryg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
)
    .then(
        app.listen(3300)
    )
    .catch((err) => { console.log(err) })