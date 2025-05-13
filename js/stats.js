// JavaScript file to calculate and display statistics from real data
document.addEventListener('DOMContentLoaded', function() {
    loadStatistics();
});

async function loadStatistics() {
    try {
        // Load all data types to calculate statistics
        const timePromise = fetch('js/data/time_series.json')
            .then(response => response.json());
        
        const factorPromise = fetch('js/data/factor_data.json')
            .then(response => response.json());
            
        const mapPromise = fetch('js/data/map_data.json')
            .then(response => response.json());
            
        // Wait for all data to be loaded
        const [timeData, factorData, mapData] = await Promise.all([
            timePromise, factorPromise, mapPromise
        ]);
        
        // Calculate daily average collisions from time series data
        updateDailyCollisionStat(timeData);
        
        // Calculate peak collision hours from time series data
        updatePeakHoursStat(timeData);
        
        // Update most common factor that's not "Unspecified"
        updateCommonFactorStat(factorData);
        
    } catch (error) {
        console.error('Error loading statistics:', error);
        // Statistics will remain as set in HTML
    }
}

// Calculate daily average from time series data
function updateDailyCollisionStat(timeData) {
    try {
        // Calculate total daily collisions by summing all hours
        let totalCollisions = 0;
        timeData.forEach(hourData => {
            totalCollisions += hourData.count;
        });
        
        // Assuming the data covers a full year (365 days)
        // If we know the exact timespan, we can adjust this
        const approximateDays = 365;
        const dailyAverage = Math.round(totalCollisions / approximateDays);
        
        // Update the stat card
        const dailyCollisionElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
        if (dailyCollisionElement) {
            dailyCollisionElement.textContent = dailyAverage.toLocaleString();
        }
    } catch (error) {
        console.error('Error calculating daily average:', error);
    }
}

// Update the peak hours based on time series data
function updatePeakHoursStat(timeData) {
    try {
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

// Update most common factor from factor data, excluding "Unspecified"
function updateCommonFactorStat(factorData) {
    try {
        // Filter out "Unspecified" factor
        const relevantFactors = factorData.filter(factor => 
            factor.factor !== "Unspecified" && 
            factor.factor !== "unspecified" &&
            factor.factor !== ""
        );
        
        // Sort by count descending
        relevantFactors.sort((a, b) => b.count - a.count);
        
        // Get the top factor
        const topFactor = relevantFactors[0];
        
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