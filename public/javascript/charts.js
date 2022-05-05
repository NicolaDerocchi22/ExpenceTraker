function createLineChart(options) {
    var chartCatE = new ApexCharts(document.querySelector("#categoryChartE"), optionsPieCategoryE);
    chartCatE.render();
}

function loadCharts() {
    loadLineChart()
    loadChartBalance()
    loadChartCategoriesS()
    loadChartCategoriesE()
}

function loadChartBalance() {

    var optionsPieBalance = {
        series: [],
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

    fetchDataChartBalance()
        .then(res => {
            if (res === null) {
                console.log("Bad");
            } else {
                optionsPieBalance.series = res
                var chart = new ApexCharts(document.querySelector("#balanceChart"), optionsPieBalance);
                chart.render();
            }
        })
}

function loadLineChart() {

    var optionsLineChart = {
        series: [{
            name: 'Spese',
            data: []
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
            categories: [],
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

    fetchDataLineChart()
        .then(res => {
            if (res === null) {
                console.log("Bad");
            } else {
                optionsLineChart.series[0].data = res.data
                optionsLineChart.xaxis.categories = res.categories
                var chart = new ApexCharts(document.querySelector("#lineChart"), optionsLineChart);
                chart.render();
            }
        })
}

function loadChartCategoriesS() {

    var optionsPieCategoryS = {
        series: [],
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

    fetchDataCategoriesChartS()
        .then(res => {
            if (res === null) {
                console.log("Bad");
            } else {
                optionsPieCategoryS.series = res
                var chart = new ApexCharts(document.querySelector("#categoryChartS"), optionsPieCategoryS);
                chart.render();
            }
        })
}

function loadChartCategoriesE() {

    var optionsPieCategoryE = {
        series: [],
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

    fetchDataCategoriesChartE()
        .then(res => {
            if (res === null) {
                console.log("Bad");
            } else {
                optionsPieCategoryE.series = res
                var chart = new ApexCharts(document.querySelector("#categoryChartE"), optionsPieCategoryE);
                chart.render();
            }
        })
}

function fetchDataChartBalance() {
    return fetch('/getSpeseForBalanceChart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8'
            },
            dataType: 'json'
        })
        .then(response => response.json())
}

function fetchDataLineChart() {
    return fetch('/getSpeseForLineChart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8'
            },
            dataType: 'json'
        })
        .then(response => response.json())
}

function fetchDataCategoriesChartS() {
    return fetch('/getDataCategoriesS', {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8'
            },
            dataType: 'json'
        })
        .then(response => response.json())
}

function fetchDataCategoriesChartE() {
    return fetch('/getDataCategoriesE', {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8'
            },
            dataType: 'json'
        })
        .then(response => response.json())
}

window.onload = () => {
    //createLineChart(options)
    loadCharts()
}