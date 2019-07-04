//= require "model/model"
//= require "model/relay"

/* global model, relay */

describe('relay', function () {
    it('empty relay', function () {
        var source, destination;

        source = model();
        destination = model();

        relay({
            model: source,
            destination: destination
        });

        source.setValue(5);
        should.equal(5, destination.getValue());
    });

    it('transform relay', function () {
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
        should.equal(7, destination.getValue());
    });
});
