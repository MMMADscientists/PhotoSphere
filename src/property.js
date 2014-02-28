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
};

// See about combining touch/mouse events
Property.prototype.onMouseDown = function (e) {
    this.scene.children.forEach(function (child) {
        if (child instanceof PhotoSphere) {
            child.startRotate(e.clientX, e.clientY);

            var clickedConnections = child.getConnectionsClicked(e.clientX, e.clientY, this.camera);

            if (clickedConnections.length > 0) {
                console.log("Clicked!!");
            }
        }
    }.bind(this));
};

Property.prototype.onMouseMove = function (e) {
    this.scene.children.forEach(function (child) {
        if (child instanceof PhotoSphere) {
            child.rotate(e.clientX, e.clientY);
        }
    });
};

Property.prototype.onMouseUp = function (e) {
    this.scene.children.forEach(function (child) {
        if (child instanceof PhotoSphere) {
            child.endRotate();
        }
    });
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

Property.prototype.onTouchStart = function (e) {
    var firstTouch = e.touches[0];

    this.scene.children.forEach(function (child) {
        if (child instanceof PhotoSphere) {
            child.startRotate(firstTouch.clientX, firstTouch.clientY);

            var clickedConnections = child.getConnectionsClicked(
                firstTouch.clientX,
                firstTouch.clientY,
                this.camera);

            if (clickedConnections.length > 0) {
                console.log("Touched!!");
            }
        }
    }.bind(this));
};

Property.prototype.onTouchMove = function (e) {
    var firstTouch = e.touches[0];

    this.scene.children.forEach(function (child) {
        if (child instanceof PhotoSphere) {
            child.rotate(firstTouch.clientX, firstTouch.clientY);
        }
    });
};

Property.prototype.onTouchEnd = function (e) {
    this.scene.children.forEach(function (child) {
        if (child instanceof PhotoSphere) {
            child.endRotate();
        }
    });
};

Property.prototype.bind = function () {
    this.renderer.domElement.addEventListener(
            "mousedown",
            this.onMouseDown.bind(this));

    this.renderer.domElement.addEventListener(
            "mousemove",
            this.onMouseMove.bind(this));

    this.renderer.domElement.addEventListener(
            "mouseup",
            this.onMouseUp.bind(this));

    this.renderer.domElement.addEventListener(
            "mousewheel",
            this.onMouseWheel.bind(this));

    this.renderer.domElement.addEventListener(
            "touchstart",
            this.onTouchStart.bind(this));

    this.renderer.domElement.addEventListener(
            "touchmove",
            this.onTouchMove.bind(this));

    this.renderer.domElement.addEventListener(
            "touchend",
            this.onTouchEnd.bind(this));
};

Property.prototype.render = function () {
    this.renderer.render(this.scene, this.camera);
};

Property.FOV = 75;

Property.ASPECT = window.innerWidth / window.innerHeight;

Property.NEAR = 0.1;

Property.FAR = 1000;

Property.SCALE = 1.25;

Property.FOV_MINIMUM = 5;

Property.FOV_MAXIMUM = 75;
