// Sample data - in a real implementation, this would come from your data processing
const timeData = {
    hours: Array.from({length: 24}, (_, i) => i),
    counts: [50, 30, 20, 15, 10, 20, 40, 80, 120, 150, 180, 200, 220, 210, 190, 170, 160, 180, 200, 180, 150, 120, 90, 70]
};

const weatherData = {
    conditions: ['Clear', 'Rain', 'Snow', 'Fog', 'Other'],
    counts: [1200, 400, 100, 50, 30]
};

const factorData = {
    factors: ['Driver Inattention', 'Failure to Yield', 'Following Too Closely', 'Speeding', 'Other'],
    counts: [800, 600, 400, 300, 200]
};

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', function() {
    createTimeChart();
    createWeatherChart();
    createFactorsChart();
});

function createTimeChart() {
    const timeChart = document.getElementById('time-chart');
    if (!timeChart) return;

    const trace = {
        x: timeData.hours,
        y: timeData.counts,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Collisions',
        line: {
            color: '#3498db',
            width: 3
        },
        marker: {
            size: 8,
            color: '#3498db'
        }
    };

    const layout = {
        title: 'Collisions by Hour of Day',
        xaxis: {
            title: 'Hour of Day',
            tickmode: 'linear',
            tick0: 0,
            dtick: 2
        },
        yaxis: {
            title: 'Number of Collisions'
        },
        margin: {
            l: 50,
            r: 20,
            t: 50,
            b: 50
        }
    };

    Plotly.newPlot(timeChart, [trace], layout);
}

function createWeatherChart() {
    const weatherChart = document.getElementById('weather-chart');
    if (!weatherChart) return;

    const trace = {
        values: weatherData.counts,
        labels: weatherData.conditions,
        type: 'pie',
        name: 'Weather Conditions',
        marker: {
            colors: ['#3498db', '#2980b9', '#2c3e50', '#34495e', '#7f8c8d']
        },
        textinfo: 'label+percent',
        insidetextorientation: 'radial'
    };

    const layout = {
        title: 'Collisions by Weather Condition',
        margin: {
            l: 20,
            r: 20,
            t: 50,
            b: 20
        }
    };

    Plotly.newPlot(weatherChart, [trace], layout);
}

function createFactorsChart() {
    const factorsChart = document.getElementById('factors-chart');
    if (!factorsChart) return;

    const trace = {
        x: factorData.factors,
        y: factorData.counts,
        type: 'bar',
        marker: {
            color: '#e74c3c'
        }
    };

    const layout = {
        title: 'Top Contributing Factors',
        xaxis: {
            title: 'Factor',
            tickangle: -45
        },
        yaxis: {
            title: 'Number of Collisions'
        },
        margin: {
            l: 50,
            r: 20,
            t: 50,
            b: 100
        }
    };

    Plotly.newPlot(factorsChart, [trace], layout);
}

// Add window resize handler to make charts responsive
window.addEventListener('resize', function() {
    const timeChart = document.getElementById('time-chart');
    const weatherChart = document.getElementById('weather-chart');
    const factorsChart = document.getElementById('factors-chart');

    if (timeChart) Plotly.Plots.resize(timeChart);
    if (weatherChart) Plotly.Plots.resize(weatherChart);
    if (factorsChart) Plotly.Plots.resize(factorsChart);
}); 