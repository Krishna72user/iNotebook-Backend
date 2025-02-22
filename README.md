# iNotebook Backend Documentation

## Overview
The backend of **iNotebook** is built using **Node.js** with **Express.js** and **MongoDB** as the database. It provides APIs for user authentication and note management, following the **RESTful API** architecture.

## Technologies Used
- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JWT (JSON Web Token) for Authentication**
- **bcrypt.js for Password Hashing**
- **dotenv for Environment Variables**
- **CORS for Cross-Origin Requests**

---

## Folder Structure
```
Backend/
│-- node_modules/
│-- routes/
│   │-- auth.js
│   │-- notes.js
│-- models/
│   │-- User.js
│   │-- Note.js
│-- middleware/
│   │-- fetchUser.js
│-- db.js
│-- .env
│-- index.js
│-- package.json
│-- README.md
```

---

## Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/inotebook-backend.git
cd inotebook-backend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add the following:
```env
MONGO_URI=Your_MONGO_URI
SECRET=your_jwt_secret_key
```

### 4️⃣ Run the Server
 Using nodemon (for development):
```sh
nodemon index.js
```
The server will run at: **http://localhost:3000**

---

## API Endpoints
### 1️⃣ Authentication Routes (`/auth`)
| Method | Endpoint          | Description                | Requires Auth |
|--------|------------------|---------------------------|--------------|
| POST   | `/auth/signup`    | Register a new user       | ❌ No        |
| POST   | `/auth/login`     | Login user & get token    | ❌ No        |
| GET    | `/auth/getUser`   | Get logged-in user details | ✅ Yes        |

### 2️⃣ Notes Routes (`/notes`)
| Method | Endpoint       | Description                 | Requires Auth |
|--------|---------------|-----------------------------|--------------|
| GET    | `/notes/fetchAllnotes`  | Fetch all user notes       | ✅ Yes       |
| POST   | `/notes/addnote`    | Add a new note             | ✅ Yes       |
| PUT    | `/notes/updatenote/:id` | Update an existing note | ✅ Yes       |
| DELETE | `/notes/deletenote/:id` | Delete a note           | ✅ Yes       |

---

## Middleware
### `fetchUser.js`
- A middleware to authenticate users using JWT.
- Used in protected routes like `/notes`.
```js
iimport jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const fetchuser = (req,res,next)=>{
    try {
        const authtoken=req.headers['authtoken']
        if(authtoken){
            const decoded = jwt.verify(authtoken, process.env.SECRET)
            req.id = decoded.id
            next();
        }
        else{
            res.status(401).send('Token is missing.')
        }
    } catch (error) {
        res.status(401).send("Please enter a valid auth token.")
    }
}
```

---
## Database Models
### 1️⃣ User Model (`User.js`)
```js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
```

### 2️⃣ Note Model (`Notes.js`)
```js
import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tag: { type: String, default: 'General' },
    date: { type: Date, default: Date.now }
});

export default mongoose.model('Note', NoteSchema);
```

---

## Deployment
### 1️⃣ Host Backend on **Render/Vercel/Heroku**
- Push code to GitHub
- Use **Render/Vercel/Heroku** to deploy
- Set environment variables on the hosting platform

### 2️⃣ Connect to **MongoDB Atlas**
- Create a MongoDB Atlas account
- Get the **Mongo URI** and update `.env`

---

## Security & Best Practices
✅ Store **secret keys** in `.env`, never commit them.  
✅ Use **bcrypt.js** to hash passwords.  
✅ Always validate **user inputs** to prevent **injection attacks**.  
✅ Use **CORS middleware** to allow requests from the frontend.

---

## Conclusion
This backend provides **authentication** and **note management** services for iNotebook. It ensures **secure user data handling** with **JWT authentication** and **MongoDB database**.


