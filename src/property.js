Property = function () {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
            Property.FOV,
            Property.ASPECT,
            Property.NEAR,
            Property.FAR);

    this.renderer = new THREE.WebGLRenderer();

    // This may need to change when we start moving to embedding the canvas into websites
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene.add(new THREE.AmbientLight(0xffffff));

    this.rooms = {};

    this.currentRoom = null;
};

Property.prototype.onPress = function (x, y) {
    if (this.currentRoom !== null) {
        this.currentRoom.startRotate(x, y);

        var clickedConnections = this.currentRoom.getConnectionsClicked(x, y, this.camera);

        if (clickedConnections.length > 0) {
            var connection = clickedConnections[0];

            this.setCurrentRoom(connection.object.destinationID);
        }
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

Property.fromJSON = function (url) {
    var property = new Property();

    $.ajax({
        url: url,

        dataType: "json",

        // TODO: Figure out how to remove the synchronocity
        async: false,

        success: function (result) {
            result.rooms.forEach(function (roomData) {
                var room = new Room(
                    roomData.name,
                    THREE.ImageUtils.loadTexture(roomData.url));

                roomData.connections.forEach(function (connData) {
                    var loc = new THREE.Vector3();

                    room.add(new Connection(
                            loc.fromArray(connData.coordinates),
                            connData.name));
                });

                property.addRoom(roomData.name, room);
            })

            property.setCurrentRoom(result.default_room);
        },

        error: function (request, textStatus, errorThrown) {
            console.log("An error has occurred while retrieving the JSON...");
            console.log(textStatus);
        },

        complete: function (request, textStatus) {
            console.log("JSON request complete!!");
        },
    });

    return property;
};
