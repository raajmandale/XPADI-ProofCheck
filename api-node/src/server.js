
const express = require("express");
const path = require("path");

const app = express();
app.use("/surface-report", express.static(path.join(__dirname, "../../surface-report")));

app.listen(8787, ()=>{
  console.log("XPADI PHASE-3 running at http://localhost:8787/surface-report/");
});
