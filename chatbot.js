// English Tutor Chatbot using Gemini API

class EnglishTutorChatbot {
    constructor() {
        this.apiKey = '';
        this.isOpen = false;
        this.isMinimized = false;
        this.isFullscreen = false;
        this.isApiConnected = false;
        this.messages = [];
        this.sessionId = null;
        this.learningModules = {
            writing: {
                name: 'Writing Improvement',
                description: 'Step-by-step guidance for improving your writing skills',
                levels: ['Beginner', 'Intermediate', 'Advanced'],
                prompts: [
                    'Help me write a formal email to my professor',
                    'How can I improve my essay structure for IELTS?',
                    'Check my paragraph for grammar mistakes',
                    'Guide me through writing a job application letter',
                    'Help me write a persuasive essay about environmental issues in Bangladesh'
                ],
                exercises: [
                    'Write a paragraph describing your hometown in Bangladesh',
                    'Rewrite this sentence to make it more formal',
                    'Complete this business email template with appropriate phrases'
                ]
            },
            reading: {
                name: 'Reading Comprehension',
                description: 'Practice understanding English texts at various levels',
                levels: ['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Intermediate)'],
                prompts: [
                    'Give me a beginner reading passage about Bangladeshi culture',
                    'Help me understand this text about global warming',
                    'Provide an advanced reading exercise about technology',
                    'I need practice with reading comprehension questions',
                    'Give me a text about Bangladeshi history with comprehension questions'
                ],
                exercises: [
                    'Read this passage and answer the questions that follow',
                    'Identify the main idea of this paragraph',
                    'Find synonyms for these words in the text'
                ]
            },
            speaking: {
                name: 'Speaking Practice',
                description: 'Interactive exercises to improve your pronunciation and fluency',
                levels: ['Basic Conversation', 'Daily Situations', 'Professional Settings', 'Academic Discussion'],
                prompts: [
                    'How do I pronounce "entrepreneur" correctly?',
                    'Give me speaking practice scenarios for a job interview',
                    'Help me with English conversation for shopping',
                    'Practice questions for IELTS speaking test',
                    'Common pronunciation mistakes for Bengali speakers'
                ],
                exercises: [
                    'Practice these tongue twisters to improve pronunciation',
                    'Respond to these common interview questions',
                    'Describe this picture in detail using these key phrases'
                ]
            },
            listening: {
                name: 'Listening Comprehension',
                description: 'Exercises to improve your ability to understand spoken English',
                levels: ['Beginner', 'Intermediate', 'Advanced', 'Native Speaker'],
                prompts: [
                    'Recommend listening exercises for beginners',
                    'How can I improve my listening skills for academic lectures?',
                    'Give me a listening comprehension quiz about daily conversations',
                    'Help me understand different English accents',
                    'Listening strategies for IELTS and TOEFL exams'
                ],
                exercises: [
                    'Listen to this dialogue and answer the questions',
                    'Fill in the missing words in this conversation',
                    'Identify the main points from this short lecture'
                ]
            },
            vocabulary: {
                name: 'Vocabulary Building',
                description: 'Expand your English vocabulary with contextual learning',
                levels: ['Essential Words', 'Academic Vocabulary', 'Professional Terminology', 'Idiomatic Expressions'],
                prompts: [
                    'Teach me 5 new English words with Bengali translations',
                    'Help me learn business vocabulary for meetings',
                    'Explain idioms used in daily conversation',
                    'Academic vocabulary for university students',
                    'Technology and IT terminology with examples'
                ],
                exercises: [
                    'Complete these sentences with the correct word',
                    'Match these words with their definitions',
                    'Use these new vocabulary words in your own sentences'
                ]
            },
            grammar: {
                name: 'Grammar Practice',
                description: 'Detailed explanations and exercises for English grammar',
                levels: ['Basic', 'Intermediate', 'Advanced', 'Mastery'],
                prompts: [
                    'Explain present perfect tense with Bengali examples',
                    'Help me practice prepositions of time and place',
                    'Give me exercises on articles (a, an, the)',
                    'Conditional sentences explained simply',
                    'Common grammar mistakes by Bengali speakers'
                ],
                exercises: [
                    'Correct the errors in these sentences',
                    'Fill in the blanks with the correct verb form',
                    'Rewrite these sentences using passive voice'
                ]
            },
            assessment: {
                name: 'Progress Assessment',
                description: 'Evaluate your English skills and track improvement',
                levels: ['Quick Check', 'Comprehensive Test', 'Skill-Specific Evaluation'],
                prompts: [
                    'Give me a quick assessment of my English level',
                    'Test my vocabulary knowledge with a quiz',
                    'Evaluate my writing skills with feedback',
                    'Check my grammar understanding',
                    'Prepare a personalized study plan based on my needs'
                ],
                exercises: [
                    'Complete this placement test to determine your level',
                    'Write a short essay for evaluation',
                    'Answer these questions to assess your progress'
                ]
            }
        };
        
        // Achievement badges system
        this.achievements = {
            firstLesson: {
                id: 'first_lesson',
                name: 'First Step',
                description: 'Completed your first lesson',
                icon: '🏆'
            },
            fiveExercises: {
                id: 'five_exercises',
                name: 'Practice Makes Perfect',
                description: 'Completed 5 exercises',
                icon: '⭐'
            },
            allModules: {
                id: 'all_modules',
                name: 'Well-Rounded',
                description: 'Tried all learning modules',
                icon: '🌟'
            },
            tenSessions: {
                id: 'ten_sessions',
                name: 'Dedicated Learner',
                description: 'Completed 10 learning sessions',
                icon: '🎓'
            },
            writingMaster: {
                id: 'writing_master',
                name: 'Writing Master',
                description: 'Completed 10 writing exercises',
                icon: '✍️'
            },
            readingMaster: {
                id: 'reading_master',
                name: 'Reading Master',
                description: 'Completed 10 reading exercises',
                icon: '📚'
            },
            speakingMaster: {
                id: 'speaking_master',
                name: 'Speaking Master',
                description: 'Completed 10 speaking exercises',
                icon: '🗣️'
            },
            listeningMaster: {
                id: 'listening_master',
                name: 'Listening Master',
                description: 'Completed 10 listening exercises',
                icon: '👂'
            },
            vocabularyMaster: {
                id: 'vocabulary_master',
                name: 'Vocabulary Master',
                description: 'Learned 100 new words',
                icon: '📝'
            },
            grammarMaster: {
                id: 'grammar_master',
                name: 'Grammar Master',
                description: 'Completed 10 grammar exercises',
                icon: '📏'
            },
            assessmentMaster: {
                id: 'assessment_master',
                name: 'Assessment Master',
                description: 'Completed 5 assessments',
                icon: '📊'
            }
        };
        
        // Track user progress and performance
    this.userPerformance = {
        sessionsCompleted: 0,
        exercisesCompleted: 0,
        strengths: [],
        areasForImprovement: [],
        recentActivities: [],
        achievements: [],
        quizScores: [],
        currentLevel: 'Beginner',
        lastActive: new Date().toISOString(),
        sessionHistory: [],
        moduleProgress: {
            writing: { completed: 0, total: 10 },
            reading: { completed: 0, total: 10 },
            speaking: { completed: 0, total: 10 },
            listening: { completed: 0, total: 10 },
            vocabulary: { completed: 0, total: 10 },
            grammar: { completed: 0, total: 10 },
            assessment: { completed: 0, total: 5 }
        }
    };
        
        // Load user performance from localStorage if available
        const savedPerformance = localStorage.getItem('chatbot_user_performance');
        if (savedPerformance) {
            try {
                this.userPerformance = JSON.parse(savedPerformance);
            } catch (e) {
                console.error('Error parsing saved performance data', e);
            }
        }

        this.init();
    }

