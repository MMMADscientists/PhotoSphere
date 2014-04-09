$(document).ready(function () {
    window.addEventListener("propertyCreate", function (e) {
        console.log("Caught propertyCreate Event");
    }, false);
});
