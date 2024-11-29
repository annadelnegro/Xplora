const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const PORT = 5000;
const url = 'mongodb+srv://xplora-user:FriendersTeam10!@xplora.u95ur.mongodb.net/?retryWrites=true&w=majority&appName=Xplora';
const client = new MongoClient(url);

app.use('/uploads', express.static(path.join('/var/www/html/uploads/trips/')));

// file filter for photo upload (user and trip photo)
const fileFilter = (req, file, cb) => {
    console.log('File Name:', file.originalname);
    console.log('MIME Type:', file.mimetype);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG and PNG allowed.'), false);
    }
};

// user pic multer 
const storageUsers = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('/var/www/html/uploads/users/'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadUserPic = multer({
    storage: storageUsers,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter
});

// trip pic multer 
const storageTrips = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('/var/www/html/uploads/trips/'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadTripPic = multer({
    storage: storageTrips,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    // port: 465,
    // secure: true,
    auth: 
    {
        user: 'xploratravelteam@gmail.com', // Gmail address
        pass: 'odveslwtjhhgphax', // App password
    },
});

// Send Email Function
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"Xplora Team" <xploratravelteam@gmail.com>', // Sender address
            to, // Recipient email address
            subject, // Subject line
            text, // Plain text body
            html, // HTML body
        });

        console.log("Email sent successfully:", info);
        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: error.message };
    }
};

client.connect();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'POST, GET, PUT, DELETE'
    );
    next();
});

//Log In API
app.post('/api/login', async (req, res, next) => {
    let error = '';
    const { email, password } = req.body;

    try {
        const db = client.db('xplora');

        const results = await db.collection('users').findOne(
            { email: email, password: password }
        );

        console.log('Login attempt with:', { email, password });

        if (results && !results.email_verified){
            error = "Please verify your e-mail to log in.";
            return res.status(403).json({ error });
        }

        if (results) {
            const { _id: id, first_name: firstName, last_name: lastName, email: userEmail } = results;
            res.status(200).json({ id, firstName, lastName, email: userEmail, error: '' });
        } else {
            error = 'Invalid login or password';
            res.status(401).json({ error });
        }
    } catch (err) {
        console.error('Error during login:', err.message);
        error = 'An error occurred while accessing the database';
        res.status(500).json({ error });
    }
});

