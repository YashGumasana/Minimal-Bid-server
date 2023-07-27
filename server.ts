import server from "./src";

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`server started on port ${port}.....`);
})



    // "db_url": "mongodb+srv://YashGumasana:9879445325120@nodeexpressprojects.nmkks8r.mongodb.net/SAMPLE_PROJECT_TS"
