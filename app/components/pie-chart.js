import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({

  chartOptions: {
    backgroundColor: '#f5f5f5',
    legend: {
      position: 'bottom'
    }
  },

  didInsertElement () {
    const _this = this;
    this.setChartWidth();
    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(() => {
      this.initiateChart();
    });

    $(window).resize(function () {
      if (this.isResizing) {
        clearTimeout(this.isResizing);
      }

      this.isResizing = setTimeout(function () {
        $(this).trigger('hasResized');
      }, 400);
    });

    $(window).on('hasResized', function () {
      _this.setChartWidth();
      _this.drawChart();
    });
  },

  initiateChart () {
    const elId = this.$().attr('id');
    this.set('chart', new google.visualization.PieChart(document.getElementById(elId)));
    this.drawChart();
  },

  drawChart () {
    let data;
    if (this.get('data').length <= 1) {
      data = google.visualization.arrayToDataTable([
        ['Category', 'Spendings'],
        ['None', 1]
      ]);
    } else {
      data = google.visualization.arrayToDataTable(this.get('data'));
    }
    this.get('chart').draw(data, this.get('chartOptions'));
  },

  didUpdateAttrs () {
    this.drawChart();
  },

  didDestroyElement () {
    this.get('chart').clearChart();
    $(window).off('resize');
    $(window).off('hasResized');
  },

  setChartWidth () {
    this.set('chartOptions.width', this.$().width());
  }

});