    init() {
        console.log('Initializing chatbot...');
        
        // Load saved data
        this.loadApiKey();
        this.loadConversationHistory();
        
        // Setup DOM and events
        this.setupDomElements();
        this.setupEventListeners();
        this.setupApiKeyListeners();
        this.setupAutoResize();
        this.setupProgressDisplay();
        this.initSession();
        
        // Check connection status
        this.checkConnectionStatus();
        
        console.log('Chatbot initialization complete');
    }
    
    setupApiKeyListeners() {
        // API key toggle visibility button
        const toggleVisibilityBtn = document.getElementById('toggle-api-key-visibility');
        if (toggleVisibilityBtn) {
            toggleVisibilityBtn.addEventListener('click', () => this.toggleApiKeyVisibility());
        }
        
        // API key submit button
        const submitApiKeyBtn = document.getElementById('submit-api-key');
        if (submitApiKeyBtn) {
            submitApiKeyBtn.addEventListener('click', () => this.validateAndSaveApiKey());
        }
        
        // API key input enter key press
        const apiKeyInput = document.getElementById('gemini-api-key');
        if (apiKeyInput) {
            apiKeyInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.validateAndSaveApiKey();
                }
            });
        }
    }
    
    loadConversationHistory() {
        const savedHistory = localStorage.getItem('chatbot_conversation_history');
        if (savedHistory) {
            try {
                const parsedHistory = JSON.parse(savedHistory);
                if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
                    this.messages = parsedHistory;
                    console.log('Loaded conversation history:', this.messages.length, 'messages');
                }
            } catch (e) {
                console.error('Error parsing conversation history', e);
            }
        }
    }

    setupDomElements() {
        // Main elements
        this.chatbotWidget = document.querySelector('.chatbot-container');
        this.chatbotToggle = document.getElementById('chatbot-toggle');
        // References to minimize and close buttons removed as these elements no longer exist
        this.chatbotFullscreen = document.querySelector('.chatbot-btn[aria-label="Fullscreen chatbot"]');
        this.chatbotMessages = document.getElementById('chatbot-messages');
        this.chatbotInput = document.getElementById('chatbot-input');
        this.chatbotSend = document.getElementById('chatbot-send');
        this.chatbotSettings = document.getElementById('chatbot-settings');
        this.apiStatusIndicator = document.querySelector('.status-indicator');
        this.apiStatusText = document.getElementById('api-status-text');
        
        // Loading indicator
        this.loadingOverlay = document.getElementById('loading-overlay');
        if (!this.loadingOverlay && this.chatbotWidget) {
            this.loadingOverlay = document.createElement('div');
            this.loadingOverlay.id = 'loading-overlay';
            this.loadingOverlay.className = 'loading-overlay hidden';
            this.loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
            this.chatbotWidget.appendChild(this.loadingOverlay);
        }

        // Get API key from settings if available
        const apiKeyInput = document.getElementById('gemini-api-key');
        if (apiKeyInput && apiKeyInput.value) {
            this.apiKey = apiKeyInput.value;
            this.checkApiConnection();
        }
        
        // Initialize API key UI elements in settings
        this.apiKeyContainer = document.querySelector('.api-key-container');
        this.apiKeyInput = document.getElementById('gemini-api-key');
        this.apiKeyToggleBtn = document.getElementById('toggle-api-key-visibility');
        this.apiKeySubmitBtn = document.getElementById('submit-api-key');
        this.apiKeyValidationMsg = document.querySelector('.validation-message');
        this.apiKeyInfoSection = document.querySelector('.api-key-info');
        this.settingsApiStatusContainer = document.querySelector('.api-status-container');
        this.settingsApiStatusIndicator = document.querySelector('.api-status-container .status-indicator');
        this.settingsApiStatusText = document.querySelector('.api-status-container .status-text');
        
        // Log element selection status for debugging
        console.log('Chatbot elements initialized:', {
            widget: this.chatbotWidget,
            toggle: this.chatbotToggle,
            messages: this.chatbotMessages,
            input: this.chatbotInput,
            send: this.chatbotSend
        });
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Toggle chatbot visibility
        if (this.chatbotToggle) {
            this.chatbotToggle.addEventListener('click', () => {
                console.log('Toggle button clicked');
                this.toggleChatbot();
            });
        } else {
            console.error('Chatbot toggle button not found');
        }
        
        // Collapsed chatbot click to expand
        if (this.chatbotWidget) {
            this.chatbotWidget.addEventListener('click', (e) => {
                if (this.chatbotWidget.classList.contains('collapsed')) {
                    console.log('Collapsed chatbot clicked');
                    this.expandChatbot();
                }
            });
        }

        // Minimize and close button event listeners removed as the buttons have been removed from the UI
        // Functionality can still be accessed programmatically if needed
        
        // Fullscreen toggle
        if (this.chatbotFullscreen) {
            this.chatbotFullscreen.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Fullscreen button clicked');
                this.toggleFullscreen();
            });
        }

        // Send message via button click
        if (this.chatbotSend) {
            this.chatbotSend.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Send button clicked');
                this.sendMessage();
            });
        }
        
        // Send message via Enter key
        if (this.chatbotInput) {
            this.chatbotInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    console.log('Enter key pressed');
                    this.sendMessage();
                }
            });
        }

        // Settings button
        if (this.chatbotSettings) {
            this.chatbotSettings.addEventListener('click', () => {
                console.log('Settings button clicked');
                // Navigate to settings section and focus on API key input
                const navButtons = document.querySelectorAll('.nav-btn');
                navButtons.forEach(btn => {
                    if (btn.dataset.section === 'settings') {
                        btn.click();
                        setTimeout(() => {
                            const apiKeyInput = document.getElementById('gemini-api-key');
                            if (apiKeyInput) {
                                apiKeyInput.focus();
                            }
                        }, 300);
                    }
                });
            });
        }

        // Listen for API key changes in settings
        const apiKeyInput = document.getElementById('gemini-api-key');
        if (apiKeyInput) {
            // Create a submit button next to the API key input if it doesn't exist
            let submitApiKeyBtn = document.getElementById('submit-api-key');
            if (!submitApiKeyBtn) {
                submitApiKeyBtn = document.createElement('button');
                submitApiKeyBtn.id = 'submit-api-key';
                submitApiKeyBtn.className = 'setting-btn';
                submitApiKeyBtn.innerHTML = '<i class="fas fa-check"></i> Save & Validate';
                apiKeyInput.insertAdjacentElement('afterend', submitApiKeyBtn);
            }
            
            // Create a validation message element if it doesn't exist
            let apiKeyValidationMsg = document.getElementById('api-key-validation-msg');
            if (!apiKeyValidationMsg) {
                apiKeyValidationMsg = document.createElement('div');
                apiKeyValidationMsg.id = 'api-key-validation-msg';
                apiKeyValidationMsg.className = 'validation-message';
                apiKeyValidationMsg.style.marginTop = '8px';
                apiKeyValidationMsg.style.fontSize = '0.9rem';
                apiKeyValidationMsg.style.display = 'none';
                submitApiKeyBtn.insertAdjacentElement('afterend', apiKeyValidationMsg);
            }
            
            // Handle submit button click
            submitApiKeyBtn.addEventListener('click', () => {
                console.log('API key submit button clicked');
                const newApiKey = apiKeyInput.value.trim();
                
                // Validate API key format (basic check for now)
                if (!newApiKey) {
                    this.showApiKeyValidationMessage('Please enter an API key', 'error');
                    return;
                }
                
                // Show loading state
                submitApiKeyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validating...';
                submitApiKeyBtn.disabled = true;
                
                // Update API key and validate connection
                this.apiKey = newApiKey;
                this.validateAndSaveApiKey(submitApiKeyBtn);
            });
            
            // Also listen for Enter key in the input field
            apiKeyInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    submitApiKeyBtn.click();
                }
            });
        }
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            console.log('Browser went online');
            this.showFeedbackMessage('You are back online!', 'success');
            this.checkConnectionStatus();
        });
        
        window.addEventListener('offline', () => {
            console.log('Browser went offline');
            this.showFeedbackMessage('You are currently offline. Some features may be limited.', 'error');
            this.checkConnectionStatus();
        });
        
        // Setup form submission
        const chatForm = document.getElementById('chatbot-form');
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submitted');
                this.sendMessage();
            });
        }
        
        console.log('Event listeners setup complete');
    }

    setupAutoResize() {
        // Auto-resize textarea as user types
        this.chatbotInput.addEventListener('input', () => {
            this.chatbotInput.style.height = 'auto';
            this.chatbotInput.style.height = (this.chatbotInput.scrollHeight) + 'px';
        });
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.expandChatbot();
        }
    }

    expandChatbot() {
        if (!this.chatbotWidget) {
            console.error('Chatbot widget element not found');
            return;
        }
        
        this.chatbotWidget.classList.add('visible');
        this.chatbotWidget.classList.remove('collapsed');
        this.isOpen = true;
        this.isMinimized = false;
        
        console.log('Expanding chatbot', this.chatbotWidget);
        
        setTimeout(() => {
            if (this.chatbotInput) {
                this.chatbotInput.focus();
            }
        }, 300);
    }

    minimizeChatbot() {
        if (!this.chatbotWidget) return;
        
        this.chatbotWidget.classList.add('collapsed');
        this.isMinimized = true;
    }

    closeChatbot() {
        if (!this.chatbotWidget) return;
        
        this.chatbotWidget.classList.remove('visible');
        this.isOpen = false;
    }
    
    toggleFullscreen() {
        if (!this.chatbotWidget) return;
        
        if (this.isFullscreen) {
            this.chatbotWidget.classList.remove('fullscreen');
            this.isFullscreen = false;
        } else {
            this.chatbotWidget.classList.add('fullscreen');
            this.isFullscreen = true;
        }
        
        // Ensure messages container scrolls to bottom after resize
        setTimeout(() => {
            this.scrollToBottom();
        }, 300);
    }

    loadApiKey() {
        const savedApiKey = localStorage.getItem('gemini_api_key');
        if (savedApiKey) {
            this.apiKey = savedApiKey;
            
            // Update the input field in settings if it exists
            const apiKeyInput = document.getElementById('gemini-api-key');
            if (apiKeyInput) {
                apiKeyInput.value = this.apiKey;
            }
            
            // Check connection silently
            this.checkApiConnection(true);
            return true;
        }
        return false;
    }

    saveApiKey() {
        if (this.apiKey) {
            localStorage.setItem('gemini_api_key', this.apiKey);
        }
    }
    
    toggleApiKeyVisibility() {
        const apiKeyInput = document.getElementById('gemini-api-key');
        const toggleButton = document.getElementById('toggle-api-key-visibility');
        const iconElement = toggleButton.querySelector('i');
        
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            iconElement.className = 'fas fa-eye-slash';
        } else {
            apiKeyInput.type = 'password';
            iconElement.className = 'fas fa-eye';
        }
    }

    async checkApiConnection(silent = false) {
        if (!this.apiKey) {
            this.updateApiStatus(false, 'Offline');
            if (!silent) {
                this.showValidationMessage('Please enter an API key first', 'info');
            }
            return false;
        }

        try {
            if (!silent) {
                this.showLoadingState();
                this.showValidationMessage('Testing connection...', 'info');
            }
            this.updateApiStatus(null, 'Connecting...');
            
            // Simple test request to Gemini API - using gemini-2.5-flash model
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: 'Hello, are you working?'
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 100
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            const data = await response.json();
            
            if (response.ok && data.candidates && data.candidates.length > 0) {
                this.updateApiStatus(true, 'Online');
                this.isApiConnected = true;
                if (!silent) {
                    this.hideLoadingState();
                    this.showValidationMessage('API connection successful!', 'success');
                }
                return true;
            } else {
                this.updateApiStatus(false, 'Error');
                this.isApiConnected = false;
                if (!silent) {
                    this.hideLoadingState();
                    if (data.error) {
                        this.showValidationMessage(`Connection failed: ${data.error.message || 'Unknown error'}`, 'error');
                    } else {
                        this.showValidationMessage('Connection failed: Invalid response from API', 'error');
                    }
                }
                console.error('API connection test failed:', data);
                return false;
            }
        } catch (error) {
            this.updateApiStatus(false, 'Error');
            this.isApiConnected = false;
            if (!silent) {
                this.hideLoadingState();
                this.showValidationMessage(`Connection error: ${error.message || 'Network error'}`, 'error');
            }
            console.error('API connection error:', error);
            return false;
        }
    }
    
    showValidationMessage(message, type = 'info') {
        const validationMsg = document.getElementById('api-key-validation-msg');
        if (!validationMsg) return;
        
        // Clear any existing classes
        validationMsg.className = 'validation-message';
        
        // Add the appropriate class based on type
        validationMsg.classList.add(`${type}-message`);
        
        // Set the message with an icon
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        validationMsg.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
        validationMsg.classList.remove('hidden');
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                validationMsg.classList.add('hidden');
            }, 5000);
        }
    }
    
    async validateAndSaveApiKey() {
        const apiKeyInput = document.getElementById('gemini-api-key');
        const submitButton = document.getElementById('submit-api-key');
        
        if (!apiKeyInput || !submitButton) return false;
        
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            this.showValidationMessage('Please enter an API key', 'error');
            return false;
        }
        
        // Update button to show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validating...';
        
        // Set the API key
        this.apiKey = apiKey;
        
        try {
            // Test the API key with a connection check
            const isValid = await this.checkApiConnection();
            
            // Reset button state
            submitButton.innerHTML = '<i class="fas fa-check"></i> <span>Validate</span>';
            submitButton.disabled = false;
            
            if (isValid) {
                // Save the valid API key
                this.saveApiKey();
                
                // Update any UI elements that depend on API connection
                this.updateChatbotForApiConnection();
                
                return true;
            } else {
                // Show error message with more details
                this.showApiKeyValidationMessage('Invalid API key. Please check your key and try again.', 'error');
                return false;
            }
        } catch (error) {
            console.error('API key validation error:', error);
            submitButton.innerHTML = '<i class="fas fa-check"></i> Save & Validate';
            submitButton.disabled = false;
            this.showApiKeyValidationMessage('Error validating API key: ' + error.message, 'error');
            return false;
        }
    }
    
    showApiKeyValidationMessage(message, type = 'info') {
        const validationMsg = document.getElementById('api-key-validation-msg');
        if (!validationMsg) return;
        
        // Set message and styling based on type
        validationMsg.textContent = message;
        validationMsg.style.display = 'block';
        
        // Clear previous classes
        validationMsg.classList.remove('success-message', 'error-message', 'info-message');
        
        // Add appropriate class
        switch (type) {
            case 'success':
                validationMsg.classList.add('success-message');
                validationMsg.style.color = '#4CAF50';
                break;
            case 'error':
                validationMsg.classList.add('error-message');
                validationMsg.style.color = '#f44336';
                break;
            default:
                validationMsg.classList.add('info-message');
                validationMsg.style.color = '#2196F3';
        }
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            validationMsg.style.opacity = '0';
            setTimeout(() => {
                validationMsg.style.display = 'none';
                validationMsg.style.opacity = '1';
            }, 500);
        }, 5000);
    }
    
    updateChatbotForApiConnection() {
        // Update any UI elements that depend on API connection status
        if (this.isApiConnected) {
            // If we're in the chatbot view, show a welcome message
            if (this.isOpen && this.chatbotMessages && this.chatbotMessages.children.length <= 1) {
                this.addStyledMessage('API connected successfully! How can I help you improve your English today?');
            }
        }
    }

    updateApiStatus(isConnected, statusText) {
        // Update the original API status indicator in the chatbot widget
        if (this.apiStatusIndicator && this.apiStatusText) {
            if (isConnected === true) {
                this.apiStatusIndicator.classList.add('connected');
            } else {
                this.apiStatusIndicator.classList.remove('connected');
            }
            this.apiStatusText.textContent = statusText;
        }
        
        // Update the new API status indicator in the settings panel
        const statusIndicator = document.getElementById('api-status-indicator');
        const statusTextElement = document.getElementById('api-status-text');
        
        if (statusIndicator && statusTextElement) {
            // Remove all status classes
            statusIndicator.classList.remove('online', 'offline', 'connecting');
            
            // Add appropriate class based on connection status
            if (isConnected === true) {
                statusIndicator.classList.add('online');
            } else if (isConnected === false) {
                statusIndicator.classList.add('offline');
            } else {
                statusIndicator.classList.add('connecting');
            }
            
            // Update the status text
            statusTextElement.textContent = statusText;
        }
    }

    addMessage(message, isUser = false) {
        if (!this.chatbotMessages) {
            console.error('Chatbot messages container not found');
            return;
        }
        
        // Store message in history
        this.messages.push({
            content: message,
            isUser: isUser,
            timestamp: new Date()
        });

        console.log('Adding message to chat:', { message, isUser });

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Handle markdown-like formatting for bot messages
        if (!isUser) {
            messageContent.innerHTML = this.formatMessage(message);
        } else {
            const p = document.createElement('p');
            p.textContent = message;
            messageContent.appendChild(p);
        }
        
        messageDiv.appendChild(messageContent);
        this.chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Save conversation history
        this.saveConversationHistory();
    }
    
    saveConversationHistory() {
        // Save last 50 messages to localStorage
        const recentMessages = this.messages.slice(-50);
        localStorage.setItem('chatbot_conversation_history', JSON.stringify(recentMessages));
    }

    formatMessage(message) {
        // Convert markdown-like syntax to HTML
        let formattedMessage = message
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Code
            .replace(/`(.*?)`/g, '<code>$1</code>')
            // Lists
            .replace(/^- (.*)/gm, '<li>$1</li>')
            // Paragraphs
            .split('\n\n').join('</p><p>')
            // Line breaks
            .split('\n').join('<br>');

        return `<p>${formattedMessage}</p>`;
    }

    showTypingIndicator() {
        console.log('Showing typing indicator');
        if (!this.chatbotMessages) {
            console.error('Chatbot messages container not found');
            return;
        }
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingDiv.appendChild(dot);
        }
        
        this.chatbotMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        console.log('Removing typing indicator');
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        } else {
            console.log('No typing indicator found to remove');
        }
    }

    scrollToBottom() {
        if (!this.chatbotMessages) {
            console.error('Chatbot messages container not found');
            return;
        }
        
        console.log('Scrolling to bottom of chat');
        this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
    }

    sendMessage() {
        if (!this.chatbotInput) {
            console.error('Chatbot input element not found');
            return;
        }
        
        const message = this.chatbotInput.value.trim();
        if (!message) return;

        console.log('Sending message:', message);

        // Add user message to chat with styled format
        this.addUserStyledMessage(message);
        
        // Clear input
        this.chatbotInput.value = '';
        this.chatbotInput.style.height = 'auto';
        
        // Process message and get response
        this.processUserMessage(message);
        
        // Update user activity
        this.userPerformance.lastActive = new Date().toISOString();
        this.saveUserPerformance();
    }
    
    // New method to add styled user messages similar to the second image
    addUserStyledMessage(message) {
        if (!this.chatbotMessages) {
            console.error('Chatbot messages container not found');
            return;
        }
        
        // Store message in history
        this.messages.push({
            content: message,
            isUser: true,
            timestamp: new Date()
        });

        console.log('Adding styled user message to chat');

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.style.display = 'flex';
        messageDiv.style.justifyContent = 'flex-end';
        messageDiv.style.marginBottom = '12px';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Apply styling similar to the second image
        messageContent.style.backgroundColor = '#4CAF50';
        messageContent.style.color = '#ffffff';
        messageContent.style.borderRadius = '12px';
        messageContent.style.padding = '12px 16px';
        messageContent.style.maxWidth = '85%';
        messageContent.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        
        messageContent.textContent = message;
        
        messageDiv.appendChild(messageContent);
        this.chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Save conversation history
        this.saveConversationHistory();
    }

    async processUserMessage(message) {
        console.log('Processing user message:', message);
        
        // Show loading state
        this.showLoadingState();
        
        // Show typing indicator
        this.showTypingIndicator();

        if (!this.apiKey || !this.isApiConnected) {
            console.log('API key missing or not connected');
            setTimeout(() => {
                this.hideLoadingState();
                this.removeTypingIndicator();
                this.addStyledMessage('Please add your Gemini API key in the settings to use the chatbot. Click the gear icon below to navigate to settings.');
            }, 1000);
            return;
        }

        // If offline, provide offline response
        if (!navigator.onLine) {
            console.log('Browser is offline, providing offline response');
            setTimeout(() => {
                this.hideLoadingState();
                this.removeTypingIndicator();
                this.addStyledMessage('You appear to be offline. Please check your internet connection and try again.');
                
                // Suggest offline content
                setTimeout(() => {
                    this.addStyledMessage('In the meantime, you can review your progress or try some of our offline exercises.');
                    this.suggestLearningModules();
                }, 1000);
            }, 1000);
            return;
        }

        try {
            console.log('Preparing API call');
            // Prepare context and prompt for Gemini API
            const prompt = this.preparePrompt(message);
            
            // Call Gemini API with gemini-2.5-flash model
            console.log('Calling Gemini API');
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            const data = await response.json();
            console.log('API response received:', response.status);
            
            // Remove loading state and typing indicator
            this.hideLoadingState();
            this.removeTypingIndicator();
            
            if (response.ok && data.candidates && data.candidates.length > 0) {
                console.log('Valid response received');
                const botResponse = data.candidates[0].content.parts[0].text;
                
                // Create styled message element
                this.addStyledMessage(botResponse);
            } else {
                console.error('API error:', data);
                // Handle specific API errors with more detailed messages
                if (data.error) {
                    if (data.error.code === 429) {
                        this.addStyledMessage('You have reached the rate limit for API requests. Please try again in a few minutes. Error details: ' + data.error.message);
                    } else if (data.error.code === 400) {
                        this.addStyledMessage('There was an issue with your request. Please check your API key and try again. Error details: ' + data.error.message);
                    } else if (data.error.code === 403) {
                        this.addStyledMessage('API access denied. Your API key may be invalid or restricted. Please check your API key in settings.');
                    } else if (data.error.code === 404) {
                        this.addStyledMessage('The requested API endpoint was not found. This may be due to an API version change. Please update your application.');
                    } else if (data.error.code >= 500) {
                        this.addStyledMessage('The Gemini API is currently experiencing issues. Please try again later. Error details: ' + data.error.message);
                    } else {
                        this.addStyledMessage('Sorry, I encountered an error while processing your request. Error code: ' + data.error.code + ', Message: ' + data.error.message);
                    }
                } else if (data.promptFeedback && data.promptFeedback.blockReason) {
                    // Handle safety blocks
                    this.addStyledMessage('Your request was blocked by content safety filters. Please rephrase your message and try again.');
                } else {
                    this.addStyledMessage('Sorry, I encountered an error while processing your request. Please try again later.');
                }
                console.error('API response error:', data);
                
                // Suggest offline content
                setTimeout(() => {
                    this.addStyledMessage('In the meantime, you can review your progress or try some of our learning modules.');
                    this.suggestLearningModules();
                }, 1500);
            }
        } catch (error) {
            this.hideLoadingState();
            this.removeTypingIndicator();
            
            // Check if network error
            if (!navigator.onLine) {
                this.addStyledMessage('You appear to be offline. Please check your internet connection and try again.');
                
                // Suggest offline content
                setTimeout(() => {
                    this.addStyledMessage('In the meantime, you can review your progress or try some of our offline exercises.');
                    this.suggestLearningModules();
                }, 1500);
            } else {
                this.addStyledMessage('Sorry, there was an error connecting to the Gemini API. Please check your internet connection and try again.');
            }
            console.error('API request error:', error);
        }
    }
    
    // New method to add styled messages similar to the second image
    addStyledMessage(message) {
        if (!this.chatbotMessages) {
            console.error('Chatbot messages container not found');
            return;
        }
        
        // Store message in history
        this.messages.push({
            content: message,
            isUser: false,
            timestamp: new Date()
        });

        console.log('Adding styled message to chat');

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Apply styling similar to the second image
        messageContent.style.backgroundColor = '#1a2c3f';
        messageContent.style.color = '#e5eef7';
        messageContent.style.borderRadius = '12px';
        messageContent.style.padding = '12px 16px';
        messageContent.style.maxWidth = '85%';
        messageContent.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        
        // Handle markdown-like formatting
        messageContent.innerHTML = this.formatMessage(message);
        
        messageDiv.appendChild(messageContent);
        this.chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Save conversation history
        this.saveConversationHistory();
    }

    preparePrompt(userMessage) {
        // Create a system prompt that instructs the model to act as an English tutor
        const systemPrompt = `You are an expert English language tutor named "English Tutor" specifically designed for Bangladeshi students. 
        You are emulating the teaching methodology of renowned instructor Munzereen Shahid.
        
        Your primary goal is to help the student improve their English language skills in a supportive, 
        structured, and culturally relevant way. Always be encouraging, patient, and provide detailed explanations.
        
        Focus on these key areas:
        1. Writing improvement with step-by-step guidance
        2. Reading comprehension at appropriate levels (beginner to advanced)
        3. Speaking practice with pronunciation feedback
        4. Listening comprehension exercises
        5. Vocabulary building using Bangladeshi cultural references
        6. Grammar explanations with practical examples
        
        When providing examples or scenarios, use contexts that would be familiar to someone from Bangladesh.
        When teaching vocabulary, include Bengali translations when helpful.
        Keep your responses concise, clear, and focused on the student's specific needs.
        
        Current conversation history:
        ${this.messages.map(m => `${m.isUser ? 'Student' : 'Tutor'}: ${m.content}`).join('\n')}
        
        Student: ${userMessage}
        
        Tutor:`;
        
        return systemPrompt;
    }

    suggestLearningModules() {
        let moduleHtml = '<div class="suggested-modules"><h4>What would you like to learn today?</h4><div class="module-buttons">';
        
        for (const [key, module] of Object.entries(this.learningModules)) {
            moduleHtml += `<button class="module-btn" data-module="${key}">${module.name}</button>`;
        }
        
        moduleHtml += '</div></div>';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = moduleHtml;
        
        messageDiv.appendChild(messageContent);
        this.chatbotMessages.appendChild(messageDiv);
        
        // Add event listeners to module buttons
        setTimeout(() => {
            document.querySelectorAll('.module-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const moduleKey = e.target.dataset.module;
                    this.selectLearningModule(moduleKey);
                });
            });
        }, 0);
        
        this.scrollToBottom();
    }

    selectLearningModule(moduleKey) {
        const module = this.learningModules[moduleKey];
        if (!module) return;
        
        // Add module selection message
        this.addUserStyledMessage(`I'd like to practice ${module.name}`);
        
        // Show module description, levels, and options
        let moduleHtml = `<p>${module.description}</p>`;
        
        // Show level selection if available
        if (module.levels && module.levels.length > 0) {
            moduleHtml += `<div class="level-selection"><p>Select your level:</p><div class="level-buttons">`;
            
            module.levels.forEach(level => {
                moduleHtml += `<button class="level-btn" data-level="${level}">${level}</button>`;
            });
            
            moduleHtml += `</div></div>`;
        }
        
        // Show prompts
        moduleHtml += `<div class="prompt-suggestions"><p>Try asking:</p><ul>`;
        
        module.prompts.forEach(prompt => {
            moduleHtml += `<li><button class="prompt-btn">${prompt}</button></li>`;
        });
        
        moduleHtml += '</ul></div>';
        
        // Show exercises if available
        if (module.exercises && module.exercises.length > 0) {
            moduleHtml += `<div class="exercise-suggestions"><p>Try these exercises:</p><ul>`;
            
            module.exercises.forEach(exercise => {
                moduleHtml += `<li><button class="exercise-btn">${exercise}</button></li>`;
            });
            
            moduleHtml += '</ul></div>';
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = moduleHtml;
        
        messageDiv.appendChild(messageContent);
        this.chatbotMessages.appendChild(messageDiv);
        
        // Add event listeners to buttons
        setTimeout(() => {
            // Level buttons
            document.querySelectorAll('.level-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const level = e.target.dataset.level;
                    this.selectLevel(moduleKey, level);
                });
            });
            
            // Prompt buttons
            document.querySelectorAll('.prompt-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const promptText = e.target.textContent;
                    this.chatbotInput.value = promptText;
                    this.sendMessage();
                });
            });
            
            // Exercise buttons
            document.querySelectorAll('.exercise-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const exerciseText = e.target.textContent;
                    this.startExercise(moduleKey, exerciseText);
                });
            });
        }, 0);
        
        this.scrollToBottom();
    }
    
    selectLevel(moduleKey, level) {
        // Add level selection message
        this.addUserStyledMessage(`I want to practice at ${level} level`);
        
        // Track user's level selection
        this.userPerformance.currentLevel = level;
        this.saveUserPerformance();
        
        // Provide level-specific guidance
        let response = `Great choice! Let's practice at the **${level}** level.\n\n`;
        
        switch(moduleKey) {
            case 'writing':
                response += `For ${level} writing practice, we'll focus on appropriate vocabulary, grammar structures, and organization techniques for this level. Let's start with a simple exercise.`;
                break;
            case 'reading':
                response += `I'll provide reading materials suitable for ${level} students, with vocabulary and structures that will challenge you appropriately.`;
                break;
            case 'speaking':
                response += `We'll practice ${level} speaking scenarios with appropriate vocabulary and expressions.`;
                break;
            case 'listening':
                response += `I'll suggest listening exercises appropriate for ${level} students to help you improve your comprehension skills.`;
                break;
            case 'vocabulary':
                response += `We'll focus on ${level} vocabulary that will be most useful for your language development.`;
                break;
            case 'grammar':
                response += `I'll explain ${level} grammar concepts with examples and provide practice exercises.`;
                break;
            case 'assessment':
                response += `I'll prepare a ${level} assessment to evaluate your current skills and track your progress.`;
                break;
            default:
                response += `Let's begin with some ${level} exercises to improve your skills.`;
        }
        
        this.addStyledMessage(response);
        
        // Record activity
        this.recordActivity(`Started ${level} ${moduleKey} practice`);
    }
    
    startExercise(moduleKey, exerciseText) {
        // Add exercise selection message
        this.addUserStyledMessage(`I want to try this exercise: ${exerciseText}`);
        
        // Increment exercise counter
        this.userPerformance.exercisesCompleted++;
        
        // Update module-specific progress
        if (this.userPerformance.moduleProgress[moduleKey]) {
            this.userPerformance.moduleProgress[moduleKey].completed++;
            
            // Check for module mastery achievements
            this.checkModuleAchievements(moduleKey);
        }
        
        // Check for general achievements
        this.checkAchievements();
        
        this.saveUserPerformance();
        
        // Provide exercise instructions
        let response = `Great! Let's work on this exercise:\n\n**${exerciseText}**\n\n`;
        
        // Add module-specific instructions
        switch(moduleKey) {
            case 'writing':
                response += `Please write your response in the chat. I'll review it and provide feedback on your writing.`;
                break;
            case 'reading':
                response += `I'll provide a passage for you to read, then ask you some comprehension questions.`;
                break;
            case 'speaking':
                response += `Practice saying these phrases aloud, focusing on pronunciation and intonation. You can type 'next' when you're ready to continue.`;
                break;
            case 'listening':
                response += `Imagine you're listening to a conversation. I'll provide the script and then ask questions to test your comprehension.`;
                break;
            case 'vocabulary':
                response += `I'll provide the exercise content, and you can respond with your answers.`;
                break;
            case 'grammar':
                response += `Complete the exercise and submit your answers. I'll provide corrections and explanations.`;
                break;
            case 'assessment':
                response += `This assessment will help us identify your strengths and areas for improvement. Answer each question to the best of your ability.`;
                break;
            default:
                response += `Complete the exercise as instructed. I'll provide guidance and feedback.`;
        }
        
        this.addStyledMessage(response);
        
        // Record activity
        this.recordActivity(`Started exercise: ${exerciseText}`);
    }
    
    checkModuleAchievements(moduleKey) {
        const progress = this.userPerformance.moduleProgress[moduleKey];
        
        // Check for module-specific achievements
        if (progress.completed >= progress.total) {
            switch(moduleKey) {
                case 'writing':
                    this.awardAchievement('writingMaster');
                    break;
                case 'reading':
                    this.awardAchievement('readingMaster');
                    break;
                case 'speaking':
                    this.awardAchievement('speakingMaster');
                    break;
                case 'listening':
                    this.awardAchievement('listeningMaster');
                    break;
                case 'vocabulary':
                    this.awardAchievement('vocabularyMaster');
                    break;
                case 'grammar':
                    this.awardAchievement('grammarMaster');
                    break;
                case 'assessment':
                    this.awardAchievement('assessmentMaster');
                    break;
            }
        }
        
        // Check if user has tried all modules
        const moduleKeys = Object.keys(this.userPerformance.moduleProgress);
        const allModulesTried = moduleKeys.every(key => this.userPerformance.moduleProgress[key].completed > 0);
        
        if (allModulesTried) {
            this.awardAchievement('allModules');
        }
    }
    
    checkAchievements() {
        // First lesson achievement
        if (this.userPerformance.exercisesCompleted === 1) {
            this.awardAchievement('firstLesson');
        }
        
        // Five exercises achievement
        if (this.userPerformance.exercisesCompleted === 5) {
            this.awardAchievement('fiveExercises');
        }
        
        // Ten sessions achievement
        if (this.userPerformance.sessionsCompleted >= 10) {
            this.awardAchievement('tenSessions');
        }
        
        // Advanced level achievement
        if (this.userPerformance.currentLevel === 'advanced') {
            this.awardAchievement('advancedLevel');
        }
        
        // Perfect score achievement (if applicable)
        if (this.userPerformance.quizScores.includes(100)) {
            this.awardAchievement('perfectScore');
        }
        
        // Check for consistent learner (5 days streak)
        // This would require additional date tracking logic
    }
    
    awardAchievement(achievementId) {
        // Check if achievement already awarded
        if (this.userPerformance.achievements.includes(achievementId)) {
            return;
        }
        
        // Add achievement to user's collection
        this.userPerformance.achievements.push(achievementId);
        
        // Get achievement details
        const achievement = this.achievements[achievementId];
        
        if (!achievement) return;
        
        // Display achievement notification
        this.displayAchievementNotification(achievement);
        
        // Save updated performance data
        this.saveUserPerformance();
    }
    
    displayAchievementNotification(achievement) {
        // Create achievement notification element
        const notificationEl = document.createElement('div');
        notificationEl.className = 'achievement-notification';
        notificationEl.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-details">
                <h3>Achievement Unlocked!</h3>
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notificationEl);
        
        // Add animation class
        setTimeout(() => {
            notificationEl.classList.add('show');
        }, 100);
        
        // Remove after display
        setTimeout(() => {
            notificationEl.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notificationEl);
            }, 500);
        }, 5000);
        
        // Also add as a message in the chat
        this.addStyledMessage(`🎉 **Achievement Unlocked!** ${achievement.icon} **${achievement.name}**: ${achievement.description}`);
    }
    
    recordActivity(activityDescription) {
        // Add activity to recent activities
        this.userPerformance.recentActivities.unshift({
            description: activityDescription,
            timestamp: new Date().toISOString()
        });
        
        // Keep only the 10 most recent activities
        if (this.userPerformance.recentActivities.length > 10) {
            this.userPerformance.recentActivities = this.userPerformance.recentActivities.slice(0, 10);
        }
        
        // Update last active timestamp
        this.userPerformance.lastActive = new Date().toISOString();
        
        // Increment session counter if this is a new session
        const lastSessionTime = localStorage.getItem('chatbot_last_session_time');
        const currentTime = new Date().getTime();
        
        if (!lastSessionTime || (currentTime - parseInt(lastSessionTime)) > 3600000) { // 1 hour = new session
            this.userPerformance.sessionsCompleted++;
            localStorage.setItem('chatbot_last_session_time', currentTime.toString());
            
            // Create new session record
            if (!this.sessionId) {
                this.initSession();
            }
            
            // Add to session history
            this.userPerformance.sessionHistory.push({
                sessionId: this.sessionId,
                startTime: new Date().toISOString(),
                activities: [activityDescription]
            });
        } else if (this.userPerformance.sessionHistory.length > 0) {
            // Add activity to current session
            const currentSession = this.userPerformance.sessionHistory[this.userPerformance.sessionHistory.length - 1];
            if (currentSession.activities) {
                currentSession.activities.push(activityDescription);
            }
        }
        
        this.saveUserPerformance();
    }
    
    loadUserPerformance() {
        const savedData = localStorage.getItem('chatbot_user_performance');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                // Merge saved data with default structure to ensure all properties exist
                this.userPerformance = {
                    ...this.userPerformance,
                    ...parsedData
                };
                
                // Ensure module progress structure is complete
                if (!this.userPerformance.moduleProgress) {
                    this.userPerformance.moduleProgress = {
                        writing: { completed: 0, total: 10 },
                        reading: { completed: 0, total: 10 },
                        speaking: { completed: 0, total: 10 },
                        listening: { completed: 0, total: 10 },
                        vocabulary: { completed: 0, total: 10 },
                        grammar: { completed: 0, total: 10 },
                        assessment: { completed: 0, total: 5 }
                    };
                }
                
                // Ensure achievements array exists
                if (!this.userPerformance.achievements) {
                    this.userPerformance.achievements = [];
                }
                
                // Ensure recent activities array exists
                if (!this.userPerformance.recentActivities) {
                    this.userPerformance.recentActivities = [];
                }
                
                // Ensure session history array exists
                if (!this.userPerformance.sessionHistory) {
                    this.userPerformance.sessionHistory = [];
                }
                
                // Ensure lastActive timestamp exists
                if (!this.userPerformance.lastActive) {
                    this.userPerformance.lastActive = new Date().toISOString();
                }
            } catch (error) {
                console.error('Error loading user performance data:', error);
                // Reset to default if there's an error
                this.resetUserPerformance();
            }
        }
    }
    
    resetUserPerformance() {
        this.userPerformance = {
            sessionsCompleted: 0,
            exercisesCompleted: 0,
            strengths: [],
            areasForImprovement: [],
            recentActivities: [],
            achievements: [],
            quizScores: [],
            currentLevel: 'beginner',
            lastActive: new Date().toISOString(),
            sessionHistory: [],
            moduleProgress: {
                writing: { completed: 0, total: 10 },
                reading: { completed: 0, total: 10 },
                speaking: { completed: 0, total: 10 },
                listening: { completed: 0, total: 10 },
                vocabulary: { completed: 0, total: 10 },
                grammar: { completed: 0, total: 10 },
                assessment: { completed: 0, total: 5 }
            }
        };
        this.saveUserPerformance();
    }
    
    setupProgressDisplay() {
        // Progress display functionality without adding button to header
        // The graph icon button has been removed as requested
    }
    
    showProgressOverview() {
        // This method has been modified to not display the progress overview message
        // as per user request. The functionality is still available programmatically
        // but will not automatically display in the chat.
        console.log('Progress overview display disabled as requested by user');
        
        // No message is added to the chat
        return;
    }
    
    updateProgressDisplay() {
        // This method will be called whenever user performance is updated
        // It can be used to update any visible progress indicators in real-time
        // For now, we'll just ensure the data is saved
        localStorage.setItem('chatbot_user_performance', JSON.stringify(this.userPerformance));
    }
    
    saveUserPerformance() {
        localStorage.setItem('chatbot_user_performance', JSON.stringify(this.userPerformance));
        this.updateProgressDisplay();
    }
}

