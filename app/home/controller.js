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
  waterfill: Ember.computed('data.[]', function() {
    let data = this.get('data');

    let waterfill = [];
    for (let i = this.get('max'); i > 0; i--) {

      let levelfill = 0;
      let count = 0;
      let minIndex;
      let maxIndex = -1;
      data.forEach((datum, index) => {
        if (datum >= i) {

          count++;

          if (minIndex === undefined) {
            minIndex = index;
          }

          if (index > maxIndex) {
            maxIndex = index;
          }
        }
      });

      console.log(`level ${i}: count: ${count} min: ${minIndex} max: ${maxIndex}`)
      if (count > 1) {

        levelfill = maxIndex - minIndex - count + 1;
      }

      waterfill.push(levelfill);
    }
    return waterfill;
  }),
  waterfillTotal: Ember.computed.sum('waterfill'),
  actions: {
    randomize: function() {
      let data = [];
      for (let i = 0; i < 7; i++) {
        var datum = Math.floor(Math.random() * (8));
        console.log('random: ' + datum);
        data.push(datum);
      }
      console.log('random data: ' + data);
      let dataString = JSON.stringify(data, null, '');
      this.set('dataString', dataString.substring(1, dataString.length - 1))
    }
  }
});