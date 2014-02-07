function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
};
function getTask(taskId){
    return {
        id:taskId,
        name:"taskName",
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



function createMap(divName){
    var topo = L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
        maxZoom: 16,
        attribution: '<a href="http://www.statkart.no/">Statens kartverk</a>'
    });

    return  new L.Map(divName, {layers: [topo], center: new L.LatLng(60.389444, 5.33), zoom: 13 });

}

function changeLayer(cb) {
  console.log("layer"+cb.id+"set to " + cb.checked);
}