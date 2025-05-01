/**
 * Riffusion Linter Core Library
 * 
 * This library provides the core functionality for analyzing Riffusion lyric prompts
 * and identifying potential issues, warnings, and suggestions for improvement.
 */

class RiffusionLinter {
    constructor() {
        // Define vocal style categories for validation
        this.vocalStyles = {
            intensity: ['whispered', 'soft', 'quiet', 'gentle', 'moderate', 'projected', 'powerful', 'loud', 'shouted', 'screamed', 'growled'],
            technique: ['clean', 'breathy', 'airy', 'chest voice', 'head voice', 'falsetto', 'vibrato', 'tremolo', 'vocal fry', 'guttural', 'raspy', 'nasal', 'twang'],
            emotion: ['sad', 'happy', 'angry', 'melancholic', 'joyful', 'furious', 'desperate', 'tender', 'aggressive', 'passionate', 'calm', 'anxious', 'fearful'],
            delivery: ['staccato', 'legato', 'spoken', 'rap', 'sung', 'chanted', 'monotone', 'rhythmic', 'syncopated', 'flowing']
        };
        
        // Define known conflicting instructions
        this.conflicts = [
            ['whispered', 'screamed'],
            ['whispered', 'shouted'],
            ['soft', 'powerful'],
            ['quiet', 'loud'],
            ['gentle', 'aggressive'],
            ['monotone', 'vibrato'],
            ['staccato', 'legato'],
            ['breathy', 'powerful']
        ];
        
        // Define vague terms that should be replaced with more specific ones
        this.vagueTerms = {
            'high': ['falsetto', 'head voice', 'upper register'],
            'low': ['chest voice', 'bass register', 'deep'],
            'medium': ['mid-range', 'mixed voice', 'middle register'],
            'normal': ['clean', 'natural', 'straight-tone'],
            'different': ['contrasting', 'varied', 'distinct'],
            'emotional': ['passionate', 'expressive', 'moving', 'heartfelt'],
            'strange': ['unusual', 'experimental', 'unconventional', 'unique'],
            'good': ['precise', 'polished', 'skilled', 'professional'],
            'bad': ['raw', 'unrefined', 'gritty', 'imperfect'],
            'hard': ['intense', 'forceful', 'powerful', 'strong'],
            'soft': ['gentle', 'delicate', 'tender', 'subdued']
        };
    }

    /**
     * Main method to analyze a Riffusion prompt and return results
     * @param {string} promptText - The full Riffusion prompt to analyze
     * @return {Object} Analysis results containing issues, warnings, and suggestions
     */
    analyze(promptText) {
        const results = {
            issues: [],
            warnings: [],
            suggestions: [],
            vocalsAnalysis: this.analyzeVocalDynamics(promptText),
            statistics: this.generateStatistics(promptText)
        };
        
        // Check for basic syntax issues
        const syntaxIssues = this.checkSyntax(promptText);
        results.issues.push(...syntaxIssues);
        
        // Check for conflicting instructions
        const conflictingInstructions = this.checkConflictingInstructions(promptText);
        if (conflictingInstructions.length > 0) {
            results.issues.push({
                type: 'conflict',
                message: `Conflicting vocal instructions detected: ${conflictingInstructions.join(', ')}`,
                details: 'These instructions contradict each other and may confuse the AI.'
            });
        }
        
        // Check for vague terminology
        const vagueTerms = this.checkVagueTerms(promptText);
        if (vagueTerms.length > 0) {
            results.suggestions.push({
                type: 'vague',
                message: `Consider replacing vague terms with more specific ones`,
                details: vagueTerms.map(term => `"${term}" could be replaced with ${this.vagueTerms[term].join(', ')}`).join('\n')
            });
        }
        
        // Check for abrupt style changes
        const abruptChanges = this.checkAbruptChanges(promptText);
        if (abruptChanges.length > 0) {
            results.warnings.push({
                type: 'transition',
                message: `Potentially abrupt style transitions detected`,
                details: `Consider adding transition instructions between dramatically different styles at lines: ${abruptChanges.join(', ')}`
            });
        }
        
        // Check tempo indicators
        const tempoIssues = this.checkTempoIndicators(promptText);
        if (tempoIssues.needed) {
            results.warnings.push({
                type: 'tempo',
                message: 'Missing tempo indicators in some sections',
                details: 'Adding BPM values