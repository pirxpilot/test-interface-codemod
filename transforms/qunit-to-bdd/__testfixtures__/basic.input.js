//= require "model/model"
//= require "model/relay"

/* global model, relay */

module('relay');

test('empty relay', function () {
    var source, destination;

    source = model();
    destination = model();

    relay({
        model: source,
        destination: destination
    });

    source.setValue(5);
    equal(5, destination.getValue());
});

test('transform relay', function () {
    var source, destination;

    source = model();
    destination = model();

    relay({
        model: source,
        destination: destination,
        transform: function(v) {
            return v + 2;
        }
    });

    source.setValue(5);
    equal(7, destination.getValue());
});
