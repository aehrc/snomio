import express from "express";
import ViteExpress from "vite-express";
import compression from "compression";

const app = express();

type SaveRequest = {
    filepath: string;
    jsontosave: string;
}
app.use(express.json({limit: '1000mb' })); 
app.use(compression());

app.post("/api/savejson", (req, res) => {
    const props: SaveRequest = req.body;
    if (!props || !props.filepath || !props.jsontosave) {
        res.status(400);
        res.send({message: 'Bad request, provide filepath and jsontosave in the request!, code: 400'})
        return;
    }
    res.send(`File: ${props.filepath} - json: ${props.jsontosave}`);
});
  
app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
