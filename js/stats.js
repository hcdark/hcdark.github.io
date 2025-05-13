// JavaScript file to calculate and display statistics from real data
document.addEventListener('DOMContentLoaded', function() {
    loadStatistics();
});

async function loadStatistics() {
    try {
        // Load map data to calculate statistics
        const response = await fetch('js/data/map_data.json');
        if (!response.ok) {
            throw new Error('Failed to load map data');
        }
        
        const mapData = await response.json();
        
        // Calculate daily average collisions
        updateDailyCollisionStat(mapData);
        
        // Calculate peak collision hours
        updatePeakHoursStat();
        
        // Update most common factor
        updateCommonFactorStat();
        
    } catch (error) {
        console.error('Error loading statistics:', error);
        // Statistics will remain as set in HTML
    }
}

// Calculate daily average from all collision data
function updateDailyCollisionStat(mapData) {
    // Get collision dates
    const dateCounter = {};
    
    // Count collisions per day
    mapData.forEach(collision => {
        if (collision['CRASH DATE']) {
            const dateStr = collision['CRASH DATE'].split('T')[0]; // Get just the date part
            dateCounter[dateStr] = (dateCounter[dateStr] || 0) + 1;
        }
    });
    
    // Calculate average
    const dateCount = Object.keys(dateCounter).length;
    const totalCollisions = mapData.length;
    const dailyAverage = dateCount > 0 ? Math.round(totalCollisions / dateCount) : 0;
    
    // Update the stat card
    const dailyCollisionElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
    if (dailyCollisionElement) {
        dailyCollisionElement.textContent = dailyAverage.toLocaleString();
    }
}

// Update the peak hours based on time series data
async function updatePeakHoursStat() {
    try {
        const response = await fetch('js/data/time_series.json');
        if (!response.ok) {
            throw new Error('Failed to load time series data');
        }
        
        const timeData = await response.json();
        
        // Find peak hour
        let peakHour = 0;
        let maxCount = 0;
        
        timeData.forEach(hourData => {
            if (hourData.count > maxCount) {
                maxCount = hourData.count;
                peakHour = hourData.HOUR;
            }
        });
        
        // Get range of peak hours (look for hours with at least 90% of max)
        const peakThreshold = maxCount * 0.9;
        let peakStart = peakHour;
        let peakEnd = peakHour;
        
        // Find continuous range of peak hours
        for (let i = peakHour - 1; i >= 0; i--) {
            const hourData = timeData.find(d => d.HOUR === i);
            if (hourData && hourData.count >= peakThreshold) {
                peakStart = i;
            } else {
                break;
            }
        }
        
        for (let i = peakHour + 1; i < 24; i++) {
            const hourData = timeData.find(d => d.HOUR === i);
            if (hourData && hourData.count >= peakThreshold) {
                peakEnd = i;
            } else {
                break;
            }
        }
        
        // Format hour range nicely
        const formatHour = (hour) => {
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const h = hour % 12 || 12;
            return `${h}${ampm}`;
        };
        
        const peakHoursText = `${formatHour(peakStart)}-${formatHour(peakEnd)}`;
        
        // Update the stat card
        const peakHoursElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (peakHoursElement) {
            peakHoursElement.textContent = peakHoursText;
        }
        
    } catch (error) {
        console.error('Error updating peak hours stat:', error);
    }
}

// Update most common factor from factor data
async function updateCommonFactorStat() {
    try {
        const response = await fetch('js/data/factor_data.json');
        if (!response.ok) {
            throw new Error('Failed to load factor data');
        }
        
        const factorData = await response.json();
        
        // Sort factors by count and get the top one
        factorData.sort((a, b) => b.count - a.count);
        const topFactor = factorData[0];
        
        if (topFactor) {
            // Format the factor name for display
            let factorName = topFactor.factor;
            
            // Simplify long factor names
            if (factorName === "Driver Inattention/Distraction") {
                factorName = "Distraction";
            } else if (factorName === "Failure to Yield Right-of-Way") {
                factorName = "Failure to Yield";
            } else if (factorName.length > 15) {
                // Truncate other long names
                factorName = factorName.split(' ').slice(0, 2).join(' ');
            }
            
            // Update the stat card
            const factorElement = document.querySelector('.stat-card:nth-child(3) .stat-number');
            if (factorElement) {
                factorElement.textContent = factorName;
            }
        }
        
    } catch (error) {
        console.error('Error updating common factor stat:', error);
    }
} 