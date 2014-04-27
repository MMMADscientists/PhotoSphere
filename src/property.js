Property = function () {
    this.scene = new THREE.Scene();
       
    if ($("#viewer").length > 0) {
        var canvas = $("#viewer")[0];

        this.camera = new THREE.PerspectiveCamera(
            Property.FOV,
            canvas.width / canvas.height,
            Property.NEAR,
            Property.FAR);

        this.renderer = new THREE.WebGLRenderer({ canvas: canvas });

        this.renderer.setSize(canvas.width, canvas.height);
    } else {
        this.camera = new THREE.PerspectiveCamera(
            Property.FOV,
            Property.ASPECT,
            Property.NEAR,
            Property.FAR);

        this.renderer = new THREE.CanvasRenderer();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        $("body").append(this.renderer.domElement);
    }

    this.scene.add(new THREE.AmbientLight(0xffffff));

    this.rooms = {};

    this.currentRoom = null;

    this.lock = false;

    this.holding = false;
};

Property.prototype.onClick = function (x, y) {
    if (this.holding) {
        this.holding = false;
        return;
    }

    if (this.currentRoom !== null) {
        var clickedConnections = this.currentRoom.getConnectionsClicked(x, y, this.camera, this.renderer.domElement);

        if (clickedConnections.intersections.length > 0 && clickedConnections.intersections[0].object instanceof Connection) {
            var connection = clickedConnections.intersections[0];

            this.setCurrentRoom(connection.object.destinationID);
        }
    }
};

Property.prototype.onPress = function (x, y) {
    if (this.currentRoom !== null) {
        this.currentRoom.startRotate(x, y);
    }
};

Property.prototype.onMove = function (x, y) {
    if (this.currentRoom !== null) {
        this.currentRoom.rotate(x, y);
    }
};

Property.prototype.onRelease = function () {
    if (this.currentRoom !== null) {
        this.currentRoom.endRotate();
    }
};

Property.prototype.onMouseWheel = function (e) {
    e.preventDefault();

    if (e.deltaY < 0) {
        this.camera.fov = Math.max(Property.FOV_MINIMUM, this.camera.fov / Property.SCALE);

        this.camera.updateProjectionMatrix();
    } else if ( e.deltaY > 0) {
        this.camera.fov = Math.min(Property.FOV_MAXIMUM, this.camera.fov * Property.SCALE);

        this.camera.updateProjectionMatrix();
    }
};

Property.prototype.onEditConnection = function (x, y) {
    if (this.currentRoom !== null) {
        this.lock = true;

        var clickedConnections = this.currentRoom.getConnectionsClicked(x, y, this.camera, this.renderer.domElement);

        if (clickedConnections.intersections.length > 0 && clickedConnections.intersections[0].object instanceof Connection) {
            // Edit the connection
            var connection = clickedConnections.intersections[0];

            var editEvent = new CustomEvent(
                    "propertyEdit", {
                        detail: {
                            id: connection.object.connectionID,
                        },
                    });

            window.dispatchEvent(editEvent);

            // Dispatch event to applications using JockeyJS
            Jockey.send(
                "propertyEdit", {
                    id: connection.object.connectionID,
                }, function () {
                    console.log("Applications have received propertyEdit!");
                });

            console.log("Dispatched propertyEdit Event");
        } else {
            var point = clickedConnections.ray.direction.normalize().multiplyScalar(clickedConnections.intersections[0].distance - 10);

            var rot = this.currentRoom.rotation.clone();
            rot.y *= -1;

            var quaternion = new THREE.Quaternion();
            quaternion.setFromEuler(rot);

            point.applyQuaternion(quaternion);

            var createEvent = new CustomEvent("propertyCreate", { detail: { x: point.x, y: point.y, z: point.z } });

            // Dispatch event to UI JavaScript
            window.dispatchEvent(createEvent);

            console.log("Dispatched propertyCreate Event");

            // Dispatch event to applications using JockeyJS
            Jockey.send(
                "propertyCreate", {
                    x: point.x,
                    y: point.y,
                    z: point.z,
                }, function () {
                    console.log("Applications have received propertyCreate!");
                });
        }
    }
};

Property.prototype.bind = function () {
    this.renderer.domElement.addEventListener(
            "mousedown",
            function (e) {
                this.onPress(e.clientX, e.clientY);
            }.bind(this));

    this.renderer.domElement.addEventListener(
            "mousemove",
            function (e) {
                this.onMove(e.clientX, e.clientY);
            }.bind(this));

    this.renderer.domElement.addEventListener(
            "mouseup",
            function (e) {
                this.onRelease(e.clientX, e.clientY);
            }.bind(this));

    this.renderer.domElement.addEventListener(
            "mouseout",
            function (e) {
                this.onRelease(e.clientX, e.clientY);
            }.bind(this));

    this.renderer.domElement.addEventListener(
            "mousewheel",
            this.onMouseWheel.bind(this));

    this.renderer.domElement.addEventListener(
            "click",
            function (e) {
                this.onClick(e.clientX, e.clientY);
            }.bind(this));

    this.renderer.domElement.addEventListener(
            "touchstart",
            function (e) {
                var t = e.touches[0];

                this.onPress(t.clientX, t.clientY);
            }.bind(this));

    this.renderer.domElement.addEventListener(
            "touchmove",
            function (e) {
                var t = e.touches[0];

                this.onMove(t.clientX, t.clientY);
            }.bind(this));

    this.renderer.domElement.addEventListener(
            "touchend",
            function (e) {
                var t = e.touches[0];

                this.onRelease(t.clientX, t.clientY);
            }.bind(this));

    this.renderer.domElement.addEventListener(
            "touchleave",
            function (e) {
                var t = e.touches[0];

                this.onRelease(t.clientX, t.clientY);
            }.bind(this));

    Hammer(this.renderer.domElement).on(
            "hold",
            function (e) {
                this.holding = true;

                var t = e.gesture.touches[0];

                this.onEditConnection(t.clientX, t.clientY);
            }.bind(this));
};

Property.prototype.render = function () {
    this.renderer.render(this.scene, this.camera);
};

Property.prototype.addRoom = function (name, room) {
    this.rooms[name] = room;
};

Property.prototype.setCurrentRoom = function (name) {
    if (this.currentRoom !== null) {
        this.scene.remove(this.currentRoom);
    }

    this.currentRoom = this.rooms[name];

    this.scene.add(this.currentRoom);
};

Property.FOV = 75;

Property.ASPECT = window.innerWidth / window.innerHeight;

Property.NEAR = 0.1;

Property.FAR = 1000;

Property.SCALE = 1.25;

Property.FOV_MINIMUM = 5;

Property.FOV_MAXIMUM = 75;

Property.fromWebpage = function (imageClass) {
    imageClass = imageClass || ".texture";

    var property = new Property();

    $(imageClass).each(function () {
        var room = new Room(this.id, THREE.ImageUtils.loadTexture(this.src));

        var connections = metadata[this.id];

        connections.forEach(function (conn) {
            var loc = new THREE.Vector3(parseFloat(conn.doorX), parseFloat(conn.doorY), parseFloat(conn.doorZ));

            room.add(new Connection(loc, conn.idDestination, conn.idConnection));
        });

        property.addRoom(this.id, room);

        property.setCurrentRoom(this.id);
    });

    if (defaultRoom !== "") {
        property.setCurrentRoom(defaultRoom);
    }

    return property;
};
