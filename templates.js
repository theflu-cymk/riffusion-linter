/**
 * Riffusion Templates Library
 * 
 * This module manages predefined templates for Riffusion prompts,
 * including loading, saving, and applying templates.
 */

class RiffusionTemplates {
    constructor() {
        this.templates = this.loadPredefinedTemplates();
        this.loadSavedTemplates();
    }
    
    /**
     * Load predefined templates
     * @return {Object} Map of predefined templates
     */
    loadPredefinedTemplates() {
        return {
            // Metal template with progression from clean to screamed vocals
            metal: {
                name: "Metal Screams & Growls",
                description: "Dynamic template with clean vocals to growls progression",
                tags: ["Metal", "Aggressive", "Screamed"],
                content: `[clean vocals 90bpm] Enter your first verse lyrics here
[gradually building intensity] Second line with growing intensity
[raspy vocals with slight distortion] Third line pushing toward aggression
[powerful projected] Fourth line with more power

[aggressive delivery 95bpm] Enter your pre-chorus lyrics here
[staccato rhythm with grit] Second line with sharp delivery
[layered vocals - main + low harmony] Third line with vocal layering
[building toward screamed] Fourth line intensifying further

[screamed vocals 100bpm] ENTER YOUR CHORUS LYRICS HERE
[guttural with reverb] SECOND LINE WITH MAXIMUM INTENSITY
[layered screams with clean backing] THIRD LINE WITH CONTRAST
[sustained final note with vibrato] FINAL CHORUS LINE

[clean vocals 90bpm] Enter your bridge lyrics here
[whispered section] Sudden dynamic shift down
[gradually building back] Starting to build again
[powerful to screamed transition] Final line before explosion`
            },
            
            // Ethereal ambient template with layered whispers
            ethereal: {
                name: "Ethereal Whispers",
                description: "Soft, ambient template with layered whispered vocals",
                tags: ["Ambient", "Whispered", "Layered"],
                content: `[whispered intimate 70bpm] Enter your first verse lyrics here
[breathy with reverb] Second line floating in space
[layered whispers panned L-C-R] Third line with spatial width
[airy head voice] Fourth line maintaining ethereal quality

[soft vocals 75bpm] Enter your chorus lyrics here
[gentle falsetto] Second line reaching higher
[whispered layers underneath] Third line with textural depth
[delicate with vocal flutter] Fourth line with subtle movement

[spoken word 70bpm] Enter your bridge lyrics here
[whispered close to mic] Creating intimate moment
[multiple whispered layers] Building textural complexity
[breathy melodic fragment] Returning to melodic element

[whispered with long reverb tail 65bpm] Final section lyrics here
[barely audible] Fading further away
[multiple voices whispering different words] Creating ghostly texture
[final whisper fading to silence] Disappearing completely`
            },
            
            // Pop vocal template with standard dynamic structure
            pop: {
                name: "Pop Dynamic Range",
                description: "Standard pop vocal structure with verse-chorus dynamics",
                tags: ["Pop", "Clean", "Dynamic"],
                content: `[clean mid-range vocals 100bpm] Enter your first verse lyrics here
[natural delivery with slight vibrato] Second line maintaining steady tone
[relaxed with clear diction] Third line with articulate delivery
[building slightly] Fourth line with subtle lift

[more projected 105bpm] Enter your pre-chorus lyrics here
[gradual dynamic increase] Second line getting stronger
[emphasis on key emotional words] Third line with targeted emphasis
[building toward chorus] Fourth line with anticipation

[full projected voice 110bpm] Enter your chorus lyrics here
[powerful with controlled belting] Second line with peak energy
[slight vocal breaks on emotional words] Third line with expressive touches
[strong sustained notes] Fourth line showcasing vocal strength

[intimate and quiet 95bpm] Enter your bridge lyrics here
[close-mic technique] Creating contrast after chorus
[building through bridge] Middle of bridge intensifying
[dramatic pause then powerful] Final line launching back to chorus`
            },
            
            // Emotional ballad with varied intensity
            ballad: {
                name: "Emotional Ballad",
                description: "Expressive vocals with varied emotional intensity",
                tags: ["Ballad", "Emotional", "Expressive"],
                content: `[gentle piano ballad 65bpm] Enter your first verse lyrics here
[intimate with slight breathiness] Second line maintaining vulnerability
[quiet with emotional catch in voice] Third line with subtle vocal break
[slightly stronger] Fourth line beginning emotional build

[more projected 70bpm] Enter your pre-chorus lyrics here
[growing emotion in voice] Second line with rising intensity
[vibrato on held notes] Third line with expressive vibrato
[building dramatically] Fourth line leading to emotional peak

[powerful emotional delivery 75bpm] Enter your chorus lyrics here
[belted with controlled power] Second line maintaining peak emotion
[vocal break on most emotional word] Third line with deliberate vulnerability
[powerful sustained note then gentle] Fourth line with dynamic contrast

[whispered intimate 60bpm] Enter your bridge lyrics here
[spoken-sung with vulnerability] Second line nearly breaking
[gradually rebuilding] Third line finding strength again
[emotional crescendo] Final line with full emotional weight`
            },
            
            // Rap flow variations
            rap: {
                name: "Rap Flow Variation",
                description: "Hip-hop template with varied flow and delivery styles",
                tags: ["Rap", "Flow", "Rhythmic"],
                content: `[steady flow rap 95bpm] Enter your first verse lyrics here
[slightly faster double-time] Second line with speed variation
[laid back behind beat] Third line with relaxed timing
[choppy staccato] Fourth line with sharp delivery

[aggressive delivery 100bpm] Enter your hook lyrics here
[emphasizing final words of phrases] Second line with targeted emphasis
[call and response with backing vocals] Third line with layered elements
[rhythmic variations] Fourth line with syncopation

[melodic rap 95bpm] Enter your second verse lyrics here
[sing-song delivery] Second line with pitched elements
[rapid flow] Third line with technical speed
[dramatic pauses] Fourth line with strategic silence

[half-time flow 90bpm] Enter your bridge lyrics here
[deep voice delivery] Creating contrast section
[whispered sections] Adding dynamic variation
[building intensity] Leading back to main hook`
            }
        };
    }
    
