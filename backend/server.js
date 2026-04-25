const express = require('express');
const dbconnection = require('./config/db');
const app = express();
const port = 5000
const cors = require('cors');






//middleware
 app.use(cors());
app.use(express.json());





// routes
const ticketRoutes = require('./routes/ticketRoutes');
 const busRoutes = require("./routes/busRoutes");
 const userRoutes = require("./routes/userRoutes")
app.use("/api/buses", busRoutes);
app.use ("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    dbconnection();
}   )