// Register API
app.post('/api/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        const db = client.db('xplora');
        const existingUser = await db.collection('users').findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const verification_token = crypto.randomBytes(32).toString('hex').trim();
        const newUser = {
            first_name,
            last_name,
            email,
            password,
            email_verified: false,
            verification_token,
        };

        await db.collection('users').insertOne(newUser);

        // Send verification email
        const verificationLink = `https://xplora.fun/api/verify-email?user_id=${newUser._id}&token=${verification_token}`;
        
        const subject = "Verify Your Email";
        const text = `Hi ${first_name},\n\nPlease verify your email by clicking the link below:\n\n${verificationLink}\n\nThank you!`;
        const html = `<p>Hi ${first_name},</p><p>Please verify your email by clicking the link below:</p><p><a href="${verificationLink}">Verify Email</a></p><p>Thank you!</p>`;

        const emailResult = await sendEmail(email, subject, text, html);

        if (emailResult.success) {
            return res.status(201).json({
                message: 'User registered successfully. Verification email sent.',
            });
        } else {
            return res.status(500).json({
                message: 'User registered, but verification email failed to send.',
                error: emailResult.error,
            });
        }
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

// Verify email API 
app.get('/api/verify-email', async (req, res) => {
    const { user_id, token } = req.query;

    try {
        console.log("Received user_id:", user_id);
        console.log("Received token:", token);

        const sanitizedToken = token.trim();
        console.log("Sanitized token:", sanitizedToken);

        const db = client.db('xplora');

        const user = await db.collection('users').findOne({
            _id: new ObjectId(user_id),
            verification_token: sanitizedToken,
        });

        console.log("Database query result:", user);

        if (!user) {
            console.error("Invalid user_id or expired token:", { user_id, token });
            return res.status(400).send('<h1>Invalid or expired token. Please register again.</h1>');
        }

        // Mark the user as verified and remove the token
        await db.collection('users').updateOne(
            { _id: new ObjectId(user_id) },
            { $set: { email_verified: true }, $unset: { verification_token: '' } }
        );

        console.log("User verified successfully:", user.email);
        res.send(`
            <html>
            <head>
                <title>Verification Successful</title>
                <meta http-equiv="refresh" content="5;url=https://xplora.fun/login" />
            </head>
            <body>
                <h1>Email successfully verified! You can now log in.</h1>
                <p>You will be redirected to the login page in 5 seconds.</p>
                <p>If you are not redirected, <a href="https://xplora.fun/login">click here</a>.</p>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error verifying email:', error.message);
        res.status(500).send('<h1>An error occurred while verifying your email. Please try again later.</h1>');
    }
});

// Update User API
app.put('/api/users/:id', async (req, res, next) => {
    try {
        await new Promise((resolve, reject) => {
            uploadUserPic.single('photo')(req, res, (err) => {
                if (err) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return reject({
                            status: 413,
                            message: 'File size exceeds the 5 MB limit',
                        });
                    } else if (err.message === 'Invalid file type. Only JPEG, JPG and PNG allowed.') {
                        return reject({
                            status: 400,
                            message: err.message,
                        });
                    }
                    return reject({
                        status: 500,
                        message: 'An error occurred during file upload',
                    });
                }
                resolve();
            });
        });

        const { id } = req.params;
        const { first_name, last_name, password } = req.body;
        const objectId = new ObjectId(String(id));
    
        const db = client.db('xplora');

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const updateFields = {};
        if (first_name) updateFields.first_name = first_name;
        if (last_name) updateFields.last_name = last_name;
        if (password) updateFields.password = password;

        // Update the user document in the database
        const result = await db.collection('users').updateOne(
            { _id: objectId },
            { $set: updateFields }
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'User information updated successfully' });
        } else {
            res.status(200).json({ message: 'No changes made' });
        }

    } catch (err) {
        errormsg = 'An error occurred while updating the user information';
        res.status(500).json({ "error": errormsg });
    }
});

// Get Password API
app.get('/api/users/:id/password', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const db = client.db('xplora');
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Password received' });

    } catch (error) {
        console.error('Error fetching password:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

//--------------------------------
// TRIPS -- POST to add a new trip
app.post('/api/users/:userId/trips', async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            uploadTripPic.single('photo')(req, res, (err) => {
                if (err) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return reject({
                            status: 413,
                            message: 'File size exceeds the 5 MB limit',
                        });
                    } else if (err.message === 'Invalid file type. Only JPEG, JPG and PNG allowed.') {
                        return reject({
                            status: 400,
                            message: err.message,
                        });
                    }
                    return reject({
                        status: 500,
                        message: 'An error occurred during file upload',
                    });
                }
                resolve();
            });
        });

        const { userId } = req.params;
        const { name, city, start_date, end_date, notes } = req.body;

        if (!name || !city || !start_date || !end_date) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        let picture_url = '/uploads/trips/trip_default.jpg';
        if (req.file) {
            picture_url = `/uploads/trips/${req.file.filename}`;
        }

        const objectId = new ObjectId(String(userId));

        const db = client.db('xplora');

        const existingTrip = await db.collection('trips').findOne({
            user_id: objectId,
            name,
            city,
            start_date,
            end_date,
        });

        if (existingTrip) {
            return res.status(409).json({ error: 'Trip already exists' });
        }

        const newTrip = {
            user_id: objectId,
            name,
            city,
            start_date,
            end_date,
            notes,
            picture_url,
        };

        const result = await db.collection('trips').insertOne(newTrip);

        res.status(201).json({
            message: 'Trip added successfully',
            trip_id: result.insertedId,
        });
    } catch (error) {
        console.error('Error occurred while processing trip:', error);

        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }

        res.status(500).json({ error: 'An error occurred while adding the trip' });
    }
});


//TRIPS -- GET trips from user_id
app.get('/api/users/:userId/trips', async (req, res) => {
    try {
        const user_id = req.params.userId;

        const db = client.db('xplora');
        const objectId = new ObjectId(String(user_id));

        const trips = await db.collection('trips').find({ user_id: objectId }).toArray();

        if (trips.length === 0) {
            return res.status(404).json({ error: 'No trips found' });
        }

        res.json(trips);
    } catch (error) {
        console.error('Database connection or query error:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the trips' });
    }
});

//TRIPS -- GET singular trip from user_id
app.get('/api/users/:userId/trips/:tripId', async (req, res) => {
    const { userId, tripId } = req.params;
    const tripObjId = new ObjectId(String(tripId));

    try {
        const db = client.db('xplora');
        const trip = await db.collection('trips').findOne({ _id: tripObjId });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        res.status(200).json(trip);
    } catch (error) {
        console.error('Error fetching trip:', error);
        res.status(500).json({ error: 'An error occurred while fetching the trip' });
    }
});

//TRIPS -- PUT to update trip
app.put('/api/users/:userId/trips/:tripId', uploadTripPic.single('photo'), async (req, res) => {
    const { userId, tripId } = req.params;
    const { name, city, start_date, end_date, notes } = req.body;
    const tripObjId = new ObjectId(String(tripId));
    const userObjId = new ObjectId(String(userId));

    try {
        const db = client.db('xplora');

        const trip = await db.collection('trips').findOne({ _id: tripObjId, user_id: userObjId });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        const updatedTrip = {};
        if (name !== undefined) updatedTrip.name = name;
        if (city !== undefined) updatedTrip.city = city;
        if (start_date !== undefined) updatedTrip.start_date = start_date;
        if (end_date !== undefined) updatedTrip.end_date = end_date;
        if (notes !== undefined) updatedTrip.notes = notes;

        if (req.file) {
            updatedTrip.picture_url = `/uploads/trips/${req.file.filename}`;
        }

        const result = await db.collection('trips').updateOne(
            { _id: tripObjId },
            { $set: updatedTrip }
        );

        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Trip updated successfully' });
        } else {
            res.status(404).json({ error: 'Trip not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the trip' });
    }
});

//TRIPS -- DELETE to remove a trip from db
app.delete('/api/users/:userId/trips/:tripId', async (req, res) => {
    const { userId, tripId } = req.params;
    const tripObjId = new ObjectId(String(tripId));
    const userObjId = new ObjectId(String(userId));

    try {
        const db = client.db('xplora');

        const trip = await db.collection('trips').findOne({ _id: tripObjId, user_id: userObjId });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found or does not belong to this user' });
        }

        const result = await db.collection('trips').deleteOne({ _id: tripObjId });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Trip deleted successfully' });
        } else {
            res.status(404).json({ error: 'Trip not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the trip' });
    }
});

//--------------------------------------
//ACTIVITY -- POST an activity to a trip
app.post('/api/users/:userId/trips/:tripId/activities', async (req, res) => {
    const { userId, tripId } = req.params;
    const userObjId = new ObjectId(String(userId));
    const tripObjId = new ObjectId(String(tripId));
    const { name, date, time, location, notes } = req.body;

    if (!name || !date || !time || !location || !notes) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const db = client.db('xplora');

        const existingActivity = await db.collection('activities').findOne({
            user_id: userObjId,
            trip_id: tripObjId,
            name,
            date,
            time,
            location,
            notes
        });

        if (existingActivity) {
            return res.status(409).json({ error: 'A similar activity already exists' });
        }

        const newActivity = {
            user_id: userObjId,
            trip_id: tripObjId,
            name,
            date,
            time,
            location,
            notes
        };

        const result = await db.collection('activities').insertOne(newActivity);
        res.status(201).json({ message: 'Activity added successfully', activity_id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the activity' });
    }
});

//ACTIVITY -- GET all activities in a trip
app.get('/api/users/:userId/trips/:tripId/activities', async (req, res) => {
    const { userId, tripId } = req.params;
    const userObjId = new ObjectId(String(userId));
    const tripObjId = new ObjectId(String(tripId));

    try {
        const db = client.db('xplora');
        const activities = await db.collection('activities').find({ user_id: userObjId, trip_id: tripObjId }).sort({ date: 1 }).toArray();

        if (activities.length === 0) {
            return res.status(404).json({ error: 'No activities found for this trip' });
        }

        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching activities' });
    }
});

//ACTIVITY -- PUT to update an activity
app.put('/api/users/:userId/trips/:tripId/activities/:activityId', async (req, res) => {
    const { userId, tripId, activityId } = req.params;
    const { name, date, time, location, notes } = req.body;

    const userObjId = new ObjectId(String(userId));
    const tripObjId = new ObjectId(String(tripId));
    const activityObjId = new ObjectId(String(activityId));

    try {
        const db = client.db('xplora');

        const activity = await db.collection('activities').findOne({ _id: activityObjId, user_id: userObjId, trip_id: tripObjId });

        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        const updatedActivity = {};
        if (name !== undefined) updatedActivity.name = name;
        if (date !== undefined) updatedActivity.date = date;
        if (time !== undefined) updatedActivity.time = time;
        if (location !== undefined) updatedActivity.location = location;
        if (notes !== undefined) updatedActivity.notes = notes;

        const result = await db.collection('activities').updateOne(
            { _id: activityObjId },
            { $set: updatedActivity }
        );

        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Activity updated successfully' });
        } else {
            res.status(404).json({ error: 'Activity not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the activity' });
    }
});

//ACTIVITY --DELETE to remove an activity
app.delete('/api/users/:userId/trips/:tripId/activities/:activityId', async (req, res) => {
    const { userId, tripId, activityId } = req.params;
    const userObjId = new ObjectId(String(userId));
    const tripObjId = new ObjectId(String(tripId));
    const activityObjId = new ObjectId(String(activityId));

    try {
        const db = client.db('xplora');
        const result = await db.collection('activities').deleteOne({ _id: activityObjId, trip_id: tripObjId, user_id: userObjId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Activity deleted successfully' });
        } else {
            res.status(404).json({ error: 'Activity not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the activity' });
    }
});

//----------------------------------
//FLIGHTS -- POST a flight to a trip
app.post('/api/users/:userId/trips/:tripId/flights', async (req, res) => {
    const { userId, tripId } = req.params;
    const userObjId = new ObjectId(String(userId));
    const tripObjId = new ObjectId(String(tripId));
    const {
        confirmation_num,
        flight_num,
        departure_airport,
        arrival_airport,
        departure_time,
        arrival_time,
        departure_date,
        arrival_date } = req.body;

    if (!confirmation_num || !flight_num || !departure_airport || !arrival_airport ||
        !departure_time || !arrival_time || !departure_date || !arrival_date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const db = client.db('xplora');

        const existingFlight = await db.collection('flights').findOne({
            user_id: userObjId,
            trip_id: tripObjId,
            confirmation_num,
            flight_num,
            departure_airport,
            arrival_airport,
            departure_time,
            arrival_time,
            departure_date,
            arrival_date
        });

        if (existingFlight) {
            return res.status(409).json({ error: 'A similar flight already exists' });
        }

        const newFlight = {
            user_id: userObjId,
            trip_id: tripObjId,
            confirmation_num,
            flight_num,
            departure_airport,
            arrival_airport,
            departure_time,
            arrival_time,
            departure_date,
            arrival_date
        };

        const result = await db.collection('flights').insertOne(newFlight);
        res.status(201).json({ message: 'Flight added successfully', flight_id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the flight' });
    }
});

//FLIGHTS -- GET all flights in a trip
app.get('/api/users/:userId/trips/:tripId/flights', async (req, res) => {
    const { userId, tripId } = req.params;
    const userObjId = new ObjectId(String(userId));
    const tripObjId = new ObjectId(String(tripId));

    try {
        const db = client.db('xplora');
        const flights = await db.collection('flights').find({ user_id: userObjId, trip_id: tripObjId }).sort({ departure_date: 1 }).toArray();

        if (flights.length === 0) {
            return res.status(404).json({ error: 'No flights found for this trip' });
        }

        res.json(flights);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching flights' });
    }
});

//FLIGHTS -- PUT to update a flight
app.put('/api/users/:userId/trips/:tripId/flights/:flightId', async (req, res) => {
    const { userId, tripId, flightId } = req.params;
    const {
        confirmation_num,
        flight_num,
        departure_airport,
        arrival_airport,
        departure_time,
        arrival_time,
        departure_date,
        arrival_date } = req.body;

    const userObjId = new ObjectId(String(userId));
    const tripObjId = new ObjectId(String(tripId));
    const flightObjId = new ObjectId(String(flightId));

    try {
        const db = client.db('xplora');

        const flight = await db.collection('flights').findOne({ _id: flightObjId, user_id: userObjId, trip_id: tripObjId });

        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }

        const updatedFlight = {};
        if (confirmation_num !== undefined) updatedFlight.confirmation_num = confirmation_num;
        if (flight_num !== undefined) updatedFlight.flight_num = flight_num;
        if (departure_airport !== undefined) updatedFlight.departure_airport = departure_airport;
        if (arrival_airport !== undefined) updatedFlight.arrival_airport = arrival_airport;
        if (departure_time !== undefined) updatedFlight.departure_time = departure_time;
        if (arrival_time !== undefined) updatedFlight.arrival_time = arrival_time;
        if (departure_date !== undefined) updatedFlight.departure_date = departure_date;
        if (arrival_date !== undefined) updatedFlight.arrival_date = arrival_date;

        const result = await db.collection('flights').updateOne(
            { _id: flightObjId },
            { $set: updatedFlight }
        );

        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Flight updated successfully' });
        } else {
            res.status(404).json({ error: 'Flight not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the flight' });
    }
});

//FLIGHTS --DELETE to remove a flight
app.delete('/api/users/:userId/trips/:tripId/flights/:flightId', async (req, res) => {
    const { userId, tripId, flightId } = req.params;
    const userObjId = new ObjectId(String(userId));
    const tripObjId = new ObjectId(String(tripId));
    const flightObjId = new ObjectId(String(flightId));

    try {
        const db = client.db('xplora');
        const result = await db.collection('flights').deleteOne({ _id: flightObjId, trip_id: tripObjId, user_id: userObjId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Flight deleted successfully' });
        } else {
            res.status(404).json({ error: 'Flight not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the Flight' });
    }
});

//-----------------------------------------------
//ACCOMMODATIONS -- POST accommodations to a trip
app.post('/api/users/:userId/trips/:tripId/accommodations', async (req, res) => {
    const { userId, tripId } = req.params;
    const userObjId = new ObjectId(String(userId));
    const tripObjId = new ObjectId(String(tripId));
    const {
        name,
        confirmation_num,
        address,
        checkin_date,
        checkout_date,
        checkin_time,
        checkout_time } = req.body;

    if (!name || !confirmation_num || !address || !checkin_date ||
        !checkout_date || !checkin_time || !checkout_time) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const db = client.db('xplora');

        const existingAccommodation = await db.collection('accommodations').findOne({
            user_id: userObjId,
            trip_id: tripObjId,
            name,
            confirmation_num,
            address,
            checkin_date,
            checkout_date,
            checkin_time,
            checkout_time
        });

        if (existingAccommodation) {
            return res.status(409).json({ error: 'A similar accommodation already exists' });
        }

        const newAccommodation = {
            user_id: userObjId,
            trip_id: tripObjId,
            name,
            confirmation_num,
            address,
            checkin_date,
            checkout_date,
            checkin_time,
            checkout_time
        };

        const result = await db.collection('accommodations').insertOne(newAccommodation);
        res.status(201).json({ message: 'Accommodation added successfully', accommodation_id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the accommodation' });
    }
});

//ACCOMMODATIONS -- GET all accommodations in a trip
app.get('/api/users/:userId/trips/:tripId/accommodations', async (req, res) => {
    const { userId, tripId } = req.params;
    const userObjId = new ObjectId(String(userId));
    const tripObjId = new ObjectId(String(tripId));

    try {
        const db = client.db('xplora');
        const accommodations = await db.collection('accommodations').find({ user_id: userObjId, trip_id: tripObjId }).sort({ checkin_date: 1 }).toArray();

        if (accommodations.length === 0) {
            return res.status(404).json({ error: 'No accommodations found for this trip' });
        }

        res.json(accommodations);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching accommodations' });
    }
});

//ACCOMMODATIONS -- PUT to update accommodations
app.put('/api/users/:userId/trips/:tripId/accommodations/:accommodationId', async (req, res) => {
    const { userId, tripId, accommodationId } = req.params;
    const {
        name,
        confirmation_num,
        address,
        checkin_date,
        checkout_date,
        checkin_time,
        checkout_time } = req.body;

    const userObjId = new ObjectId(String(userId));
    const tripObjId = new ObjectId(String(tripId));
    const accommodationObjId = new ObjectId(String(accommodationId));

    try {
        const db = client.db('xplora');

        const accommodation = await db.collection('accommodations').findOne({ _id: accommodationObjId, user_id: userObjId, trip_id: tripObjId });

        if (!accommodation) {
            return res.status(404).json({ error: 'Accommodation not found' });
        }

        const updatedAccommodation = {};
        if (name !== undefined) updatedAccommodation.name = name;
        if (confirmation_num !== undefined) updatedAccommodation.confirmation_num = confirmation_num;
        if (address !== undefined) updatedAccommodation.address = address;
        if (checkin_date !== undefined) updatedAccommodation.checkin_date = checkin_date;
        if (checkout_date !== undefined) updatedAccommodation.checkout_date = checkout_date;
        if (checkin_time !== undefined) updatedAccommodation.checkin_time = checkin_time;
        if (checkout_time !== undefined) updatedAccommodation.checkout_time = checkout_time;

        const result = await db.collection('accommodations').updateOne(
            { _id: accommodationObjId },
            { $set: updatedAccommodation }
        );

        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Accommodation updated successfully' });
        } else {
            res.status(404).json({ error: 'Accommodation not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the accommodation' });
    }
});

//ACCOMMODATIONS --DELETE to remove accommodations
app.delete('/api/users/:userId/trips/:tripId/accommodations/:accommodationId', async (req, res) => {
    const { userId, tripId, accommodationId } = req.params;
    const userObjId = new ObjectId(String(userId));
    const tripObjId = new ObjectId(String(tripId));
    const accommodationObjId = new ObjectId(String(accommodationId));

    try {
        const db = client.db('xplora');
        const result = await db.collection('accommodations').deleteOne({ _id: accommodationObjId, trip_id: tripObjId, user_id: userObjId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Accommodation deleted successfully' });
        } else {
            res.status(404).json({ error: 'Accommodation not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the accommodation' });
    }
});

//------------------
//PASSWORD RESET APIs
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const db = client.db('xplora');
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; // one hour

        await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { resetToken, resetTokenExpiration } }
        );

        const resetLink = `http://xplora.fun/reset-password?token=${resetToken}&id=${user._id}`; 
        const subject = 'Password Reset Request';
        const text = `You requested a password reset. Click the link below to reset your password:\n${resetLink}`;
        const html = `<p>You requested a password reset. Click the link below to reset your password:</p> <a href="${resetLink}">Reset Password</a>`;

        const emailResult = await sendEmail(user.email, subject, text, html);

        if(emailResult.success) {
            res.status(200).json({ message: 'Password reset link sent to your email' });
        } else {
            res.status(500).json({ error: 'Failed to send password reset link' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while sending password reset link'});
    }
});
app.post('/api/reset-password', async (req, res) => {
    const { token, id, newPassword } = req.body;

    try {
        const db = client.db('xplora');
        const user = await db.collection('users').findOne({
            _id: MongoClient.ObjectId(id),
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

        await db.collection('users').updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { resetToken: "", resetTokenExpiration: "" }  // Remove reset fields
            }
        );

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while resetting the password' });
    }
});
