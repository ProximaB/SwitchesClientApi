//cache: true, $.ajaxSetup({'cache':true});
// application code here!
function SwitchesViewModel() {
    var self = this;
    self.switchesURI = '';
    
    self.switches = ko.observableArray();

    self.switches([
        {
            name: ko.observable('switch #1'),
            description: ko.observable('description #1'),
            state: ko.observable(false)
        },
        {
            name: ko.observable('switch #2'),
            description: ko.observable('description #2'),
            state: ko.observable(true)
        }
    ]);

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
ko.applyBindings(new SwitchesViewModel(), $('#main')[0]);

//var vm = new TasksViewModel();
// $(function () {
//     ko.applyBindings(vm);
// })