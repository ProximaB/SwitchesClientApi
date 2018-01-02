//cache: true, $.ajaxSetup({'cache':true});
// application code here!
function SwitchesViewModel(url) {
  var self = this;

  self.switchesURI = 'http://localhost:57493/api/Switches/';
  self.roomsURI = 'http://localhost:57493/api/Rooms/';
  self.switchesURI = url;
  self.switches = ko.observableArray();
  self.rooms = ko.observableArray();

  self.ajax = function(uri, method, data) {
    var request = {
      url: uri,
      type: method,
      contentType: "application/json",
      accepts: "application/json",
      cache: false,
      dataType: "json",
      cache: true,
      data: JSON.stringify(data),
      error: function(jqXHR) {
        console.log("ajax error " + jqXHR.status);
      }
    };
    return $.ajax(request);
  };

  self.beginAdd = function() {
    //alert("Add");
    $("#add").modal();
  };
  self.beginEdit = function(swth) {
    alert("Edit: " + swth.name());
  };
  self.remove = function(swth) {
    alert("Remove: " + swth.name());
  };
  self.switchOFF = function(swth) {
    swth.state("OFF");
    console.log("switchOFF");
  };
  self.switchON = function(swth) {
    swth.state("ON");
    console.log("switchON");
  };

  self.add = function(swth) {
    self.ajax(self.switchesURI, "POST", swth).done(function(data) {
      console.log("data add" + data);
      self.switches.push({
        id: ko.observable(data.id),
        name: ko.observable(data.name),
        description: ko.observable(data.description),
        state: ko.observable(data.state),
        roomId: ko.observable(data[i].roomId),
        isON: ko.computed(function() {
          console.log("[add] computed state: " + data.state);
          return data.state == "ON" ? true : false;
        })
      });
    });
  };

  self.ajax(self.switchesURI, "GET").done(function(data) {
    for (var i = 0; i < data.length; i++) {
      console.log("[GET relay] GetSwitch[" + i + "] = " + data[i]);
      self.switches.push({
        id: ko.observable(data[i].id),
        name: ko.observable(data[i].name),
        description: ko.observable(data[i].description),
        state: ko.observable(data[i].state),
        roomId: ko.observable(data[i].roomId),
        roomName: ko.observable("noName"),
        isON: ko.computed(function() {
          console.log("computed state: " + data[i].state);
          return data[i].state == "ON" ? true : false;
        })
      });
    }
  }).done(function(){
    console.log("TESTEST");
    self.ajax(self.roomsURI, "GET").done(function(data) {
    console.log("[GET Rooms] data len: " + data.length);
    for (var i = 0; i < data.length; i++) {
      self.rooms.push({
        id: ko.observable(data[i].id),
        name: ko.observable(data[i].name),
        description: ko.observable(data[i].description)
      });
    }
  }).done(function(){
    console.log("switches length: "+self.switches().length);
    console.log("rooms length: "+self.rooms().length);
    for( var k = 0; k < self.switches().length; k++) {
      for( var j = 0; j < self.rooms().length; j++) {   
       
        if(self.switches()[k].roomId() == self.rooms()[j].id()){
          self.switches()[k].roomName(self.rooms()[j].name()); 
          console.log("self.rooms()[j].name = "+self.rooms()[j].name());
          console.log("self.switches()[k].name = "+self.switches()[k].roomName());
        }
          console.log("PUSHED");
        }
      }
      console.log("Switch[" + "all" + "] = " + self.switches());
    });
  }); 
}

function AddSwitchViewModel() {
  var self = this;
  self.rooms = new SwitchesViewModel("http://localhost:57493/api/Rooms/").switches;
  self.name = ko.observable();
  self.description = ko.observable();
  self.roomId = ko.observable();
  self.state = ko.observable();
  self.addSwitch = function() {
    $("#add").modal("hide");
    switchesViewModel.add({
      name: self.name(),
      description: self.description(),
      state: self.state(),
      roomId: self.roomId()
    });
    self.name("");
    self.description("");
  };
}

var switchesViewModel = new SwitchesViewModel('http://localhost:57493/api/Switches/');
//var addSwitchViewModel = new AddSwitchViewModel();
ko.applyBindings(switchesViewModel, $("#main")[0]);
//ko.applyBindings(addSwitchViewModel, $("#add")[0]);
//var vm = new TasksViewModel();
// $(function () {
//     ko.applyBindings(vm);
// })
