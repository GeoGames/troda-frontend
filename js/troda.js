function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
};
function getTask(taskId){
    return {
        id:taskId,
        name:"taskName" + taskId,
        location:"12,12"
    };

};

var troda=function(){
    return{
        id:getURLParameter("trodaid"),
        name:"someName",
        tasks:[
            getTask(1234)
        ]
    }
}();

function loadTroda(){
    var trodaId = getURLParameter("trodaId");
    $.get("http://localhost:3007/api/troda/"+trodaId,
        function(data){
            $("#trodaName").text(data.name);
    });
}



function createMap(divName){
    var map;
    var markers = [];
    var topo = L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
        maxZoom: 16,
        attribution: '<a href="http://www.statkart.no/">Statens kartverk</a>'
    });

    function showCoordinates (e) {
        alert(e.latlng);
    }

    function addPoint(e){
        var marker = L.marker(e.latlng);
        marker.addTo(map);
        markers.push(marker);
    }

    function centerMap (e) {
        map.panTo(e.latlng);
    }

    function zoomIn (e) {
        map.zoomIn();
    }

    function zoomOut (e) {
        map.zoomOut();
    }

    map = new L.Map(divName, {
        layers: [topo],
        center: new L.LatLng(60.389444, 5.33),
        zoom: 13 ,
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [
            {
                text: 'Show coordinates',
                callback: showCoordinates
            },
            {
                text: 'Add point to Toda',
                callback: addPoint

            },
            {
                text: 'Center map here',
                callback: centerMap
            }, '-', {
                text: 'Zoom in',
                callback: zoomIn
            }, {
                text: 'Zoom out',
                callback: zoomOut
            }]});

}

function changeLayer(cb) {
    console.log("layer"+cb.id+"set to " + cb.checked);
}