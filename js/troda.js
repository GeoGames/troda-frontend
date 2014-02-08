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
            getTask(1234),
            getTask(1234)
        ]
    }
}();

function loadTroda(){
    var trodaId = getURLParameter("trodaId");
    $.get("http://localhost:3007/api/troda/"+trodaId,
        function(data){
            $("#nameOfTroda").text(data.name);
            console.log(data);
    });
    return trodaId;
}

function editTask(marker){
    editor=document.getElementById("edit_task");
    return editor;
}



function addPoint(e){
    var marker = L.marker(e.latlng);
    marker.addTo(map);
    markers.push(marker);
    marker.bindPopup(editTask(marker));
    $.post("http://localhost:3007/api/troda/" + trodaId + "/tasks" ,{ lat: e.lat, lon: e.lon }, function(){console.log('added lonlat');});
}


function createMap(divName, trodaId){
    var map;
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
        marker.bindPopup(editTask(marker));
        $.post("http://localhost:3007/api/troda/" + trodaId + "/tasks" ,{ lat: e.lat, lon: e.lon }, function(){console.log('added lonlat');});
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


    return map;
}

function changeLayer(cb) {
    console.log("layer"+cb.id+"set to " + cb.checked);
}

function loadPoints(map, dataset){
    var bounds=map.getBounds();
    var minll=bounds.getSouthWest();
    var maxll=bounds.getNorthEast();

    $.get("http://localhost:3007/api/finn/" + dataset +"/?bbox="+minll.lng+','+minll.lat+','+maxll.lng+','+maxll.lat, function (data){
        console.log(data[0]);
        for (var i=0; i < data.length; i++){
            var marker = L.geoJson(data[i].geojson).addTo(map);
            marker.bindPopup(editTask(marker));
        }

    });
}