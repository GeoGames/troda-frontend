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


function editTask(marker, map, data){
    (function(marker, map){
        $("#add").unbind('click');
        $("#add").click(function(e){
            console.log(marker);
            /*map.removeLayer(marker);*/
            marker.setOpacity(0.1);

            })})(marker, map);
    var editor = $(".show_task.prototype");
    var editor2 = editor.clone();
    editor2.removeClass('prototype');
    editor2.find("span.navn").text(data.navn);
    editor2.find("span.kategori").text(data.kategori);
    editor2.find("span.art").text(data.art);
    return editor2[0];
}


function addPoint(e){
    var marker = L.marker(e.latlng);
    marker.addTo(map);
    markers.push(marker);
    marker.bindPopup(editTask(marker));
    $.post("http://localhost:3007/api/troda/" + trodaId + "/tasks" ,{ lat: e.lat, lon: e.lon }, function(){console.log('added lonlat');});
}

var userIcon = L.icon({
    iconUrl: 'icons/PERSON.png',

    iconSize:     [46, 40], // size of the icon
    iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
    popupAnchor:  [0,0] // point from which the popup should open relative to the iconAnchor
});




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

    var userMarker;


function createSolverMap(divName, trodaId){
    var map;
    var topo = L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
        maxZoom: 16,
        attribution: '<a href="http://www.statkart.no/">Statens kartverk</a>'
    });

    function showCoordinates (e) {
        alert(e.latlng);
    }

         function moveHere(e){
             if(userMarker !== undefined){
                  map.removeLayer(userMarker);
                  userMarker=undefined;
             }
             userMarker = new L.Marker(e.latlng , {icon:userIcon,draggable:true});
             userMarker.addTo(map);
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
            text: 'Flytt hit',
            callback: moveHere
        }]});


    return map;
}

var layers=new Array();
layers["kulturminner"]={
     enabled:true
}
layers["topper"]={
     enabled:true
}
layers["ssr"]={
     enabled:true
}

function changeLayer(cb) {
// id == dataset. Stygt men sandt
    layers[cb.id].enabled= cb.checked;
    if(layers[cb.id].enabled){

    }
    else {

    }

    console.log("layer"+cb.id+"set to " + cb.checked);
}

var datasets;

function loadPoints(map, dataset){
    var bounds=map.getBounds();
    var minll=bounds.getSouthWest();
    var maxll=bounds.getNorthEast();

    $.get("http://localhost:3007/api/finn/" + dataset +"/?bbox="+minll.lng+','+minll.lat+','+maxll.lng+','+maxll.lat, function (data){
        console.log(data[0].geojson);
        var geoJsonLayer;

        for (var i=0; i < data.length; i++){
            geoJsonLayer = L.geoJson(data[i].geojson).addTo(map);
            (function(geoJsonLayer, map){
                geoJsonLayer.bindPopup(editTask(geoJsonLayer, map, data[i]));
            })(geoJsonLayer, map);

        }

    });
}