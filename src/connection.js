Connection = function (position, destinationID, texture) {
    texture = texture || THREE.ImageUtils.loadTexture($("#door")[0].src);

    var geometry = new THREE.PlaneGeometry(1, 2),
        material = new THREE.MeshLambertMaterial({ map: texture, transparent: true });

    material.side = THREE.DoubleSide;

    THREE.Mesh.call(this, geometry, material);

    this.position = position;
    this.destinationID = destinationID;
};

Connection.prototype = Object.create(THREE.Mesh.prototype);