// Add methods for loading state
EnglishTutorChatbot.prototype.showLoadingState = function() {
    console.log('Showing loading state');
    if (this.loadingOverlay) {
        this.loadingOverlay.classList.remove('hidden');
    } else {
        console.error('Loading overlay element not found');
        // Create loading overlay if it doesn't exist
        if (this.chatbotWidget) {
            this.loadingOverlay = document.createElement('div');
            this.loadingOverlay.id = 'loading-overlay';
            this.loadingOverlay.className = 'loading-overlay';
            this.loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
            this.chatbotWidget.appendChild(this.loadingOverlay);
            console.log('Created new loading overlay');
        } else {
            console.error('Cannot create loading overlay: chatbot widget not found');
        }
    }
};

EnglishTutorChatbot.prototype.hideLoadingState = function() {
    console.log('Hiding loading state');
    if (this.loadingOverlay) {
        this.loadingOverlay.classList.add('hidden');
    } else {
        console.error('Loading overlay element not found');
    }
};

// Add method to show feedback messages
EnglishTutorChatbot.prototype.showFeedbackMessage = function(message, type = 'info') {
    // Create feedback message element if it doesn't exist
    if (!this.feedbackContainer) {
        this.feedbackContainer = document.createElement('div');
        this.feedbackContainer.className = 'feedback-container';
        this.chatbotWidget.appendChild(this.feedbackContainer);
    }
    
    // Create message element
    const feedbackMessage = document.createElement('div');
    feedbackMessage.className = `feedback-message ${type}`;
    feedbackMessage.textContent = message;
    
    // Add to container
    this.feedbackContainer.appendChild(feedbackMessage);
    
    // Show message with animation
    setTimeout(() => {
        feedbackMessage.classList.add('visible');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        feedbackMessage.classList.remove('visible');
        setTimeout(() => {
            if (feedbackMessage.parentNode) {
                feedbackMessage.parentNode.removeChild(feedbackMessage);
            }
        }, 300);
    }, 5000);
};

