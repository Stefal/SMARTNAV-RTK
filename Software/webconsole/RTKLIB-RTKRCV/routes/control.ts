import * as fs from "../utilities/fs_wrapper";
import express = require("express");
import child_process = require("child_process");
const exec = child_process.exec;

import * as logger from "../utilities/logger";
const log = logger.getLogger("admin");

import * as rtkrcv from "../utilities/rtkrcv";

let rtkrcv_instance: rtkrcv.rtkrcv = null;

import * as config from "../config";



import { execution_manager } from "../utilities/execution_manager";

interface IServiceCommands {
    [id: string]: string;
}

interface IModuleResponse {
    error?: Error;
    stdout?: string;
    stderr?: string;
    isActive?: boolean;
    isEnabled?: boolean;
}

import { Application } from "../app";

export default function controlModule(application: Application) {
    const app = application.app;

    app.post("/control", async (req, res) => {
        log.info("POST /control", req.body);
        res.setHeader("Access-Control-Allow-Origin", "*");

        const commandType: string = req.body.commandType;
        const configType: string = req.body.configType;

        const response: IModuleResponse = {};

        let error: Error = null;

        try {
            switch (commandType) {
                case "start":
                    if (!rtkrcv_instance) {
                        if (!await fs.exists(config.rtkrcv_config)) {
                            throw new Error("rtkrcv configuration is missing: " + config.rtkrcv_config);
                        }
                        const rtkrcv_configuration = await fs.deserialize_file<rtkrcv.IRTKRCVConfig>(config.rtkrcv_config);
                        rtkrcv_instance = new rtkrcv.rtkrcv(rtkrcv_configuration);
                        rtkrcv_instance.start();
                        rtkrcv_configuration.enabled = true;
                        await fs.serialize_file<rtkrcv.IRTKRCVConfig>(config.rtkrcv_config, rtkrcv_configuration);
                    } else {
                        throw new Error("can't start an already stated service");
                    }
                    break;
                case "stop":
                    if (rtkrcv_instance) {
                        rtkrcv_instance.stop();
                        rtkrcv_instance = null;
                        const rtkrcv_configuration = await fs.deserialize_file<rtkrcv.IRTKRCVConfig>(config.rtkrcv_config);
                        rtkrcv_configuration.enabled = false;
                        await fs.serialize_file<rtkrcv.IRTKRCVConfig>(config.rtkrcv_config, rtkrcv_configuration);
                    }
                    break;
                case "status":
                    const rtkrcv_config = await fs.deserialize_file<rtkrcv.IRTKRCVConfig>(config.rtkrcv_config);
                    response.isActive = rtkrcv_instance && rtkrcv_instance.status();
                    response.isEnabled = rtkrcv_config.enabled;
                    if (!response.isActive) {
                        rtkrcv_instance = null;
                    }
                    break;
                case "enable": {
                    const rtkrcv_configuration = await fs.deserialize_file<rtkrcv.IRTKRCVConfig>(config.rtkrcv_config);
                    rtkrcv_configuration.enabled = true;
                    await fs.serialize_file<rtkrcv.IRTKRCVConfig>(config.rtkrcv_config, rtkrcv_configuration);
                } break;
                case "disable": {
                    const rtkrcv_configuration = await fs.deserialize_file<rtkrcv.IRTKRCVConfig>(config.rtkrcv_config);
                    rtkrcv_configuration.enabled = false;
                    await fs.serialize_file<rtkrcv.IRTKRCVConfig>(config.rtkrcv_config, rtkrcv_configuration);
                }
            }
        } catch (e) {
            log.error("error", configType, commandType, e);
            error = e;
        }
        response.stdout = (rtkrcv_instance) ? rtkrcv_instance.stdout() : null;
        response.stderr = (rtkrcv_instance) ? rtkrcv_instance.stderr() : null;
        response.error = error;

        return res.send(response);


    });

    app.get("/configuration", async (req, res) => {
        log.info("GET /configuration", req.body);

        const str2str_configuration = await fs.deserialize_file<rtkrcv.IRTKRCVConfig>(config.rtkrcv_config);
        res.send(str2str_configuration);
    });

    app.post("/configuration", async (req, res) => {
        log.info("POST /configuration", req.body);

        await fs.serialize_file<rtkrcv.IRTKRCVConfig>(config.rtkrcv_config, req.body);

        const str2str_configuration = await fs.deserialize_file<rtkrcv.IRTKRCVConfig>(config.rtkrcv_config);
        res.send(str2str_configuration);
    });

    function execComandLine(res: express.Response, commandLine: string) {
        exec(commandLine, (error, stdout, stderr) => {

            const response: IModuleResponse = {};

            if (error) {
                response.error = error;
            }

            if (stdout) {
                response.stdout = stdout;
            }

            if (stderr) {
                response.stderr = stderr;
            }

            return res.send(response);

        });
    }

}