// app.js
const express = require("express");
const app = express();
const session = require('express-session');
const PORT = process.env.PORT || 3000;
const { PrismaClient } = require('./generated/prisma')
const prisma = new PrismaClient()
const cors = require('cors');

const postsRouter = require("./routes/postsRouter");
const authRouter = require('./routes/authRouter');

require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
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

 

