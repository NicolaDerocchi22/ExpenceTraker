function fetchDataBudgetChart() {
  return fetch("/getDataBudgetChart", {
    method: "POST",
    headers: {
      Accept: "application/json; charset=utf-8",
      "Content-Type": "application/json; charset=utf-8",
    },
    dataType: "json",
  }).then((response) => response.json());
}

function fetchDataBilancioChart() {
  return fetch("/getDataBilancioChart", {
    method: "POST",
    headers: {
      Accept: "application/json; charset=utf-8",
      "Content-Type": "application/json; charset=utf-8",
    },
    dataType: "json",
  }).then((response) => response.json());
}

function loadChartBudget() {
  var optionsBudget = {
    series: [
      {
        name: "Actual",
        data: [],
      },
    ],
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    colors: ["#00E396"],
    dataLabels: {
      formatter: function (val, opt) {
        const goals =
          opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex].goals;

        if (goals && goals.length) {
          return `${val} / ${goals[0].value}`;
        }
        return val;
      },
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      customLegendItems: ["Actual", "Expected"],
      markers: {
        fillColors: ["#00E396", "#775DD0"],
      },
    },
  };

  fetchDataBudgetChart().then((res) => {
    if (res === null) {
      console.log("Bad");
    } else {
      optionsBudget.series[0].data = res;
      var budgetChart = new ApexCharts(
        document.querySelector("#budgetChart"),
        optionsBudget
      );
      budgetChart.render();
    }
  });
}

function loadChartBilancio() {
  var optionsBilancioChart = {
    series: [
      {
        name: "Bilancio",
        data: [],
      },
    ],
    chart: {
      type: "area",
      height: 350,
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },

    title: {
      text: "Bilancio",
      align: "left",
    },
    subtitle: {
      text: "Balance Movements",
      align: "left",
    },
    labels: [],
    xaxis: {
      type: "string",
    },
    yaxis: {
      opposite: true,
    },
    legend: {
      horizontalAlign: "left",
    },
  };

  fetchDataBilancioChart().then((res) => {
    if (res === null) {
      console.log("Bad");
    } else {
      optionsBilancioChart.series[0].data = res.data;
      optionsBilancioChart.labels = res.categories;
      var bilancioChart = new ApexCharts(
        document.querySelector("#chartBilancio"),
        optionsBilancioChart
      );
      bilancioChart.render();
    }
  });
}

function loadCharts(params) {
  loadChartBudget();
  loadChartBilancio();
}

window.onload = () => {
  loadCharts();
};
