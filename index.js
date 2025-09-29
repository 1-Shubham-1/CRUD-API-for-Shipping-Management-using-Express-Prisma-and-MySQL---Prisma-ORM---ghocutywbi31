const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const {verifySecret} = require("./middleware/authMiddleware");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
// Start the server
app.post("/api/shipping/create", verifySecret, async (req, res) => {
  try {

    const { userId, productId, count } = req.body
    if (!userId || !productId || !count) {
      return res.status(404).json({ error: "All fields required" });
    }
    const creates = await prisma.shipping.create({
      data: { userId, productId, count }
    })
    return res.status(201).json(creates);
  }
  catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Internal server error" })
  }
})


app.put("/api/shipping/cancel", verifySecret, async (req, res) => {
  try {
    const { shippingId } = req.body
    if (!shippingId) {
      return res.status(404).json({ "error": "Missing shippingId" })
    }
    const ship = await prisma.shipping.update({
      where: { id: Number(shippingId) },
      data: {
        status: "cancelled"
      }
    })
    return res.status(200).json(ship)
  }
  catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/shipping/get", verifySecret, async (req, res) => {
  try {

    const { userId } = req.query
    let data
    if (!userId) {
      data = await prisma.shipping.findMany()
    }
    else {
      data = await prisma.shipping.findMany(
        {
          where: { userId: Number(userId) }
        }
      );
    }
    return res.status(200).json(data)
  }
  catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Internal server error" })
  }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;