// Add method to check connection status
EnglishTutorChatbot.prototype.checkConnectionStatus = function() {
    const updateConnectionStatus = () => {
        this.isConnected = navigator.onLine;
        if (this.isConnected) {
            this.updateApiStatus(this.isApiConnected, this.isApiConnected ? 'Online' : 'Offline');
        } else {
            this.updateApiStatus(false, 'Offline');
        }
    };
    
    // Check initial status
    updateConnectionStatus();
    
    // Add event listeners for online/offline events
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
};

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.englishTutorChatbot = new EnglishTutorChatbot();
    
    // Add welcome message after a short delay
    setTimeout(() => {
        window.englishTutorChatbot.addMessage('Hello! I\'m your English language tutor. How can I help you improve your English today?');
        setTimeout(() => {
            window.englishTutorChatbot.suggestLearningModules();
        }, 500);
    }, 1000);
});

// Add method to initialize session
EnglishTutorChatbot.prototype.initSession = function() {
    // Generate a unique session ID
    this.sessionId = 'session_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Initialize connection status
    this.isConnected = navigator.onLine;
    
    // Check if we should resume previous session
    if (this.userPerformance.lastActive) {
        const lastActiveTime = new Date(this.userPerformance.lastActive).getTime();
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastActiveTime;
        
        // If last active within 30 minutes, consider it the same session
        if (timeDiff < 30 * 60 * 1000) {
            console.log('Resuming previous session');
            // If there are session history entries, use the last session ID
            if (this.userPerformance.sessionHistory && this.userPerformance.sessionHistory.length > 0) {
                this.sessionId = this.userPerformance.sessionHistory[this.userPerformance.sessionHistory.length - 1].sessionId;
            }
        } else {
            console.log('Starting new session after inactivity');
        }
    }
    
    console.log('Session initialized with ID:', this.sessionId);
};