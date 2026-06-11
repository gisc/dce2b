/**
 * SCORM 1.2 API Implementation
 */

class SCORM12API {
    constructor() {
        this.API = null;
        this.initialized = false;
        this.completionType = 'time';
        this.timeSpent = 6;
        this.startTime = null;
        this.interactionCount = 0;
        this.requiredInteractions = 1;
        this.completedWithInteractions = false;
        
        this.init();
    }

    /**
     * Initialize the SCORM API
     */
    init() {
        // Find the SCORM API
        this.findAPI();
        
        if (this.API) {
            this.initialize();
        } else {
            console.error('SCORM API not found');
        }
    }

    /**
     * Find the SCORM API in the parent window hierarchy
     */
    findAPI() {
        const maxAttempts = 10; // Arbitrary number
        
        const findAPILoop = (win) => {
            let findAttempts = 0;

            // Check to see if the window (win) contains the API
            // if the window (win) does not contain the API and
            // the window (win) has a parent window and the parent window
            // is not the same as the window (win)
            while (!win.API && win.parent && win.parent !== win) {
                // increment the number of tries
                findAttempts++;


                if (findAttempts > maxAttempts) {
                    console.error('SCORM API not found after maximum attempts');
                    return;
                }

                // set the variable that represents the window being
                // searched to be the parent of the current window
                // then search for the API again
                win = win.parent;
            }

            this.API = win.API;
        };

        // start by looking for the API in the current window
        findAPILoop(window);

        // if the API could not be found in the current window
        // and the current window has an opener window
        if (!this.API && window.opener) {
           // try to find the API in the current window’s opener
           findAPILoop(window.opener);
        }
    }

    /**
     * Initialize SCORM communication
     */
    initialize() {
        if (!this.API) return;
        
        try {
            const result = this.API.LMSInitialize('');
            if (result === 'true') {
                this.initialized = true;
                console.log('SCORM 1.2 API initialized');

                this.startTime = new Date();
                this.setupCompletionTracking();
            } else {
                console.error('SCORM API initialization failed:', result);
            }
        } catch (error) {
            console.error('Error initializing SCORM API:', error);
        }
    }

    /**
     * Set up completion tracking based on configuration
     */
    setupCompletionTracking() {
        if (!this.initialized) return;
        
        switch (this.completionType) {
            case 'immediate':
                this.markCompleted();
                break;
                
            case 'time':
                this.setupTimeTracking();
                break;
                
            case 'interaction':
                this.setupInteractionTracking();
                break;
        }
    }

    /**
     * Set up time-based completion tracking
     */
    setupTimeTracking() {
        const timeInMs = this.timeSpent * 60 * 1000; // Convert minutes to milliseconds
        
        setTimeout(() => {
            this.markCompleted();
        }, timeInMs);
    }

    /**
     * Set up interaction-based completion tracking
     */
    setupInteractionTracking() {
        // Track clicks
        document.addEventListener('click', () => {
            this.handleInteraction();
        });
        
        // Track key presses
        document.addEventListener('keydown', () => {
            this.handleInteraction();
        });
        
        // Track form interactions
        document.addEventListener('input', () => {
            this.handleInteraction();
        });
        
        // Track focus events
        document.addEventListener('focus', () => {
            this.handleInteraction();
        }, true);
    }

    /**
     * Handle user interaction
     */
    handleInteraction() {
        this.interactionCount++;
        
        if (!this.completedWithInteractions && this.interactionCount >= this.requiredInteractions) {
            this.markCompleted();
            this.completedWithInteractions = true;
        }
    }

    /**
     * Set SCO session time
     */
    setSessionTime() {
        const timeSpent = Math.floor((new Date() - this.startTime) / 1000);

        // Set time spent
        this.setValue('cmi.core.session_time', this.formatTime(timeSpent));

        // Commit changes
        this.commit();
    }

    /**
     * Mark the SCO as completed
     */
    markCompleted() {
        if (!this.initialized) return;
        
        try {
            // Set completion status
            this.setValue('cmi.core.lesson_status', 'completed');
            
            // Set exit status
            this.setValue('cmi.core.exit', 'logout');
            
            // Commit changes
            this.commit();
            
            console.log('SCO marked as completed');
        } catch (error) {
            console.error('Error marking SCO as completed:', error);
        }
    }

    /**
     * Set a SCORM data model value
     * @param {string} element - The data model element
     * @param {string} value - The value to set
     */
    setValue(element, value) {
        if (!this.initialized || !this.API) return;
        
        try {
            const result = this.API.LMSSetValue(element, value);
            if (result !== 'true') {
                console.error(`Failed to set ${element}:`, result);
            }
        } catch (error) {
            console.error(`Error setting ${element}:`, error);
        }
    }

    /**
     * Get a SCORM data model value
     * @param {string} element - The data model element
     * @returns {string} The value
     */
    getValue(element) {
        if (!this.initialized || !this.API) return '';
        
        try {
            return this.API.LMSGetValue(element);
        } catch (error) {
            console.error(`Error getting ${element}:`, error);
            return '';
        }
    }

    /**
     * Commit changes to the LMS
     */
    commit() {
        if (!this.initialized || !this.API) return;
        
        try {
            const result = this.API.LMSCommit('');
            if (result !== 'true') {
                console.error('Failed to commit changes:', result);
            }
        } catch (error) {
            console.error('Error committing changes:', error);
        }
    }

    /**
     * Terminate SCORM communication
     */
    terminate() {
        if (!this.initialized || !this.API) return;

        // Set time spent
        setSessionTime();
        
        try {
            const result = this.API.LMSFinish('');

            if (result === 'true') {
                this.initialized = false;
                console.log('SCORM API terminated');
            } else {
                console.error('SCORM API termination failed:', result);
            }
        } catch (error) {
            console.error('Error terminating SCORM API:', error);
        }
    }

    /**
     * Format time in SCORM format (HH:MM:SS)
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time
     */
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Set completion configuration
     * @param {string} type - Completion type
     * @param {number} timeSpent - Time in minutes (for time-based completion)
     * @param {number} interactions - Required interactions (for interaction-based completion)
     */
    setCompletionConfig(type, timeSpent = 5, interactions = 1) {
        this.completionType = type;
        this.timeSpent = timeSpent;
        this.requiredInteractions = interactions;
    }
}

// Auto-initialize when the script loads
if (document.readyState !== 'loading') {
    window.scormAPI = new SCORM12API();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        window.scormAPI = new SCORM12API();
    });
}

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.scormAPI) {
        window.scormAPI.terminate();
    }
});
