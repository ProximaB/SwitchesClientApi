//cache: true, $.ajaxSetup({'cache':true});
// application code here!
function SwitchesViewModel() {
    var self = this;
    self.switchesURI = 'http://localhost:57493/api/Switch';

    self.switches = ko.observableArray();

    self.ajax = function(uri, method, data) {
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            accepts: "application/json",
            cache: false,
            dataType: 'json',
            'cache':true,
            data: JSON.stringify(data),         
            error: function(jqXHR) {
                console.log("ajax error " + jqXHR.status);
            }
        };
        return $.ajax(request);
    }

    self.beginAdd = function() {
        alert("Add");
    }
    self.beginEdit = function(swth) {
        alert("Edit: " + swth.name());
    }
    self.remove = function(swth) {
        alert("Remove: " + swth.name());
    }
    self.markInProgress = function(swth) {
        swth.state(false);
    }
    self.markDone = function(swth) {
        task.state(true);
    }

self.ajax(self.switchesURI, 'GET').done(function(data) {
    console.log(data.length);
    for (var i=0; i < data.length; i++) {
        self.switches.push({
            id: ko.observable(data[i].id),
            name: ko.observable(data[i].name),
            description: ko.observable(data[i].description),
            state: ko.observable(data[i].state)
        });
    }
});

}
ko.applyBindings(new SwitchesViewModel(), $('#main')[0]);

//var vm = new TasksViewModel();
// $(function () {
//     ko.applyBindings(vm);
// })