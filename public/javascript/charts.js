var options = {
    series: [{
            name: "High - 2013",
            data: [28, 29, 33, 36, 32, 32, 33]
        },
        {
            name: "Low - 2013",
            data: [12, 11, 14, 18, 17, 13, 13]
        }
    ],
    chart: {
        height: 350,
        type: 'line',
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
        },
        toolbar: {
            show: false
        }
    },
    colors: ['#77B6EA', '#545454'],
    dataLabels: {
        enabled: true,
    },
    stroke: {
        curve: 'smooth'
    },
    title: {
        text: 'Average High & Low Temperature',
        align: 'left'
    },
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
        },
    },
    markers: {
        size: 1
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        title: {
            text: 'Month'
        }
    },
    yaxis: {
        title: {
            text: 'Temperature'
        },
        min: 5,
        max: 40
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
    }
};

var optionsPie = {
    series: [44, 55, 13, 43, 22],
    chart: {
        width: 380,
        type: 'donut',
    },
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
};

function createLineChart(options) {
    var chart = new ApexCharts(document.querySelector("#lineChart"), options);
    chart.render();

    var chartCat = new ApexCharts(document.querySelector("#categoryChart"), optionsPie);
    chartCat.render();

    var chartBal = new ApexCharts(document.querySelector("#balanceChart"), optionsPie);
    chartBal.render();
}

function getData() {
    var spese = $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/getSpeseForChart',
        success: function(data) {
            return data;
        }
    });

    var entrate = $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/getEntrateForChart',
        success: function(data) {
            return data;
        }
    });

}

window.onload = () => {
    createLineChart(options)
}