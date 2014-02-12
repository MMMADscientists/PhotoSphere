var PhotoSphere = function (radius, widthSegments, heightSegments, texture) {
    var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments),
        material = new THREE.MeshLambertMaterial({ map: texture });

    material.side = THREE.BackSide;
    material.overdraw = true;

    THREE.Mesh.call(this, geometry, material);
};
PhotoSphere.prototype = Object.create(THREE.Mesh.prototype);
