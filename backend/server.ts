import express from 'express';
import {newsRouter} from "./router/news.router";
import {homepage} from "./controller/homepage.controller";
import {managementInterfaceRouter} from "./router/managementInterface.router";
import swaggerJsDoc from 'swagger-jsdoc';
import {sequelize} from "./db_connect";
import {News} from "./model/news.model";
import * as bodyParser from 'body-parser';
import path from "path";
import * as swaggerUi from 'swagger-ui-express';
import dotenv from "dotenv";
import { Request, Response } from 'express';
import cors from 'cors';

dotenv.config();
sequelize.addModels([News]);

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: "EIP API",
            version: '1.0.0',
            description: "EIP API Information"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["server.js", "./router/*.ts", "./swagger/*.ts"]
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app: any = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.static(process.cwd() + "/frontend/dist"))
app.get('/', homepage);
app.use('/', managementInterfaceRouter)
app.use('/', newsRouter);
app.use(cors());


process.on('uncaughtException', (err, origin) => {
    //code to log the errors
    console.log(
        `Caught exception: ${err}\n` +
        `Exception origin: ${origin}`,
    );
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });