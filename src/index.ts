import express from "express";

const app = express();
const port = 8080 || process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hi Andreas du er sgu en flot fyr! Nøj manner jeg har savnet dig her hen over ferien hvor er jeg glad for at se dig igen hver eneste dag!");
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});