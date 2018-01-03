//cache: true, $.ajaxSetup({'cache':true});
// 

function Switch(data) {
  var self = this;
  self.id = ko.observable(data.id);
  self.name = ko.observable(data.name);
  self.description = ko.observable(data.description);
  self.state = ko.observable(data.state);
  self.roomId = ko.observable(data.roomId);
  self.roomName = ko.observable("noName");
  self.isON = ko.computed({
    read: function () {
      return self.state() == "ON" ? true : false;
    },
    write: function (value) {
      self.state(value ? "ON" : "OFF");
    },
    owner: this
  });
};

/*
id: ko.observable(data[i].id),
    name: ko.observable(data[i].name),
    description: ko.observable(data[i].description),
    state: ko.observable(data[i].state),
    roomId: ko.observable(data[i].roomId),
    roomName: ko.observable("noName"),
    isON: ko.Computed({
      read: function () {
        return this.state == "ON" ? true : false;
      },
      write: function (value) {
        this.state = value ? "ON" : "OFF";
      },
      owner: this
    }),
  }*/
function SwitchesViewModel() {
  var self = this;

  self.roomsURI = 'http://localhost:57493/api/Rooms/';
  self.switchesURI = 'http://localhost:57493/api/Switches/';
  self.switches = ko.observableArray();
  self.rooms = ko.observableArray();

  self.ajax = function (uri, method, data) {
    var request = {
      url: uri,
      type: method,
      contentType: "application/json",
      accepts: "application/json",
      cache: false,
      dataType: "json",
      cache: true,
      data: JSON.stringify(data),
      error: function (jqXHR) {
        console.log("ajax error " + jqXHR.status);
      }
    };
    return $.ajax(request);
  };

  self.beginAdd = function () {
    //alert("Add");
    $("#add").modal();
  };
  self.beginEdit = function (swth) {
    editSwitchViewModel.setSwitch(swth);
    $('#edit').modal('show');
  }
  self.edit = function (swth, data) {
    self.ajax(switchesURI + swth.id(), 'PUT', data).done(function (newSwith) {
      self.updateSwitch(swth, newSwith);
    });
  }
  self.updateSwitch = function (swth, newSwith) {
    var i = self.switches.indexOf(swth);
    self.switches()[i].uri(newSwith.uri);
    self.switches()[i].title(newSwith.title);
    self.switches()[i].description(newSwith.description);
    self.switches()[i].done(newSwith.done);
  }

  self.remove = function (swth) {
    if (confirm("Are you sure you want to delete this item?")) {
      self.ajax(self.switchesURI + swth.id(), 'DELETE').done(function () {}); //??
      self.switches.remove(function (_switch) {
        return _switch.id == swth.id
      });
      console.log("Remove complete");
    }
  };

  self.switchOFF = function (swth) {
    self.ajax(self.switchesURI + swth.id() + '/OFF', "PUT").done(function () {
      swth.isON(false);
      console.log("switchOFF");
    })
  };

  self.switchON = function (swth) {
    self.ajax(self.switchesURI + swth.id() + '/ON', "PUT").done(function () {
      swth.isON(true);
      console.log("switchON");
    })

  };

  self.add = function (swth) {
    self.ajax(self.switchesURI, "POST", swth).done(function (data) {
      console.log("data add" + data);
      self.switches = ko.push(Switch(data))
    }).done(
      function () {
        for (var j = 0; j < self.rooms().length; j++) {
          var pointer = self.switches().length - 1;
          if (self.switches()[pointer].roomId() == self.rooms()[j].id()) {
            self.switches()[pointer].roomName(self.rooms()[j].name());
          }
          console.log("PUSHED");
        }
        console.log("Switch[" + "pointer" + "] = " + self.switches());
      });
  };

  self.ajax(self.switchesURI, "GET").done(function (data) {
    for (var i = 0; i < data.length; i++) {
      console.log("[GET relay] GetSwitch[" + i + "] = " + data[i]);
      self.switches.push(new Switch(data[i]));
    }
  }).done(function () {
    self.joinWithRoom();
  });

  self.joinWithRoom = function () { // XD
    console.log("TESTEST");
    self.ajax(self.roomsURI, "GET").done(function (data) {
      console.log("[GET Rooms] data len: " + data.length);
      for (var i = 0; i < data.length; i++) {
        self.rooms.push({
          id: ko.observable(data[i].id),
          name: ko.observable(data[i].name),
          description: ko.observable(data[i].description)
        });
      }
    }).done(
      function () {
        console.log("switches length: " + self.switches().length);
        console.log("rooms length: " + self.rooms().length);
        for (var k = 0; k < self.switches().length; k++) {
          for (var j = 0; j < self.rooms().length; j++) {
            if (self.switches()[k].roomId() == self.rooms()[j].id()) {
              self.switches()[k].roomName(self.rooms()[j].name());
              console.log("self.rooms()[j].name = " + self.rooms()[j].name());
              console.log("self.switches()[k].name = " + self.switches()[k].roomName());
            }
            console.log("PUSHED");
          }
        }
        console.log("Switches[all] = " + self.switches());
      });
  };

  self.beginLogin = function() {
    $('#login').modal('show');
}
self.login = function(username, password) {
    self.username = username;
    self.password = password;
    self.ajax(self.switchesURI, 'GET').done(function(data) {
      for (var i = 0; i < data.length; i++) {
        self.rooms.push({
          id: ko.observable(data[i].id),
          name: ko.observable(data[i].name),
          description: ko.observable(data[i].description)
        });
      }
    }).fail(function(jqXHR) {
        if (jqXHR.status == 403)
            setTimeout(self.beginLogin, 500);
    });
}

self.beginLogin();
}

