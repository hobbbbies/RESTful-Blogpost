// app.js
const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const session = require('express-session');
var passport = require('passport');
const PORT = process.env.PORT || 3000;
const { PrismaClient } = require('./generated/prisma')
const prisma = new PrismaClient()

require('./config/passport');
require('dotenv').config();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: new (require('connect-pg-simple')(session))({
        pool: pool,
    }),
    saveUninitialized: false,
    secret: process.env.SECRET,
    resave: false,
    cookie: {maxAge: 30 * 24 * 60 * 60 * 1000 },
}));
app.use(passport.session());
app.use("/", indexRouter); 

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

 

