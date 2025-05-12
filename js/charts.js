// Time series data and weather data will be loaded from JSON files
let timeData = {
    hours: Array.from({length: 24}, (_, i) => i),
    counts: []
};

let weatherData = {
    conditions: [],
    counts: []
};

let factorData = {
    factors: [],
    counts: []
};

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load data first, then create charts
    Promise.all([
        loadTimeData(),
        loadWeatherData(),
        loadFactorData()
    ]).then(() => {
        createTimeChart();
        createWeatherChart();
        createFactorsChart();
    }).catch(error => {
        console.error('Error loading data:', error);
        // If data loading fails, we'll use the charts with default data
        createTimeChart();
        createWeatherChart();
        createFactorsChart();
    });
});

// Load time series data from JSON
async function loadTimeData() {
    try {
        const response = await fetch('js/data/time_series.json');
        if (!response.ok) {
            throw new Error('Failed to load time series data');
        }
        
        const data = await response.json();
        
        // Format data for the chart
        timeData.hours = data.map(item => item.HOUR);
        timeData.counts = data.map(item => item.count);
        
        return true;
    } catch (error) {
        console.error('Error loading time series data:', error);
        // Use default data if loading fails
        timeData.counts = [50, 30, 20, 15, 10, 20, 40, 80, 120, 150, 180, 200, 220, 210, 190, 170, 160, 180, 200, 180, 150, 120, 90, 70];
        return false;
    }
}

// Load weather data from JSON
async function loadWeatherData() {
    try {
        const response = await fetch('js/data/weather_data.json');
        if (!response.ok) {
            throw new Error('Failed to load weather data');
        }
        
        const data = await response.json();
        
        // Format data for the chart
        weatherData.conditions = data.map(item => item.condition);
        weatherData.counts = data.map(item => item.count);
        
        return true;
    } catch (error) {
        console.error('Error loading weather data:', error);
        // Use default data if loading fails
        weatherData.conditions = ['Clear', 'Rain', 'Snow', 'Cloudy', 'Fog'];
        weatherData.counts = [350, 150, 80, 120, 50];
        return false;
    }
}

// Load factor data from JSON
async function loadFactorData() {
    try {
        const response = await fetch('js/data/factor_data.json');
        if (!response.ok) {
            throw new Error('Failed to load factor data');
        }
        
        const data = await response.json();
        
        // Format data for the chart
        factorData.factors = data.map(item => item.factor);
        factorData.counts = data.map(item => item.count);
        
        return true;
    } catch (error) {
        console.error('Error loading factor data:', error);
        // Use default data if loading fails
        factorData.factors = ['Driver Inattention', 'Speeding', 'Failure to Yield', 'Following Too Closely', 'Impaired'];
        factorData.counts = [320, 210, 180, 150, 120];
        return false;
    }
}

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
            title: 'Hour',
            tickmode: 'linear',
            tick0: 0,
            dtick: 2
        },
        yaxis: {
            title: 'Number of Collisions'
        },
        margin: {
            l: 60,
            r: 20,
            t: 50,
            b: 60
        }
    };

    Plotly.newPlot(timeChart, [trace], layout, {responsive: true});
}

function createWeatherChart() {
    const weatherChart = document.getElementById('weather-chart');
    if (!weatherChart) return;

    const trace = {
        x: weatherData.conditions,
        y: weatherData.counts,
        type: 'bar',
        marker: {
            color: '#2ecc71'
        }
    };

    const layout = {
        title: 'Collisions by Weather Condition',
        xaxis: {
            title: 'Weather'
        },
        yaxis: {
            title: 'Number of Collisions'
        },
        margin: {
            l: 60,
            r: 20,
            t: 50,
            b: 60
        }
    };

    Plotly.newPlot(weatherChart, [trace], layout, {responsive: true});
}

function createFactorsChart() {
    const factorsChart = document.getElementById('factors-chart');
    if (!factorsChart) return;

    // Only show top 5 factors
    const topFactors = factorData.factors.slice(0, 5);
    const topCounts = factorData.counts.slice(0, 5);

    const trace = {
        x: topFactors,
        y: topCounts,
        type: 'bar',
        marker: {
            color: '#9b59b6'
        }
    };

    const layout = {
        title: 'Top Contributing Factors',
        xaxis: {
            title: 'Factor'
        },
        yaxis: {
            title: 'Number of Collisions'
        },
        margin: {
            l: 60,
            r: 20,
            t: 50,
            b: 120
        }
    };

    Plotly.newPlot(factorsChart, [trace], layout, {responsive: true});
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