function AddSwitchViewModel() {
  var self = this;
  self.rooms = ko.observableArray();
  self.name = ko.observable();
  self.description = ko.observable();
  self.roomId = ko.observable();
  self.state = ko.observable();

  self.roomsURI = 'http://localhost:57493/api/Rooms/';

  self.ajax = function (uri, method, data) {
    var request = {
      url: uri,
      type: method,
      contentType: "application/json",
      accepts: "application/json",
      cache: false,
      dataType: "json",
      cache: true,
      data: JSON.stringify(data),
      error: function (jqXHR) {
        console.log("ajax error " + jqXHR.status);
      }
    };
    return $.ajax(request);
  };

  self.ajax(self.roomsURI, "GET").done(function (data) {
    console.log("AddSwitch_Get_Length" + data);
    for (var i = 0; i < data.length; i++) {
      self.rooms.push({
        id: ko.observable(data[i].id),
        name: ko.observable(data[i].name),
        description: ko.observable(data[i].description)
      });
    }
  });

  self.addSwitch = function () {
    $("#add").modal("hide");
    switchesViewModel.add({
      name: self.name(),
      description: self.description(),
      state: self.state(),
      roomId: self.roomId()
    });

    self.name("");
    self.description("");
  }
}

function EditSwitchViewModel() {
  var self = this;

  self.rooms = ko.observableArray();

  self.name = ko.observable();
  self.description = ko.observable();
  self.roomId = ko.observable();
  self.state = ko.observable();
  
  self.roomsURI = 'http://localhost:57493/api/Rooms/';

  self.ajax = function (uri, method, data) {
    var request = {
      url: uri,
      type: method,
      contentType: "application/json",
      accepts: "application/json",
      cache: false,
      dataType: "json",
      cache: true,
      data: JSON.stringify(data),
      error: function (jqXHR) {
        console.log("ajax error " + jqXHR.status);
      }
    };
    return $.ajax(request);
  };

  self.ajax(self.roomsURI, "GET").done(function (data) {
    console.log("AddSwitch_Get_Length" + data);
    for (var i = 0; i < data.length; i++) {
      self.rooms.push({
        id: ko.observable(data[i].id),
        name: ko.observable(data[i].name),
        description: ko.observable(data[i].description)
      });
    }
  });

 
  self.setSwitch = function (swth) {
    self.switchPointer = swth;

    self.name(swth.name());
    self.description(swth.description());
    self.roomId(swth.roomId());
    self.state(swth.state());
    $('edit').modal('show');
  }
  self.editSwitch = function () {
    $('#edit').modal('hide');
    
    switchesViewModel.edit(self.switchPointer, {
      name: ko.observable(data[i].name),
      description: ko.observable(data[i].description),
      state: ko.observable(data[i].state),
      roomId: ko.observable(data[i].roomId),
    });
  }
  
}

function LoginViewModel() {
  var self = this;
  self.username = ko.observable();
  self.password = ko.observable();

  self.login = function() {
      $('#login').modal('hide');
      tasksViewModel.login(self.username(), self.password());
  }
}

var switchesViewModel = new SwitchesViewModel();
var addSwitchViewModel = new AddSwitchViewModel();
var editSwitchViewModel = new EditSwitchViewModel();
ko.applyBindings(switchesViewModel, $("#main")[0]);
ko.applyBindings(addSwitchViewModel, $("#add")[0]);
ko.applyBindings(editSwitchViewModel, $("#edit")[0]);