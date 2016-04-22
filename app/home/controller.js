import Ember from 'ember';

export default Ember.Controller.extend({
  dataString: '4, 5, 2, 4, 2, 2',
  data: Ember.computed('dataString', function() {
    return eval('[' + this.get('dataString') + ']');
  }),
  styleDimensions: Ember.computed.map('data', function(datum, index) {
    return {
      value: datum,
      height: datum * 100,
      left: index * 100 + 10
    };
  }),
  max: Ember.computed.max('data'),

  // calculates the water that could be contained in the columns
  waterfillByLevel: Ember.computed('data.[]', function() {
    let data = this.get('data');

    // total amount of water for whole histogram
    let waterfill = [];

    // start at highest column(s)' level and calculate fill a row at a time
    for (let i = this.get('max'); i > 0; i--) {

      // amount of water for current level (row) of the histogram
      let levelfill = 0;

      // number of columns at/above the current level
      let count = 0;

      // index of leftmost column at/above the current level
      let minIndex;

      // index of rightmost column at/above the current level
      let maxIndex = -1;

      data.forEach((datum, index) => {
        if (datum >= i) {

          // this column is at or above the current level, include

          count++;

          if (minIndex === undefined) {
            // first column at/above is set as leftmost column
            minIndex = index;
          }

          if (index > maxIndex) {
            maxIndex = index;
          }
        }
      });

      // if there are 0 or 1 columns at/above current level, no water can fill
      if (count > 1) {

        levelfill = maxIndex - minIndex - count + 1;
      }

      waterfill.push(levelfill);
    }
    return waterfill;
  }),
  waterfill: Ember.computed.sum('waterfillByLevel'),
  actions: {

    // limited randomization of data to generate a new histogram whose fill
    // can be calculated
    randomize: function() {
      let data = [];
      for (let i = 0; i < 7; i++) {
        var datum = Math.floor(Math.random() * (8));
        data.push(datum);
      }
      let dataString = JSON.stringify(data, null, '');
      this.set('dataString', dataString.substring(1, dataString.length - 1));
    }
  }
});