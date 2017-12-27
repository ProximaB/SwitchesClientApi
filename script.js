//cache: true, $.ajaxSetup({'cache':true});
// application code here!
function SwitchesViewModel() {
    var self = this;
    self.switchesURI = '';

    self.switches = ko.observableArray();

    self.ajax = function(uri, method, data) {
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            accepts: "application/json",
            cache: false,
            dataType: 'json',
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
}

self.ajax(self.switchesURI, 'GET').done(function(data) {
    for (var i=0; i < data.switches.length; i++) {
        self.switches.push({
            name: ko.observable(data.switches.);
            description: ko.observable(data.switches.);
            state: ko.observable(data.switches.);
        });
    }
});

ko.applyBindings(new SwitchesViewModel(), $('#main')[0]);

//var vm = new TasksViewModel();
// $(function () {
//     ko.applyBindings(vm);
// })