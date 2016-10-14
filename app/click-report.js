import rsvp from 'rsvp';

class ClickReport {
  constructor(reporting) {
    this.reporting = reporting;
  }

  loadCharts(done) {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(done);
  }

  draw() {
    this.drawTotalClicked();
    this.drawTotalUsers();
    this.drawLastClicked();
    this.drawPieChart('pie_chart_div');
    this.drawLineChart('line_chart_div', 'minute');
    this.drawLineChart('line_chart_div2', 'hour');
    this.drawLineChart('line_chart_div3', 'day');
    this.drawLineChart('line_chart_div4', 'week');
  }

  drawLineChart(id, during) {
    let title;
    const queryStartTime = new Date();
    const queryEndTime = new Date();
    queryStartTime.setMilliseconds(0);
    queryStartTime.setSeconds(0);
    queryStartTime.setMinutes(0);

    switch (during) {
      case 'minute':
        title = 'Clicked this Hour';
        queryEndTime.setTime(queryStartTime.getTime());
        queryEndTime.setHours(queryStartTime.getHours() + 1);
        break;
      case 'hour':
        title = 'Clicked Today';
        queryStartTime.setHours(0);
        queryEndTime.setTime(queryStartTime.getTime());
        queryEndTime.setDate(queryStartTime.getDate() + 1);
        break;
      case 'day':
        title = 'Clicked this Month';
        queryStartTime.setHours(0);
        queryStartTime.setDate(1);
        queryEndTime.setTime(queryStartTime.getTime());
        queryEndTime.setMonth(queryStartTime.getMonth() + 1);
        break;
      case 'week':
        title = 'Clicked this Year';
        queryStartTime.setHours(0);
        queryStartTime.setDate(1);
        queryStartTime.setMonth(1);
        queryEndTime.setTime(queryStartTime.getTime());
        queryEndTime.setFullYear(queryStartTime.getFullYear() + 1);
        break;
    }

    const aClickedQuery = this.reporting.filter().sum('aclicked').during(during).range(queryStartTime.getTime(), queryEndTime.getTime()).values(true);
    const bClickedQuery = this.reporting.filter().sum('bclicked').during(during).range(queryStartTime.getTime(), queryEndTime.getTime()).values(true);
    const cClickedQuery = this.reporting.filter().sum('cclicked').during(during).range(queryStartTime.getTime(), queryEndTime.getTime()).values(true);
    const dClickedQuery = this.reporting.filter().sum('dclicked').during(during).range(queryStartTime.getTime(), queryEndTime.getTime()).values(true);

    rsvp.all([aClickedQuery, bClickedQuery, cClickedQuery, dClickedQuery]).then(function(values) {
      var element = jQuery('#' + id);
      var chartdata = [['Time', 'A', 'B', 'C', 'D']];
      for (var i = 0; i < values[0].length; i++) {
        chartdata.push([new Date(values[0][i].timestamp), values[0][i].value, values[1][i].value, values[2][i].value, values[3][i].value]);
      }
      var data = new google.visualization.arrayToDataTable(chartdata);

      // Set chart options
      var options = {
         title: title,
         width: element.width(),
         height: 400,
         legend: { position: 'bottom' }
      };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.LineChart(element[0]);
      chart.draw(data, options);
    });
  }

  drawPieChart(id) {
    const aClickedQuery = this.reporting.filter().sum('aclicked').value();
    const bClickedQuery = this.reporting.filter().sum('bclicked').value();
    const cClickedQuery = this.reporting.filter().sum('cclicked').value();
    const dClickedQuery = this.reporting.filter().sum('dclicked').value();

    rsvp.all([aClickedQuery, bClickedQuery, cClickedQuery, dClickedQuery]).then(function(values) {
      var element = jQuery('#' + id);
      var data = new google.visualization.arrayToDataTable([
        ['Button', 'Times Clicked'],
        ['A', values[0]],
        ['B', values[1]],
        ['C', values[2]],
        ['D', values[3]]
      ]);

      // Set chart options
      var options = {
         width: element.width(),
         height: 400,
         legend: { position: 'bottom' }
      };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(element[0]);
      chart.draw(data, options);
    });
  }

  drawTotalClicked() {
    const query = this.reporting.filter().sum('anyclicked').select(1);

    query.then(function(values) {
      jQuery('#total_clicked_count').text(values[0] || 0);
    }).catch(function(err) { console.log(err); });
  }

  drawTotalUsers() {
    const query = this.reporting.filter('users').sum('anyclicked').count();

    query.then(function(value) {
      jQuery('#total_users_count').text(value || 0);
    }).catch(function(err) { console.log(err); });
  }

  drawLastClicked() {
    const query = this.reporting.filter().last('timestamp').select(1);

    query.then(function(values) {
      if (values.length === 0) {
        jQuery('#last_clicked_time').text('never');
      } else {
        var date = new Date();
        date.setTime(values[0]);
        jQuery('#last_clicked_time').text(date.toLocaleString());
      }
    }).catch(function(err) { console.log(err); });
  }
}

module.exports = ClickReport;
