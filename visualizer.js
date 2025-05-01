/**
 * Riffusion Visualizer
 * 
 * This module provides visualization functionality for the Riffusion Linter,
 * creating visual representations of vocal dynamics and intensity patterns.
 */

class RiffusionVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.initialized = false;
    }

    /**
     * Initialize the visualizer with a container and dimensions
     */
    initialize() {
        if (this.initialized) return;
        
        // Clear any existing content
        this.container.innerHTML = '';
        this.container.classList.add('relative');
        
        // Add intensity guide lines
        this.addIntensityGuides();
        
        this.initialized = true;
    }

    /**
     * Add horizontal guide lines for intensity levels
     */
    addIntensityGuides() {
        const levels = [
            { level: 'High', position: '25%' },
            { level: 'Medium', position: '50%' },
            { level: 'Low', position: '75%' }
        ];
        
        levels.forEach(level => {
            const guide = document.createElement('div');
            guide.className = 'intensity-guide';
            guide.style.top = level.position;
            
            const label = document.createElement('div');
            label.className = 'intensity-guide-label';
            label.textContent = level.level;
            
            guide.appendChild(label);
            this.container.appendChild(guide);
        });
    }

    /**
     * Create a visualization of vocal dynamics based on analysis results
     * @param {Object} analysisResults - Analysis results from the RiffusionLinter
     */
    visualize(analysisResults) {
        this.initialize();
        
        // Clear existing visualization bars
        const existingBars = this.container.querySelectorAll('.intensity-bar, .vocal-type-label');
        existingBars.forEach(bar => bar.remove());
        
        if (!analysisResults || !analysisResults.vocalsAnalysis || analysisResults.vocalsAnalysis.length === 0) {
            this.showPlaceholder();
            return;
        }
        
        // Hide placeholder if it exists
        const placeholder = this.container.querySelector('.visualization-placeholder');
        if (placeholder) placeholder.style.display = 'none';
        
        const sections = analysisResults.vocalsAnalysis;
        const totalSections = sections.length;
        
        // Calculate bar width based on number of sections
        const barWidth = Math.max(8, Math.min(30, Math.floor((this.container.clientWidth - 40) / totalSections)));
        const gapWidth = Math.max(4, Math.min(20, Math.floor(barWidth / 2)));
        const totalBarWidth = barWidth + gapWidth;
        
        // Create a bar for each section
        sections.forEach((section, index) => {
            // Create intensity bar
            const bar = document.createElement('div');
            bar.className = 'intensity-bar';
            
            // Set position and dimensions
            bar.style.left = `${40 + (index * totalBarWidth)}px`;
            bar.style.width = `${barWidth}px`;
            
            // Set height based on intensity (10 is maximum intensity)
            const heightPercentage = (section.intensity / 10) * 100;
            bar.style.height = `${heightPercentage}%`;
            
            // Set color based on vocal type
            bar.style.backgroundColor = this.getColorForVocalType(section.vocalType);
            
            // Add tooltip with details
            bar.title = `Line ${section.lineNumber}: ${section.instructions}\n${section.lyrics}`;
            
            // Create label for vocal type
            const label = document.createElement('div');
            label.className = 'vocal-type-label';
            label.textContent = section.vocalType || 'normal';
            label.style.left = `${40 + (index * totalBarWidth) + (barWidth / 2)}px`;
            
            // Add elements to container
            this.container.appendChild(bar);
            this.container.appendChild(label);
        });
    }

    /**
     * Show placeholder when no visualization is available
     */
    showPlaceholder() {
        let placeholder = this.container.querySelector('.visualization-placeholder');
        
        if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.className = 'visualization-placeholder text-gray-500 italic text-center mt-20';
            placeholder.textContent = 'Visualization will appear here after analysis';
            this.container.appendChild(placeholder);
        } else {
            placeholder.style.display = 'block';
        }
    }

    /**
     * Get color for a specific vocal type
     * @param {string} vocalType - The type of vocal technique
     * @return {string} Color in hex or rgba format
     */
    getColorForVocalType(vocalType) {
        const colors = {
            // Intensity colors
            'whispered': '#9333ea', // purple
            'soft': '#a855f7',
            'quiet': '#b366f7',
            'gentle': '#c084fc',
            'moderate': '#d8b4fe',
            'projected': '#818cf8', // indigo
            'powerful': '#6366f1',
            'loud': '#4f46e5',
            'shouted': '#4338ca',
            'screamed': '#3730a3',
            'growled': '#312e81',
            
            // Technique colors
            'clean': '#06b6d4', // cyan
            'breathy': '#0ea5e9', // sky blue
            'falsetto': '#3b82f6', // blue
            'vibrato': '#8b5cf6', // violet
            'vocal fry': '#d946ef', // fuchsia
            'guttural': '#e11d48', // rose
            'raspy': '#ef4444', // red
            
            // Defaults
            'normal': '#6b7280', // gray
            'default': '#6b7280'
        };
        
        return colors[vocalType] || colors['default'];
    }
    
    /**
     * Create a downloadable image of the current visualization
     * @return {string} Data URL of the visualization image
     */
    createDownloadableImage() {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Set dimensions to match container
        canvas.width = this.container.clientWidth;
        canvas.height = this.container.clientHeight;
        
        // Draw white background
        context.fillStyle = '#1f2937'; // Dark background
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw title
        context.font = 'bold 16px Arial';
        context.fillStyle = '#f9fafb';
        context.fillText('Riffusion Vocal Dynamics', 20, 30);
        
        // Draw guide lines
        const levels = [
            { level: 'High', position: canvas.height * 0.25 },
            { level: 'Medium', position: canvas.height * 0.5 },
            { level: 'Low', position: canvas.height * 0.75 }
        ];
        
        levels.forEach(level => {
            context.beginPath();
            context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            context.setLineDash([5, 5]);
            context.moveTo(40, level.position);
            context.lineTo(canvas.width - 20, level.position);
            context.stroke();
            
            context.font = '12px Arial';
            context.fillStyle = '#9ca3af';
            context.fillText(level.level, 10, level.position + 4);
        });
        
        // Draw bars
        const bars = this.container.querySelectorAll('.intensity-bar');
        const labels = this.container.querySelectorAll('.vocal-type-label');
        
        bars.forEach((bar, index) => {
            const rect = bar.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();
            
            // Get relative position to container
            const x = rect.left - containerRect.left;
            const y = rect.top - containerRect.top;
            
            // Draw bar
            context.fillStyle = bar.style.backgroundColor;
            context.fillRect(x, y, parseFloat(bar.style.width), parseFloat(bar.style.height));
            
            // Draw label
            if (labels[index]) {
                context.font = '10px Arial';
                context.fillStyle = '#f9fafb';
                context.textAlign = 'center';
                
                const label = labels[index];
                const labelX = parseFloat(label.style.left);
                context.fillText(label.textContent, labelX, canvas.height - 5);
            }
        });
        
        // Return data URL
        return canvas.toDataURL('image/png');
    }
}
