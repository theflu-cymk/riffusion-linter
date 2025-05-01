/**
 * Riffusion Linter Main Application
 * 
 * This script initializes and connects all components of the
 * Riffusion Linter web application.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize CodeMirror editor
    const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
        lineNumbers: true,
        theme: 'material-darker',
        mode: 'javascript',
        lineWrapping: true,
        tabSize: 2
    });

    // Initialize core components
    const linter = new RiffusionLinter();
    const visualizer = new RiffusionVisualizer('visualization-panel');
    const templates = new RiffusionTemplates();
    
    // Setup navigation
    setupNavigation();
    
    // Attach event listeners
    setupEventListeners(editor, linter, visualizer, templates);
    
    // Load example template on start (optional)
    // editor.setValue(templates.getTemplate('pop').content);
});

/**
 * Set up navigation between sections
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = {
        'editor': document.getElementById('editor-section'),
        'templates': document.getElementById('templates-section'),
        'help': document.getElementById('help-section')
    };
    
    // Default to editor section
    sections['editor'].classList.remove('hidden');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get target section
            const targetSection = link.getAttribute('data-section');
            
            // Hide all sections
            Object.values(sections).forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show target section
            sections[targetSection].classList.remove('hidden');
            
            // Update active state on navigation
            navLinks.forEach(l => l.classList.remove('text-purple-300'));
            link.classList.add('text-purple-300');
        });
    });
}

/**
 * Set up all event listeners for the application
 * @param {Object} editor - CodeMirror editor instance
 * @param {Object} linter - RiffusionLinter instance
 * @param {Object} visualizer - RiffusionVisualizer instance
 * @param {Object} templates - RiffusionTemplates instance
 */
function setupEventListeners(editor, linter, visualizer, templates) {
    // Analyze button
    const analyzeButton = document.getElementById('analyze-button');
    analyzeButton.addEventListener('click', () => {
        analyzePrompt(editor, linter, visualizer);
    });
    
    // Load example button
    const loadExampleButton = document.getElementById('load-example');
    loadExampleButton.addEventListener('click', () => {
        const examplePrompt = getExamplePrompt();
        editor.setValue(examplePrompt);
    });
    
    // Clear editor button
    const clearEditorButton = document.getElementById('clear-editor');
    clearEditorButton.addEventListener('click', () => {
        editor.setValue('');
    });
    
    // Template buttons
    const templateButtons = document.querySelectorAll('.template-load-btn');
    templateButtons.forEach(button => {
        button.addEventListener('click', () => {
            const templateId = button.getAttribute('data-template');
            const template = templates.getTemplate(templateId);
            
            if (template) {
                editor.setValue(template.content);
                
                // Switch to editor tab
                document.querySelector('nav a[data-section="editor"]').click();
            }
        });
    });
    
    // Create template button
    const createTemplateButton = document.getElementById('create-template');
    createTemplateButton.addEventListener('click', () => {
        document.getElementById('template-modal').classList.remove('hidden');
    });
    
    // Close modal button
    const closeModalButton = document.getElementById('close-modal');
    closeModalButton.addEventListener('click', () => {
        document.getElementById('template-modal').classList.add('hidden');
    });
    
    // Save template button
    const saveTemplateButton = document.getElementById('save-template');
    saveTemplateButton.addEventListener('click', () => {
        const name = document.getElementById('template-name').value;
        const description = document.getElementById('template-description').value;
        const tagsInput = document.getElementById('template-tags').value;
        const content = document.getElementById('template-content').value;
        
        if (!name || !content) {
            alert('Template name and content are required');
            return;
        }
        
        const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        const templateId = templates.saveTemplate({
            name,
            description,
            tags,
            content
        });
        
        if (templateId) {
            alert('Template saved successfully!');
            document.getElementById('template-modal').classList.add('hidden');
            
            // Reload page to show new template
            // In a real application, you would dynamically add the template to the UI
            window.location.reload();
        }
    });
}

/**
 * Analyze the current prompt and display results
 * @param {Object} editor - CodeMirror editor instance
 * @param {Object} linter - RiffusionLinter instance
 * @param {Object} visualizer - RiffusionVisualizer instance
 */
function analyzePrompt(editor, linter, visualizer) {
    const promptText = editor.getValue();
    
    if (!promptText.trim()) {
        alert('Please enter a Riffusion prompt to analyze');
        return;
    }
    
    // Analyze the prompt
    const results = linter.analyze(promptText);
    
    // Update results panel
    updateResultsPanel(results);
    
    // Update visualization
    visualizer.visualize(results);
}

/**
 * Update the results panel with analysis results
 * @param {Object} results - Analysis results from the linter
 */
function updateResultsPanel(results) {
    const resultsPanel = document.getElementById('results-panel');
    resultsPanel.innerHTML = '';
    
    // Check if there are no issues, warnings, or suggestions
    if (results.issues.length === 0 && results.warnings.length === 0 && results.suggestions.length === 0) {
        resultsPanel.innerHTML = `
            <div class="bg-green-900 bg-opacity-20 rounded-lg p-4 border border-green-700">
                <div class="flex items-center">
                    <svg class="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                