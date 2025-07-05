// app.js
const express = require("express");
const app = express();
const session = require('express-session');
const PORT = process.env.PORT || 3000;
const { PrismaClient } = require('./generated/prisma')
const prisma = new PrismaClient()

const postsRouter = require("./routes/postsRouter");
const authRouter = require('./routes/authRouter');

require('dotenv').config();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: new (require('connect-pg-simple')(session))({
        conString: process.env.DATABASE_URL
    }),
    saveUninitialized: false,
    secret: process.env.SECRET,
    resave: false,
    cookie: {maxAge: 30 * 24 * 60 * 60 * 1000 },
}));

app.use("/", postsRouter); 
app.use('/auth', authRouter);

async function main() {
    try {
        app.listen(PORT, () => {
            console.log("Listening on 3000");
        });
    } catch(err) {
        console.error("Failed to start server");
        await prisma.$disconnect();
        process.exit(1);
    }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

 

