var options = {
    series: [{
        name: 'Spese',
        data: [12, 32, 64, 88, 5, 34, 43, 100, 57, 12, 32, 64, 88, 0, 45, 54, 12, 32, 64, 88, 34, 45, 45, 12, 32, 64, 88, 23, 32, 43]
    }],
    chart: {
        type: 'bar',
        height: 350
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '30%',
            endingShape: 'rounded'
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
    },
    yaxis: {
        title: {
            text: '€'
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter: function(val) {
                return "€ " + val
            }
        }
    }
};

var optionsPieBalance = {
    series: [976, 1209],
    chart: {
        width: 380,
        type: 'donut',
    },
    labels: ['Speso', 'Bilancio'],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'center'
            }
        }
    }]
};

var optionsPieCategoryS = {
    series: [44, 55, 13, 43, 22, 43, 54, 76, 32, 45, 21, 86, 98],
    chart: {
        width: 380,
        type: 'donut',
    },
    labels: ['Spesa', 'Shopping', 'Ristorante', 'Bar', 'PayPal', 'Benzina', 'Regali', 'Spesa', 'Casa', 'Palestra', 'Prelievi', 'Telefono', 'Altro'],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'center'
            }
        }
    }]
};

var optionsPieCategoryE = {
    series: [1000, 145, 10],
    chart: {
        width: 380,
        type: 'donut',
    },
    labels: ['Stipendio', 'PayPal', 'Altro'],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'center'
            }
        }
    }]
};

function createLineChart(options) {
    var chart = new ApexCharts(document.querySelector("#lineChart"), options);
    chart.render();

    var chartCatS = new ApexCharts(document.querySelector("#categoryChartS"), optionsPieCategoryS);
    chartCatS.render();

    var chartCatE = new ApexCharts(document.querySelector("#categoryChartE"), optionsPieCategoryE);
    chartCatE.render();

    var chartBal = new ApexCharts(document.querySelector("#balanceChart"), optionsPieBalance);
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