    /**
     * Load user-saved templates from localStorage
     */
    loadSavedTemplates() {
        try {
            const savedTemplates = JSON.parse(localStorage.getItem('riffusionTemplates') || '{}');
            // Merge with predefined templates, user templates take precedence
            this.templates = { ...this.templates, ...savedTemplates };
        } catch (error) {
            console.error('Error loading saved templates:', error);
        }
    }
    
    /**
     * Save a new user-created template
     * @param {Object} template - Template object to save
     */
    saveTemplate(template) {
        try {
            // Get existing user templates
            const savedTemplates = JSON.parse(localStorage.getItem('riffusionTemplates') || '{}');
            
            // Generate a unique ID for the template if not provided
            const templateId = template.id || `user_${Date.now()}`;
            
            // Add the new template
            savedTemplates[templateId] = {
                name: template.name,
                description: template.description,
                tags: template.tags,
                content: template.content,
                isUserCreated: true
            };
            
            // Save back to localStorage
            localStorage.setItem('riffusionTemplates', JSON.stringify(savedTemplates));
            
            // Update our templates object
            this.templates = { ...this.templates, ...savedTemplates };
            
            return templateId;
        } catch (error) {
            console.error('Error saving template:', error);
            return null;
        }
    }
    
    /**
     * Delete a saved template
     * @param {string} templateId - ID of the template to delete
     * @return {boolean} Success status
     */
    deleteTemplate(templateId) {
        try {
            // Only allow deleting user-created templates
            if (this.templates[templateId] && this.templates[templateId].isUserCreated) {
                // Get existing templates
                const savedTemplates = JSON.parse(localStorage.getItem('riffusionTemplates') || '{}');
                
                // Remove the template
                delete savedTemplates[templateId];
                delete this.templates[templateId];
                
                // Save back to localStorage
                localStorage.setItem('riffusionTemplates', JSON.stringify(savedTemplates));
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting template:', error);
            return false;
        }
    }
    
    /**
     * Get a template by ID
     * @param {string} templateId - ID of the template to retrieve
     * @return {Object|null} The template object or null if not found
     */
    getTemplate(templateId) {
        return this.templates[templateId] || null;
    }
    
    /**
     * Get all available templates
     * @return {Object} Map of all templates
     */
    getAllTemplates() {
        return this.templates;
    }
    
    /**
     * Search templates by name, description, or tags
     * @param {string} query - Search query
     * @return {Object} Map of matching templates
     */
    searchTemplates(query) {
        if (!query) return this.templates;
        
        const results = {};
        const queryLower = query.toLowerCase();
        
        for (const [id, template] of Object.entries(this.templates)) {
            // Check if query matches name, description, or tags
            if (template.name.toLowerCase().includes(queryLower) || 
                template.description.toLowerCase().includes(queryLower) || 
                template.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
                results[id] = template;
            }
        }
        
        return results;
    }
}