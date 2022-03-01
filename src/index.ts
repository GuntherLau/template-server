import "reflect-metadata"
import { createConnection } from "typeorm"
import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { Routes } from "./routes"
import { User } from "./entity/User"
import { Server } from "socket.io"
import { createServer } from "http"
import { Mappings } from "./mappings"

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // setup express app here
    // ...

    // start express server
    const server = createServer(app)
    const io = new Server(server)
    io.on("connection", (socket) => {
        console.log(`new connection ${socket.id}`)

        Mappings.forEach(info => {
            socket.on(info.path, message => {
                (new (info.caller as any))[info.func](io, socket, message)
            })
        })
    })
    server.listen(3000)

    // insert new users for test
    await connection.manager.save(connection.manager.create(User, {
        firstName: "Timber",
        lastName: "Saw",
        age: 27
    }));
    await connection.manager.save(connection.manager.create(User, {
        firstName: "Phantom",
        lastName: "Assassin",
        age: 24
    }));

    console.log("server has started on port 3000.");



}).catch(error => console.log(error));
