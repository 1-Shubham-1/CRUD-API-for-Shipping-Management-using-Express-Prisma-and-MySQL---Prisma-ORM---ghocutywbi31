const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const verifySecret = require("./middleware/authMiddleware");
const { Prisma } = require('@prisma/client');
const prisma = new Prisma()
// Start the server
app.post("/api/shipping/create", verifySecret, async (req, res) => {
  try {
    const { userId, productId, count } = req.body()
    if (!userId || !productId || !count) {
      return res.status(404).json({ error: "All fields required" });
    }
    const creates = await prisma.shipping.create({
      data:{ userId, productId, count, status: "pending" }
    })
    return res.status(201).json(creates);
  }
  catch(err){
    return res.status(500).json(err);
  }
})


req.put("/api/shipping/cancel",verifySecret,async(req,res) => {
  try{
    const {shippingId} = req.body
    if (!shippingId) {
      return res.status(404).json({"error": "Missing shippingId"})
    }
    const ship = await prisma.shipping.update({
      where:{id:shippingId},
      data:{
        status:"cancelled"
      }
    })
    return res.status(200).json(ship)
  }
  catch(err){
    return res.status(500).json(err)
  }
})

app.get("/api/shipping/get",verifySecret,async(req,res) => {
  try{
    const data = await prisma.shipping.findMany()
    const{key} = req.header
    if(!key){
      return res.status(403).json({ "error": "SHIPPING_SECRET_KEY is missing or invalid"})
    }
    if(key != "a1b2c3d4e5f67890123456789abcdef"){
      return res.status(403).json({"error": "Failed to authenticate SHIPPING_SECRET_KEY"})
    }
    return res.status(200).json(data)
  }
  catch(err){
    return res.status(500).json(err)
  }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;