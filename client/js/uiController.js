var uiController = new function() {

    var _this = this,
        UI_ELEMENT = null,
        UI_SHOWN = false,
        HINT_CLASS_NAME = "hint",
        ELEMENTS = {
            infoBar: null,
            connect: null,
            login: null,
            message: null,
            addNode: null,
            messageHead: null,
            messageBody: null,
            editNode: null,
            copyNode: null,
            jumpNode: null,
            about: null,
            themesBlock: null,
            themeLink: null
        },
        FIELDS = { // @autofill
            connectHostname: null,
            connectPort: null,
            connectPassword: null,
            connectButton: null,
            loginUsername: null,
            loginPassword: null,
            loginNamespace: null,
            loginDatabase: null,
            loginButton: null,
            addNodeName: null,
            addNodeValue: null,
            editNodeName: null,
            editNodeValue: null,
            copySourcePath: null,
            copyDestinationPathPart: null,
            copyDestinationPathNode: null,
            jumpNodeName: null,
            aboutField: null
        };

    var hideAll = function() {

        var children = UI_ELEMENT.childNodes;

        for (var i in children) {
            if (!children.hasOwnProperty(i) || children[i].tagName !== "DIV") continue;
            children[i].style.opacity = 0;
            children[i].style.visibility = "hidden";
        }

    };

    /**
     * Focuses on element with a little timeout.
     *
     * @param element
     */
    var timeFocus = function(element) {

        setTimeout(function() {
            element.focus();
            element.select();
        }, 50);

    };

    var targetElement = function(element) {

        hideAll();
        element.style.opacity = 1;
        element.style.visibility = "visible";

    };

    var showLoadingAnimation = function(enable) {

        ELEMENTS.infoBar.innerHTML = (enable)?"<img class=\"loadingImage\" " +
            "src=\"img/loading-black.gif\"/>":"";

    };

    /**
     * Show hint.
     *
     * @param html
     */
    this.hint = function(html) {

        var o = document.createElement("DIV"),
            direction = { x: 0, y: -1 },
            stepsLeft = 55,
            FADE_END_STEPS = 25,
            FADE_END_SLEEP = 20,
            FADE_START = 9,
            SPEED = 5,
            INITIAL_STEPS = stepsLeft,
            interval;

        o.className = HINT_CLASS_NAME;
        o.innerHTML = html;
        o.style["opacity"] = 0;

        interval = setInterval(function() {

            o.style[direction.x > 0 ? "left" : "right"] =
                (parseFloat(o.style[direction.x > 0 ? "left" : "right"]) || 0)
                    + Math.sin(Math.PI/2*Math.max(stepsLeft - FADE_END_STEPS, 0)/(INITIAL_STEPS - FADE_END_STEPS))
                *SPEED*direction.x + "px";
            o.style[direction.y > 0 ? "top" : "bottom"] =
                (parseFloat(o.style[direction.y > 0 ? "top" : "bottom"]) || 0)
                    - Math.sin(Math.PI/2*Math.max(stepsLeft - FADE_END_STEPS, 0)/(INITIAL_STEPS - FADE_END_STEPS))
                *SPEED*direction.y + "px";

            stepsLeft--;
            o.style["opacity"] = Math.min((INITIAL_STEPS - stepsLeft)/FADE_START,
                    stepsLeft/(FADE_END_STEPS - FADE_END_SLEEP), 1);

            if (stepsLeft < 0) {
                o.parentNode.removeChild(o);
                clearInterval(interval);
            }

        }, 25);

        document.body.appendChild(o);

    };

    this.showLoadingAnimation = showLoadingAnimation;

    this.showUI = function() {

        UI_SHOWN = true;
        app.switchControl(false);
        UI_ELEMENT.style.left = 0;

    };

    this.hideUI = function() {

        UI_SHOWN = false;
        app.switchControl(true);
        if (document.activeElement) document.activeElement.blur();
        UI_ELEMENT.style.left = "100%";

    };

    this.switchConnectForm = function() {

        _this.showUI();
        targetElement(ELEMENTS.connect);
        timeFocus(FIELDS.connectHostname);

    };

    this.switchLoginForm = function() {

        _this.showUI();
        targetElement(ELEMENTS.login);
        timeFocus(FIELDS.loginUsername);

    };

    this.switchAddNodeForm = function() {

        _this.showUI();
        targetElement(ELEMENTS.addNode);
        timeFocus(FIELDS.addNodeName);
        FIELDS.addNodeValue.value = "";

    };

    this.switchEditNodeForm = function(nodeName, nodeValue) {

        FIELDS.editNodeName.value = nodeName;
        FIELDS.editNodeValue.value = nodeValue;
        _this.showUI();
        targetElement(ELEMENTS.editNode);
        timeFocus(FIELDS.editNodeValue);

    };

    this.switchCopyNodeForm = function(fromPath, toPathPart) {

        FIELDS.copySourcePath.innerHTML = fromPath;
        FIELDS.copyDestinationPathPart.innerHTML = toPathPart;
        _this.showUI();
        targetElement(ELEMENTS.copyNode);
        timeFocus(FIELDS.copyDestinationPathNode);

    };

    this.switchJumpNodeForm = function() {

        _this.showUI();
        targetElement(ELEMENTS.jumpNode);

    };

    this.switchInfoPanel = function() {

        _this.showUI();
        targetElement(ELEMENTS.about);
        FIELDS.aboutField.innerHTML = "";
        app.getDescription(function(text){
            FIELDS.aboutField.innerHTML += "<p>" + text + "</p>";
        });

    };

    var actions = {

        connect: {

            setWaitingState: function(wait) {
                showLoadingAnimation(wait);
                FIELDS.connectButton.disabled = !!wait;
            }

        },

        login: {

            setWaitingState: function(wait) {
                showLoadingAnimation(wait);
                FIELDS.loginButton.disabled = !!wait;
            }

        }

    };

    this.showMessage = function(headHTML, bodyHTML) {

        ELEMENTS.messageHead.innerHTML = headHTML;
        ELEMENTS.messageBody.innerHTML = bodyHTML;
        ELEMENTS.message.style.left = 0;

    };

    /**
     * DOM events handlers.
     */
    this.handle = {

        connect: function() {

            if (!UI_SHOWN) return;

            var data = {
                host: FIELDS.connectHostname.value,
                port: FIELDS.connectPort.value,
                masterPassword: FIELDS.connectPassword.value
            };

            actions.connect.setWaitingState(true);
            _this.hideUI();

            server.connect(data.host, data.port, function(result) {

                if (result) {

                    server.send(data, function(success) {

                        var dbs = success.databases || {},
                            l = "";

                        for (var d in dbs) {
                            if (!dbs.hasOwnProperty(d)) continue;
                            l += "<option>" + dbs[d] + "</option>";
                        }

                        FIELDS.loginDatabase.innerHTML = l;

                        actions.connect.setWaitingState(false);
                        _this.switchLoginForm();

                    });

                } else {

                    actions.connect.setWaitingState(false);
                    _this.showMessage("Connection error", "Unable to connect to " + data.host + ":" + data.port);
                    _this.switchConnectForm();

                }

            });

        },

        login: function() {

            if (!UI_SHOWN) return;

            var data = {
                username: FIELDS.loginUsername.value,
                password: FIELDS.loginPassword.value,
                namespace: FIELDS.loginNamespace.value,
                database: FIELDS.loginDatabase.options[FIELDS.loginDatabase.selectedIndex].innerHTML
            };

            actions.connect.setWaitingState(true);
            _this.hideUI();

            server.send(data, function(response) {

                actions.connect.setWaitingState(false);
                if (response && response.error === 0) {

                    _this.hideUI();
                    app.resetTreeRoot(null, data.namespace, data.username);

                } else {
                    _this.showMessage("Login error", "Unable to login. Server reason: " + (response.reason || "[none]"));
                    _this.switchLoginForm();
                }

            });

        },

        messageClose: function() {

            ELEMENTS.message.style.left = "-100%";

        },

        addNode: function() {

            var name = FIELDS.addNodeName.value,
                value = FIELDS.addNodeValue.value;

            _this.hideUI();

            if (!name) {
                _this.showMessage("Unable to create node", "\"name\" field is empty.");
                return;
            }

            app.handle.addNode(name, value);

        },

        copyNode: function() {

            _this.hideUI();
            app.handle.copyNode(FIELDS.copyDestinationPathNode.value);

        },

        editNode: function() {

            var name = FIELDS.editNodeName.value,
                value = FIELDS.editNodeValue.value;

            _this.hideUI();

            if (!name) {
                _this.showMessage("Unable to edit node", "\"name\" field is empty.");
                return;
            }

            app.handle.editNode(name, value);

        },

        jumpNode: function() {

            var name = FIELDS.jumpNodeName.value;

            _this.hideUI();

            app.handle.jumpNode(name);

        }

    };

    var initElements = function() {

        FIELDS.connectHostname.value = document.location.hostname;
        FIELDS.connectPort.value = 57775;
        FIELDS.connectPassword.value = "protect";

    };

    var onElementFocused = function(e) {

        if (e && e.target) {
            document.activeElement = (e.target == document) ? null : e.target;
        }

    };

    this.updateSettings = function() {

        // update theme settings

        var theme = localStorage.getItem("settings-theme") || THEMES[0] || "classic",
            setUp = ELEMENTS.themesBlock.innerHTML.indexOf(">") > 0;

        if (!setUp) for (var i in THEMES) {
            ELEMENTS.themesBlock.innerHTML += "<label onclick=\"uiController.updateSettings();\">" +
                "<input type=\"radio\" name=\"settings-" +
                "theme\" value=\"" + THEMES[i] + "\"/" + ((theme === THEMES[i])?" checked":"") +
                "> " + THEMES[i] + "</label>&nbsp; ";
        }

        var els = document.getElementsByName("settings-theme"), e;

        for (e in els) {
            if (els[e].checked) {
                theme = els[e].value;
            }
        }

        ELEMENTS.themeLink.setAttribute("href", "css/theme-" + theme + ".css");
        document.body.appendChild(e = document.createElement("DIV")); e.parentNode.removeChild(e);
        localStorage.setItem("settings-theme", theme);

    };

    this.init = function() {

        UI_ELEMENT = document.getElementById("ui");
        ELEMENTS.connect = document.getElementById("ui-connect");
        ELEMENTS.login = document.getElementById("ui-login");
        ELEMENTS.infoBar = document.getElementById("ui-infoBar");
        ELEMENTS.message = document.getElementById("ui-message");
        ELEMENTS.messageHead = document.getElementById("ui-message-head");
        ELEMENTS.messageBody = document.getElementById("ui-message-body");
        ELEMENTS.addNode = document.getElementById("ui-addNode");
        ELEMENTS.copyNode = document.getElementById("ui-copyNode");
        ELEMENTS.editNode = document.getElementById("ui-editNode");
        ELEMENTS.jumpNode = document.getElementById("ui-jumpNode");
        ELEMENTS.about = document.getElementById("ui-about");
        ELEMENTS.themesBlock = document.getElementById("themesBlock");
        ELEMENTS.themeLink = document.getElementById("themeLink");

        for (var i in FIELDS) {
            if (!FIELDS.hasOwnProperty(i)) continue;
            if ((FIELDS[i] = document.getElementById(i)) === undefined) {
                console.error("Listed element with ID=" + i + " is not present in DOM.")
            }
        }

        if (document.addEventListener) {
            document.addEventListener("focus", onElementFocused, true);
        }

        _this.updateSettings();

        initElements();

    };

};
