/**
 * WebSocket interface to application.
 */

module.exports = new function() {

    var config = require("./../config.js"),
        mainApplication = require("./index.js"),
        Adapter = require("./adapter.js"),
        WebSocketServer = require("ws").Server,
        fs = require("fs"),
        webSocketServer,

        clients = {},

        __this = this;

    this.MANIFEST = {

        VERSION: "0.9.5.3",
        AUTHOR: "ZitRo",
        DATE: "27.02.2014",
        DESCRIPTION: "GlobalsDB admin server adapter",
        COPYRIGHT: "Modified version special for GoldenByte challenge. All rights protected."

    };

    var generateNewClientKey = function() {
        var key;
        do {
            key = parseInt(Math.random().toString().substr(2));
        } while (clients.hasOwnProperty(key));
        return key;
    };

    var appendToLogFile = function(text) {

        var fileName = config.system.cwd + "/" + config.server.logFileName;

        var append = function() {

            fs.appendFile(fileName, text + "\r\n", function(err) {
                if (err) console.log(text);
            });

        };

        fs.exists(fileName, function(exists) {
            if (exists) {
                append();
            } else {
                fs.open(fileName, "w", function(err) {
                    if (err) console.log(text); else append();
                })
            }
        })

    };

    var logConnection = function(ip) {

        appendToLogFile("Connection on " + new Date + " IP=" + ip);

    };

    var logDisconnect = function(ip) {

        appendToLogFile("Disconnected on " + new Date + " IP=" + ip);

    };

    var logLogin = function(success, data, ip) {

        appendToLogFile("Login ["+(success?"SUCCESS":"FAIL")+"] on " + new Date + " IP=" + ip + "; DB=" +
            (data.path || "default") + "; NAMESPACE=" + data.namespace + "; LOGIN=" + data.login + "; PASS=" +
            (data.password || "").replace(/./g, "*") +
            (config.server.useMasterPassword?"; MASTER_PASSWORD="+data.masterPassword:""));

    };

    var getSocketIP = function(ws) {

        return ws.upgradeReq.headers['x-forwarded-for'] || ws.upgradeReq.connection.remoteAddress;

    };

    var newConnection = function(ws) {

        var id = generateNewClientKey();

        clients[id] = {
            id: id,
            socket: ws,
            logged: false,
            authorized: false,
            adapter: null
        };

        ws.on("message", function(data) {
            socketDataHandler(clients[id], data);
        });

        ws.on("close", function(code, reason) {
            if (clients.hasOwnProperty(id) && typeof clients[id] === "object") {
                /*if (clients[id].adapter) clients[id].adapter.asynchronousRequest({
                    request: "close" // gc-able?
                }, function(data) {});*/
                delete clients[id];
                logDisconnect(getSocketIP(ws));
            } else console.error("[clients] local variable fault.");
        });

        if (config.server.log) {
            logConnection(getSocketIP(ws));
        }

    };

    /**
     *
     * @param client
     * @param data {Object}
     */
    var send = function(client, data) {

        try {
            client.socket.send(JSON.stringify(data));
        } catch (e) {}

    };

    var socketDataHandler = function(client, data) {

        try {

            data = JSON.parse(data);

        } catch(e) { return }

        if (client.logged && client.authorized) { // if authorized and logged

            if (!client.adapter) return;

            if (data && data.request && data.request === "getManifest") {

                data.manifest = __this.MANIFEST;

                send(client, data);
                return;
            }

            client.adapter.asynchronousRequest(data, function(data) {
                send(client, data);
            });

        } else if (!client.authorized) { // if not authorized

            if (config.server.useMasterPassword) {
                if (data.masterPassword !== config.server.masterPassword) {
                    if (config.server.log) logLogin(false, data, getSocketIP(client.socket));
                    client.socket.close();
                    return;
                }
            }

            var dbs = config.database.databases,
                dbs1 = [];

            for (var i in dbs) {
                if (!dbs.hasOwnProperty(i)) continue;
                dbs1.push(i);
            }

            send(client, {
                __id: data.__id,
                databases: dbs1,
                error: 0
            });

            client.authorized = true;

            /*client.adapter.asynchronousRequest({
                request: "open",
                data: {
                    path: "C:/temp/lal/lal",
                    login: data.login,
                    password: data.password,
                    namespace: data.namespace
                }
            }, function(dbData) {
                console.log(dbData);
                client.adapter.asynchronousRequest({
                    request: "setNode",
                    data: {
                        pathArray: ["testMeNode"],
                        data: "test for creating new database"
                    }
                }, function(ee) {
                    console.log(ee);
                });
            });*/

            /*client.adapter.asynchronousRequest({
                request: "open",
                data: {
                    path: config.database.databases[0], // @debug
                    login: data.login,
                    password: data.password,
                    namespace: data.namespace
                }
            }, function(dbData) {
                if (config.server.log) logLogin(!dbData.error, data, getSocketIP(client.socket));
                if (dbData.error) {
                    client.socket.close();
                } else {
                    send(client, {
                        __id: data.__id,
                        error: 0
                    });
                    client.logged = true;
                }
            });*/

        } else if (!client.logged && client.authorized) { // if authorized but not logged
            // creating db adapter for client if not exists || reset db connection.

            if (!client.adapter) {
                client.adapter = new Adapter();
            } else {
                console.log("HAS ADAPTER socketInterface.js todo"); // todo
            }

            if (!config.database.databases[data.database]) {
                send(client, {
                    __id: data.__id,
                    error: 1,
                    reason: "Database " + data.database + " not configured on server."
                });
                return;
            }

            client.adapter.asynchronousRequest({
                request: "open",
                data: {
                    path: config.database.databases[data.database] || "",
                    login: data.username,
                    password: data.password,
                    namespace: data.namespace
                }
            }, function(dbData) {
                if (config.server.log) logLogin(!dbData.error, data, getSocketIP(client.socket));
                if (dbData.error) {

                    send(client, {
                        __id: data.__id,
                        error: 1,
                        reason: "Wrong login data.",
                        data: dbData
                    });

                } else {

                    send(client, {
                        __id: data.__id,
                        error: 0
                    });
                    client.logged = true;

                }
            });


        } else { // something weird

            client.socket.close();

        }

    };

    this.init = function() {

        webSocketServer = new WebSocketServer({
            port: config.server.port
        });
        webSocketServer.on("connection", newConnection);
        console.log("Server joined.");

    };

};