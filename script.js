// English-Bengali Learning Platform JavaScript

class LearningApp {
    constructor() {
        this.currentSection = 'welcome';
        this.currentCardIndex = 0;
        this.quizQuestions = [];
        this.currentQuizQuestion = 0;
        this.quizScore = 0;
        this.userProgress = this.loadProgress();
        this.wordsData = [];
        this.currentSessionWords = [];
        this.isLoading = false;
    // Selected difficulty filters (A1, A2, B1, B2, or 'all')
    this.flashcardDifficulty = 'all';
    this.quizDifficulty = 'all';
        
        // Ensure a single global instance
        window.learningApp = this;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadWordsData();
        this.updateProgressDisplay();
        this.setupBackToTop();
        this.setupKeyboardShortcuts();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchSection(e.target.closest('.nav-btn').dataset.section);
            });
        });
        


        // Start learning button
        document.getElementById('start-learning').addEventListener('click', () => {
            this.switchSection('flashcards');
        });

        // Flashcard controls
        document.getElementById('flip-card').addEventListener('click', () => {
            this.flipCard();
        });

        document.getElementById('prev-card').addEventListener('click', () => {
            this.previousCard();
        });

        document.getElementById('next-card').addEventListener('click', () => {
            this.nextCard();
        });

        document.getElementById('mark-known').addEventListener('click', () => {
            this.markWordAsKnown();
        });

        document.getElementById('mark-unknown').addEventListener('click', () => {
            this.markWordAsUnknown();
        });

        // Quiz controls
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectQuizOption(e.target.dataset.option);
            });
        });

        document.getElementById('next-question').addEventListener('click', () => {
            this.nextQuizQuestion();
        });

        // Settings
        document.getElementById('export-progress').addEventListener('click', () => {
            this.exportProgress();
        });

        document.getElementById('import-progress').addEventListener('click', () => {
            this.importProgress();
        });

        document.getElementById('reset-progress').addEventListener('click', () => {
            this.resetProgress();
        });

        // Flashcard click to flip
        document.getElementById('flashcard').addEventListener('click', () => {
            this.flipCard();
        });

        // Difficulty selectors
        const flashcardDiffSelect = document.getElementById('flashcard-difficulty');
        if (flashcardDiffSelect) {
            flashcardDiffSelect.addEventListener('change', (e) => {
                this.flashcardDifficulty = e.target.value;
                if (this.currentSection === 'flashcards') {
                    this.initializeFlashcards();
                }
            });
        }
        const quizDiffSelect = document.getElementById('quiz-difficulty');
        if (quizDiffSelect) {
            quizDiffSelect.addEventListener('change', (e) => {
                this.quizDifficulty = e.target.value;
                if (this.currentSection === 'quiz') {
                    this.initializeQuiz();
                }
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const storedTheme = localStorage.getItem('appTheme');
            if (storedTheme === 'dark') {
                document.body.classList.add('dark');
                this.updateThemeToggleIcon(true);
            }
            themeToggle.addEventListener('click', () => {
                const isDark = document.body.classList.toggle('dark');
                localStorage.setItem('appTheme', isDark ? 'dark' : 'light');
                this.updateThemeToggleIcon(isDark);
            });
        }
    }

    updateThemeToggleIcon(isDark) {
        const icon = document.querySelector('#theme-toggle i');
        const textSpan = document.querySelector('#theme-toggle .theme-text');
        if (!icon || !textSpan) return;
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            textSpan.textContent = 'Light';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            textSpan.textContent = 'Dark';
        }
    }

    loadWordsData() {
        this.loadSampleWords();
    }


    loadSampleWords() {
        // Fallback sample data
        this.wordsData = [
    {
    "english": "a, an",
    "Bangla": "একটি",
    "meaning": "Used when referring to someone or something for the first time in a text or conversation.",
    "type": "indefinite article",
    "example": "She has a dog.",
    "difficulty": "A1"
     },
      {
        "english": "abandon",
        "bengali": "ত্যাগ করা",
        "meaning": "Cease to support or look after (someone); desert.",
        "type": "verb",
        "example": "He had to abandon his car.",
        "difficulty": "B2"
    },
    {
        "english": "ability",
        "bengali": "দক্ষতা",
        "meaning": "Possession of the means or skill to do something.",
        "type": "noun",
        "example": "He has the ability to do the work.",
        "difficulty": "A2"
    },
    {
        "english": "able",
        "bengali": "সক্ষম",
        "meaning": "Having the power, skill, means, or opportunity to do something.",
        "type": "adjective",
        "example": "Will she be able to cope?",
        "difficulty": "A2"
    },
    {
        "english": "about",
        "bengali": "সম্পর্কে",
        "meaning": "On the subject of; concerning.",
        "type": "preposition, adverb",
        "example": "I was thinking about you.",
        "difficulty": "A1"
    },
    {
        "english": "above",
        "bengali": "উপরে",
        "meaning": "At a higher level or layer.",
        "type": "preposition, adverb",
        "example": "The sun is above the clouds.",
        "difficulty": "A1"
    },
    {
        "english": "abroad",
        "bengali": "বিদেশে",
        "meaning": "In or to a foreign country or countries.",
        "type": "adverb",
        "example": "He's currently abroad on business.",
        "difficulty": "B2"
    },
    {
        "english": "absolute",
        "bengali": "পরম",
        "meaning": "Not qualified or diminished in any way; total.",
        "type": "adjective",
        "example": "The decision was an absolute disaster.",
        "difficulty": "B2"
    },
    {
        "english": "absolutely",
        "bengali": "একেবারে",
        "meaning": "With no qualification, restriction, or limitation; totally.",
        "type": "adverb",
        "example": "You are absolutely right.",
        "difficulty": "B1"
    },
    {
        "english": "academic",
        "bengali": "অ্যাকাডেমিক",
        "meaning": "Relating to education and scholarship.",
        "type": "adjective",
        "example": "She has a strong academic background.",
        "difficulty": "B1"
    },
    {
        "english": "accept",
        "bengali": "গ্রহণ করা",
        "meaning": "Consent to receive or undertake (something offered).",
        "type": "verb",
        "example": "He accepted a pen from me.",
        "difficulty": "A2"
    },
    {
        "english": "acceptable",
        "bengali": "গ্রহণযোগ্য",
        "meaning": "Able to be agreed on; suitable.",
        "type": "adjective",
        "example": "The food was acceptable, but not outstanding.",
        "difficulty": "B2"
    },
    {
        "english": "access",
        "bengali": "প্রবেশাধিকার",
        "meaning": "The means or opportunity to approach or enter a place.",
        "type": "noun, verb",
        "example": "The police gained access to the house through a side door.",
        "difficulty": "B1"
    },
    {
        "english": "accident",
        "bengali": "দুর্ঘটনা",
        "meaning": "An unfortunate incident that happens unexpectedly and unintentionally, typically resulting in damage or injury.",
        "type": "noun",
        "example": "He had an accident at the factory.",
        "difficulty": "A2"
    },
    {
        "english": "accompany",
        "bengali": "সঙ্গে থাকা",
        "meaning": "Go somewhere with (someone) as a companion or escort.",
        "type": "verb",
        "example": "The children must be accompanied by an adult.",
        "difficulty": "B2"
    },
    {
        "english": "according to",
        "bengali": "অনুযায়ী",
        "meaning": "As stated by or in.",
        "type": "preposition",
        "example": "According to the weather forecast, it will rain tomorrow.",
        "difficulty": "A2"
    },
    {
        "english": "account",
        "bengali": "হিসাব",
        "meaning": "A report or description of an event or experience.",
        "type": "noun, verb",
        "example": "She gave a detailed account of the incident.",
        "difficulty": "B1"
    },
    {
        "english": "accurate",
        "bengali": "নির্ভুল",
        "meaning": "(of information, measurements, statistics, etc.) correct in all details; exact.",
        "type": "adjective",
        "example": "The information is accurate.",
        "difficulty": "B2"
    },
   {
        "english": "accuse",
        "bengali": "অভিযুক্ত করা",
        "meaning": "Charge (someone) with an offense or crime.",
        "type": "verb",
        "example": "He was accused of murder.",
        "difficulty": "B2"
    },
    {
        "english": "achieve",
        "bengali": "অর্জন করা",
        "meaning": "Successfully bring about or reach (a desired objective, level, or result) by effort, skill, or courage.",
        "type": "verb",
        "example": "She achieved her goal of becoming a doctor.",
        "difficulty": "A2"
    },
    {
        "english": "achievement",
        "bengali": "কৃতিত্ব",
        "meaning": "A thing done successfully, typically by effort, courage, or skill.",
        "type": "noun",
        "example": "It was a great achievement to finish the marathon.",
        "difficulty": "B1"
    },
    {
        "english": "acknowledge",
        "bengali": "স্বীকার করা",
        "meaning": "Accept or admit the existence or truth of.",
        "type": "verb",
        "example": "She acknowledged that she had been at fault.",
        "difficulty": "B2"
    },
    {
        "english": "acquire",
        "bengali": "অর্জন করা",
        "meaning": "Buy or obtain (an asset or object) for oneself.",
        "type": "verb",
        "example": "I managed to acquire all the books I needed.",
        "difficulty": "B2"
    },
    {
        "english": "across",
        "bengali": "জুড়ে",
        "meaning": "From one side to the other of (a place, area, etc.).",
        "type": "preposition, adverb",
        "example": "She walked across the street.",
        "difficulty": "A1"
    },
    {
        "english": "act",
        "bengali": "কাজ করা",
        "meaning": "Take action; do something.",
        "type": "verb, noun",
        "example": "She acted as if she didn't know me.",
        "difficulty": "A2"
    },
    {
        "english": "action",
        "bengali": "কর্ম",
        "meaning": "The fact or process of doing something, typically to achieve an aim.",
        "type": "noun",
        "example": "He is a man of action.",
        "difficulty": "A1"
    },
    {
        "english": "active",
        "bengali": "সক্রিয়",
        "meaning": "Engaging or ready to engage in physically energetic pursuits.",
        "type": "adjective",
        "example": "She's a very active person.",
        "difficulty": "A2"
    },
    {
        "english": "activity",
        "bengali": "কার্যকলাপ",
        "meaning": "The condition in which things are happening or being done.",
        "type": "noun",
        "example": "There was a lot of activity in the kitchen.",
        "difficulty": "A1"
    },
    {
        "english": "actor",
        "bengali": "অভিনেতা",
        "meaning": "A person whose profession is acting on the stage, in movies, or on television.",
        "type": "noun",
        "example": "He is a famous actor.",
        "difficulty": "A1"
    },
    {
        "english": "actress",
        "bengali": "অভিনেত্রী",
        "meaning": "A woman whose profession is acting on the stage, in movies, or on television.",
        "type": "noun",
        "example": "She is a talented actress.",
        "difficulty": "A1"
    },
    {
        "english": "actual",
        "bengali": "প্রকৃত",
        "meaning": "Existing in fact; typically as contrasted with what was intended, expected, or believed.",
        "type": "adjective",
        "example": "The actual cost was higher than we expected.",
        "difficulty": "B2"
    },
    {
        "english": "actually",
        "bengali": "আসলে",
        "meaning": "As the truth or facts of a situation; really.",
        "type": "adverb",
        "example": "He didn't actually say anything.",
        "difficulty": "A2"
    },
    {
        "english": "ad",
        "bengali": "বিজ্ঞাপন",
        "meaning": "An advertisement.",
        "type": "noun",
        "example": "I saw an ad for a new car.",
        "difficulty": "B1"
    },
    {
        "english": "adapt",
        "bengali": "অভিযোজিত করা",
        "meaning": "Make (something) suitable for a new use or purpose; modify.",
        "type": "verb",
        "example": "We have to adapt to the new system.",
        "difficulty": "B2"
    },
    {
        "english": "add",
        "bengali": "যোগ করা",
        "meaning": "Join (something) to something else so as to increase the size, number, or amount.",
        "type": "verb",
        "example": "Please add my name to the list.",
        "difficulty": "A1"
    },
    {
        "english": "addition",
        "bengali": "সংযোজন",
        "meaning": "The action or process of adding something to something else.",
        "type": "noun",
        "example": "The hotel is building a new addition.",
        "difficulty": "B1"
    },
    {
        "english": "additional",
        "bengali": "অতিরিক্ত",
        "meaning": "Added, extra, or supplementary to what is already present or available.",
        "type": "adjective",
        "example": "There will be an additional charge for this service.",
        "difficulty": "B2"
    },
    {
        "english": "address",
        "bengali": "ঠিকানা",
        "meaning": "The particulars of the place where someone lives or an organization is situated.",
        "type": "noun, verb",
        "example": "What is your home address?",
        "difficulty": "A1"
    },
    {
        "english": "administration",
        "bengali": "প্রশাসন",
        "meaning": "The process or activity of running a business, organization, etc.",
        "type": "noun",
        "example": "I work in the sales administration department.",
        "difficulty": "B1"
    },
    {
        "english": "admire",
        "bengali": "প্রশংসা করা",
        "meaning": "Regard (an object, quality, or person) with respect or warm approval.",
        "type": "verb",
        "example": "I admire her for her bravery.",
        "difficulty": "B1"
    },
    {
        "english": "admit",
        "bengali": "স্বীকার করা",
        "meaning": "Confess to be true or to be the case, typically with reluctance.",
        "type": "verb",
        "example": "He admitted his mistake.",
        "difficulty": "B1"
    },
    {
        "english": "adopt",
        "bengali": "দত্তক গ্রহণ করা",
        "meaning": "Legally take (another's child) and bring it up as one's own.",
        "type": "verb",
        "example": "They decided to adopt a child.",
        "difficulty": "B2"
    },
    {
        "english": "adult",
        "bengali": "প্রাপ্তবয়স্ক",
        "meaning": "A person who is fully grown or developed.",
        "type": "noun, adjective",
        "example": "This movie is for adults only.",
        "difficulty": "A1"
    },
    {
        "english": "advance",
        "bengali": "অগ্রিম",
        "meaning": "Move forward in a purposeful way.",
        "type": "noun, verb, adjective",
        "example": "The army advanced on the city.",
        "difficulty": "B2"
    },
    {
        "english": "advanced",
        "bengali": "উন্নত",
        "meaning": "Modern and recently developed.",
        "type": "adjective",
        "example": "This is the most advanced technology available.",
        "difficulty": "B1"
    },
    {
        "english": "advantage",
        "bengali": "সুবিধা",
        "meaning": "A condition or circumstance that puts one in a favorable or superior position.",
        "type": "noun",
        "example": "Her experience gave her an advantage over the other applicants.",
        "difficulty": "A2"
    },
    {
        "english": "adventure",
        "bengali": "দুঃসাহসিক কাজ",
        "meaning": "An unusual and exciting, typically hazardous, experience or activity.",
        "type": "noun",
        "example": "He is looking for adventure.",
        "difficulty": "A2"
    },
    {
        "english": "advertise",
        "bengali": "বিজ্ঞাপন করা",
        "meaning": "Describe or draw attention to (a product, service, or event) in a public medium in order to promote sales or attendance.",
        "type": "verb",
        "example": "They are advertising the new product on television.",
        "difficulty": "A2"
    },
    {
        "english": "advertisement",
        "bengali": "বিজ্ঞাপন",
        "meaning": "A notice or announcement in a public medium promoting a product, service, or event or publicizing a job vacancy.",
        "type": "noun",
        "example": "I saw an advertisement for a new car.",
        "difficulty": "A2"
    },
    {
        "english": "advertising",
        "bengali": "বিজ্ঞাপন",
        "meaning": "The activity or profession of producing advertisements for commercial products or services.",
        "type": "noun",
        "example": "He works in advertising.",
        "difficulty": "A2"
    },
    {
        "english": "advice",
        "bengali": "উপদেশ",
        "meaning": "Guidance or recommendations offered with regard to prudent future action.",
        "type": "noun",
        "example": "Let me give you some advice.",
        "difficulty": "A1"
    },
    {
        "english": "advise",
        "bengali": "উপদেশ দেওয়া",
        "meaning": "Offer suggestions about the best course of action to someone.",
        "type": "verb",
        "example": "I would advise you to see a doctor.",
        "difficulty": "B1"
    },
    {
        "english": "affair",
        "bengali": "ব্যাপার",
        "meaning": "An event or sequence of events of a specified kind or that has previously been referred to.",
        "type": "noun",
        "example": "The whole affair was a disaster.",
        "difficulty": "B2"
    },
    {
        "english": "affect",
        "bengali": "প্রভাবিত করা",
        "meaning": "Have an effect on; make a difference to.",
        "type": "verb",
        "example": "The divorce affected every aspect of her life.",
        "difficulty": "A2"
    },
    {
        "english": "afford",
        "bengali": "সাধ্যের মধ্যে থাকা",
        "meaning": "Have enough money to pay for.",
        "type": "verb",
        "example": "I can't afford a new car.",
        "difficulty": "B1"
    },
    {
        "english": "afraid",
        "bengali": "ভীত",
        "meaning": "Feeling fear or anxiety; frightened.",
        "type": "adjective",
        "example": "She was afraid of the dark.",
        "difficulty": "A1"
    },
    {
        "english": "after",
        "bengali": "পরে",
        "meaning": "During the period of time following (an event).",
        "type": "preposition, conjunction, adverb",
        "example": "I'll see you after school.",
        "difficulty": "A1"
    },
    {
        "english": "afternoon",
        "bengali": "বিকাল",
        "meaning": "The time from noon or lunchtime to evening.",
        "type": "noun",
        "example": "Let's meet this afternoon.",
        "difficulty": "A1"
    },
    {
        "english": "afterward",
        "bengali": "পরে",
        "meaning": "At a later or future time; subsequently.",
        "type": "adverb",
        "example": "Let's go to the cinema now and eat afterward.",
        "difficulty": "B2"
    },
    {
        "english": "again",
        "bengali": "আবার",
        "meaning": "Another time; once more.",
        "type": "adverb",
        "example": "Can you say that again?",
        "difficulty": "A1"
    },
    {
        "english": "against",
        "bengali": "বিরুদ্ধে",
        "meaning": "In opposition to.",
        "type": "preposition",
        "example": "They are playing against the best team in the league.",
        "difficulty": "A2"
    },
    {
        "english": "age",
        "bengali": "বয়স",
        "meaning": "The length of time that a person has lived or a thing has existed.",
        "type": "noun, verb",
        "example": "What is your age?",
        "difficulty": "A1"
    },
    {
        "english": "agency",
        "bengali": "সংস্থা",
        "meaning": "A business or organization established to provide a particular service, typically one that involves organizing transactions between two other parties.",
        "type": "noun",
        "example": "She works for an advertising agency.",
        "difficulty": "B2"
    },
    {
        "english": "agenda",
        "bengali": "আলোচ্যসূচি",
        "meaning": "A list of items to be discussed at a formal meeting.",
        "type": "noun",
        "example": "The first item on the agenda is the budget.",
        "difficulty": "B2"
    },
    {
        "english": "agent",
        "bengali": "প্রতিনিধি",
        "meaning": "A person who acts on behalf of another person or group.",
        "type": "noun",
        "example": "Please contact our agent in Spain for more information.",
        "difficulty": "B1"
    },
    {
        "english": "aggressive",
        "bengali": "আক্রমণাত্মক",
        "meaning": "Ready or likely to attack or confront; characterized by or resulting from aggression.",
        "type": "adjective",
        "example": "He is a very aggressive player.",
        "difficulty": "B2"
    },
    {
        "english": "ago",
        "bengali": "আগে",
        "meaning": "Before the present; earlier.",
        "type": "adverb",
        "example": "I met her a long time ago.",
        "difficulty": "A1"
    },
    {
        "english": "agree",
        "bengali": "সম্মত হওয়া",
        "meaning": "Have the same opinion about something; concur.",
        "type": "verb",
        "example": "I agree with you.",
        "difficulty": "A1"
    },
    {
        "english": "agreement",
        "bengali": "চুক্তি",
        "meaning": "A negotiated and typically legally binding arrangement between parties as to a course of action.",
        "type": "noun",
        "example": "They have signed a peace agreement.",
        "difficulty": "B1"
    },
    {
        "english": "ah",
        "bengali": "আহ",
        "meaning": "Used to express a range of emotions including surprise, pleasure, or sympathy.",
        "type": "exclamation",
        "example": "Ah, that's better.",
        "difficulty": "A2"
    },
    {
        "english": "ahead",
        "bengali": "সামনে",
        "meaning": "Further forward in space; in the line of one's forward motion.",
        "type": "adverb",
        "example": "The road ahead is very busy.",
        "difficulty": "B1"
    },
    {
        "english": "aid",
        "bengali": "সাহায্য",
        "meaning": "Help, typically of a practical nature.",
        "type": "noun, verb",
        "example": "They sent aid to the victims of the earthquake.",
        "difficulty": "B2"
    },
    {
        "english": "aim",
        "bengali": "লক্ষ্য",
        "meaning": "A purpose or intention; a desired outcome.",
        "type": "verb, noun",
        "example": "My main aim in life is to be a good husband and father.",
        "difficulty": "B1"
    },
    {
        "english": "air",
        "bengali": "বাতাস",
        "meaning": "The invisible gaseous substance surrounding the earth, a mixture mainly of oxygen and nitrogen.",
        "type": "noun",
        "example": "I need some fresh air.",
        "difficulty": "A1"
    },
    {
        "english": "aircraft",
        "bengali": "বিমান",
        "meaning": "An airplane, helicopter, or other machine capable of flight.",
        "type": "noun",
        "example": "The aircraft is ready for takeoff.",
        "difficulty": "B2"
    },
    {
        "english": "airline",
        "bengali": "বিমান সংস্থা",
        "meaning": "An organization providing a regular public service of air transport on scheduled routes.",
        "type": "noun",
        "example": "I need to book a flight with a different airline.",
        "difficulty": "A2"
    },
    {
        "english": "airport",
        "bengali": "বিমানবন্দর",
        "meaning": "A complex of runways and buildings for the takeoff, landing, and maintenance of civil aircraft, with facilities for passengers.",
        "type": "noun",
        "example": "I'll meet you at the airport.",
        "difficulty": "A1"
    },
    {
        "english": "alarm",
        "bengali": "সতর্কবার্তা",
        "meaning": "An anxious awareness of danger.",
        "type": "noun, verb",
        "example": "The fire alarm went off.",
        "difficulty": "B1"
    },
    {
        "english": "album",
        "bengali": "অ্যালবাম",
        "meaning": "A collection of recordings issued as a single item on CD, record, or another medium.",
        "type": "noun",
        "example": "Have you heard their new album?",
        "difficulty": "B1"
    },
    {
        "english": "alcohol",
        "bengali": "মদ",
        "meaning": "A colorless volatile flammable liquid which is produced by the natural fermentation of sugars and is the intoxicating constituent of wine, beer, spirits, and other drinks, and is also used as an industrial solvent and as a fuel.",
        "type": "noun",
        "example": "He doesn't drink alcohol.",
        "difficulty": "B1"
    },
    {
        "english": "alcoholic",
        "bengali": "মদীয়",
        "meaning": "Containing or relating to alcohol.",
        "type": "adjective",
        "example": "This is an alcoholic drink.",
        "difficulty": "B1"
    },
    {
        "english": "alive",
        "bengali": "জীবিত",
        "meaning": "(of a person, animal, or plant) living, not dead.",
        "type": "adjective",
        "example": "It's good to be alive.",
        "difficulty": "A2"
    },
    {
        "english": "all",
        "bengali": "সব",
        "meaning": "Used to refer to the whole quantity or extent of a particular group or thing.",
        "type": "determiner, pronoun, adverb",
        "example": "All the students passed the exam.",
        "difficulty": "A1"
    },
    {
        "english": "all right",
        "bengali": "ঠিক আছে",
        "meaning": "Satisfactory but not especially good; acceptable.",
        "type": "adjective, adverb",
        "example": "Are you all right?",
        "difficulty": "A2"
    },
    {
        "english": "allow",
        "bengali": "অনুমতি দেওয়া",
        "meaning": "Let (someone) have or do something.",
        "type": "verb",
        "example": "They don't allow smoking here.",
        "difficulty": "A2"
    },
    {
        "english": "almost",
        "bengali": "প্রায়",
        "meaning": "Not quite; very nearly.",
        "type": "adverb",
        "example": "I'm almost finished.",
        "difficulty": "A2"
    },
    {
        "english": "alone",
        "bengali": "একা",
        "meaning": "Having no one else present; on one's own.",
        "type": "adjective, adverb",
        "example": "She lives alone.",
        "difficulty": "A2"
    },
    {
        "english": "along",
        "bengali": "বরাবর",
        "meaning": "Moving in a constant direction on (a road, path, or any more or less horizontal surface).",
        "type": "preposition, adverb",
        "example": "We walked along the beach.",
        "difficulty": "A2"
    },
    {
        "english": "already",
        "bengali": "ইতিমধ্যে",
        "meaning": "Before or by now or the time in question.",
        "type": "adverb",
        "example": "I have already seen that movie.",
        "difficulty": "A2"
    },
    {
        "english": "also",
        "bengali": "এছাড়াও",
        "meaning": "In addition; too.",
        "type": "adverb",
        "example": "She is a talented singer and also a great dancer.",
        "difficulty": "A1"
    },
    {
        "english": "alter",
        "bengali": "পরিবর্তন করা",
        "meaning": "Change or cause to change in character or composition, typically in a comparatively small but significant way.",
        "type": "verb",
        "example": "We've had to alter our plans.",
        "difficulty": "B2"
    },
    {
        "english": "alternative",
        "bengali": "বিকল্প",
        "meaning": "(of one or more things) available as another possibility.",
        "type": "noun, adjective",
        "example": "Is there an alternative to surgery?",
        "difficulty": "A2"
    },
    {
        "english": "although",
        "bengali": "যদিও",
        "meaning": "In spite of the fact that; even though.",
        "type": "conjunction",
        "example": "Although it was cold, we went for a walk.",
        "difficulty": "A2"
    },
    {
        "english": "always",
        "bengali": "সবসময়",
        "meaning": "On all occasions; at all times; continuously.",
        "type": "adverb",
        "example": "I will always love you.",
        "difficulty": "A1"
    },
    {
        "english": "amazed",
        "bengali": " বিস্মিত",
        "meaning": "Greatly surprised; astonished.",
        "type": "adjective",
        "example": "I was amazed at how much I had learned.",
        "difficulty": "B1"
    },
    {
        "english": "amazing",
        "bengali": "বিস্ময়কর",
        "meaning": "Causing great surprise or wonder; astonishing.",
        "type": "adjective",
        "example": "The view from the top of the mountain is amazing.",
        "difficulty": "A1"
    },
    {
        "english": "ambition",
        "bengali": "উচ্চাকাঙ্ক্ষা",
        "meaning": "A strong desire to do or to achieve something, typically requiring determination and hard work.",
        "type": "noun",
        "example": "His ambition is to become a doctor.",
        "difficulty": "B1"
    },
    {
        "english": "among",
        "bengali": "মধ্যে",
        "meaning": "Situated more or less centrally in relation to (several other things).",
        "type": "preposition",
        "example": "The house is hidden among the trees.",
        "difficulty": "A2"
    },
    {
        "english": "amount",
        "bengali": "পরিমাণ",
        "meaning": "A quantity of something, especially the total of a thing or things in number, size, value, or extent.",
        "type": "noun, verb",
        "example": "The total amount is $100.",
        "difficulty": "A2"
    },
    {
        "english": "analysis",
        "bengali": "বিশ্লেষণ",
        "meaning": "Detailed examination of the elements or structure of something.",
        "type": "noun",
        "example": "The book is an analysis of the country's political system.",
        "difficulty": "B1"
    },
    {
        "english": "analyze",
        "bengali": "বিশ্লেষণ করা",
        "meaning": "Examine methodically and in detail the constitution or structure of (something, especially information), typically for purposes of explanation and interpretation.",
        "type": "verb",
        "example": "The teacher asked us to analyze the poem.",
        "difficulty": "A2"
    },
    {
        "english": "ancient",
        "bengali": "প্রাচীন",
        "meaning": "Belonging to the very distant past and no longer in existence.",
        "type": "adjective",
        "example": "We visited the ancient city of Rome.",
        "difficulty": "A2"
    },
        {
            "english": "and",
            "bengali": "এবং",
            "meaning": "Used to connect words of the same part of speech, clauses, or sentences that are to be taken jointly.",
            "type": "conjunction",
            "example": "I like tea and coffee.",
            "difficulty": "A1"
        },
        {
            "english": "anger",
            "bengali": "রাগ",
            "meaning": "A strong feeling of annoyance, displeasure, or hostility.",
            "type": "noun",
            "example": "He was filled with anger.",
            "difficulty": "B2"
        },
        {
            "english": "angle",
            "bengali": "কোণ",
            "meaning": "The space (usually measured in degrees) between two intersecting lines or surfaces at or close to the point where they meet.",
            "type": "noun",
            "example": "A triangle has three angles.",
            "difficulty": "B2"
        },
        {
            "english": "angry",
            "bengali": "রাগান্বিত",
            "meaning": "Feeling or showing strong annoyance, displeasure, or hostility; full of anger.",
            "type": "adjective",
            "example": "She was angry with him.",
            "difficulty": "A1"
        },
        {
            "english": "animal",
            "bengali": "পশু",
            "meaning": "A living organism that feeds on organic matter, typically having specialized sense organs and nervous system and able to respond rapidly to stimuli.",
            "type": "noun",
            "example": "The lion is a wild animal.",
            "difficulty": "A1"
        },
        {
            "english": "ankle",
            "bengali": "গোড়ালি",
            "meaning": "The joint connecting the foot with the leg.",
            "type": "noun",
            "example": "I twisted my ankle.",
            "difficulty": "A2"
        },
        {
            "english": "anniversary",
            "bengali": "বার্ষিকী",
            "meaning": "The date on which an event took place in a previous year.",
            "type": "noun",
            "example": "Today is our wedding anniversary.",
            "difficulty": "B2"
        },
        {
            "english": "announce",
            "bengali": "ঘোষণা করা",
            "meaning": "Make a public and typically formal declaration about a fact, occurrence, or intention.",
            "type": "verb",
            "example": "They will announce the winner tomorrow.",
            "difficulty": "B1"
        },
        {
            "english": "announcement",
            "bengali": "ঘোষণা",
            "meaning": "A formal public statement about a fact, occurrence, or intention.",
            "type": "noun",
            "example": "The president made an important announcement.",
            "difficulty": "B1"
        },
        {
            "english": "annoy",
            "bengali": "বিরক্ত করা",
            "meaning": "Make (someone) a little angry; irritate.",
            "type": "verb",
            "example": "His constant questions started to annoy me.",
            "difficulty": "B1"
        },
        {
            "english": "annoyed",
            "bengali": "বিরক্ত",
            "meaning": "Slightly angry; irritated.",
            "type": "adjective",
            "example": "I was annoyed by his behavior.",
            "difficulty": "B1"
        },
        {
            "english": "annoying",
            "bengali": "বিরক্তিকর",
            "meaning": "Causing irritation or annoyance.",
            "type": "adjective",
            "example": "That's a very annoying habit.",
            "difficulty": "B1"
        },
        {
            "english": "annual",
            "bengali": "বার্ষিক",
            "meaning": "Occurring once every year.",
            "type": "adjective",
            "example": "The company holds an annual meeting.",
            "difficulty": "B2"
        },
        {
            "english": "another",
            "bengali": "আরেকটি",
            "meaning": "Used to refer to an additional person or thing of the same type as one already mentioned or known about; one more; a further.",
            "type": "determiner, pronoun",
            "example": "Can I have another cup of coffee?",
            "difficulty": "A1"
        },
        {
            "english": "answer",
            "bengali": "উত্তর",
            "meaning": "A thing said, written, or done to deal with or as a reaction to a question, statement, or situation.",
            "type": "noun, verb",
            "example": "I don't know the answer.",
            "difficulty": "A1"
        },
        {
            "english": "anxious",
            "bengali": "উদ্বিগ্ন",
            "meaning": "Feeling or showing worry, nervousness, or unease about something with an uncertain outcome.",
            "type": "adjective",
            "example": "She was anxious about the exam.",
            "difficulty": "B2"
        },
        {
            "english": "any",
            "bengali": "কোন",
            "meaning": "Used to refer to one or some of a thing or number of things, no matter how much or how many.",
            "type": "determiner, pronoun, adverb",
            "example": "Do you have any questions?",
            "difficulty": "A1"
        },
        {
            "english": "anybody",
            "bengali": "যে কেউ",
            "meaning": "Anyone.",
            "type": "pronoun",
            "example": "Is anybody home?",
            "difficulty": "A2"
        },
        {
            "english": "anymore",
            "bengali": "আর",
            "meaning": "No longer.",
            "type": "adverb",
            "example": "I don't live there anymore.",
            "difficulty": "A2"
        },
        {
            "english": "anyone",
            "bengali": "যে কেউ",
            "meaning": "Any person or people.",
            "type": "pronoun",
            "example": "Can anyone help me?",
            "difficulty": "A1"
        },
        {
            "english": "anything",
            "bengali": "কিছু",
            "meaning": "A thing of any kind.",
            "type": "pronoun",
            "example": "Is there anything I can do?",
            "difficulty": "A1"
        },
        {
            "english": "anyway",
            "bengali": "যাইহোক",
            "meaning": "Used to confirm or support a point or idea just mentioned.",
            "type": "adverb",
            "example": "It's too expensive and anyway the color doesn't suit you.",
            "difficulty": "A2"
        },
        {
            "english": "anywhere",
            "bengali": "যে কোন জায়গায়",
            "meaning": "In or to any place.",
            "type": "adverb, pronoun",
            "example": "You can sit anywhere you like.",
            "difficulty": "A2"
        },
        {
            "english": "apart",
            "bengali": "আলাদা",
            "meaning": "(of two or more people or things) separated by a distance.",
            "type": "adverb",
            "example": "The two houses are 200 metres apart.",
            "difficulty": "B1"
        },
        {
            "english": "apartment",
            "bengali": "অ্যাপার্টমেন্ট",
            "meaning": "A suite of rooms forming one residence, typically in a building containing a number of these.",
            "type": "noun",
            "example": "She lives in a beautiful apartment.",
            "difficulty": "A1"
        },
        {
            "english": "apologize",
            "bengali": "ক্ষমা চাওয়া",
            "meaning": "Express regret for something that one has done wrong.",
            "type": "verb",
            "example": "I must apologize for my mistake.",
            "difficulty": "B1"
        },
        {
            "english": "app",
            "bengali": "অ্যাপ",
            "meaning": "An application, especially as downloaded by a user to a mobile device.",
            "type": "noun",
            "example": "I downloaded a new app on my phone.",
            "difficulty": "A2"
        },
        {
            "english": "apparent",
            "bengali": "আপাত",
            "meaning": "Clearly visible or understood; obvious.",
            "type": "adjective",
            "example": "It was apparent that she was unhappy.",
            "difficulty": "B2"
        },
        {
            "english": "apparently",
            "bengali": "আপাতদৃষ্টিতে",
            "meaning": "As far as one knows or can see.",
            "type": "adverb",
            "example": "Apparently, he's not coming.",
            "difficulty": "B2"
        },
        {
            "english": "appeal",
            "bengali": "আবেদন",
            "meaning": "Make a serious or urgent request, typically to the public.",
            "type": "noun, verb",
            "example": "The police have made an appeal for witnesses.",
            "difficulty": "B2"
        },
        {
            "english": "appear",
            "bengali": "হাজির হওয়া",
            "meaning": "Come into sight; become visible or noticeable, typically without apparent cause.",
            "type": "verb",
            "example": "A man suddenly appeared from behind a tree.",
            "difficulty": "A2"
        },
        {
            "english": "appearance",
            "bengali": "আবির্ভাব",
            "meaning": "The way that someone or something looks.",
            "type": "noun",
            "example": "She has a youthful appearance.",
            "difficulty": "A2"
        },
        {
            "english": "apple",
            "bengali": "আপেল",
            "meaning": "A round fruit with firm, white flesh and a green or red skin.",
            "type": "noun",
            "example": "An apple a day keeps the doctor away.",
            "difficulty": "A1"
        },
        {
            "english": "application",
            "bengali": "আবেদন",
            "meaning": "A formal request to an authority for something.",
            "type": "noun",
            "example": "I've sent off applications for four different jobs.",
            "difficulty": "B1"
        },
        {
            "english": "apply",
            "bengali": "আবেদন করা",
            "meaning": "Make a formal application or request.",
            "type": "verb",
            "example": "He has applied for a new job.",
            "difficulty": "A2"
        },
        {
            "english": "appointment",
            "bengali": "সাক্ষাৎকার",
            "meaning": "An arrangement to meet someone at a particular time and place.",
            "type": "noun",
            "example": "I have an appointment with the doctor.",
            "difficulty": "B1"
        },
        {
            "english": "appreciate",
            "bengali": "প্রশংসা করা",
            "meaning": "Recognize the full worth of.",
            "type": "verb",
            "example": "I really appreciate your help.",
            "difficulty": "B1"
        },
        {
            "english": "approach",
            "bengali": "পথ",
            "meaning": "A way of dealing with something.",
            "type": "noun, verb",
            "example": "We need to find a new approach to the problem.",
            "difficulty": "B2"
        },
        {
            "english": "appropriate",
            "bengali": "উপযুক্ত",
            "meaning": "Suitable or proper in the circumstances.",
            "type": "adjective",
            "example": "This is not an appropriate time to discuss the matter.",
            "difficulty": "B2"
        },
        {
            "english": "approval",
            "bengali": "অনুমোদন",
            "meaning": "The belief that someone or something is good or acceptable.",
            "type": "noun",
            "example": "The plan has the approval of the school board.",
            "difficulty": "B2"
        },
        {
            "english": "approve",
            "bengali": "অনুমোদন করা",
            "meaning": "Officially agree to or accept as satisfactory.",
            "type": "verb",
            "example": "The committee approved the new budget.",
            "difficulty": "B2"
        },
        {
            "english": "approximately",
            "bengali": "আনুমানিক",
            "meaning": "Used to show that something is almost, but not completely, accurate or exact; roughly.",
            "type": "adverb",
            "example": "The journey took approximately 10 hours.",
            "difficulty": "B1"
        },
        {
            "english": "April",
            "bengali": "এপ্রিল",
            "meaning": "The fourth month of the year, in the northern hemisphere usually considered the second month of spring.",
            "type": "noun",
            "example": "Her birthday is in April.",
            "difficulty": "A1"
        },
        {
            "english": "architect",
            "bengali": "স্থপতি",
            "meaning": "A person who designs buildings and in many cases also supervises their construction.",
            "type": "noun",
            "example": "He is a famous architect.",
            "difficulty": "A2"
        },
        {
            "english": "architecture",
            "bengali": "স্থাপত্য",
            "meaning": "The art or practice of designing and constructing buildings.",
            "type": "noun",
            "example": "I am studying architecture.",
            "difficulty": "A2"
        },
        {
            "english": "area",
            "bengali": "এলাকা",
            "meaning": "A region or part of a town, a country, or the world.",
            "type": "noun",
            "example": "This is a residential area.",
            "difficulty": "A1"
        },
        {
            "english": "argue",
            "bengali": "তর্ক করা",
            "meaning": "Give reasons or cite evidence in support of an idea, action, or theory, typically with the aim of persuading others to share one's view.",
            "type": "verb",
            "example": "They were arguing about money.",
            "difficulty": "A2"
        },
        {
            "english": "argument",
            "bengali": "যুক্তি",
            "meaning": "An exchange of diverging or opposite views, typically a heated or angry one.",
            "type": "noun",
            "example": "He had an argument with his boss.",
            "difficulty": "A2"
        },
        {
            "english": "arise",
            "bengali": "দেখা দেওয়া",
            "meaning": "(of a problem, opportunity, or situation) emerge; become apparent.",
            "type": "verb",
            "example": "A new crisis has arisen.",
            "difficulty": "B2"
        },
        {
            "english": "arm",
            "bengali": "বাহু",
            "meaning": "Each of the two upper limbs of the human body from the shoulder to the hand.",
            "type": "noun",
            "example": "He broke his arm.",
            "difficulty": "A1"
        },
        {
            "english": "armed",
            "bengali": "সশস্ত্র",
            "meaning": "Equipped with or carrying a firearm or firearms.",
            "type": "adjective",
            "example": "The police were armed.",
            "difficulty": "B2"
        },
        {
            "english": "arms",
            "bengali": "অস্ত্র",
            "meaning": "Weapons and ammunition; armaments.",
            "type": "noun",
            "example": "They were charged with smuggling arms.",
            "difficulty": "B2"
        },
        {
            "english": "army",
            "bengali": "সেনাবাহিনী",
            "meaning": "An organized military force equipped for fighting on land.",
            "type": "noun",
            "example": "He joined the army.",
            "difficulty": "A2"
        },
        {
            "english": "around",
            "bengali": "চারপাশে",
            "meaning": "Located or situated on every side.",
            "type": "preposition, adverb",
            "example": "The house is built around a courtyard.",
            "difficulty": "A1"
        },
        {
            "english": "arrange",
            "bengali": "ব্যবস্থা করা",
            "meaning": "Put (things) in a neat, attractive, or required order.",
            "type": "verb",
            "example": "She arranged the flowers in a vase.",
            "difficulty": "A2"
        },
        {
            "english": "arrangement",
            "bengali": "ব্যবস্থা",
            "meaning": "A plan for a future event.",
            "type": "noun",
            "example": "We have an arrangement to meet tomorrow.",
            "difficulty": "A2"
        },
        {
            "english": "arrest",
            "bengali": "গ্রেপ্তার",
            "meaning": "Seize (someone) by legal authority and take into custody.",
            "type": "verb, noun",
            "example": "The police arrested him for theft.",
            "difficulty": "B1"
        },
        {
            "english": "arrival",
            "bengali": "আগমন",
            "meaning": "The action or process of arriving.",
            "type": "noun",
            "example": "His arrival was expected.",
            "difficulty": "B1"
        },
        {
            "english": "arrive",
            "bengali": "পৌঁছানো",
            "meaning": "Reach a place at the end of a journey or a stage in a journey.",
            "type": "verb",
            "example": "What time did you arrive?",
            "difficulty": "A1"
        },
        {
            "english": "art",
            "bengali": "শিল্প",
            "meaning": "The expression or application of human creative skill and imagination, typically in a visual form such as painting or sculpture, producing works to be appreciated primarily for their beauty or emotional power.",
            "type": "noun",
            "example": "I am interested in modern art.",
            "difficulty": "A1"
        },
        {
            "english": "article",
            "bengali": "প্রবন্ধ",
            "meaning": "A piece of writing included with others in a newspaper, magazine, or other publication.",
            "type": "noun",
            "example": "She wrote an article about her travels.",
            "difficulty": "A1"
        },
        {
            "english": "artificial",
            "bengali": "কৃত্রিম",
            "meaning": "Made or produced by human beings rather than occurring naturally, especially as a copy of something natural.",
            "type": "adjective",
            "example": "This flower is artificial.",
            "difficulty": "B2"
        },
        {
            "english": "artist",
            "bengali": "শিল্পী",
            "meaning": "A person who creates paintings or drawings as a profession or hobby.",
            "type": "noun",
            "example": "He is a famous artist.",
            "difficulty": "A1"
        },
        {
            "english": "artistic",
            "bengali": "শৈল্পিক",
            "meaning": "Having or revealing natural creative skill.",
            "type": "adjective",
            "example": "She has an artistic temperament.",
            "difficulty": "B2"
        },
        {
            "english": "as",
            "bengali": "হিসাবে",
            "meaning": "Used to refer to the function or character that someone or something has.",
            "type": "preposition, adverb, conjunction",
            "example": "She works as a teacher.",
            "difficulty": "A1"
        },
        {
            "english": "ashamed",
            "bengali": "লজ্জিত",
            "meaning": "Embarrassed or guilty because of one's actions, characteristics, or associations.",
            "type": "adjective",
            "example": "He was ashamed of his behavior.",
            "difficulty": "B2"
        },
        {
            "english": "aside",
            "bengali": "পাশে",
            "meaning": "To one side; out of the way.",
            "type": "adverb",
            "example": "She pulled the curtain aside.",
            "difficulty": "B2"
        },
        {
            "english": "ask",
            "bengali": "জিজ্ঞাসা করা",
            "meaning": "Say something in order to obtain an answer or some information.",
            "type": "verb",
            "example": "Can I ask you a question?",
            "difficulty": "A1"
        },
        {
            "english": "asleep",
            "bengali": "ঘুমন্ত",
            "meaning": "In a state of sleep.",
            "type": "adjective",
            "example": "The baby is asleep.",
            "difficulty": "A2"
        },
        {
            "english": "aspect",
            "bengali": "দিক",
            "meaning": "A particular part or feature of something.",
            "type": "noun",
            "example": "The book examines every aspect of the subject.",
            "difficulty": "B2"
        },
        {
            "english": "assess",
            "bengali": "মূল্যায়ন করা",
            "meaning": "Evaluate or estimate the nature, ability, or quality of.",
            "type": "verb",
            "example": "The committee will assess the applications.",
            "difficulty": "B2"
        },
        {
            "english": "assessment",
            "bengali": "মূল্যায়ন",
            "meaning": "The evaluation or estimation of the nature, quality, or ability of someone or something.",
            "type": "noun",
            "example": "The teacher made an assessment of each student's work.",
            "difficulty": "B2"
        },
        {
            "english": "assignment",
            "bengali": "অ্যাসাইনমেন্ট",
            "meaning": "A task or piece of work assigned to someone as part of a job or course of study.",
            "type": "noun",
            "example": "I have a lot of assignments to do.",
            "difficulty": "B1"
        },
        {
            "english": "assist",
            "bengali": "সহায়তা করা",
            "meaning": "Help (someone), typically by doing a share of the work.",
            "type": "verb",
            "example": "He assisted her with the shopping.",
            "difficulty": "B1"
        },
        {
            "english": "assistant",
            "bengali": "সহকারী",
            "meaning": "A person who ranks below a senior person.",
            "type": "noun, adjective",
            "example": "She is my assistant.",
            "difficulty": "A2"
        },
        {
            "english": "associate",
            "bengali": "সহযোগী",
            "meaning": "Connect (someone or something) with something else in one's mind.",
            "type": "verb",
            "example": "I always associate the smell of baking with my grandmother.",
            "difficulty": "B2"
        },
        {
            "english": "associated",
            "bengali": "সম্পর্কিত",
            "meaning": "(of a person or thing) connected with something else.",
            "type": "adjective",
            "example": "There are risks associated with this procedure.",
            "difficulty": "B2"
        },
        {
            "english": "association",
            "bengali": "সমিতি",
            "meaning": "A group of people organized for a joint purpose.",
            "type": "noun",
            "example": "He is a member of the local residents' association.",
            "difficulty": "B2"
        },
        {
            "english": "assume",
            "bengali": "ধারণা করা",
            "meaning": "Suppose to be the case, without proof.",
            "type": "verb",
            "example": "I assume you know what you are doing.",
            "difficulty": "B2"
        },
        {
            "english": "at",
            "bengali": "এ",
            "meaning": "Expressing location or arrival in a particular place or position.",
            "type": "preposition",
            "example": "She is at home.",
            "difficulty": "A1"
        },
        {
            "english": "athlete",
            "bengali": "ক্রীড়াবিদ",
            "meaning": "A person who is proficient in sports and other forms of physical exercise.",
            "type": "noun",
            "example": "He is a professional athlete.",
            "difficulty": "A2"
        },
        {
            "english": "atmosphere",
            "bengali": "বায়ুমণ্ডল",
            "meaning": "The envelope of gases surrounding the earth or another planet.",
            "type": "noun",
            "example": "The atmosphere of the restaurant was very relaxed.",
            "difficulty": "B1"
        },
        {
            "english": "attach",
            "bengali": "সংযুক্ত করা",
            "meaning": "Join or fasten (something) to something else.",
            "type": "verb",
            "example": "Please attach a recent photograph to your application form.",
            "difficulty": "B1"
        },
        {
            "english": "attack",
            "bengali": "আক্রমণ",
            "meaning": "Take aggressive action against (a place or enemy forces) with weapons or armed force.",
            "type": "noun, verb",
            "example": "The army launched an attack on the enemy.",
            "difficulty": "A2"
        },
        {
            "english": "attempt",
            "bengali": "চেষ্টা",
            "meaning": "Make an effort to achieve or complete (something, typically a difficult task or action).",
            "type": "noun, verb",
            "example": "He made an attempt to climb the mountain.",
            "difficulty": "B2"
        },
        {
            "english": "attend",
            "bengali": "অংশগ্রহণ করা",
            "meaning": "Be present at (an event, meeting, or function).",
            "type": "verb",
            "example": "She will attend the meeting.",
            "difficulty": "A2"
        },
        {
            "english": "attention",
            "bengali": "মনোযোগ",
            "meaning": "Notice taken of someone or something; the regarding of someone or something as interesting or important.",
            "type": "noun",
            "example": "Pay attention to what I am saying.",
            "difficulty": "A2"
        },
        {
            "english": "attitude",
            "bengali": "মনোভাব",
            "meaning": "A settled way of thinking or feeling about someone or something, typically one that is reflected in a person's behavior.",
            "type": "noun",
            "example": "He has a positive attitude.",
            "difficulty": "B1"
        },
        {
            "english": "attorney",
            "bengali": "আইনজীবী",
            "meaning": "A person appointed to act for another in business or legal matters.",
            "type": "noun",
            "example": "She is a successful attorney.",
            "difficulty": "B2"
        },
        {
            "english": "attract",
            "bengali": "আকর্ষণ করা",
            "meaning": "Cause to come to a place or participate in a venture by offering something of interest, advantage, or pleasure.",
            "type": "verb",
            "example": "The museum attracts visitors from all over the world.",
            "difficulty": "B1"
        },
        {
            "english": "attraction",
            "bengali": "আকর্ষণ",
            "meaning": "The action or power of evoking interest, pleasure, or liking for someone or something.",
            "type": "noun",
            "example": "The main attraction of the city is its beautiful beaches.",
            "difficulty": "B1"
        },
        {
            "english": "attractive",
            "bengali": "আকর্ষণীয়",
            "meaning": "(of a person) pleasing or appealing to the senses.",
            "type": "adjective",
            "example": "She is a very attractive woman.",
            "difficulty": "A2"
        },
        {
            "english": "audience",
            "bengali": "শ্রোতা",
            "meaning": "The assembled spectators or listeners at a public event, such as a play, movie, concert, or meeting.",
            "type": "noun",
            "example": "The audience applauded loudly.",
            "difficulty": "A2"
        },
        {
            "english": "August",
            "bengali": "আগস্ট",
            "meaning": "The eighth month of the year, in the northern hemisphere usually considered the last month of summer.",
            "type": "noun",
            "example": "We are going on holiday in August.",
            "difficulty": "A1"
        },
        {
            "english": "aunt",
            "bengali": "চাচি/খালা/ফুফু/মামী",
            "meaning": "The sister of one's father or mother or the wife of one's uncle.",
            "type": "noun",
            "example": "My aunt lives in London.",
            "difficulty": "A1"
        },
        {
            "english": "author",
            "bengali": "লেখক",
            "meaning": "A writer of a book, article, or report.",
            "type": "noun",
            "example": "He is my favorite author.",
            "difficulty": "A2"
        },
            {
                "english": "authority",
                "bengali": "কর্তৃপক্ষ",
                "meaning": "The power or right to give orders, make decisions, and enforce obedience.",
                "type": "noun",
                "example": "He has no authority over us.",
                "difficulty": "B1"
            },
            {
                "english": "automatic",
                "bengali": "স্বয়ংক্রিয়",
                "meaning": "Working by itself with little or no direct human control.",
                "type": "adjective",
                "example": "This is an automatic door.",
                "difficulty": "B1"
            },
            {
                "english": "automatically",
                "bengali": "স্বয়ংক্রিয়ভাবে",
                "meaning": "By itself with little or no direct human control.",
                "type": "adverb",
                "example": "The lights turn on automatically.",
                "difficulty": "B1"
            },
            {
                "english": "available",
                "bengali": "উপলব্ধ",
                "meaning": "Able to be used or obtained; at someone's disposal.",
                "type": "adjective",
                "example": "There are no tickets available for the show.",
                "difficulty": "A2"
            },
            {
                "english": "average",
                "bengali": "গড়",
                "meaning": "Constituting the result obtained by adding together several quantities and then dividing this total by the number of quantities.",
                "type": "adjective, noun, verb",
                "example": "The average age of the students is 20.",
                "difficulty": "A2"
            },
            {
                "english": "avoid",
                "bengali": "এড়িয়ে চলুন",
                "meaning": "Keep away from or stop oneself from doing (something).",
                "type": "verb",
                "example": "You should avoid eating fatty foods.",
                "difficulty": "A2"
            },
            {
                "english": "award",
                "bengali": "পুরস্কার",
                "meaning": "A prize or other mark of recognition given in honor of an achievement.",
                "type": "noun, verb",
                "example": "She won an award for her book.",
                "difficulty": "A2"
            },
            {
                "english": "aware",
                "bengali": "সচেতন",
                "meaning": "Having knowledge or perception of a situation or fact.",
                "type": "adjective",
                "example": "Are you aware of the problem?",
                "difficulty": "B1"
            },
            {
                "english": "away",
                "bengali": "দূরে",
                "meaning": "To or at a distance from a particular place, person, or thing.",
                "type": "adverb",
                "example": "The beach is a mile away.",
                "difficulty": "A1"
            },
            {
                "english": "awesome",
                "bengali": "অসাধারণ",
                "meaning": "Extremely impressive or daunting; inspiring great admiration, apprehension, or fear.",
                "type": "adjective",
                "example": "That was an awesome concert.",
                "difficulty": "A1"
            },
            {
                "english": "awful",
                "bengali": "ভয়ানক",
                "meaning": "Very bad or unpleasant.",
                "type": "adjective",
                "example": "The weather was awful.",
                "difficulty": "A2"
            },
            {
                "english": "baby",
                "bengali": "শিশু",
                "meaning": "A very young child, especially one newly born or in infancy.",
                "type": "noun",
                "example": "She has a new baby.",
                "difficulty": "A1"
            },
            {
                "english": "back",
                "bengali": "পিছনে",
                "meaning": "The rear surface of the human body from the shoulders to the hips.",
                "type": "noun, adverb, adjective, verb",
                "example": "He was lying on his back.",
                "difficulty": "A1"
            },
            {
                "english": "background",
                "bengali": "পটভূমি",
                "meaning": "The part of a picture, scene, or design that forms a setting for the main figures or objects, or that is furthest from the viewer.",
                "type": "noun",
                "example": "The mountains in the background are beautiful.",
                "difficulty": "A2"
            },
            {
                "english": "backward",
                "bengali": "পিছনের দিকে",
                "meaning": "Directed behind or to the rear.",
                "type": "adverb",
                "example": "He took a step backward.",
                "difficulty": "B1"
            },
            {
                "english": "bacteria",
                "bengali": "ব্যাকটেরিয়া",
                "meaning": "A member of a large group of unicellular microorganisms which have cell walls but lack organelles and an organized nucleus, including some which can cause disease.",
                "type": "noun",
                "example": "Some bacteria are harmful.",
                "difficulty": "B2"
            },
            {
                "english": "bad",
                "bengali": "খারাপ",
                "meaning": "Of poor quality or a low standard.",
                "type": "adjective",
                "example": "This is a bad example.",
                "difficulty": "A1"
            },
            {
                "english": "badly",
                "bengali": "খারাপভাবে",
                "meaning": "In an unsatisfactory, inadequate, or unsuccessful way.",
                "type": "adverb",
                "example": "The team played badly.",
                "difficulty": "A2"
            },
            {
                "english": "bag",
                "bengali": "থলে",
                "meaning": "A flexible container with an opening at the top, used for carrying things.",
                "type": "noun",
                "example": "She put her books in her bag.",
                "difficulty": "A1"
            },
            {
                "english": "bake",
                "bengali": "সেঁকা",
                "meaning": "Cook (food) by dry heat without direct exposure to a flame, typically in an oven.",
                "type": "verb",
                "example": "I love to bake cakes.",
                "difficulty": "B1"
            },
            {
                "english": "balance",
                "bengali": "ভারসাম্য",
                "meaning": "An even distribution of weight enabling someone or something to remain upright and steady.",
                "type": "noun, verb",
                "example": "She lost her balance and fell.",
                "difficulty": "B1"
            },
            {
                "english": "ball",
                "bengali": "বল",
                "meaning": "A solid or hollow spherical or ovoid object that is kicked, thrown, or hit in a game.",
                "type": "noun",
                "example": "The children were playing with a ball.",
                "difficulty": "A1"
            },
            {
                "english": "ban",
                "bengali": "নিষেধাজ্ঞা",
                "meaning": "Officially or legally prohibit (something).",
                "type": "verb, noun",
                "example": "There is a ban on smoking in public places.",
                "difficulty": "B1"
            },
            {
                "english": "banana",
                "bengali": "কলা",
                "meaning": "A long curved fruit which grows in clusters and has soft pulpy flesh and yellow skin when ripe.",
                "type": "noun",
                "example": "He is eating a banana.",
                "difficulty": "A1"
            },
            {
                "english": "band",
                "bengali": "বাদ্যদল",
                "meaning": "A small group of musicians who play popular music together.",
                "type": "noun",
                "example": "My favorite band is playing tonight.",
                "difficulty": "A1"
            },
            {
                "english": "bank (money)",
                "bengali": "ব্যাংক",
                "meaning": "A financial establishment that invests money deposited by customers, pays it out when required, makes loans at interest, and exchanges currency.",
                "type": "noun",
                "example": "I need to go to the bank.",
                "difficulty": "A1"
            },
            {
                "english": "bank (river)",
                "bengali": "তীর",
                "meaning": "The land alongside or sloping down to a river or lake.",
                "type": "noun",
                "example": "We sat on the bank of the river.",
                "difficulty": "B1"
            },
            {
                "english": "bar",
                "bengali": "বার",
                "meaning": "A place where drinks, especially alcoholic drinks, are sold and drunk, or the counter in such a place.",
                "type": "noun, verb",
                "example": "Let's meet at the bar.",
                "difficulty": "A1"
            },
            {
                "english": "barrier",
                "bengali": "বাধা",
                "meaning": "A fence or other obstacle that prevents movement or access.",
                "type": "noun",
                "example": "The police put up barriers to control the crowd.",
                "difficulty": "B2"
            },
            {
                "english": "base",
                "bengali": "ভিত্তি",
                "meaning": "The lowest part or edge of something, especially the part on which it rests or is supported.",
                "type": "noun, verb",
                "example": "The vase has a wide base.",
                "difficulty": "B1"
            },
            {
                "english": "baseball",
                "bengali": "বেসবল",
                "meaning": "A ball game played between two teams of nine on a field with a diamond-shaped circuit of four bases.",
                "type": "noun",
                "example": "He is a professional baseball player.",
                "difficulty": "A1"
            },
            {
                "english": "based",
                "bengali": "ভিত্তিক",
                "meaning": "Use (something specified) as the foundation or starting point for something.",
                "type": "adjective",
                "example": "The movie is based on a true story.",
                "difficulty": "A2"
            },
            {
                "english": "basic",
                "bengali": "মৌলিক",
                "meaning": "Forming an essential foundation or starting point; fundamental.",
                "type": "adjective",
                "example": "We learned the basic skills.",
                "difficulty": "B1"
            },
            {
                "english": "basically",
                "bengali": "মূলত",
                "meaning": "In the most essential respects; fundamentally.",
                "type": "adverb",
                "example": "Basically, I'm just a lazy person.",
                "difficulty": "B2"
            },
            {
                "english": "basis",
                "bengali": "ভিত্তি",
                "meaning": "The underlying support or foundation for an idea, argument, or process.",
                "type": "noun",
                "example": "There is no basis for his claim.",
                "difficulty": "B1"
            },
            {
                "english": "basketball",
                "bengali": "বাস্কেটবল",
                "meaning": "A game played between two teams of five players in which goals are scored by throwing a ball through a netted hoop fixed above each end of the court.",
                "type": "noun",
                "example": "He loves to play basketball.",
                "difficulty": "A1"
            },
            {
                "english": "bath",
                "bengali": "স্নান",
                "meaning": "A large container for water, used for washing the body.",
                "type": "noun",
                "example": "I'm going to take a bath.",
                "difficulty": "A1"
            },
            {
                "english": "bathroom",
                "bengali": "স্নানাগার",
                "meaning": "A room containing a toilet and a sink and typically also a bathtub or shower.",
                "type": "noun",
                "example": "Where is the bathroom?",
                "difficulty": "A1"
            },
            {
                "english": "battery",
                "bengali": "ব্যাটারি",
                "meaning": "A container consisting of one or more cells, in which chemical energy is converted into electricity and used as a source of power.",
                "type": "noun",
                "example": "My phone battery is dead.",
                "difficulty": "B1"
            },
            {
                "english": "battle",
                "bengali": "যুদ্ধ",
                "meaning": "A sustained fight between large organized armed forces.",
                "type": "noun, verb",
                "example": "The two armies fought a fierce battle.",
                "difficulty": "B1"
            },
            {
                "english": "be",
                "bengali": "হওয়া",
                "meaning": "Exist.",
                "type": "verb, auxiliary verb",
                "example": "To be or not to be, that is the question.",
                "difficulty": "A1"
            },
            {
                "english": "beach",
                "bengali": "সৈকত",
                "meaning": "A pebbly or sandy shore, especially by the ocean between high- and low-water marks.",
                "type": "noun",
                "example": "We spent the day at the beach.",
                "difficulty": "A1"
            },
            {
                "english": "bean",
                "bengali": "শিম",
                "meaning": "An edible seed, typically kidney-shaped, growing in long pods on certain leguminous plants.",
                "type": "noun",
                "example": "I like to eat beans.",
                "difficulty": "A2"
            },
            {
                "english": "bear (deal with)",
                "bengali": "সহ্য করা",
                "meaning": "Endure (an ordeal or difficulty).",
                "type": "verb",
                "example": "I can't bear the pain.",
                "difficulty": "B2"
            },
            {
                "english": "bear (animal)",
                "bengali": "ভালুক",
                "meaning": "A large, heavy, mammal that walks on the soles of its feet, having thick fur and a very short tail.",
                "type": "noun",
                "example": "I saw a bear in the forest.",
                "difficulty": "A2"
            },
            {
                "english": "beat",
                "bengali": "প্রহার করা",
                "meaning": "Defeat (someone) in a game or other competitive situation.",
                "type": "verb, noun",
                "example": "Our team beat the other team.",
                "difficulty": "A2"
            },
            {
                "english": "beautiful",
                "bengali": "সুন্দর",
                "meaning": "Pleasing the senses or mind aesthetically.",
                "type": "adjective",
                "example": "She is a beautiful woman.",
                "difficulty": "A1"
            },
            {
                "english": "beauty",
                "bengali": "সৌন্দর্য",
                "meaning": "A combination of qualities, such as shape, color, or form, that pleases the aesthetic senses, especially the sight.",
                "type": "noun",
                "example": "The beauty of the sunset was breathtaking.",
                "difficulty": "B1"
            },
            {
                "english": "because",
                "bengali": "কারণ",
                "meaning": "For the reason that; since.",
                "type": "conjunction",
                "example": "I am late because I missed the bus.",
                "difficulty": "A1"
            },
            {
                "english": "become",
                "bengali": "হয়ে ওঠা",
                "meaning": "Begin to be.",
                "type": "verb",
                "example": "He wants to become a doctor.",
                "difficulty": "A1"
            },
            {
                "english": "bed",
                "bengali": "বিছানা",
                "meaning": "A piece of furniture used for sleep or rest.",
                "type": "noun",
                "example": "I'm going to bed.",
                "difficulty": "A1"
            },
            {
                "english": "bedroom",
                "bengali": "শয়নকক্ষ",
                "meaning": "A room for sleeping in.",
                "type": "noun",
                "example": "My bedroom is very small.",
                "difficulty": "A1"
            },
            {
                "english": "bee",
                "bengali": "মৌমাছি",
                "meaning": "A stinging winged insect which collects nectar and pollen, produces wax and honey, and lives in large communities.",
                "type": "noun",
                "example": "A bee stung me.",
                "difficulty": "B1"
            },
            {
                "english": "beef",
                "bengali": "গরুর মাংস",
                "meaning": "The flesh of a cow, bull, or ox, used as food.",
                "type": "noun",
                "example": "I would like to have beef for dinner.",
                "difficulty": "A2"
            },
            {
                "english": "beer",
                "bengali": "বিয়ার",
                "meaning": "An alcoholic drink made from yeast-fermented malt flavored with hops.",
                "type": "noun",
                "example": "He ordered a glass of beer.",
                "difficulty": "A1"
            },
            {
                "english": "before",
                "bengali": "আগে",
                "meaning": "During the period of time preceding (a particular event or time).",
                "type": "preposition, conjunction, adverb",
                "example": "Please finish your homework before dinner.",
                "difficulty": "A1"
            },
            {
                "english": "beg",
                "bengali": "অনুরোধ করা",
                "meaning": "Ask (someone) earnestly or humbly for something.",
                "type": "verb",
                "example": "I beg you to help me.",
                "difficulty": "B2"
            },
            {
                "english": "begin",
                "bengali": "শুরু করা",
                "meaning": "Perform or undergo the first part of (an action or activity).",
                "type": "verb",
                "example": "Let's begin the meeting.",
                "difficulty": "A1"
            },
            {
                "english": "beginning",
                "bengali": "শুরু",
                "meaning": "The point in time or space at which something starts.",
                "type": "noun",
                "example": "This is the beginning of a new chapter in my life.",
                "difficulty": "A1"
            },
            {
                "english": "behave",
                "bengali": "আচরণ করা",
                "meaning": "Act or conduct oneself in a specified way, especially toward others.",
                "type": "verb",
                "example": "You should behave yourself.",
                "difficulty": "A2"
            },
            {
                "english": "behavior",
                "bengali": "আচরণ",
                "meaning": "The way in which one acts or conducts oneself, especially toward others.",
                "type": "noun",
                "example": "His behavior was unacceptable.",
                "difficulty": "A2"
            },
            {
                "english": "behind",
                "bengali": "পিছনে",
                "meaning": "At or to the far side of (something), typically so as to be hidden by it.",
                "type": "preposition, adverb",
                "example": "The cat is hiding behind the curtain.",
                "difficulty": "A1"
            },
            {
                "english": "being",
                "bengali": "অস্তিত্ব",
                "meaning": "Existence.",
                "type": "noun",
                "example": "The origin of all being.",
                "difficulty": "B2"
            },
            {
                "english": "belief",
                "bengali": "বিশ্বাস",
                "meaning": "An acceptance that a statement is true or that something exists.",
                "type": "noun",
                "example": "My belief is that he is innocent.",
                "difficulty": "B1"
            },
            {
                "english": "believe",
                "bengali": "বিশ্বাস করা",
                "meaning": "Accept (something) as true; feel sure of the truth of.",
                "type": "verb",
                "example": "I believe you.",
                "difficulty": "A1"
            },
            {
                "english": "bell",
                "bengali": "ঘণ্টা",
                "meaning": "A hollow metal object, typically in the shape of a deep cup, that is struck to make a ringing sound.",
                "type": "noun",
                "example": "The school bell is ringing.",
                "difficulty": "A2"
            },
            {
                "english": "belong",
                "bengali": "অধীনে থাকা",
                "meaning": "Be the property of.",
                "type": "verb",
                "example": "This book belongs to me.",
                "difficulty": "A2"
            },
            {
                "english": "below",
                "bengali": "নিচে",
                "meaning": "At a lower level or layer than.",
                "type": "preposition, adverb",
                "example": "The temperature is below freezing.",
                "difficulty": "A1"
            },
            {
                "english": "belt",
                "bengali": "বেল্ট",
                "meaning": "A strip of leather or other material worn around the waist or across the chest, especially in order to support clothes or carry a weapon.",
                "type": "noun",
                "example": "He was wearing a black leather belt.",
                "difficulty": "A2"
            },
            {
                "english": "bend",
                "bengali": "বাঁকানো",
                "meaning": "Shape or force (something straight) into a curve or angle.",
                "type": "verb",
                "example": "You need to bend your knees.",
                "difficulty": "B1"
            },
            {
                "english": "benefit",
                "bengali": "সুবিধা",
                "meaning": "An advantage or profit gained from something.",
                "type": "noun, verb",
                "example": "There are many benefits to exercise.",
                "difficulty": "A2"
            },
            {
                "english": "bent",
                "bengali": "বাঁকা",
                "meaning": "Sharply curved or having an angle.",
                "type": "adjective",
                "example": "The wire is bent.",
                "difficulty": "B2"
            },
            {
                "english": "best",
                "bengali": "সেরা",
                "meaning": "Of the most excellent, effective, or desirable type or quality.",
                "type": "adjective, adverb, noun",
                "example": "This is the best book I have ever read.",
                "difficulty": "A1"
            },
            {
                "english": "bet",
                "bengali": "বাজি",
                "meaning": "Risk something, usually a sum of money, against someone else's on the basis of the outcome of a future event, such as a horse race or a game of cards.",
                "type": "verb, noun",
                "example": "I bet you $5 that my team will win.",
                "difficulty": "B1"
            },
            {
                "english": "better",
                "bengali": "আরও ভাল",
                "meaning": "Of a more excellent or effective type or quality.",
                "type": "adjective, adverb, noun",
                "example": "This book is better than the last one.",
                "difficulty": "A1"
            },
            {
                "english": "between",
                "bengali": "মাঝে",
                "meaning": "At, into, or across the space separating (two objects or regions).",
                "type": "preposition, adverb",
                "example": "The house is between the two trees.",
                "difficulty": "A1"
            },
            {
                "english": "beyond",
                "bengali": "ছাড়িয়ে",
                "meaning": "At or to the further side of.",
                "type": "preposition, adverb",
                "example": "The mountains are beyond the river.",
                "difficulty": "B2"
            },
            {
                "english": "bicycle",
                "bengali": "বাইসাইকেল",
                "meaning": "A vehicle composed of two wheels held in a frame one behind the other, propelled by pedals and steered with handlebars attached to the front wheel.",
                "type": "noun",
                "example": "I ride my bicycle to work.",
                "difficulty": "A1"
            },
            {
                "english": "big",
                "bengali": "বড়",
                "meaning": "Of considerable size, extent, or intensity.",
                "type": "adjective",
                "example": "That is a big house.",
                "difficulty": "A1"
            },
            {
                "english": "bike",
                "bengali": "বাইক",
                "meaning": "A bicycle or motorcycle.",
                "type": "noun",
                "example": "He has a new bike.",
                "difficulty": "A1"
            },
            {
                "english": "bill",
                "bengali": "বিল",
                "meaning": "A printed or written statement of the money owed for goods or services.",
                "type": "noun",
                "example": "I have to pay the electricity bill.",
                "difficulty": "A1"
            },
            {
                "english": "billion",
                "bengali": "বিলিয়ন",
                "meaning": "The number equivalent to the product of a thousand and a million; 1,000,000,000 or 10⁹.",
                "type": "number",
                "example": "The world population is over 7 billion.",
                "difficulty": "A2"
            },
            {
                "english": "biology",
                "bengali": "জীববিজ্ঞান",
                "meaning": "The study of living organisms, divided into many specialized fields that cover their morphology, physiology, anatomy, behavior, origin, and distribution.",
                "type": "noun",
                "example": "She is studying biology at university.",
                "difficulty": "A2"
            },
            {
                "english": "bird",
                "bengali": "পাখি",
                "meaning": "A warm-blooded egg-laying vertebrate distinguished by the possession of feathers, wings, and a beak and (typically) by being able to fly.",
                "type": "noun",
                "example": "I saw a beautiful bird in the garden.",
                "difficulty": "A1"
            },
            {
                "english": "birth",
                "bengali": "জন্ম",
                "meaning": "The emergence of a baby or other young from the body of its mother; the start of life as a physically separate being.",
                "type": "noun",
                "example": "What is your date of birth?",
                "difficulty": "A2"
            },
            {
                "english": "birthday",
                "bengali": "জন্মদিন",
                "meaning": "The anniversary of the day on which a person was born, typically treated as an occasion for celebration and the giving of gifts.",
                "type": "noun",
                "example": "Happy birthday!",
                "difficulty": "A1"
            },
            {
                "english": "bit",
                "bengali": "একটু",
                "meaning": "A small piece, part, or quantity of something.",
                "type": "noun",
                "example": "Can I have a little bit of sugar?",
                "difficulty": "A2"
            },
            {
                "english": "bite",
                "bengali": "কামড়",
                "meaning": "(of a person or animal) use the teeth to cut into or through something.",
                "type": "verb, noun",
                "example": "The dog might bite you.",
                "difficulty": "B1"
            },
            {
                "english": "bitter",
                "bengali": "তিক্ত",
                "meaning": "Having a sharp, pungent taste or smell; not sweet.",
                "type": "adjective",
                "example": "This coffee is very bitter.",
                "difficulty": "B2"
            },
            {
                "english": "black",
                "bengali": "কালো",
                "meaning": "Of the very darkest color owing to the absence of or complete absorption of light; the opposite of white.",
                "type": "adjective, noun",
                "example": "She was wearing a black dress.",
                "difficulty": "A1"
            },
            {
                "english": "blame",
                "bengali": "দোষ",
                "meaning": "Feel or declare that (someone or something) is responsible for a fault or wrong.",
                "type": "verb, noun",
                "example": "Don't blame me for your mistake.",
                "difficulty": "B1"
            },
            {
                "english": "blank",
                "bengali": "খালি",
                "meaning": "A space in a text or on a form that is to be filled in.",
                "type": "adjective, noun",
                "example": "Leave the last page blank.",
                "difficulty": "A2"
            },
            {
                "english": "blind",
                "bengali": "অন্ধ",
                "meaning": "Unable to see because of injury, disease, or a congenital condition.",
                "type": "adjective",
                "example": "He is blind in one eye.",
                "difficulty": "B2"
            },
            {
                "english": "block",
                "bengali": "ব্লক",
                "meaning": "A large solid piece of hard material, especially rock, stone, or wood, typically with flat surfaces on each side.",
                "type": "noun, verb",
                "example": "The road is blocked by a fallen tree.",
                "difficulty": "A2"
            },
            {
                "english": "blog",
                "bengali": "ব্লগ",
                "meaning": "A regularly updated website or web page, typically one run by an individual or small group, that is written in an informal or conversational style.",
                "type": "noun",
                "example": "She writes a blog about her travels.",
                "difficulty": "A2"
            },
            {
                "english": "blond",
                "bengali": "স্বর্ণকেশী",
                "meaning": "(of hair) fair or pale yellow.",
                "type": "adjective, noun",
                "example": "She has long blond hair.",
                "difficulty": "A2"
            },
            {
                "english": "blood",
                "bengali": "রক্ত",
                "meaning": "The red liquid that circulates in the arteries and veins of humans and other vertebrate animals, carrying oxygen to and carbon dioxide from the tissues of the body.",
                "type": "noun",
                "example": "He lost a lot of blood in the accident.",
                "difficulty": "A2"
            },
            {
                "english": "blow",
                "bengali": "প্রবাহিত হওয়া",
                "meaning": "(of wind) move creating an air current.",
                "type": "verb",
                "example": "The wind is blowing hard.",
                "difficulty": "A2"
            },
                {
                    "english": "blue",
                    "bengali": "নীল",
                    "meaning": "Of a color intermediate between green and violet, as of the sky or sea on a sunny day.",
                    "type": "adjective, noun",
                    "example": "The sky is blue.",
                    "difficulty": "A1"
                },
                {
                    "english": "board",
                    "bengali": "বোর্ড",
                    "meaning": "A long, thin, flat piece of wood or other hard material, used for floors or other building purposes.",
                    "type": "noun, verb",
                    "example": "He wrote the answer on the board.",
                    "difficulty": "A2"
                },
                {
                    "english": "boat",
                    "bengali": "নৌকা",
                    "meaning": "A vessel for travel on water, propelled by oars, sails, or an engine.",
                    "type": "noun",
                    "example": "We went for a ride in a boat.",
                    "difficulty": "A1"
                },
                {
                    "english": "body",
                    "bengali": "শরীর",
                    "meaning": "The physical structure, including the bones, flesh, and organs, of a person or an animal.",
                    "type": "noun",
                    "example": "Exercise is good for the body.",
                    "difficulty": "A1"
                },
                {
                    "english": "boil",
                    "bengali": "সিদ্ধ করা",
                    "meaning": "(with reference to a liquid) reach or cause to reach the temperature at which it bubbles and turns to vapor.",
                    "type": "verb",
                    "example": "You should boil the water before you drink it.",
                    "difficulty": "A2"
                },
                {
                    "english": "bomb",
                    "bengali": "বোমা",
                    "meaning": "A container filled with explosive, incendiary material, smoke, gas, or other destructive substance, designed to explode on impact or when detonated by a time mechanism, remote control, or lit fuse.",
                    "type": "noun, verb",
                    "example": "A bomb exploded in the city center.",
                    "difficulty": "B1"
                },
                {
                    "english": "bond",
                    "bengali": "বন্ধন",
                    "meaning": "A relationship between people or groups based on shared feelings, interests, or experiences.",
                    "type": "noun, verb",
                    "example": "There is a strong bond between them.",
                    "difficulty": "B2"
                },
                {
                    "english": "bone",
                    "bengali": "হাড়",
                    "meaning": "Any of the pieces of hard, whitish tissue making up the skeleton in humans and other vertebrates.",
                    "type": "noun",
                    "example": "He broke a bone in his arm.",
                    "difficulty": "A2"
                },
                {
                    "english": "book",
                    "bengali": "বই",
                    "meaning": "A written or printed work consisting of pages glued or sewn together along one side and bound in covers.",
                    "type": "noun, verb",
                    "example": "I am reading a good book.",
                    "difficulty": "A1"
                },
                {
                    "english": "boot",
                    "bengali": "বুট",
                    "meaning": "A sturdy item of footwear covering the foot and ankle, and sometimes also the lower leg.",
                    "type": "noun",
                    "example": "She was wearing a pair of brown boots.",
                    "difficulty": "A2"
                },
                {
                    "english": "border",
                    "bengali": "সীমানা",
                    "meaning": "A line separating two political or geographical areas, especially countries.",
                    "type": "noun, verb",
                    "example": "We crossed the border into Canada.",
                    "difficulty": "A2"
                },
                {
                    "english": "bored",
                    "bengali": "বিরক্ত",
                    "meaning": "Feeling weary because one is unoccupied or lacks interest in one's current activity.",
                    "type": "adjective",
                    "example": "I am bored with this game.",
                    "difficulty": "A2"
                },
                {
                    "english": "boring",
                    "bengali": "বিরক্তিকর",
                    "meaning": "Not interesting; tedious.",
                    "type": "adjective",
                    "example": "This is a very boring book.",
                    "difficulty": "A1"
                },
                {
                    "english": "born",
                    "bengali": "জন্মগ্রহণ করা",
                    "meaning": "Existing as a result of birth.",
                    "type": "adjective",
                    "example": "I was born in 1990.",
                    "difficulty": "A1"
                },
                {
                    "english": "borrow",
                    "bengali": "ধার করা",
                    "meaning": "Take and use (something that belongs to someone else) with the intention of returning it.",
                    "type": "verb",
                    "example": "Can I borrow your pen?",
                    "difficulty": "A2"
                },
                {
                    "english": "boss",
                    "bengali": "কর্তা",
                    "meaning": "A person who is in charge of a worker, group, or organization.",
                    "type": "noun",
                    "example": "My boss is a very nice person.",
                    "difficulty": "A2"
                },
                {
                    "english": "both",
                    "bengali": "উভয়",
                    "meaning": "Used to refer to two people or things, regarded and addressed together.",
                    "type": "determiner, pronoun",
                    "example": "Both of my parents are doctors.",
                    "difficulty": "A1"
                },
                {
                    "english": "bother",
                    "bengali": "বিরক্ত করা",
                    "meaning": "Take the trouble to do something.",
                    "type": "verb, noun",
                    "example": "Don't bother to come if you don't want to.",
                    "difficulty": "B1"
                },
                {
                    "english": "bottle",
                    "bengali": "বোতল",
                    "meaning": "A glass or plastic container with a narrow neck, used for holding drinks or other liquids.",
                    "type": "noun",
                    "example": "He drank a bottle of water.",
                    "difficulty": "A1"
                },
                {
                    "english": "bottom",
                    "bengali": "তল",
                    "meaning": "The lowest point or part.",
                    "type": "noun, adjective",
                    "example": "The keys are at the bottom of my bag.",
                    "difficulty": "A2"
                },
                {
                    "english": "bowl",
                    "bengali": "বাটি",
                    "meaning": "A round, deep dish or basin used for food or liquid.",
                    "type": "noun",
                    "example": "She ate a bowl of soup.",
                    "difficulty": "A2"
                },
                {
                    "english": "box",
                    "bengali": "বাক্স",
                    "meaning": "A container with a flat base and sides, typically square or rectangular and having a lid.",
                    "type": "noun, verb",
                    "example": "The gift was in a beautiful box.",
                    "difficulty": "A1"
                },
                {
                    "english": "boy",
                    "bengali": "ছেলে",
                    "meaning": "A male child or young man.",
                    "type": "noun",
                    "example": "The boy is playing in the garden.",
                    "difficulty": "A1"
                },
                {
                    "english": "boyfriend",
                    "bengali": "প্রেমিক",
                    "meaning": "A person's regular male companion with whom they have a romantic or sexual relationship.",
                    "type": "noun",
                    "example": "She is going out with her boyfriend.",
                    "difficulty": "A1"
                },
                {
                    "english": "brain",
                    "bengali": "মস্তিষ্ক",
                    "meaning": "An organ of soft nervous tissue contained in the skull of vertebrates, functioning as the coordinating center of sensation and intellectual and nervous activity.",
                    "type": "noun",
                    "example": "The brain is a complex organ.",
                    "difficulty": "A2"
                },
                {
                    "english": "branch",
                    "bengali": "শাখা",
                    "meaning": "A part of a tree which grows out from the trunk or from a bough.",
                    "type": "noun",
                    "example": "The bird is sitting on a branch.",
                    "difficulty": "B1"
                },
                {
                    "english": "brand",
                    "bengali": "ব্র্যান্ড",
                    "meaning": "A type of product manufactured by a particular company under a particular name.",
                    "type": "noun, verb",
                    "example": "What brand of car do you drive?",
                    "difficulty": "B1"
                },
                {
                    "english": "brave",
                    "bengali": "সাহসী",
                    "meaning": "Ready to face and endure danger or pain; showing courage.",
                    "type": "adjective",
                    "example": "He was a brave soldier.",
                    "difficulty": "B1"
                },
                {
                    "english": "bread",
                    "bengali": "রুটি",
                    "meaning": "Food made of flour, water, and yeast mixed together and baked.",
                    "type": "noun",
                    "example": "I had bread and butter for breakfast.",
                    "difficulty": "A1"
                },
                {
                    "english": "break",
                    "bengali": "ভাঙ্গা",
                    "meaning": "Separate into pieces as a result of a blow, shock, or strain.",
                    "type": "verb, noun",
                    "example": "Be careful not to break the glass.",
                    "difficulty": "A1"
                },
                {
                    "english": "breakfast",
                    "bengali": "সকালের নাস্তা",
                    "meaning": "A meal eaten in the morning, the first of the day.",
                    "type": "noun",
                    "example": "What did you have for breakfast?",
                    "difficulty": "A1"
                },
                {
                    "english": "breast",
                    "bengali": "বক্ষ",
                    "meaning": "Either of the two soft, protruding organs on the upper front of a woman's body that secrete milk after pregnancy.",
                    "type": "noun",
                    "example": "Breast cancer is a common disease.",
                    "difficulty": "B2"
                },
                {
                    "english": "breath",
                    "bengali": "শ্বাস",
                    "meaning": "The air taken into or expelled from the lungs.",
                    "type": "noun",
                    "example": "He took a deep breath.",
                    "difficulty": "B1"
                },
                {
                    "english": "breathe",
                    "bengali": "শ্বাস ফেলা",
                    "meaning": "Take air into the lungs and then expel it, as a regular physiological process.",
                    "type": "verb",
                    "example": "It's so cold I can see my breath.",
                    "difficulty": "B1"
                },
                {
                    "english": "breathing",
                    "bengali": "শ্বাস-প্রশ্বাস",
                    "meaning": "The process of taking air into and expelling it from the lungs.",
                    "type": "noun",
                    "example": "Her breathing was shallow.",
                    "difficulty": "B1"
                },
                {
                    "english": "bride",
                    "bengali": "নববধূ",
                    "meaning": "A woman on her wedding day or just before and after the event.",
                    "type": "noun",
                    "example": "The bride looked beautiful.",
                    "difficulty": "B1"
                },
                {
                    "english": "bridge",
                    "bengali": "সেতু",
                    "meaning": "A structure carrying a road, path, railroad, or canal across a river, ravine, road, railroad, or other obstacle.",
                    "type": "noun",
                    "example": "We crossed the bridge to get to the other side.",
                    "difficulty": "A2"
                },
                {
                    "english": "brief",
                    "bengali": "সংক্ষিপ্ত",
                    "meaning": "Of short duration; not lasting for long.",
                    "type": "adjective",
                    "example": "It was a brief meeting.",
                    "difficulty": "B2"
                },
                {
                    "english": "bright",
                    "bengali": "উজ্জ্বল",
                    "meaning": "Giving out or reflecting a lot of light; shining.",
                    "type": "adjective",
                    "example": "The sun is very bright today.",
                    "difficulty": "A2"
                },
                {
                    "english": "brilliant",
                    "bengali": "মেধাবী",
                    "meaning": "Exceptionally clever or talented.",
                    "type": "adjective",
                    "example": "He is a brilliant scientist.",
                    "difficulty": "A2"
                },
                {
                    "english": "bring",
                    "bengali": "আনা",
                    "meaning": "Take or go with (someone or something) to a place.",
                    "type": "verb",
                    "example": "Please bring your books with you.",
                    "difficulty": "A1"
                },
                {
                    "english": "broad",
                    "bengali": "প্রশস্ত",
                    "meaning": "Having a distance larger than usual from side to side; wide.",
                    "type": "adjective",
                    "example": "The river is very broad here.",
                    "difficulty": "B2"
                },
                {
                    "english": "broadcast",
                    "bengali": "সম্প্রচার",
                    "meaning": "Transmit (a program or some information) by radio or television.",
                    "type": "verb, noun",
                    "example": "The news will be broadcast at 10 pm.",
                    "difficulty": "B2"
                },
                {
                    "english": "broken",
                    "bengali": "ভাঙ্গা",
                    "meaning": "Having been fractured or damaged and no longer in one piece or in working order.",
                    "type": "adjective",
                    "example": "My watch is broken.",
                    "difficulty": "A2"
                },
                {
                    "english": "brother",
                    "bengali": "ভাই",
                    "meaning": "A man or boy with one or more parents in common with another person.",
                    "type": "noun",
                    "example": "I have two brothers.",
                    "difficulty": "A1"
                },
                {
                    "english": "brown",
                    "bengali": "বাদামী",
                    "meaning": "Of a color produced by mixing red, yellow, and blue, as of dark wood or rich soil.",
                    "type": "adjective, noun",
                    "example": "She has brown eyes.",
                    "difficulty": "A1"
                },
                {
                    "english": "brush",
                    "bengali": "ব্রাশ",
                    "meaning": "An implement with a handle, consisting of bristles, hair, or wire set into a block, used for cleaning or scrubbing, applying a liquid or powder to a surface, or arranging the hair.",
                    "type": "verb, noun",
                    "example": "You should brush your teeth twice a day.",
                    "difficulty": "A2"
                },
                {
                    "english": "bubble",
                    "bengali": "বুদবুদ",
                    "meaning": "A thin sphere of liquid enclosing air or another gas.",
                    "type": "noun, verb",
                    "example": "The children were blowing bubbles.",
                    "difficulty": "B1"
                },
                {
                    "english": "budget",
                    "bengali": "বাজেট",
                    "meaning": "An estimate of income and expenditure for a set period of time.",
                    "type": "noun, verb",
                    "example": "We need to plan our budget for the trip.",
                    "difficulty": "B2"
                },
                {
                    "english": "build",
                    "bengali": "নির্মাণ করা",
                    "meaning": "Construct (something, typically something large) by putting parts or material together over a period of time.",
                    "type": "verb",
                    "example": "They are going to build a new house.",
                    "difficulty": "A1"
                },
                {
                    "english": "building",
                    "bengali": "ভবন",
                    "meaning": "A structure with a roof and walls, such as a house or factory.",
                    "type": "noun",
                    "example": "That is a very tall building.",
                    "difficulty": "A1"
                },
                {
                    "english": "bullet",
                    "bengali": "গুলি",
                    "meaning": "A projectile for firing from a rifle, revolver, or other small firearm, typically made of metal, cylindrical and pointed, and sometimes containing an explosive charge.",
                    "type": "noun",
                    "example": "The gun was loaded with bullets.",
                    "difficulty": "B2"
                },
                {
                    "english": "bunch",
                    "bengali": "গুচ্ছ",
                    "meaning": "A number of things, typically of the same kind, growing or fastened together.",
                    "type": "noun",
                    "example": "She bought a bunch of bananas.",
                    "difficulty": "B2"
                },
                {
                    "english": "burn",
                    "bengali": "পোড়া",
                    "meaning": "(of a fire) produce flames and heat while consuming a material such as coal or wood.",
                    "type": "verb, noun",
                    "example": "The fire is burning brightly.",
                    "difficulty": "A2"
                },
                {
                    "english": "bury",
                    "bengali": "কবর দেওয়া",
                    "meaning": "Put or hide under ground.",
                    "type": "verb",
                    "example": "They buried him in the local cemetery.",
                    "difficulty": "B1"
                },
                {
                    "english": "bus",
                    "bengali": "বাস",
                    "meaning": "A large motor vehicle carrying passengers by road, typically one serving the public on a fixed route and for a fare.",
                    "type": "noun",
                    "example": "I take the bus to work.",
                    "difficulty": "A1"
                },
                {
                    "english": "bush",
                    "bengali": "ঝোপ",
                    "meaning": "A shrub or clump of shrubs with stems of moderate length.",
                    "type": "noun",
                    "example": "The cat is hiding in the bushes.",
                    "difficulty": "B2"
                },
                {
                    "english": "business",
                    "bengali": "ব্যবসা",
                    "meaning": "A person's regular occupation, profession, or trade.",
                    "type": "noun",
                    "example": "He has his own business.",
                    "difficulty": "A1"
                },
                {
                    "english": "businessman",
                    "bengali": "ব্যবসায়ী",
                    "meaning": "A man who works in business, especially one who has a high position in a company.",
                    "type": "noun",
                    "example": "He is a successful businessman.",
                    "difficulty": "A2"
                },
                {
                    "english": "busy",
                    "bengali": "ব্যস্ত",
                    "meaning": "Having a great deal to do.",
                    "type": "adjective",
                    "example": "I am very busy today.",
                    "difficulty": "A1"
                },
                {
                    "english": "but",
                    "bengali": "কিন্তু",
                    "meaning": "Used to introduce a phrase or clause contrasting with what has already been mentioned.",
                    "type": "conjunction, preposition",
                    "example": "I like him, but I don't trust him.",
                    "difficulty": "A1"
                },
                {
                    "english": "butter",
                    "bengali": "মাখন",
                    "meaning": "A pale yellow edible fatty substance made by churning cream and used as a spread or in cooking.",
                    "type": "noun",
                    "example": "I like butter on my bread.",
                    "difficulty": "A1"
                },
                {
                    "english": "button",
                    "bengali": "বোতাম",
                    "meaning": "A small disk or knob sewn on to a garment, either to fasten it by being pushed through a buttonhole, or for decoration.",
                    "type": "noun",
                    "example": "One of the buttons is missing from my shirt.",
                    "difficulty": "A2"
                },
                {
                    "english": "buy",
                    "bengali": "কেনা",
                    "meaning": "Obtain in exchange for payment.",
                    "type": "verb",
                    "example": "I need to buy some new shoes.",
                    "difficulty": "A1"
                },
                {
                    "english": "by",
                    "bengali": "দ্বারা",
                    "meaning": "Indicating the agent performing an action.",
                    "type": "preposition, adverb",
                    "example": "The book was written by a famous author.",
                    "difficulty": "A1"
                },
                {
                    "english": "bye",
                    "bengali": "বিদায়",
                    "meaning": "Short for goodbye.",
                    "type": "exclamation",
                    "example": "Bye! See you tomorrow.",
                    "difficulty": "A1"
                },
                {
                    "english": "cable",
                    "bengali": "তার",
                    "meaning": "A thick, strong rope, especially one made of wire.",
                    "type": "noun",
                    "example": "The bridge is supported by steel cables.",
                    "difficulty": "B1"
                },
                {
                    "english": "cafe",
                    "bengali": "ক্যাফে",
                    "meaning": "A small restaurant selling light meals and drinks.",
                    "type": "noun",
                    "example": "Let's meet at the cafe.",
                    "difficulty": "A1"
                },
                {
                    "english": "cake",
                    "bengali": "কেক",
                    "meaning": "A sweet baked food made from a mixture of flour, sugar, eggs, fat, etc.",
                    "type": "noun",
                    "example": "She baked a delicious cake.",
                    "difficulty": "A1"
                },
                {
                    "english": "calculate",
                    "bengali": "হিসাব করা",
                    "meaning": "Determine (the amount or number of something) mathematically.",
                    "type": "verb",
                    "example": "We need to calculate the total cost.",
                    "difficulty": "B2"
                },
                {
                    "english": "call",
                    "bengali": "ডাকা",
                    "meaning": "Give (a baby or animal) a specified name.",
                    "type": "verb, noun",
                    "example": "I will call you later.",
                    "difficulty": "A1"
                },
                {
                    "english": "calm",
                    "bengali": "শান্ত",
                    "meaning": "Not showing or feeling nervousness, anger, or other emotions.",
                    "type": "adjective, verb, noun",
                    "example": "The sea was calm.",
                    "difficulty": "B1"
                },
                {
                    "english": "camera",
                    "bengali": "ক্যামেরা",
                    "meaning": "A device for recording visual images in the form of photographs, film, or video signals.",
                    "type": "noun",
                    "example": "I have a new camera.",
                    "difficulty": "A1"
                },
                {
                    "english": "camp",
                    "bengali": "শিবির",
                    "meaning": "A place with temporary accommodations of huts, tents, or other structures, typically used by soldiers, refugees, prisoners, or travelers.",
                    "type": "noun, verb",
                    "example": "We set up camp by the river.",
                    "difficulty": "A2"
                },
                {
                    "english": "campaign",
                    "bengali": "প্রচারণা",
                    "meaning": "A series of military operations intended to achieve a particular objective, confined to a particular area, or involving a particular type of fighting.",
                    "type": "noun, verb",
                    "example": "They launched a campaign to save the local hospital.",
                    "difficulty": "B1"
                },
                {
                    "english": "camping",
                    "bengali": "ক্যাম্পিং",
                    "meaning": "The activity of spending a vacation or weekend in a camp, tent, or camper.",
                    "type": "noun",
                    "example": "We are going camping this weekend.",
                    "difficulty": "A2"
                },
                {
                    "english": "campus",
                    "bengali": "ক্যাম্পাস",
                    "meaning": "The grounds and buildings of a university or college.",
                    "type": "noun",
                    "example": "The university has a beautiful campus.",
                    "difficulty": "A2"
                },
                {
                    "english": "can (modal)",
                    "bengali": "পারা",
                    "meaning": "Be able to.",
                    "type": "modal verb",
                    "example": "I can swim.",
                    "difficulty": "A1"
                },
                {
                    "english": "can (container)",
                    "bengali": "ক্যান",
                    "meaning": "A cylindrical metal container.",
                    "type": "noun",
                    "example": "He opened a can of soda.",
                    "difficulty": "A2"
                },
                {
                    "english": "cancel",
                    "bengali": "বাতিল করা",
                    "meaning": "Decide that an arranged event will not take place.",
                    "type": "verb",
                    "example": "The meeting was canceled.",
                    "difficulty": "B2"
                },
                {
                    "english": "cancer",
                    "bengali": "ক্যান্সার",
                    "meaning": "A disease caused by an uncontrolled division of abnormal cells in a part of the body.",
                    "type": "noun",
                    "example": "He died of cancer.",
                    "difficulty": "B2"
                },
                {
                    "english": "candidate",
                    "bengali": "প্রার্থী",
                    "meaning": "A person who applies for a job or is nominated for election.",
                    "type": "noun",
                    "example": "There are three candidates for the job.",
                    "difficulty": "B1"
                },
                {
                    "english": "candy",
                    "bengali": "মিছরি",
                    "meaning": "A sweet food made with sugar or other sweeteners, typically formed in small pieces and eaten as a snack.",
                    "type": "noun",
                    "example": "The children love to eat candy.",
                    "difficulty": "A2"
                },
                {
                    "english": "cannot",
                    "bengali": "না পারা",
                    "meaning": "Can not.",
                    "type": "verb",
                    "example": "I cannot help you.",
                    "difficulty": "A1"
                },
                {
                    "english": "cap",
                    "bengali": "টুপি",
                    "meaning": "A kind of soft, flat hat, typically with a peak.",
                    "type": "noun",
                    "example": "He was wearing a baseball cap.",
                    "difficulty": "B1"
                },
                {
                    "english": "capable",
                    "bengali": "সক্ষম",
                    "meaning": "Having the ability, fitness, or quality necessary to do or achieve a specified thing.",
                    "type": "adjective",
                    "example": "She is capable of doing much better.",
                    "difficulty": "B2"
                },
                {
                    "english": "capacity",
                    "bengali": "ক্ষমতা",
                    "meaning": "The maximum amount that something can contain.",
                    "type": "noun",
                    "example": "The stadium has a seating capacity of 50,000.",
                    "difficulty": "B2"
                },
                {
                    "english": "capital",
                    "bengali": "রাজধানী",
                    "meaning": "The most important city or town of a country or region, usually its seat of government and administrative center.",
                    "type": "noun, adjective",
                    "example": "Dhaka is the capital of Bangladesh.",
                    "difficulty": "A1"
                },
                {
                    "english": "captain",
                    "bengali": "অধিনায়ক",
                    "meaning": "The person in command of a ship.",
                    "type": "noun",
                    "example": "The captain of the team is a great player.",
                    "difficulty": "B1"
                },
                {
                    "english": "capture",
                    "bengali": "বন্দী করা",
                    "meaning": "Take into one's possession or control by force.",
                    "type": "verb, noun",
                    "example": "The police captured the thief.",
                    "difficulty": "B2"
                },
                {
                    "english": "car",
                    "bengali": "গাড়ি",
                    "meaning": "A road vehicle, typically with four wheels, powered by an internal combustion engine or electric motor and able to carry a small number of people.",
                    "type": "noun",
                    "example": "He has a new car.",
                    "difficulty": "A1"
                },
                {
                    "english": "card",
                    "bengali": "কার্ড",
                    "meaning": "A piece of thick, stiff paper or thin pasteboard, in particular one used for writing or printing on.",
                    "type": "noun",
                    "example": "I sent her a birthday card.",
                    "difficulty": "A1"
                },
                {
                    "english": "care",
                    "bengali": "যত্ন",
                    "meaning": "The provision of what is necessary for the health, welfare, maintenance, and protection of someone or something.",
                    "type": "noun, verb",
                    "example": "She takes good care of her children.",
                    "difficulty": "A2"
                },
                {
                    "english": "career",
                    "bengali": "পেশা",
                    "meaning": "An occupation undertaken for a significant period of a person's life and with opportunities for progress.",
                    "type": "noun",
                    "example": "He has a successful career in law.",
                    "difficulty": "A1"
                },
                {
                    "english": "careful",
                    "bengali": "সতর্ক",
                    "meaning": "Making sure of avoiding potential danger, mishap, or harm; cautious.",
                    "type": "adjective",
                    "example": "Be careful when you cross the street.",
                    "difficulty": "A2"
                },
                {
                    "english": "carefully",
                    "bengali": "সাবধানে",
                    "meaning": "In a way that deliberately avoids harm or errors; cautiously.",
                    "type": "adverb",
                    "example": "Please drive carefully.",
                    "difficulty": "A2"
                },   
    {
        "english": "careless",
        "bengali": "অসতর্ক",
        "meaning": "Not giving sufficient attention or thought to avoiding harm or errors.",
        "type": "adjective",
        "example": "He is a careless driver.",
        "difficulty": "B1"
    },
    {
        "english": "carpet",
        "bengali": "গালিচা",
        "meaning": "A floor covering made from thick woven fabric.",
        "type": "noun",
        "example": "We have a new carpet in the living room.",
        "difficulty": "A2"
    },
    {
        "english": "carrot",
        "bengali": "গাজর",
        "meaning": "A tapering orange-colored root eaten as a vegetable.",
        "type": "noun",
        "example": "Rabbits like to eat carrots.",
        "difficulty": "A1"
    },
    {
        "english": "carry",
        "bengali": "বহন করা",
        "meaning": "Support and move (someone or something) from one place to another.",
        "type": "verb",
        "example": "Can you help me carry this bag?",
        "difficulty": "A1"
    },
    {
        "english": "cartoon",
        "bengali": "কার্টুন",
        "meaning": "A simplified or exaggerated drawing of a person or thing, often for humorous or satirical effect.",
        "type": "noun",
        "example": "The children are watching cartoons.",
        "difficulty": "A2"
    },
    {
        "english": "case",
        "bengali": "মামলা",
        "meaning": "An instance of a particular situation or a thing of a particular kind.",
        "type": "noun",
        "example": "In that case, we will have to cancel the trip.",
        "difficulty": "A2"
    },
    {
        "english": "cash",
        "bengali": "নগদ টাকা",
        "meaning": "Money in coins or notes, as distinct from checks, money orders, or credit.",
        "type": "noun",
        "example": "I need to get some cash from the bank.",
        "difficulty": "A2"
    },
    {
        "english": "cast",
        "bengali": "নিক্ষেপ করা",
        "meaning": "Cause (light or shadow) to appear on a surface.",
        "type": "noun, verb",
        "example": "The tree cast a long shadow.",
        "difficulty": "B2"
    },
    {
        "english": "cat",
        "bengali": "বিড়াল",
        "meaning": "A small domesticated carnivorous mammal with soft fur, a short snout, and retractable claws.",
        "type": "noun",
        "example": "My cat is very friendly.",
        "difficulty": "A1"
    },
    {
        "english": "catch",
        "bengali": "ধরা",
        "meaning": "Intercept and hold (something which has been thrown, propelled, or dropped).",
        "type": "verb, noun",
        "example": "Can you catch the ball?",
        "difficulty": "A2"
    },
    {
        "english": "category",
        "bengali": "বিভাগ",
        "meaning": "A class or division of people or things regarded as having particular shared characteristics.",
        "type": "noun",
        "example": "The books are divided into different categories.",
        "difficulty": "B1"
    },
    {
        "english": "cause",
        "bengali": "কারণ",
        "meaning": "A person or thing that gives rise to an action, phenomenon, or condition.",
        "type": "noun, verb",
        "example": "What was the cause of the fire?",
        "difficulty": "A2"
    },
    {
        "english": "CD",
        "bengali": "সিডি",
        "meaning": "A compact disc.",
        "type": "noun",
        "example": "I have a large collection of CDs.",
        "difficulty": "A1"
    },
    {
        "english": "ceiling",
        "bengali": "ছাদ",
        "meaning": "The upper interior surface of a room.",
        "type": "noun",
        "example": "The ceiling is painted white.",
        "difficulty": "B1"
    },
    {
        "english": "celebrate",
        "bengali": "উদযাপন করা",
        "meaning": "Acknowledge (a significant or happy day or event) with a social gathering or enjoyable activity.",
        "type": "verb",
        "example": "We are going to celebrate his birthday.",
        "difficulty": "A2"
    },
    {
        "english": "celebration",
        "bengali": "উদযাপন",
        "meaning": "The action of celebrating an important day or event.",
        "type": "noun",
        "example": "There was a big celebration for the new year.",
        "difficulty": "B1"
    },
    {
        "english": "celebrity",
        "bengali": "বিখ্যাত ব্যক্তি",
        "meaning": "A famous person, especially in entertainment or sport.",
        "type": "noun",
        "example": "He is a famous celebrity.",
        "difficulty": "A2"
    },
    {
        "english": "cell",
        "bengali": "কোষ",
        "meaning": "The smallest structural and functional unit of an organism, typically microscopic and consisting of cytoplasm and a nucleus enclosed in a membrane.",
        "type": "noun",
        "example": "The human body is made up of millions of cells.",
        "difficulty": "A2"
    },
    {
        "english": "cent",
        "bengali": "সেন্ট",
        "meaning": "A monetary unit in various countries, equal to one hundredth of a dollar, euro, or other decimal currency unit.",
        "type": "noun",
        "example": "This only costs 50 cents.",
        "difficulty": "A1"
    },
    {
        "english": "center",
        "bengali": "কেন্দ্র",
        "meaning": "The middle point of a circle or sphere, equidistant from every point on the circumference or surface.",
        "type": "noun, verb",
        "example": "The hotel is in the center of the town.",
        "difficulty": "A1"
    },
    {
        "english": "central",
        "bengali": "কেন্দ্রীয়",
        "meaning": "Of, at, or forming the center.",
        "type": "adjective",
        "example": "The central library is open to the public.",
        "difficulty": "B1"
    },
    {
        "english": "century",
        "bengali": "শতাব্দী",
        "meaning": "A period of one hundred years.",
        "type": "noun",
        "example": "We are living in the 21st century.",
        "difficulty": "A2"
    },
    {
        "english": "ceremony",
        "bengali": "অনুষ্ঠান",
        "meaning": "A formal religious or public occasion, typically one celebrating a particular event or anniversary.",
        "type": "noun",
        "example": "The wedding ceremony was beautiful.",
        "difficulty": "B1"
    },
    {
        "english": "certain",
        "bengali": "নিশ্চিত",
        "meaning": "Known for sure; established beyond doubt.",
        "type": "adjective",
        "example": "I am certain that he is innocent.",
        "difficulty": "A2"
    },
    {
        "english": "certainly",
        "bengali": "অবশ্যই",
        "meaning": "Without doubt.",
        "type": "adverb",
        "example": "I will certainly help you.",
        "difficulty": "A2"
    },
    {
        "english": "chain",
        "bengali": "শিকল",
        "meaning": "A series of connected links or rings, usually of metal.",
        "type": "noun, verb",
        "example": "The dog was tied up with a chain.",
        "difficulty": "B1"
    },
    {
        "english": "chair",
        "bengali": "চেয়ার",
        "meaning": "A separate seat for one person, typically with a back and four legs.",
        "type": "noun, verb",
        "example": "Please have a seat in this chair.",
        "difficulty": "A1"
    },
    {
        "english": "chairman",
        "bengali": "সভাপতি",
        "meaning": "A person, especially a man, designated to preside over a meeting.",
        "type": "noun",
        "example": "He is the chairman of the committee.",
        "difficulty": "B2"
    },
    {
        "english": "challenge",
        "bengali": "চ্যালেঞ্জ",
        "meaning": "A call to take part in a contest or competition, especially a duel.",
        "type": "noun, verb",
        "example": "I accept your challenge.",
        "difficulty": "B1"
    },
    {
        "english": "champion",
        "bengali": "চ্যাম্পিয়ন",
        "meaning": "A person who has defeated or surpassed all rivals in a competition, especially in sports.",
        "type": "noun",
        "example": "He is the world champion.",
        "difficulty": "B1"
    },
    {
        "english": "chance",
        "bengali": "সুযোগ",
        "meaning": "A possibility of something happening.",
        "type": "noun",
        "example": "Is there any chance of rain?",
        "difficulty": "A2"
    },
    {
        "english": "change",
        "bengali": "পরিবর্তন",
        "meaning": "Make or become different.",
        "type": "verb, noun",
        "example": "I need to change my clothes.",
        "difficulty": "A1"
    },
    {
        "english": "channel",
        "bengali": "চ্যানেল",
        "meaning": "A band of frequencies used in radio and television transmission, especially as used by a particular station.",
        "type": "noun",
        "example": "What channel is the news on?",
        "difficulty": "B1"
    },
    {
        "english": "chapter",
        "bengali": "অধ্যায়",
        "meaning": "A main division of a book, typically with a number or title.",
        "type": "noun",
        "example": "I have read the first chapter of the book.",
        "difficulty": "B1"
    },
    {
        "english": "character",
        "bengali": "চরিত্র",
        "meaning": "The mental and moral qualities distinctive to an individual.",
        "type": "noun",
        "example": "He has a strong character.",
        "difficulty": "A2"
    },
    {
        "english": "characteristic",
        "bengali": "বৈশিষ্ট্য",
        "meaning": "A feature or quality belonging typically to a person, place, or thing and serving to identify it.",
        "type": "noun, adjective",
        "example": "The main characteristic of this car is its speed.",
        "difficulty": "B2"
    },
    {
        "english": "charge",
        "bengali": "অভিযোগ",
        "meaning": "Accuse (someone) of something, especially an offense under law.",
        "type": "noun, verb",
        "example": "He was charged with murder.",
        "difficulty": "B1"
    },
    {
        "english": "charity",
        "bengali": "দান",
        "meaning": "An organization set up to provide help and raise money for those in need.",
        "type": "noun",
        "example": "She works for a charity.",
        "difficulty": "A2"
    },
    {
        "english": "chart",
        "bengali": "তালিকা",
        "meaning": "A sheet of information in the form of a table, graph, or diagram.",
        "type": "noun, verb",
        "example": "The chart shows the company's sales figures.",
        "difficulty": "A1"
    },
    {
        "english": "chat",
        "bengali": "আড্ডা",
        "meaning": "Talk in a friendly and informal way.",
        "type": "verb, noun",
        "example": "We had a long chat about our plans.",
        "difficulty": "A2"
    },
    {
        "english": "cheap",
        "bengali": "সস্তা",
        "meaning": "Low in price; worth more than its cost.",
        "type": "adjective, adverb",
        "example": "This is a cheap hotel.",
        "difficulty": "A1"
    },
    {
        "english": "cheat",
        "bengali": "প্রতারণা করা",
        "meaning": "Act dishonestly or unfairly in order to gain an advantage, especially in a game or examination.",
        "type": "verb, noun",
        "example": "He cheated on the exam.",
        "difficulty": "B1"
    },
    {
        "english": "check",
        "bengali": "পরীক্ষা করা",
        "meaning": "Examine (something) in order to determine its accuracy, quality, or condition, or to detect the presence of something.",
        "type": "verb, noun",
        "example": "Please check your work before you hand it in.",
        "difficulty": "A1"
    },
    {
        "english": "cheerful",
        "bengali": "হাসিখুশি",
        "meaning": "Noticeably happy and optimistic.",
        "type": "adjective",
        "example": "She is a cheerful person.",
        "difficulty": "B1"
    },
    {
        "english": "cheese",
        "bengali": "পনির",
        "meaning": "A food made from the pressed curds of milk.",
        "type": "noun",
        "example": "I like to eat cheese.",
        "difficulty": "A1"
    },
    {
        "english": "chef",
        "bengali": "বাবুর্চি",
        "meaning": "A professional cook, typically the chief cook in a restaurant or hotel.",
        "type": "noun",
        "example": "He is a famous chef.",
        "difficulty": "A2"
    },
    {
        "english": "chemical",
        "bengali": "রাসায়নিক",
        "meaning": "Relating to chemistry, or the interactions of substances as studied in chemistry.",
        "type": "adjective, noun",
        "example": "This is a chemical reaction.",
        "difficulty": "B1"
    },
    {
        "english": "chemistry",
        "bengali": "রসায়ন",
        "meaning": "The branch of science that deals with the identification of the substances of which matter is composed; the investigation of their properties and the ways in which they interact, combine, and change; and the use of these processes to form new substances.",
        "type": "noun",
        "example": "I am studying chemistry at university.",
        "difficulty": "A2"
    },
    {
        "english": "chest",
        "bengali": "বুক",
        "meaning": "The front surface of a person's or animal's body between the neck and the abdomen.",
        "type": "noun",
        "example": "He has a pain in his chest.",
        "difficulty": "B1"
    },
    {
        "english": "chicken",
        "bengali": "মুরগি",
        "meaning": "A domestic fowl kept for its eggs or meat, especially a young one.",
        "type": "noun",
        "example": "We are having chicken for dinner.",
        "difficulty": "A1"
    },
    {
        "english": "chief",
        "bengali": "প্রধান",
        "meaning": "A leader or ruler of a people or clan.",
        "type": "adjective, noun",
        "example": "He is the chief of the tribe.",
        "difficulty": "B2"
    },
    {
        "english": "child",
        "bengali": "শিশু",
        "meaning": "A young human being below the age of puberty or below the legal age of majority.",
        "type": "noun",
        "example": "She is just a child.",
        "difficulty": "A1"
    },
    {
        "english": "childhood",
        "bengali": "শৈশব",
        "meaning": "The state or period of being a child.",
        "type": "noun",
        "example": "I had a happy childhood.",
        "difficulty": "B1"
    },
    {
        "english": "chip",
        "bengali": "চিপ",
        "meaning": "A small, thin piece of something, especially wood or stone, cut or broken off a larger piece.",
        "type": "noun",
        "example": "I would like a bag of chips.",
        "difficulty": "A2"
    },
    {
        "english": "chocolate",
        "bengali": "চকোলেট",
        "meaning": "A food preparation in the form of a paste or solid block made from roasted and ground cacao seeds, typically sweetened.",
        "type": "noun",
        "example": "I love to eat chocolate.",
        "difficulty": "A1"
    },
    {
        "english": "choice",
        "bengali": "পছন্দ",
        "meaning": "An act of selecting or making a decision when faced with two or more possibilities.",
        "type": "noun",
        "example": "You have a choice between these two cars.",
        "difficulty": "A2"
    },
    {
        "english": "choose",
        "bengali": "পছন্দ করা",
        "meaning": "Pick out or select (someone or something) as being the best or most appropriate of two or more alternatives.",
        "type": "verb",
        "example": "You have to choose which one you want.",
        "difficulty": "A1"
    },
    {
        "english": "church",
        "bengali": "গির্জা",
        "meaning": "A building used for public Christian worship.",
        "type": "noun",
        "example": "We go to church every Sunday.",
        "difficulty": "A2"
    },
    {
        "english": "cigarette",
        "bengali": "সিগারেট",
        "meaning": "A thin cylinder of finely cut tobacco rolled in paper for smoking.",
        "type": "noun",
        "example": "He is smoking a cigarette.",
        "difficulty": "A2"
    },
    {
        "english": "circle",
        "bengali": "বৃত্ত",
        "meaning": "A round plane figure whose boundary (the circumference) consists of points equidistant from a fixed point (the center).",
        "type": "noun, verb",
        "example": "Draw a circle.",
        "difficulty": "A2"
    },
    {
        "english": "circumstance",
        "bengali": "পরিস্থিতি",
        "meaning": "A fact or condition connected with or relevant to an event or action.",
        "type": "noun",
        "example": "The circumstances of his death are not yet known.",
        "difficulty": "B2"
    },
    {
        "english": "cite",
        "bengali": "উদ্ধৃত করা",
        "meaning": "Quote (a passage, book, or author) as evidence for or justification of an argument or statement, especially in a scholarly work.",
        "type": "verb",
        "example": "He cited the Bible in his sermon.",
        "difficulty": "B2"
    },
    {
        "english": "citizen",
        "bengali": "নাগরিক",
        "meaning": "A legally recognized subject or national of a state or commonwealth, either native or naturalized.",
        "type": "noun",
        "example": "He is a citizen of Bangladesh.",
        "difficulty": "B2"
    },
    {
        "english": "city",
        "bengali": "শহর",
        "meaning": "A large town.",
        "type": "noun",
        "example": "Dhaka is a big city.",
        "difficulty": "A1"
    },
    {
        "english": "civil",
        "bengali": "বেসামরিক",
        "meaning": "Relating to ordinary citizens and their concerns, as distinct from military or ecclesiastical matters.",
        "type": "adjective",
        "example": "This is a civil matter, not a criminal one.",
        "difficulty": "B2"
    },
    {
        "english": "claim",
        "bengali": "দাবি",
        "meaning": "State or assert that something is the case, typically without providing evidence or proof.",
        "type": "verb, noun",
        "example": "He claimed that he was innocent.",
        "difficulty": "B1"
    },
    {
        "english": "class",
        "bengali": "শ্রেণী",
        "meaning": "A set or category of things having some property or attribute in common and differentiated from others by kind, type, or quality.",
        "type": "noun",
        "example": "I have a class at 10 am.",
        "difficulty": "A1"
    },
    {
        "english": "classic",
        "bengali": "ক্লাসিক",
        "meaning": "Judged over a period of time to be of the highest quality and outstanding of its kind.",
        "type": "adjective, noun",
        "example": "This is a classic movie.",
        "difficulty": "B2"
    },
    {
        "english": "classical",
        "bengali": "শাস্ত্রীয়",
        "meaning": "Relating to ancient Greek or Latin literature, art, or culture.",
        "type": "adjective",
        "example": "I enjoy listening to classical music.",
        "difficulty": "A2"
    },
    {
        "english": "classroom",
        "bengali": "শ্রেণীকক্ষ",
        "meaning": "A room in which a class of students is taught.",
        "type": "noun",
        "example": "The students are in the classroom.",
        "difficulty": "A1"
    },
    {
        "english": "clause",
        "bengali": "ধারা",
        "meaning": "A unit of grammatical organization next below the sentence in rank and in traditional grammar said to consist of a subject and predicate.",
        "type": "noun",
        "example": "A sentence can have more than one clause.",
        "difficulty": "B1"
    },
    {
        "english": "clean",
        "bengali": "পরিষ্কার",
        "meaning": "Free from dirt, marks, or stains.",
        "type": "adjective, verb",
        "example": "Please clean your room.",
        "difficulty": "A1"
    },
    {
        "english": "clear",
        "bengali": "পরিষ্কার",
        "meaning": "Easy to perceive, understand, or interpret.",
        "type": "adjective, verb",
        "example": "The instructions are very clear.",
        "difficulty": "A2"
    },
    {
        "english": "clearly",
        "bengali": "পরিষ্কারভাবে",
        "meaning": "In a way that is easy to see, hear, read, or understand.",
        "type": "adverb",
        "example": "He spoke very clearly.",
        "difficulty": "A2"
    },
    {
        "english": "clerk",
        "bengali": "কেরানি",
        "meaning": "A person employed in an office or bank to keep records and accounts and to undertake other routine administrative duties.",
        "type": "noun",
        "example": "She works as a clerk in a bank.",
        "difficulty": "A2"
    },
    {
        "english": "clever",
        "bengali": "চালাক",
        "meaning": "Quick to understand, learn, and devise or apply ideas; intelligent.",
        "type": "adjective",
        "example": "He is a clever student.",
        "difficulty": "B1"
    },
    {
        "english": "click",
        "bengali": "ক্লিক করা",
        "meaning": "Make a short, sharp sound as of a switch being operated or of two hard objects coming smartly into contact.",
        "type": "verb, noun",
        "example": "Click on the link to open the website.",
        "difficulty": "B1"
    },
    {
        "english": "client",
        "bengali": "মক্কেল",
        "meaning": "A person or organization using the services of a lawyer or other professional person or company.",
        "type": "noun",
        "example": "The lawyer is meeting with his client.",
        "difficulty": "B1"
    },
    {
        "english": "climate",
        "bengali": "জলবায়ু",
        "meaning": "The weather conditions prevailing in an area in general or over a long period.",
        "type": "noun",
        "example": "The climate in Bangladesh is hot and humid.",
        "difficulty": "A2"
    },
    {
        "english": "climb",
        "bengali": "আরোহণ করা",
        "meaning": "Go or come up (a slope, incline, or staircase), especially by using the feet and sometimes the hands; ascend.",
        "type": "verb, noun",
        "example": "We climbed the mountain.",
        "difficulty": "A1"
    },
    {
        "english": "clock",
        "bengali": "ঘড়ি",
        "meaning": "A mechanical or electrical device for measuring time, indicating hours, minutes, and sometimes seconds by hands on a round dial or by displayed figures.",
        "type": "noun",
        "example": "The clock on the wall is not working.",
        "difficulty": "A1"
    },
    {
        "english": "close (verb)",
        "bengali": "বন্ধ করা",
        "meaning": "Move so as to block an opening.",
        "type": "verb, noun",
        "example": "Please close the door.",
        "difficulty": "A1"
    },
    {
        "english": "close (adjective)",
        "bengali": "কাছাকাছি",
        "meaning": "A short distance away or apart in space or time.",
        "type": "adjective, adverb",
        "example": "The school is close to our house.",
        "difficulty": "A2"
    },
    {
        "english": "closed",
        "bengali": "বন্ধ",
        "meaning": "Not open.",
        "type": "adjective",
        "example": "The shop is closed.",
        "difficulty": "A2"
    },
    {
        "english": "closely",
        "bengali": " ঘনিষ্ঠভাবে",
        "meaning": "With little or no space in between; in a close position.",
        "type": "adverb",
        "example": "The two houses are built closely together.",
        "difficulty": "B2"
    },
    {
        "english": "closet",
        "bengali": "আলমারি",
        "meaning": "A tall cupboard or wardrobe with a door, used for storage.",
        "type": "noun",
        "example": "My clothes are in the closet.",
        "difficulty": "A2"
    },
    {
        "english": "cloth",
        "bengali": "কাপড়",
        "meaning": "Woven or felted fabric made from wool, cotton, or a similar fiber.",
        "type": "noun",
        "example": "She bought some cloth to make a dress.",
        "difficulty": "B1"
    },
    {
        "english": "clothes",
        "bengali": "পোশাক",
        "meaning": "Items worn to cover the body.",
        "type": "noun",
        "example": "I need to buy some new clothes.",
        "difficulty": "A1"
    },
    {
        "english": "clothing",
        "bengali": "বস্ত্র",
        "meaning": "Clothes collectively.",
        "type": "noun",
        "example": "The store sells men's clothing.",
        "difficulty": "A2"
    },
    {
        "english": "cloud",
        "bengali": "মেঘ",
        "meaning": "A visible mass of water droplets or ice crystals suspended in the atmosphere, typically high above the general level of the ground.",
        "type": "noun",
        "example": "The sky is full of clouds.",
        "difficulty": "A2"
    },
    {
        "english": "club",
        "bengali": "ক্লাব",
        "meaning": "An association or organization dedicated to a particular interest or activity.",
        "type": "noun",
        "example": "He is a member of the local tennis club.",
        "difficulty": "A1"
    },
    {
        "english": "clue",
        "bengali": "সূত্র",
        "meaning": "A piece of evidence or information used in the detection of a crime or the solving of a mystery.",
        "type": "noun",
        "example": "The police are looking for clues.",
        "difficulty": "B1"
    },
    {
        "english": "coach",
        "bengali": "প্রশিক্ষক",
        "meaning": "A person who trains or instructs a team or performer.",
        "type": "noun, verb",
        "example": "He is the coach of the national team.",
        "difficulty": "A2"
    },
    {
        "english": "coal",
        "bengali": "কয়লা",
        "meaning": "A combustible black or dark brown rock consisting mainly of carbonized plant matter, found mainly in underground deposits and widely used as fuel.",
        "type": "noun",
        "example": "Coal is a fossil fuel.",
        "difficulty": "B1"
    },
    {
        "english": "coast",
        "bengali": "উপকূল",
        "meaning": "The part of the land adjoining or near the sea.",
        "type": "noun",
        "example": "We drove along the coast.",
        "difficulty": "A2"
    },
    {
        "english": "coat",
        "bengali": "কোট",
        "meaning": "An outer garment worn outdoors, having sleeves and typically extending below the hips.",
        "type": "noun",
        "example": "She was wearing a warm coat.",
        "difficulty": "A1"
    },
    {
        "english": "code",
        "bengali": "কোড",
        "meaning": "A system of words, letters, figures, or other symbols substituted for other words, letters, etc., especially for the purposes of secrecy.",
        "type": "noun",
        "example": "Can you crack the code?",
        "difficulty": "A2"
    },
    {
        "english": "coffee",
        "bengali": "কফি",
        "meaning": "A hot drink made from the roasted and ground seeds (coffee beans) of a tropical shrub.",
        "type": "noun",
        "example": "I drink coffee every morning.",
        "difficulty": "A1"
    },
    {
        "english": "coin",
        "bengali": "মুদ্রা",
        "meaning": "A flat, typically round piece of metal with an official stamp, used as money.",
        "type": "noun",
        "example": "He found a rare coin.",
        "difficulty": "B1"
    },
    {
        "english": "cold",
        "bengali": "ঠান্ডা",
        "meaning": "Of or at a low or relatively low temperature, especially when compared with the human body.",
        "type": "adjective, noun",
        "example": "It's cold outside.",
        "difficulty": "A1"
    },
    {
        "english": "collapse",
        "bengali": "ভেঙ্গে পড়া",
        "meaning": "(of a structure) fall down or in; give way.",
        "type": "verb, noun",
        "example": "The building collapsed after the earthquake.",
        "difficulty": "B2"
    },
    {
        "english": "colleague",
        "bengali": "সহকর্মী",
        "meaning": "A person with whom one works in a profession or business.",
        "type": "noun",
        "example": "She gets along well with her colleagues.",
        "difficulty": "A2"
    },
    {
        "english": "collect",
        "bengali": "সংগ্রহ করা",
        "meaning": "Bring or gather together (a number of things).",
        "type": "verb",
        "example": "He collects stamps.",
        "difficulty": "A2"
    },
    {
        "english": "collection",
        "bengali": "সংগ্রহ",
        "meaning": "The action or process of collecting someone or something.",
        "type": "noun",
        "example": "He has a large collection of old coins.",
        "difficulty": "B1"
    },
    {
        "english": "college",
        "bengali": "কলেজ",
        "meaning": "An educational institution or establishment, in particular one providing higher education or specialized professional or vocational training.",
        "type": "noun",
        "example": "She is going to college next year.",
        "difficulty": "A1"
    },
    {
        "english": "color",
        "bengali": "রঙ",
        "meaning": "The property possessed by an object of producing different sensations on the eye as a result of the way the object reflects or emits light.",
        "type": "noun, verb",
        "example": "What is your favorite color?",
        "difficulty": "A1"
    },
    {
        "english": "colored",
        "bengali": "রঙিন",
        "meaning": "Having a color or colors, especially as opposed to being black, white, or neutral.",
        "type": "adjective",
        "example": "She was wearing a brightly colored dress.",
        "difficulty": "B1"
    },
    {
        "english": "column",
        "bengali": "কলাম",
        "meaning": "An upright pillar, typically cylindrical and made of stone or concrete, supporting an entablature, arch, or other structure or standing alone as a monument.",
        "type": "noun",
        "example": "The article is in the third column.",
        "difficulty": "A2"
    },
    {
        "english": "combination",
        "bengali": "সমাহার",
        "meaning": "A joining or merging of different parts or qualities in which the component elements are individually distinct.",
        "type": "noun",
        "example": "The combination of colors is beautiful.",
        "difficulty": "B2"
    },
    {
        "english": "combine",
        "bengali": "একত্রিত করা",
        "meaning": "Unite; merge.",
        "type": "verb",
        "example": "We need to combine our efforts.",
        "difficulty": "B1"
    },
    {
        "english": "come",
        "bengali": "আসা",
        "meaning": "Move or travel toward or into a place thought of as near or familiar to the speaker.",
        "type": "verb",
        "example": "Please come here.",
        "difficulty": "A1"
    },
    {
        "english": "comedy",
        "bengali": "কমেডি",
        "meaning": "Professional entertainment consisting of jokes and satirical sketches, intended to make an audience laugh.",
        "type": "noun",
        "example": "I enjoy watching comedies.",
        "difficulty": "A2"
    },
    {
        "english": "comfort",
        "bengali": "আরাম",
        "meaning": "A state of physical ease and freedom from pain or constraint.",
        "type": "noun, verb",
        "example": "He lives in comfort.",
        "difficulty": "B2"
    },
    {
        "english": "comfortable",
        "bengali": "আরামদায়ক",
        "meaning": "(especially of clothes or furniture) providing physical ease and relaxation.",
        "type": "adjective",
        "example": "This is a very comfortable chair.",
        "difficulty": "A2"
    },
    {
        "english": "command",
        "bengali": "আদেশ",
        "meaning": "Give an authoritative order.",
        "type": "noun, verb",
        "example": "The officer gave the command to fire.",
        "difficulty": "B2"
    },
    {
        "english": "comment",
        "bengali": "মন্তব্য",
        "meaning": "A verbal or written remark expressing an opinion or reaction.",
        "type": "noun, verb",
        "example": "He made a rude comment.",
        "difficulty": "A2"
    },
    {
        "english": "commercial",
        "bengali": "বাণিজ্যিক",
        "meaning": "Concerned with or engaged in commerce.",
        "type": "adjective, noun",
        "example": "This is a commercial district.",
        "difficulty": "B1"
    },
    {
        "english": "commission",
        "bengali": "কমিশন",
        "meaning": "An instruction, command, or duty given to a person or group of people.",
        "type": "noun, verb",
        "example": "She gets a commission on each sale.",
        "difficulty": "B2"
    },
    {
        "english": "commit",
        "bengali": "অঙ্গীকার করা",
        "meaning": "Perpetrate or carry out (a mistake, crime, or immoral act).",
        "type": "verb",
        "example": "He committed a serious crime.",
        "difficulty": "B1"
    },
    {
        "english": "commitment",
        "bengali": "প্রতিশ্রুতি",
        "meaning": "The state or quality of being dedicated to a cause, activity, etc.",
        "type": "noun",
        "example": "He has a strong commitment to his work.",
        "difficulty": "B2"
    },
    {
        "english": "committee",
        "bengali": "কমিটি",
        "meaning": "A group of people appointed for a specific function, typically consisting of members of a larger group.",
        "type": "noun",
        "example": "The committee will make a decision tomorrow.",
        "difficulty": "B2"
    },
    {
        "english": "common",
        "bengali": "সাধারণ",
        "meaning": "Occurring, found, or done often; prevalent.",
        "type": "adjective",
        "example": "This is a common mistake.",
        "difficulty": "A1"
    },
    {
        "english": "commonly",
        "bengali": "সাধারণত",
        "meaning": "Very often; frequently.",
        "type": "adverb",
        "example": "This word is not commonly used.",
        "difficulty": "B2"
    },
    {
        "english": "communicate",
        "bengali": "যোগাযোগ করা",
        "meaning": "Share or exchange information, news, or ideas.",
        "type": "verb",
        "example": "We need to communicate better.",
        "difficulty": "A2"
    },
    {
        "english": "communication",
        "bengali": "যোগাযোগ",
        "meaning": "The imparting or exchanging of information or news.",
        "type": "noun",
        "example": "Communication is important in any relationship.",
        "difficulty": "B1"
    },
    {
        "english": "community",
        "bengali": "সম্প্রদায়",
        "meaning": "A group of people living in the same place or having a particular characteristic in common.",
        "type": "noun",
        "example": "There is a strong sense of community in this town.",
        "difficulty": "A2"
    },
    {
        "english": "company",
        "bengali": "প্রতিষ্ঠান",
        "meaning": "A commercial business.",
        "type": "noun",
        "example": "He works for a large company.",
        "difficulty": "A1"
    },
    {
        "english": "compare",
        "bengali": "তুলনা করা",
        "meaning": "Estimate, measure, or note the similarity or dissimilarity between.",
        "type": "verb",
        "example": "You can't compare these two things.",
        "difficulty": "A1"
    },
    {
        "english": "comparison",
        "bengali": "তুলনা",
        "meaning": "The act or instance of comparing.",
        "type": "noun",
        "example": "There is no comparison between the two.",
        "difficulty": "B1"
    },
    {
        "english": "compete",
        "bengali": "প্রতিযোগিতা করা",
        "meaning": "Strive to gain or win something by defeating or establishing superiority over others who are trying to do the same.",
        "type": "verb",
        "example": "They are competing for the prize.",
        "difficulty": "A2"
    },
    {
        "english": "competition",
        "bengali": "প্রতিযোগিতা",
        "meaning": "The activity or condition of competing.",
        "type": "noun",
        "example": "There is a lot of competition for jobs.",
        "difficulty": "A2"
    },
    {
        "english": "competitive",
        "bengali": "প্রতিযোগিতামূলক",
        "meaning": "Relating to or characterized by competition.",
        "type": "adjective",
        "example": "He is a very competitive person.",
        "difficulty": "B1"
    },
    {
        "english": "competitor",
        "bengali": "প্রতিযোগী",
        "meaning": "A person who takes part in an athletic contest.",
        "type": "noun",
        "example": "She is a strong competitor.",
        "difficulty": "B1"
    },
    {
        "english": "complain",
        "bengali": "অভিযোগ করা",
        "meaning": "Express dissatisfaction or annoyance about something.",
        "type": "verb",
        "example": "He is always complaining about something.",
        "difficulty": "A2"
    },
    {
        "english": "complaint",
        "bengali": "অভিযোগ",
        "meaning": "A statement that a situation is unsatisfactory or unacceptable.",
        "type": "noun",
        "example": "I have a complaint about the service.",
        "difficulty": "B1"
    },
    {
        "english": "complete",
        "bengali": "সম্পূর্ণ",
        "meaning": "Having all the necessary or appropriate parts.",
        "type": "adjective, verb",
        "example": "Please complete this form.",
        "difficulty": "A1"
    },
    {
        "english": "completely",
        "bengali": "সম্পূর্ণভাবে",
        "meaning": "Totally; utterly.",
        "type": "adverb",
        "example": "I completely forgot about it.",
        "difficulty": "A2"
    },
    {
        "english": "complex",
        "bengali": "জটিল",
        "meaning": "Consisting of many different and connected parts.",
        "type": "adjective, noun",
        "example": "This is a complex problem.",
        "difficulty": "B1"
    },
    {
        "english": "complicated",
        "bengali": "জটিল",
        "meaning": "Consisting of many interconnecting parts or elements; intricate.",
        "type": "adjective",
        "example": "The instructions are too complicated.",
        "difficulty": "B2"
    },
    {
        "english": "component",
        "bengali": "উপাদান",
        "meaning": "A part or element of a larger whole.",
        "type": "noun",
        "example": "The machine is made of many different components.",
        "difficulty": "B2"
    },
    {
        "english": "computer",
        "bengali": "কম্পিউটার",
        "meaning": "An electronic device for storing and processing data, typically in binary form, according to instructions given to it in a variable program.",
        "type": "noun",
        "example": "I have a new computer.",
        "difficulty": "A1"
    },
    {
        "english": "concentrate",
        "bengali": "মনোনিবেশ করা",
        "meaning": "Focus all one's attention on a particular object or activity.",
        "type": "verb",
        "example": "I can't concentrate with all this noise.",
        "difficulty": "B1"
    },
    {
        "english": "concentration",
        "bengali": "মনোযোগ",
        "meaning": "The action or power of focusing one's attention or mental effort.",
        "type": "noun",
        "example": "This work requires a lot of concentration.",
        "difficulty": "B2"
    },
    {
        "english": "concept",
        "bengali": "ধারণা",
        "meaning": "An abstract idea; a general notion.",
        "type": "noun",
        "example": "I don't understand the concept of infinity.",
        "difficulty": "B2"
    },
    {
        "english": "concern",
        "bengali": "উদ্বেগ",
        "meaning": "Relate to; be about.",
        "type": "noun, verb",
        "example": "This is a matter of great concern.",
        "difficulty": "B2"
    },
    {
        "english": "concerned",
        "bengali": "উদ্বিগ্ন",
        "meaning": "Worried, troubled, or anxious.",
        "type": "adjective",
        "example": "I am concerned about your health.",
        "difficulty": "B2"
    },
    {
        "english": "concert",
        "bengali": "কনসার্ট",
        "meaning": "A musical performance given in public, typically by several performers or of several separate compositions.",
        "type": "noun",
        "example": "We are going to a concert tonight.",
        "difficulty": "A1"
    },
    {
        "english": "conclude",
        "bengali": "উপসংহার করা",
        "meaning": "Bring (something) to an end.",
        "type": "verb",
        "example": "The meeting concluded at 5 pm.",
        "difficulty": "B1"
    },
    {
        "english": "conclusion",
        "bengali": "উপসংহার",
        "meaning": "The end or finish of an event or process.",
        "type": "noun",
        "example": "What is your conclusion?",
        "difficulty": "B1"
    },
    {
        "english": "condition",
        "bengali": "শর্ত",
        "meaning": "The state of something with regard to its appearance, quality, or working order.",
        "type": "noun",
        "example": "The car is in good condition.",
        "difficulty": "A2"
    },
    {
        "english": "conduct",
        "bengali": "পরিচালনা করা",
        "meaning": "Organize and carry out.",
        "type": "verb, noun",
        "example": "The police are conducting an investigation.",
        "difficulty": "B2"
    },
    {
        "english": "conference",
        "bengali": "সম্মেলন",
        "meaning": "A formal meeting for discussion.",
        "type": "noun",
        "example": "He is attending a conference in Dhaka.",
        "difficulty": "A2"
    },
    {
        "english": "confidence",
        "bengali": "আত্মবিশ্বাস",
        "meaning": "The feeling or belief that one can rely on someone or something; firm trust.",
        "type": "noun",
        "example": "I have confidence in you.",
        "difficulty": "B2"
    },
    {
        "english": "confident",
        "bengali": "আত্মবিশ্বাসী",
        "meaning": "Feeling or showing confidence in oneself; self-assured.",
        "type": "adjective",
        "example": "She is a confident person.",
        "difficulty": "B1"
    },
    {
        "english": "confirm",
        "bengali": "নিশ্চিত করা",
        "meaning": "Establish the truth or correctness of (something previously believed, suspected, or feared to be the case).",
        "type": "verb",
        "example": "Please confirm your booking.",
        "difficulty": "B1"
    },
    {
        "english": "conflict",
        "bengali": "দ্বন্দ্ব",
        "meaning": "A serious disagreement or argument, typically a protracted one.",
        "type": "noun, verb",
        "example": "There is a lot of conflict between the two countries.",
        "difficulty": "B2"
    },
    {
        "english": "confuse",
        "bengali": "বিভ্রান্ত করা",
        "meaning": "Make (someone) bewildered or perplexed.",
        "type": "verb",
        "example": "Don't confuse me with all these details.",
        "difficulty": "B1"
    },
    {
        "english": "confused",
        "bengali": "বিভ্রান্ত",
        "meaning": "Unable to think clearly; bewildered.",
        "type": "adjective",
        "example": "I am confused about what to do.",
        "difficulty": "B1"
    },
    {
        "english": "confusing",
        "bengali": "বিভ্রান্তিকর",
        "meaning": "Bewildering or perplexing.",
        "type": "adjective",
        "example": "The instructions are very confusing.",
        "difficulty": "B2"
    },
    {
        "english": "congress",
        "bengali": "কংগ্রেস",
        "meaning": "A national legislative body, especially that of the US.",
        "type": "noun",
        "example": "The bill was passed by Congress.",
        "difficulty": "B2"
    },
    {
        "english": "connect",
        "bengali": "সংযুক্ত করা",
        "meaning": "Bring together or into contact so that a real or notional link is established.",
        "type": "verb",
        "example": "The two towns are connected by a bridge.",
        "difficulty": "A2"
    },
    {
        "english": "connected",
        "bengali": "সংযুক্ত",
        "meaning": "Joined or linked together.",
        "type": "adjective",
        "example": "The two rooms are connected by a door.",
        "difficulty": "A2"
    },
    {
        "english": "connection",
        "bengali": "সংযোগ",
        "meaning": "A relationship in which a person, thing, or idea is linked or associated with something else.",
        "type": "noun",
        "example": "There is a connection between smoking and lung cancer.",
        "difficulty": "B1"
    },
    {
        "english": "conscious",
        "bengali": "সচেতন",
        "meaning": "Aware of and responding to one's surroundings; awake.",
        "type": "adjective",
        "example": "He was not conscious when the ambulance arrived.",
        "difficulty": "B2"
    },
    {
        "english": "consequence",
        "bengali": "পরিণাম",
        "meaning": "A result or effect of an action or condition.",
        "type": "noun",
        "example": "He must face the consequences of his actions.",
        "difficulty": "B1"
    },
    {
        "english": "conservative",
        "bengali": "রক্ষণশীল",
        "meaning": "Averse to change or innovation and holding traditional values.",
        "type": "adjective, noun",
        "example": "He has a very conservative outlook on life.",
        "difficulty": "B2"
    },
    {
        "english": "consider",
        "bengali": "বিবেচনা করা",
        "meaning": "Think carefully about (something), typically before making a decision.",
        "type": "verb",
        "example": "Please consider my application.",
        "difficulty": "A2"
    },
    {
        "english": "consideration",
        "bengali": "বিবেচনা",
        "meaning": "Careful thought, typically over a period of time.",
        "type": "noun",
        "example": "After careful consideration, we have decided to accept your offer.",
        "difficulty": "B2"
    },
    {
        "english": "consist",
        "bengali": "গঠিত হওয়া",
        "meaning": "Be composed or made up of.",
        "type": "verb",
        "example": "The team consists of ten members.",
        "difficulty": "B1"
    },
    {
        "english": "consistent",
        "bengali": "সামঞ্জস্যপূর্ণ",
        "meaning": "Acting or done in the same way over time, especially so as to be fair or accurate.",
        "type": "adjective",
        "example": "He is a consistent performer.",
        "difficulty": "B2"
    },
    {
        "english": "constant",
        "bengali": "অবিচলিত",
        "meaning": "Occurring continuously over a period of time.",
        "type": "adjective",
        "example": "He is in constant pain.",
        "difficulty": "B2"
    },
    {
        "english": "constantly",
        "bengali": "ক্রমাগত",
        "meaning": "Continuously over a period of time; always.",
        "type": "adverb",
        "example": "He is constantly complaining.",
        "difficulty": "B2"
    },
    {
        "english": "construct",
        "bengali": "নির্মাণ করা",
        "meaning": "Build or erect (something, typically a building, road, or machine).",
        "type": "verb",
        "example": "They are going to construct a new bridge.",
        "difficulty": "B2"
    },
    {
        "english": "construction",
        "bengali": "নির্মাণ",
        "meaning": "The building of something, typically a large structure.",
        "type": "noun",
        "example": "The construction of the new road will take two years.",
        "difficulty": "B2"
    },
    {
        "english": "consume",
        "bengali": "ভোগ করা",
        "meaning": "Eat, drink, or ingest (food or drink).",
        "type": "verb",
        "example": "The average person consumes a lot of sugar.",
        "difficulty": "B1"
    },
    {
        "english": "consumer",
        "bengali": "ভোক্তা",
        "meaning": "A person who purchases goods and services for personal use.",
        "type": "noun",
        "example": "Consumer demand has increased.",
        "difficulty": "B1"
    },
    {
        "english": "contact",
        "bengali": "যোগাযোগ",
        "meaning": "The state or condition of physical touching.",
        "type": "noun, verb",
        "example": "Please contact me if you have any questions.",
        "difficulty": "B1"
    },
    {
        "english": "contain",
        "bengali": "ধারণ করা",
        "meaning": "Have or hold (someone or something) within.",
        "type": "verb",
        "example": "This box contains a surprise.",
        "difficulty": "A2"
    },
    {
        "english": "container",
        "bengali": "ধারক",
        "meaning": "An object for holding or transporting something.",
        "type": "noun",
        "example": "Please put the food in a container.",
        "difficulty": "B1"
    },
    {
        "english": "contemporary",
        "bengali": "সমসাময়িক",
        "meaning": "Living or occurring at the same time.",
        "type": "adjective, noun",
        "example": "He is a contemporary artist.",
        "difficulty": "B2"
    },
    {
        "english": "content",
        "bengali": "বিষয়বস্তু",
        "meaning": "The things that are held or included in something.",
        "type": "noun",
        "example": "The content of the book is very interesting.",
        "difficulty": "B1"
    },
    {
        "english": "contest",
        "bengali": "প্রতিযোগিতা",
        "meaning": "An event in which people compete for supremacy in a sport, game, or other activity, or in a quality.",
        "type": "noun, verb",
        "example": "She won the beauty contest.",
        "difficulty": "B2"
    },
    {
        "english": "context",
        "bengali": "প্রসঙ্গ",
        "meaning": "The circumstances that form the setting for an event, statement, or idea, and in terms of which it can be fully understood and assessed.",
        "type": "noun",
        "example": "You need to understand the context of the situation.",
        "difficulty": "A2"
    },
    {
        "english": "continent",
        "bengali": "মহাদেশ",
        "meaning": "Any of the world's main continuous expanses of land (Europe, Asia, Africa, North and South America, Australia, Antarctica).",
        "type": "noun",
        "example": "Africa is a continent.",
        "difficulty": "A2"
    },
    {
        "english": "continue",
        "bengali": "চালিয়ে যাওয়া",
        "meaning": "Persist in an activity or process.",
        "type": "verb",
        "example": "Please continue with your work.",
        "difficulty": "A2"
    },
    {
        "english": "continuous",
        "bengali": "অবিরাম",
        "meaning": "Forming an unbroken whole; without interruption.",
        "type": "adjective",
        "example": "The rain has been continuous for hours.",
        "difficulty": "B1"
    },
    {
        "english": "contract",
        "bengali": "চুক্তি",
        "meaning": "A written or spoken agreement, especially one concerning employment, sales, or tenancy, that is intended to be enforceable by law.",
        "type": "noun, verb",
        "example": "They have signed a contract.",
        "difficulty": "B2"
    },
    {
        "english": "contrast",
        "bengali": "বৈসাদৃশ্য",
        "meaning": "The state of being strikingly different from something else, typically something in juxtaposition or close association.",
        "type": "noun, verb",
        "example": "There is a great contrast between the two sisters.",
        "difficulty": "B1"
    },
    {
        "english": "contribute",
        "bengali": "অবদান রাখা",
        "meaning": "Give (something, especially money) in order to help achieve or provide something.",
        "type": "verb",
        "example": "He contributed a lot of money to the charity.",
        "difficulty": "B2"
    },
    {
        "english": "contribution",
        "bengali": "অবদান",
        "meaning": "A gift or payment to a common fund or collection.",
        "type": "noun",
        "example": "He made a significant contribution to science.",
        "difficulty": "B2"
    },
    {
        "english": "control",
        "bengali": "নিয়ন্ত্রণ",
        "meaning": "The power to influence or direct people's behavior or the course of events.",
        "type": "noun, verb",
        "example": "He has no control over his emotions.",
        "difficulty": "A2"
    },
    {
        "english": "convenient",
        "bengali": "সুবিধাজনক",
        "meaning": "Fitting in well with a person's needs, activities, and plans.",
        "type": "adjective",
        "example": "The hotel is in a convenient location.",
        "difficulty": "B1"
    },
    {
        "english": "conversation",
        "bengali": "কথোপকথন",
        "meaning": "A talk, especially an informal one, between two or more people, in which news and ideas are exchanged.",
        "type": "noun",
        "example": "We had a long conversation.",
        "difficulty": "A1"
    },
    {
        "english": "convert",
        "bengali": "রূপান্তর করা",
        "meaning": "Change the form, character, or function of something.",
        "type": "verb",
        "example": "The old factory has been converted into apartments.",
        "difficulty": "B2"
    },
    {
        "english": "convince",
        "bengali": "প্রত্যয়ী করা",
        "meaning": "Cause (someone) to believe firmly in the truth of something.",
        "type": "verb",
        "example": "I convinced him to go to the doctor.",
        "difficulty": "B1"
    },
    {
        "english": "convinced",
        "bengali": "প্রত্যয়ী",
        "meaning": "Completely certain about something.",
        "type": "adjective",
        "example": "I am convinced that he is innocent.",
        "difficulty": "B2"
    },
    {
        "english": "cook",
        "bengali": "রান্না করা",
        "meaning": "Prepare (food, a dish, or a meal) by combining and heating the ingredients in various ways.",
        "type": "verb, noun",
        "example": "My father loves to cook.",
        "difficulty": "A1"
    },
    {
        "english": "cookie",
        "bengali": "বিস্কুট",
        "meaning": "A small sweet baked good, typically crisp, flat, and sweet.",
        "type": "noun",
        "example": "I would like a chocolate chip cookie.",
        "difficulty": "A2"
    },
    {
        "english": "cooking",
        "bengali": "রান্না",
        "meaning": "The practice or skill of preparing food by combining, mixing, and heating ingredients.",
        "type": "noun",
        "example": "She is very good at cooking.",
        "difficulty": "A1"
    },
    {
        "english": "cool",
        "bengali": "ঠান্ডা",
        "meaning": "Of or at a fairly low temperature.",
        "type": "adjective, verb",
        "example": "It's a cool evening.",
        "difficulty": "A1"
    },
    {
        "english": "copy",
        "bengali": "নকল",
        "meaning": "A thing made to be similar or identical to another.",
        "type": "noun, verb",
        "example": "Please make a copy of this document.",
        "difficulty": "A2"
    },
    {
        "english": "core",
        "bengali": "মূল",
        "meaning": "The tough central part of various fruits, containing the seeds.",
        "type": "noun, adjective",
        "example": "The core of the problem is a lack of funding.",
        "difficulty": "B2"
    },
    {
        "english": "corn",
        "bengali": "ভুট্টা",
        "meaning": "A tall annual cereal grass that yields large grains, or kernels, set in rows on a cob.",
        "type": "noun",
        "example": "We are having corn on the cob for dinner.",
        "difficulty": "B1"
    },
    {
        "english": "corner",
        "bengali": "কোণ",
        "meaning": "A place or angle where two or more sides or edges meet.",
        "type": "noun",
        "example": "The shop is on the corner of the street.",
        "difficulty": "A2"
    },
    {
        "english": "corporate",
        "bengali": "কর্পোরেট",
        "meaning": "Relating to a large company or group.",
        "type": "adjective",
        "example": "He works in corporate finance.",
        "difficulty": "B2"
    },
    {
        "english": "correct",
        "bengali": "সঠিক",
        "meaning": "Free from error; in accordance with fact or truth.",
        "type": "adjective, verb",
        "example": "That is the correct answer.",
        "difficulty": "A1"
    },
    {
        "english": "correctly",
        "bengali": "সঠিকভাবে",
        "meaning": "In a way that is true, factual, or appropriate.",
        "type": "adverb",
        "example": "Did I pronounce your name correctly?",
        "difficulty": "A2"
    },
    {
        "english": "cost",
        "bengali": "খরচ",
        "meaning": "(of an object or an action) require the payment of (a specified sum of money) before it can be acquired or done.",
        "type": "noun, verb",
        "example": "How much does this cost?",
        "difficulty": "A1"
    },
    {
        "english": "costume",
        "bengali": "পোশাক",
        "meaning": "A set of clothes in a style typical of a particular country or historical period.",
        "type": "noun",
        "example": "She wore a beautiful costume to the party.",
        "difficulty": "B1"
    },
    {
        "english": "cotton",
        "bengali": "তুলা",
        "meaning": "A soft white fibrous substance that surrounds the seeds of a tropical and subtropical plant and is used as textile fiber and thread for sewing.",
        "type": "noun",
        "example": "This shirt is made of cotton.",
        "difficulty": "B1"
    },
    {
        "english": "could",
        "bengali": "পারত",
        "meaning": "Used as the past tense of can, to indicate possibility.",
        "type": "modal verb",
        "example": "I could swim when I was five.",
        "difficulty": "A1"
    },
    {
        "english": "council",
        "bengali": "পরিষদ",
        "meaning": "An advisory, deliberative, or legislative body of people formally constituted and meeting regularly.",
        "type": "noun",
        "example": "The city council will meet tomorrow.",
        "difficulty": "B2"
    },
    {
        "english": "count",
        "bengali": "গণনা করা",
        "meaning": "Determine the total number of (a collection of items).",
        "type": "verb, noun",
        "example": "Can you count to ten in English?",
        "difficulty": "A2"
    },
    {
        "english": "country",
        "bengali": "দেশ",
        "meaning": "A nation with its own government, occupying a particular territory.",
        "type": "noun",
        "example": "Bangladesh is a beautiful country.",
        "difficulty": "A1"
    },
    {
        "english": "countryside",
        "bengali": " গ্রামাঞ্চল",
        "meaning": "The land and scenery of a rural area.",
        "type": "noun",
        "example": "I love the peace and quiet of the countryside.",
        "difficulty": "B1"
    },
    {
        "english": "county",
        "bengali": "কাউন্টি",
        "meaning": "A geographical region of a country used for administrative or other purposes.",
        "type": "noun",
        "example": "He lives in a rural county.",
        "difficulty": "B2"
    },
    {
        "english": "couple",
        "bengali": "দম্পতি",
        "meaning": "Two people or things of the same sort considered together.",
        "type": "noun",
        "example": "A couple of people were waiting outside.",
        "difficulty": "A2"
    },
    {
        "english": "courage",
        "bengali": "সাহস",
        "meaning": "The ability to do something that frightens one; bravery.",
        "type": "noun",
        "example": "He showed great courage in the face of danger.",
        "difficulty": "B2"
    },
    {
        "english": "course",
        "bengali": "কোর্স",
        "meaning": "A set of classes or a plan of study on a particular subject, usually leading to an exam or qualification.",
        "type": "noun",
        "example": "I am taking a course in English.",
        "difficulty": "A1"
    },
    {
        "english": "court",
        "bengali": "আদালত",
        "meaning": "A body of people presided over by a judge, judges, or magistrate, and acting as a tribunal in civil and criminal cases.",
        "type": "noun",
        "example": "He will appear in court tomorrow.",
        "difficulty": "B1"
    },
    {
        "english": "cousin",
        "bengali": "চাচাতো ভাই/বোন",
        "meaning": "A child of one's uncle or aunt.",
        "type": "noun",
        "example": "My cousin lives in London.",
        "difficulty": "A1"
    },
    {
        "english": "cover",
        "bengali": "আচ্ছাদন",
        "meaning": "Put something such as a cloth or lid on top of or in front of (something) in order to protect or conceal it.",
        "type": "verb, noun",
        "example": "Please cover the food.",
        "difficulty": "A2"
    },
    {
        "english": "covered",
        "bengali": "ঢাকা",
        "meaning": "Put something on top of or in front of (something), especially to protect or conceal it.",
        "type": "adjective",
        "example": "The ground was covered with snow.",
        "difficulty": "B1"
    },
    {
        "english": "cow",
        "bengali": "গরু",
        "meaning": "A fully grown female animal of a domesticated breed of ox, used as a source of milk or beef.",
        "type": "noun",
        "example": "The cow is a sacred animal in India.",
        "difficulty": "A1"
    },
    {
        "english": "crash",
        "bengali": "সংঘর্ষ",
        "meaning": "(of a vehicle) collide violently with an obstacle or another vehicle.",
        "type": "noun, verb",
        "example": "There was a car crash on the highway.",
        "difficulty": "B2"
    },
    {
        "english": "crazy",
        "bengali": "পাগল",
        "meaning": "Mad, especially as manifested in wild or aggressive behavior.",
        "type": "adjective",
        "example": "That's a crazy idea.",
        "difficulty": "A2"
    },
    {
        "english": "cream",
        "bengali": "ক্রিম",
        "meaning": "The thick white or pale yellow fatty liquid which rises to the top when milk is left to stand and which can be consumed as an accompaniment to desserts or used to make butter and cheese.",
        "type": "noun, adjective",
        "example": "I like cream in my coffee.",
        "difficulty": "A1"
    },
    {
        "english": "create",
        "bengali": "তৈরি করা",
        "meaning": "Bring (something) into existence.",
        "type": "verb",
        "example": "She created a beautiful painting.",
        "difficulty": "A1"
    },
    {
        "english": "creation",
        "bengali": "সৃষ্টি",
        "meaning": "The action or process of bringing something into existence.",
        "type": "noun",
        "example": "The creation of the universe is a mystery.",
        "difficulty": "B2"
    },
    {
        "english": "creative",
        "bengali": "সৃজনশীল",
        "meaning": "Relating to or involving the imagination or original ideas, especially in the production of an artistic work.",
        "type": "adjective",
        "example": "She is a very creative person.",
        "difficulty": "A2"
    },
    {
        "english": "creature",
        "bengali": "প্রাণী",
        "meaning": "An animal, as distinct from a human being.",
        "type": "noun",
        "example": "There are many strange creatures in the deep sea.",
        "difficulty": "B2"
    },
    {
        "english": "credit",
        "bengali": "ক্রেডিট",
        "meaning": "The ability of a customer to obtain goods or services before payment, based on the trust that payment will be made in the future.",
        "type": "noun, verb",
        "example": "I bought this on credit.",
        "difficulty": "A2"
    },
    {
        "english": "crew",
        "bengali": "কর্মীদল",
        "meaning": "A group of people who work on and operate a ship, aircraft, etc.",
        "type": "noun",
        "example": "The flight crew was very helpful.",
        "difficulty": "B2"
    },
    {
        "english": "crime",
        "bengali": "অপরাধ",
        "meaning": "An action or omission that constitutes an offense that may be prosecuted by the state and is punishable by law.",
        "type": "noun",
        "example": "He was convicted of a serious crime.",
        "difficulty": "A2"
    },
    {
        "english": "criminal",
        "bengali": "অপরাধী",
        "meaning": "A person who has committed a crime.",
        "type": "noun, adjective",
        "example": "The police are looking for the criminal.",
        "difficulty": "A2"
    },
    {
        "english": "crisis",
        "bengali": "সংকট",
        "meaning": "A time of intense difficulty, trouble, or danger.",
        "type": "noun",
        "example": "The country is facing an economic crisis.",
        "difficulty": "B2"
    },
    {
        "english": "criterion",
        "bengali": "মানদণ্ড",
        "meaning": "A principle or standard by which something may be judged or decided.",
        "type": "noun",
        "example": "What is the main criterion for success?",
        "difficulty": "B2"
    },
    {
        "english": "critic",
        "bengali": "সমালোচক",
        "meaning": "A person who expresses an unfavorable opinion of something.",
        "type": "noun",
        "example": "He is a well-known art critic.",
        "difficulty": "B2"
    },
    {
        "english": "critical",
        "bengali": "সমালোচনামূলক",
        "meaning": "Expressing adverse or disapproving comments or judgments.",
        "type": "adjective",
        "example": "He is very critical of her work.",
        "difficulty": "B2"
    },
    {
        "english": "criticism",
        "bengali": "সমালোচনা",
        "meaning": "The expression of disapproval of someone or something based on perceived faults or mistakes.",
        "type": "noun",
        "example": "She received a lot of criticism for her decision.",
        "difficulty": "B2"
    },
    {
        "english": "criticize",
        "bengali": "সমালোচনা করা",
        "meaning": "Indicate the faults of (someone or something) in a disapproving way.",
        "type": "verb",
        "example": "Don't criticize my work.",
        "difficulty": "B2"
    },
    {
        "english": "crop",
        "bengali": "ফসল",
        "meaning": "A cultivated plant that is grown as food, especially a grain, fruit, or vegetable.",
        "type": "noun",
        "example": "The main crop in this area is rice.",
        "difficulty": "B2"
    },
    {
        "english": "cross",
        "bengali": "অতিক্রম করা",
        "meaning": "Go or extend across or to the other side of (an area, body of water, etc.).",
        "type": "verb, noun",
        "example": "Be careful when you cross the road.",
        "difficulty": "A2"
    },
    {
        "english": "crowd",
        "bengali": "ভিড়",
        "meaning": "A large number of people gathered together in a public place.",
        "type": "noun",
        "example": "There was a large crowd at the concert.",
        "difficulty": "A2"
    },
    {
        "english": "crowded",
        "bengali": "ভিড়",
        "meaning": "(of a space) full of people, leaving little or no room for movement; packed.",
        "type": "adjective",
        "example": "The bus was very crowded.",
        "difficulty": "A2"
    },
    {
        "english": "crucial",
        "bengali": "গুরুত্বপূর্ণ",
        "meaning": "Decisive or critical, especially in the success or failure of something.",
        "type": "adjective",
        "example": "This is a crucial moment in our history.",
        "difficulty": "B2"
    },
    {
        "english": "cruel",
        "bengali": "নিষ্ঠুর",
        "meaning": "Willfully causing pain or suffering to others, or feeling no concern about it.",
        "type": "adjective",
        "example": "He is a cruel man.",
        "difficulty": "B1"
    },
    {
        "english": "cry",
        "bengali": "কাঁদা",
        "meaning": "Shed tears, typically as an expression of distress, pain, or sorrow.",
        "type": "verb, noun",
        "example": "The baby is crying.",
        "difficulty": "A2"
    },
    {
        "english": "cultural",
        "bengali": "সাংস্কৃতিক",
        "meaning": "Relating to the ideas, customs, and social behavior of a society.",
        "type": "adjective",
        "example": "There are many cultural differences between the two countries.",
        "difficulty": "B1"
    },
    {
        "english": "culture",
        "bengali": "সংস্কৃতি",
        "meaning": "The arts and other manifestations of human intellectual achievement regarded collectively.",
        "type": "noun",
        "example": "I am interested in learning about different cultures.",
        "difficulty": "A1"
    },
    {
        "english": "cup",
        "bengali": "কাপ",
        "meaning": "A small bowl-shaped container for drinking from, typically having a handle.",
        "type": "noun",
        "example": "I would like a cup of tea.",
        "difficulty": "A1"
    },
    {
        "english": "cupboard",
        "bengali": "আলমারি",
        "meaning": "A recess or piece of furniture with a door and usually shelves, used for storage.",
        "type": "noun",
        "example": "The plates are in the cupboard.",
        "difficulty": "B1"
    },
    {
        "english": "cure",
        "bengali": "নিরাময়",
        "meaning": "Relieve (a person or animal) of the symptoms of a disease or condition.",
        "type": "verb, noun",
        "example": "There is no cure for the common cold.",
        "difficulty": "B2"
    },
    {
        "english": "curly",
        "bengali": "কোঁকড়া",
        "meaning": "(of hair) having curls or a tendency to curl.",
        "type": "adjective",
        "example": "She has curly hair.",
        "difficulty": "A2"
    },
    {
        "english": "currency",
        "bengali": "মুদ্রা",
        "meaning": "A system of money in general use in a particular country.",
        "type": "noun",
        "example": "The currency of Bangladesh is the taka.",
        "difficulty": "B1"
    },
    {
        "english": "current",
        "bengali": "বর্তমান",
        "meaning": "Belonging to the present time; happening or being used or done now.",
        "type": "adjective, noun",
        "example": "What is the current situation?",
        "difficulty": "B1"
    },
    {
        "english": "currently",
        "bengali": "বর্তমানে",
        "meaning": "At the present time.",
        "type": "adverb",
        "example": "He is currently unemployed.",
        "difficulty": "B1"
    },
    {
        "english": "curtain",
        "bengali": "পর্দা",
        "meaning": "A piece of material suspended at the top to form a screen, typically movable sideways along a rail and found as one of a pair at a window.",
        "type": "noun",
        "example": "Please draw the curtains.",
        "difficulty": "B1"
    },
    {
        "english": "curve",
        "bengali": "বক্ররেখা",
        "meaning": "A line or outline that gradually deviates from being straight for some or all of its length.",
        "type": "noun, verb",
        "example": "The road has a sharp curve.",
        "difficulty": "B2"
    },
    {
        "english": "curved",
        "bengali": "বাঁকা",
        "meaning": "Having the form of a curve; bent.",
        "type": "adjective",
        "example": "The knife has a curved blade.",
        "difficulty": "B2"
    },
    {
        "english": "custom",
        "bengali": "প্রথা",
        "meaning": "A traditional and widely accepted way of behaving or doing something that is specific to a particular society, place, or time.",
        "type": "noun",
        "example": "It is a custom to give gifts on birthdays.",
        "difficulty": "B1"
    },
    {
        "english": "customer",
        "bengali": "গ্রাহক",
        "meaning": "A person or organization that buys goods or services from a store or business.",
        "type": "noun",
        "example": "The customer is always right.",
        "difficulty": "A1"
    },
    {
        "english": "cut",
        "bengali": "কাটা",
        "meaning": "Make an opening, incision, or wound in (something) with a sharp-edged tool or object.",
        "type": "verb, noun",
        "example": "Be careful not to cut yourself.",
        "difficulty": "A1"
    },
    {
        "english": "cycle",
        "bengali": "চক্র",
        "meaning": "A series of events that are regularly repeated in the same order.",
        "type": "noun, verb",
        "example": "The cycle of the seasons.",
        "difficulty": "A2"
    },
    {
        "english": "dad",
        "bengali": "বাবা",
        "meaning": "One's father.",
        "type": "noun",
        "example": "My dad is a doctor.",
        "difficulty": "A1"
    },
    {
        "english": "daily",
        "bengali": "দৈনিক",
        "meaning": "Done, produced, or occurring every day or every weekday.",
        "type": "adjective, adverb",
        "example": "I read the daily newspaper.",
        "difficulty": "A2"
    },
    {
        "english": "damage",
        "bengali": "ক্ষতি",
        "meaning": "Physical harm caused to something in such a way as to impair its value, usefulness, or normal function.",
        "type": "noun, verb",
        "example": "The storm caused a lot of damage.",
        "difficulty": "B1"
    },
    {
        "english": "dance",
        "bengali": "নাচ",
        "meaning": "Move rhythmically to music, typically following a set sequence of steps.",
        "type": "noun, verb",
        "example": "I love to dance.",
        "difficulty": "A1"
    },
    {
        "english": "dancer",
        "bengali": "নৃত্যশিল্পী",
        "meaning": "A person who dances or whose profession is dancing.",
        "type": "noun",
        "example": "She is a professional dancer.",
        "difficulty": "A1"
    },
    {
        "english": "dancing",
        "bengali": "নাচ",
        "meaning": "The activity of dancing for pleasure or in a performance.",
        "type": "noun",
        "example": "Dancing is good exercise.",
        "difficulty": "A1"
    },
    {
        "english": "danger",
        "bengali": "বিপদ",
        "meaning": "The possibility of suffering harm or injury.",
        "type": "noun",
        "example": "There is a danger of fire.",
        "difficulty": "A2"
    },
    {
        "english": "dangerous",
        "bengali": "বিপজ্জনক",
        "meaning": "Able or likely to cause harm or injury.",
        "type": "adjective",
        "example": "This is a dangerous road.",
        "difficulty": "A1"
    },
    {
        "english": "dark",
        "bengali": "অন্ধকার",
        "meaning": "With little or no light.",
        "type": "adjective, noun",
        "example": "It's too dark to see anything.",
        "difficulty": "A1"
    },
    {
        "english": "data",
        "bengali": "উপাত্ত",
        "meaning": "Facts and statistics collected together for reference or analysis.",
        "type": "noun",
        "example": "The company collects data about its customers.",
        "difficulty": "A2"
    },
    {
        "english": "date",
        "bengali": "তারিখ",
        "meaning": "The day of the month or year as specified by a number.",
        "type": "noun, verb",
        "example": "What's the date today?",
        "difficulty": "A1"
    },
    {
        "english": "daughter",
        "bengali": "কন্যা",
        "meaning": "A girl or woman in relation to her parents.",
        "type": "noun",
        "example": "She is my daughter.",
        "difficulty": "A1"
    },
    {
        "english": "day",
        "bengali": "দিন",
        "meaning": "Each of the twenty-four-hour periods, reckoned from one midnight to the next, into which a week, month, or year is divided, and corresponding to a rotation of the earth on its axis.",
        "type": "noun",
        "example": "Today is a beautiful day.",
        "difficulty": "A1"
    },
    {
        "english": "dead",
        "bengali": "মৃত",
        "meaning": "No longer alive.",
        "type": "adjective",
        "example": "The plant is dead.",
        "difficulty": "A2"
    },
    {
        "english": "deal",
        "bengali": "চুক্তি",
        "meaning": "An agreement entered into by two or more parties for their mutual benefit, especially in business or politics.",
        "type": "verb, noun",
        "example": "We made a deal.",
        "difficulty": "A2"
    },
    {
        "english": "dear",
        "bengali": "প্রিয়",
        "meaning": "Regarded with deep affection; cherished by someone.",
        "type": "adjective",
        "example": "She is a dear friend.",
        "difficulty": "A1"
    },
    {
        "english": "death",
        "bengali": "মৃত্যু",
        "meaning": "The action or fact of dying or being killed; the end of the life of a person or organism.",
        "type": "noun",
        "example": "His death was a great shock.",
        "difficulty": "A2"
    },
    {
        "english": "debate",
        "bengali": "বিতর্ক",
        "meaning": "A formal discussion on a particular topic in a public meeting or legislative assembly, in which opposing arguments are put forward.",
        "type": "noun, verb",
        "example": "There was a long debate about the new law.",
        "difficulty": "B2"
    },
    {
        "english": "debt",
        "bengali": "ঋণ",
        "meaning": "A sum of money that is owed or due.",
        "type": "noun",
        "example": "He is in debt.",
        "difficulty": "B2"
    },
    {
        "english": "decade",
        "bengali": "দশক",
        "meaning": "A period of ten years.",
        "type": "noun",
        "example": "He has been working here for a decade.",
        "difficulty": "B1"
    },
    {
        "english": "December",
        "bengali": "ডিসেম্বর",
        "meaning": "The twelfth month of the year, in the northern hemisphere the first month of winter.",
        "type": "noun",
        "example": "Christmas is in December.",
        "difficulty": "A1"
    },
    {
        "english": "decent",
        "bengali": "শালীন",
        "meaning": "Conforming with generally accepted standards of respectable or moral behavior.",
        "type": "adjective",
        "example": "He is a decent person.",
        "difficulty": "B2"
    },
    {
        "english": "decide",
        "bengali": "সিদ্ধান্ত নেওয়া",
        "meaning": "Come to a resolution in the mind as a result of consideration.",
        "type": "verb",
        "example": "I have decided to leave my job.",
        "difficulty": "A1"
    },
    {
        "english": "decision",
        "bengali": "সিদ্ধান্ত",
        "meaning": "A conclusion or resolution reached after consideration.",
        "type": "noun",
        "example": "It was a difficult decision to make.",
        "difficulty": "A2"
    },
    {
        "english": "declare",
        "bengali": "ঘোষণা করা",
        "meaning": "Say something in a solemn and emphatic manner.",
        "type": "verb",
        "example": "The government has declared a state of emergency.",
        "difficulty": "B2"
    },
    {
        "english": "decline",
        "bengali": "পতন",
        "meaning": "(typically of something regarded as good) become smaller, fewer, or less; decrease.",
        "type": "verb, noun",
        "example": "The company's profits have declined.",
        "difficulty": "B2"
    },
    {
        "english": "decrease",
        "bengali": "হ্রাস",
        "meaning": "Make or become smaller or fewer in size, amount, intensity, or degree.",
        "type": "verb, noun",
        "example": "The population has decreased in recent years.",
        "difficulty": "B2"
    },
    {
        "english": "deep",
        "bengali": "গভীর",
        "meaning": "Extending far down from the top or surface.",
        "type": "adjective, adverb",
        "example": "The ocean is very deep.",
        "difficulty": "A2"
    },
    {
        "english": "deeply",
        "bengali": "গভীরভাবে",
        "meaning": "Far down or in.",
        "type": "adverb",
        "example": "He was deeply in debt.",
        "difficulty": "B2"
    },
    {
        "english": "defeat",
        "bengali": "পরাজয়",
        "meaning": "Win a victory over (someone) in a battle or other contest; overcome or beat.",
        "type": "verb, noun",
        "example": "Our team suffered a heavy defeat.",
        "difficulty": "B2"
    },
    {
        "english": "defend",
        "bengali": "রক্ষা করা",
        "meaning": "Resist an attack made on (someone or something); protect from harm or danger.",
        "type": "verb",
        "example": "The soldiers defended the city.",
        "difficulty": "B2"
    },
    {
        "english": "defense",
        "bengali": "প্রতিরক্ষা",
        "meaning": "The action of defending from or resisting attack.",
        "type": "noun",
        "example": "The country has a strong defense system.",
        "difficulty": "B2"
    },
    {
        "english": "define",
        "bengali": "সংজ্ঞায়িত করা",
        "meaning": "State or describe exactly the nature, scope, or meaning of.",
        "type": "verb",
        "example": "Can you define the word 'love'?",
        "difficulty": "B1"
    },
    {
        "english": "definite",
        "bengali": "সুনির্দিষ্ট",
        "meaning": "Clearly stated or decided; not vague or doubtful.",
        "type": "adjective",
        "example": "We need a definite answer by tomorrow.",
        "difficulty": "B1"
    },
    {
        "english": "definitely",
        "bengali": "অবশ্যই",
        "meaning": "Without doubt (used for emphasis).",
        "type": "adverb",
        "example": "I will definitely be there.",
        "difficulty": "A2"
    },
    {
        "english": "definition",
        "bengali": "সংজ্ঞা",
        "meaning": "A statement of the exact meaning of a word, especially in a dictionary.",
        "type": "noun",
        "example": "What is the definition of this word?",
        "difficulty": "B1"
    },
    {
        "english": "degree",
        "bengali": "ডিগ্রী",
        "meaning": "The amount, level, or extent to which something happens or is present.",
        "type": "noun",
        "example": "There is a high degree of risk involved.",
        "difficulty": "A2"
    },
    {
        "english": "delay",
        "bengali": "বিলম্ব",
        "meaning": "Make (someone or something) late or slow.",
        "type": "verb, noun",
        "example": "The flight was delayed due to bad weather.",
        "difficulty": "B2"
    },
    {
        "english": "deliberate",
        "bengali": "ইচ্ছাকৃত",
        "meaning": "Done consciously and intentionally.",
        "type": "adjective",
        "example": "It was a deliberate act of cruelty.",
        "difficulty": "B2"
    },
    {
        "english": "deliberately",
        "bengali": "ইচ্ছাকৃতভাবে",
        "meaning": "Consciously and intentionally; on purpose.",
        "type": "adverb",
        "example": "He deliberately broke the window.",
        "difficulty": "B2"
    },
    {
        "english": "delicious",
        "bengali": "সুস্বাদু",
        "meaning": "Highly pleasant to the taste.",
        "type": "adjective",
        "example": "This cake is delicious.",
        "difficulty": "A1"
    },
    {
        "english": "deliver",
        "bengali": "পৌঁছে দেওয়া",
        "meaning": "Bring and hand over (a letter, parcel, or ordered goods) to the proper recipient or address.",
        "type": "verb",
        "example": "The mailman delivers the mail every day.",
        "difficulty": "B1"
    },
    {
        "english": "delivery",
        "bengali": "বিতরণ",
        "meaning": "The action of delivering letters, packages, or ordered goods.",
        "type": "noun",
        "example": "The delivery will arrive tomorrow.",
        "difficulty": "B2"
    },
    {
        "english": "demand",
        "bengali": "চাহিদা",
        "meaning": "An insistent and peremptory request, made as if by right.",
        "type": "noun, verb",
        "example": "The workers are demanding higher wages.",
        "difficulty": "B2"
    },
    {
        "english": "demonstrate",
        "bengali": "প্রদর্শন করা",
        "meaning": "Clearly show the existence or truth of (something) by giving proof or evidence.",
        "type": "verb",
        "example": "He demonstrated how to use the new machine.",
        "difficulty": "B2"
    },
    {
        "english": "dentist",
        "bengali": "দন্ত চিকিৎসক",
        "meaning": "A person qualified to treat the diseases and conditions that affect the teeth and gums, especially the repair and extraction of teeth and the insertion of artificial ones.",
        "type": "noun",
        "example": "I have an appointment with the dentist.",
        "difficulty": "A2"
    },
    {
        "english": "deny",
        "bengali": "অস্বীকার করা",
        "meaning": "State that one refuses to admit the truth or existence of.",
        "type": "verb",
        "example": "He denied any involvement in the crime.",
        "difficulty": "B2"
    },
    {
        "english": "department",
        "bengali": "বিভাগ",
        "meaning": "A division of a large organization such as a government, university, or business, dealing with a specific area of activity.",
        "type": "noun",
        "example": "She works in the sales department.",
        "difficulty": "A2"
    },
    {
        "english": "departure",
        "bengali": "প্রস্থান",
        "meaning": "The action of leaving, especially to start a journey.",
        "type": "noun",
        "example": "The departure of the train was delayed.",
        "difficulty": "B1"
    },
    {
        "english": "depend",
        "bengali": "নির্ভর করা",
        "meaning": "Be controlled or determined by.",
        "type": "verb",
        "example": "Our success depends on your help.",
        "difficulty": "A2"
    },
    {
        "english": "depressed",
        "bengali": "বিষণ্ণ",
        "meaning": "(of a person) in a state of general unhappiness or despondency.",
        "type": "adjective",
        "example": "She has been depressed since she lost her job.",
        "difficulty": "B2"
    },
    {
        "english": "depressing",
        "bengali": "বিষণ্ণকর",
        "meaning": "Causing a feeling of unhappiness and hopelessness.",
        "type": "adjective",
        "example": "The news was very depressing.",
        "difficulty": "B2"
    },
    {
        "english": "depth",
        "bengali": "গভীরতা",
        "meaning": "The distance from the top or surface of something to its bottom.",
        "type": "noun",
        "example": "What is the depth of the pool?",
        "difficulty": "B2"
    },
    {
        "english": "describe",
        "bengali": "বর্ণনা করা",
        "meaning": "Give a detailed account in words of.",
        "type": "verb",
        "example": "Can you describe the man you saw?",
        "difficulty": "A1"
    },
    {
        "english": "description",
        "bengali": "বর্ণনা",
        "meaning": "A spoken or written representation or account of a person, object, or event.",
        "type": "noun",
        "example": "The police have a description of the suspect.",
        "difficulty": "A1"
    },
    {
        "english": "desert",
        "bengali": "মরুভূমি",
        "meaning": "A barren or desolate area, especially one with little or no vegetation.",
        "type": "noun, verb",
        "example": "The Sahara is a vast desert.",
        "difficulty": "A2"
    },
    {
        "english": "deserve",
        "bengali": "যোগ্য",
        "meaning": "Do something or have or show qualities worthy of (a reaction which rewards or punishes as appropriate).",
        "type": "verb",
        "example": "He deserves to be punished.",
        "difficulty": "B2"
    },
    {
        "english": "design",
        "bengali": "নকশা",
        "meaning": "A plan or drawing produced to show the look and function or workings of a building, garment, or other object before it is built or made.",
        "type": "noun, verb",
        "example": "She designed the new logo.",
        "difficulty": "A1"
    },
    {
        "english": "designer",
        "bengali": "নকশাকার",
        "meaning": "A person who plans the form, look, or workings of something before its being made or built, typically by drawing it in detail.",
        "type": "noun",
        "example": "She is a famous fashion designer.",
        "difficulty": "A2"
    },
    {
        "english": "desire",
        "bengali": "আকাঙ্ক্ষা",
        "meaning": "A strong feeling of wanting to have something or wishing for something to happen.",
        "type": "noun, verb",
        "example": "He has a strong desire for success.",
        "difficulty": "B2"
    },
    {
        "english": "desk",
        "bengali": "ডেস্ক",
        "meaning": "A piece of furniture with a flat table-style work surface used in a school, office, or home.",
        "type": "noun",
        "example": "My books are on the desk.",
        "difficulty": "A1"
    },
    {
        "english": "desperate",
        "bengali": "মরিয়া",
        "meaning": "Feeling, showing, or involving a hopeless sense that a situation is so bad as to be impossible to deal with.",
        "type": "adjective",
        "example": "He was desperate for a job.",
        "difficulty": "B2"
    },
    {
        "english": "despite",
        "bengali": "সত্ত্বেও",
        "meaning": "Without being affected by; in spite of.",
        "type": "preposition",
        "example": "Despite the rain, we went for a walk.",
        "difficulty": "B1"
    },
    {
        "english": "dessert",
        "bengali": "মিষ্টান্ন",
        "meaning": "The sweet course eaten at the end of a meal.",
        "type": "noun",
        "example": "What's for dessert?",
        "difficulty": "A2"
    },
    {
        "english": "destination",
        "bengali": "গন্তব্য",
        "meaning": "The place to which someone or something is going or being sent.",
        "type": "noun",
        "example": "Our final destination is Dhaka.",
        "difficulty": "B1"
    },
    {
        "english": "destroy",
        "bengali": "ধ্বংস করা",
        "meaning": "End the existence of (something) by damaging or attacking it.",
        "type": "verb",
        "example": "The fire destroyed the building.",
        "difficulty": "A2"
    },
    {
        "english": "detail",
        "bengali": "বিস্তারিত",
        "meaning": "An individual feature, fact, or item.",
        "type": "noun, verb",
        "example": "Please give me all the details.",
        "difficulty": "A1"
    },
    {
        "english": "detailed",
        "bengali": "বিস্তারিত",
        "meaning": "Having many details or facts; showing attention to detail.",
        "type": "adjective",
        "example": "He gave a detailed description of the event.",
        "difficulty": "B2"
    },
    {
        "english": "detect",
        "bengali": "শনাক্ত করা",
        "meaning": "Discover or identify the presence or existence of.",
        "type": "verb",
        "example": "The police detected the smell of gas.",
        "difficulty": "B2"
    },
    {
        "english": "detective",
        "bengali": "গোয়েন্দা",
        "meaning": "A person, especially a police officer, whose occupation is to investigate and solve crimes.",
        "type": "noun",
        "example": "Sherlock Holmes is a famous detective.",
        "difficulty": "A2"
    },
    {
        "english": "determine",
        "bengali": "নির্ধারণ করা",
        "meaning": "Cause (something) to occur in a particular way; be the decisive factor in.",
        "type": "verb",
        "example": "The results will determine our future actions.",
        "difficulty": "B1"
    },
    {
        "english": "determined",
        "bengali": "দৃঢ়সংকল্প",
        "meaning": "Having made a firm decision and being resolved not to change it.",
        "type": "adjective",
        "example": "She is determined to succeed.",
        "difficulty": "B1"
    },
    {
        "english": "develop",
        "bengali": "বিকাশ করা",
        "meaning": "Grow or cause to grow and become more mature, advanced, or elaborate.",
        "type": "verb",
        "example": "The company is developing a new product.",
        "difficulty": "A2"
    },
    {
        "english": "development",
        "bengali": "উন্নয়ন",
        "meaning": "The process of developing or being developed.",
        "type": "noun",
        "example": "The development of the country is a priority.",
        "difficulty": "B1"
    },
    {
        "english": "device",
        "bengali": "যন্ত্র",
        "meaning": "A thing made or adapted for a particular purpose, especially a piece of mechanical or electronic equipment.",
        "type": "noun",
        "example": "This is a useful device.",
        "difficulty": "A2"
    },
    {
        "english": "diagram",
        "bengali": "চিত্র",
        "meaning": "A simplified drawing showing the appearance, structure, or workings of something; a schematic representation.",
        "type": "noun",
        "example": "The diagram explains how the machine works.",
        "difficulty": "B1"
    },
    {
        "english": "dialogue",
        "bengali": "সংলাপ",
        "meaning": "Conversation between two or more people as a feature of a book, play, or movie.",
        "type": "noun",
        "example": "The dialogue in the movie was very good.",
        "difficulty": "A1"
    },
    {
        "english": "diamond",
        "bengali": "হীরা",
        "meaning": "A precious stone consisting of a clear and typically colorless crystalline form of pure carbon, the hardest naturally occurring substance.",
        "type": "noun",
        "example": "She was wearing a diamond ring.",
        "difficulty": "B1"
    },
    {
        "english": "diary",
        "bengali": "দিনলিপি",
        "meaning": "A book in which one keeps a daily record of events and experiences.",
        "type": "noun",
        "example": "She writes in her diary every day.",
        "difficulty": "A2"
    },
    {
        "english": "dictionary",
        "bengali": "অভিধান",
        "meaning": "A book or electronic resource that lists the words of a language (typically in alphabetical order) and gives their meaning, or gives the equivalent words in a different language.",
        "type": "noun",
        "example": "You can look up the word in a dictionary.",
        "difficulty": "A1"
    },
    {
        "english": "die",
        "bengali": "মারা যাওয়া",
        "meaning": "(of a person, animal, or plant) stop living.",
        "type": "verb",
        "example": "He died of a heart attack.",
        "difficulty": "A1"
    },
    {
        "english": "diet",
        "bengali": "খাদ্যতালিকা",
        "meaning": "The kinds of food that a person, animal, or community habitually eats.",
        "type": "noun",
        "example": "I am on a diet to lose weight.",
        "difficulty": "A1"
    },
    {
        "english": "difference",
        "bengali": "পার্থক্য",
        "meaning": "A point or way in which people or things are not the same.",
        "type": "noun",
        "example": "There is a big difference between the two.",
        "difficulty": "A1"
    },
    {
        "english": "different",
        "bengali": "ভিন্ন",
        "meaning": "Not the same as another or each other; unlike in nature, form, or quality.",
        "type": "adjective",
        "example": "We have different opinions.",
        "difficulty": "A1"
    },
    {
        "english": "differently",
        "bengali": "ভিন্নভাবে",
        "meaning": "In a way that is not the same as another or as before.",
        "type": "adverb",
        "example": "He thinks differently from me.",
        "difficulty": "A2"
    },
    {
        "english": "difficult",
        "bengali": "কঠিন",
        "meaning": "Needing much effort or skill to accomplish, deal with, or understand.",
        "type": "adjective",
        "example": "This is a difficult question.",
        "difficulty": "A1"
    },
    {
        "english": "difficulty",
        "bengali": "অসুবিধা",
        "meaning": "The state or condition of being difficult.",
        "type": "noun",
        "example": "He has difficulty in breathing.",
        "difficulty": "B1"
    },
    {
        "english": "dig",
        "bengali": "খনন করা",
        "meaning": "Break up and move earth with a tool or machine, or with hands, paws, snout, etc.",
        "type": "verb",
        "example": "The dog is digging a hole.",
        "difficulty": "B2"
    },
    {
        "english": "digital",
        "bengali": "ডিজিটাল",
        "meaning": "(of a clock or watch) showing the time by means of displayed digits rather than hands or a pointer.",
        "type": "adjective",
        "example": "I have a digital camera.",
        "difficulty": "A2"
    },
    {
        "english": "dinner",
        "bengali": "রাতের খাবার",
        "meaning": "The main meal of the day, taken either around midday or in the evening.",
        "type": "noun",
        "example": "What's for dinner?",
        "difficulty": "A1"
    },
    {
        "english": "direct",
        "bengali": "সরাসরি",
        "meaning": "Extending or moving from one place to another by the shortest way without changing direction or stopping.",
        "type": "adjective, verb, adverb",
        "example": "This is a direct flight to Dhaka.",
        "difficulty": "A2"
    },
    {
        "english": "direction",
        "bengali": "দিক",
        "meaning": "A course along which someone or something moves.",
        "type": "noun",
        "example": "Which direction did he go?",
        "difficulty": "A2"
    },
    {
        "english": "directly",
        "bengali": "সরাসরি",
        "meaning": "Without changing direction or stopping.",
        "type": "adverb",
        "example": "The bus goes directly to the airport.",
        "difficulty": "B1"
    },
    {
        "english": "director",
        "bengali": "পরিচালক",
        "meaning": "A person who is in charge of an activity, department, or organization.",
        "type": "noun",
        "example": "He is the director of the company.",
        "difficulty": "A2"
    },
    {
        "english": "dirt",
        "bengali": "ময়লা",
        "meaning": "A substance, such as mud or dust, that soils someone or something.",
        "type": "noun",
        "example": "There is a lot of dirt on the floor.",
        "difficulty": "B1"
    },
    {
        "english": "dirty",
        "bengali": "নোংরা",
        "meaning": "Covered or marked with an unclean substance.",
        "type": "adjective",
        "example": "Your hands are dirty.",
        "difficulty": "A1"
    },
    {
        "english": "disadvantage",
        "bengali": "অসুবিধা",
        "meaning": "An unfavorable circumstance or condition that reduces the chances of success or effectiveness.",
        "type": "noun",
        "example": "The main disadvantage of this car is its high fuel consumption.",
        "difficulty": "B1"
    },
    {
        "english": "disagree",
        "bengali": "অসম্মত",
        "meaning": "Have or express a different opinion.",
        "type": "verb",
        "example": "I disagree with you.",
        "difficulty": "A2"
    },
    {
        "english": "disappear",
        "bengali": "অদৃশ্য হয়ে যাওয়া",
        "meaning": "Cease to be visible.",
        "type": "verb",
        "example": "The sun disappeared behind the clouds.",
        "difficulty": "A2"
    },
    {
        "english": "disappointed",
        "bengali": "হতাশ",
        "meaning": "Sad or displeased because someone or something has failed to fulfill one's hopes or expectations.",
        "type": "adjective",
        "example": "I was disappointed with my exam results.",
        "difficulty": "B1"
    },
    {
        "english": "disappointing",
        "bengali": "হতাশাজনক",
        "meaning": "Failing to fulfill someone's hopes or expectations.",
        "type": "adjective",
        "example": "The movie was very disappointing.",
        "difficulty": "B1"
    },
    {
        "english": "disaster",
        "bengali": "বিপর্যয়",
        "meaning": "A sudden event, such as an accident or a natural catastrophe, that causes great damage or loss of life.",
        "type": "noun",
        "example": "The earthquake was a terrible disaster.",
        "difficulty": "A2"
    },
    {
        "english": "discipline",
        "bengali": "শৃঙ্খলা",
        "meaning": "The practice of training people to obey rules or a code of behavior, using punishment to correct disobedience.",
        "type": "noun",
        "example": "He needs more discipline.",
        "difficulty": "B2"
    },
    {
        "english": "discount",
        "bengali": "ছাড়",
        "meaning": "A deduction from the usual cost of something.",
        "type": "noun, verb",
        "example": "They are offering a 10% discount.",
        "difficulty": "B1"
    },
    {
        "english": "discover",
        "bengali": "আবিষ্কার করা",
        "meaning": "Find unexpectedly or during a search.",
        "type": "verb",
        "example": "Columbus discovered America.",
        "difficulty": "A2"
    },
    {
        "english": "discovery",
        "bengali": "আবিষ্কার",
        "meaning": "The action or process of discovering or being discovered.",
        "type": "noun",
        "example": "The discovery of penicillin was a major breakthrough.",
        "difficulty": "A2"
    },
    {
        "english": "discuss",
        "bengali": "আলোচনা করা",
        "meaning": "Talk about (something) with another person or group of people.",
        "type": "verb",
        "example": "We need to discuss this matter.",
        "difficulty": "A1"
    },
    {
        "english": "discussion",
        "bengali": "আলোচনা",
        "meaning": "The action or process of talking about something in order to reach a decision or to exchange ideas.",
        "type": "noun",
        "example": "We had a long discussion.",
        "difficulty": "A2"
    },
    {
        "english": "disease",
        "bengali": "রোগ",
        "meaning": "A disorder of structure or function in a human, animal, or plant, especially one that produces specific signs or symptoms or that affects a specific location and is not simply a direct result of physical injury.",
        "type": "noun",
        "example": "He is suffering from a rare disease.",
        "difficulty": "A2"
    },
    {
        "english": "dish",
        "bengali": "থালা",
        "meaning": "A flat-bottomed container for holding food, typically made of china, earthenware, or metal.",
        "type": "noun",
        "example": "This is my favorite dish.",
        "difficulty": "A1"
    },
    {
        "english": "dishonest",
        "bengali": "অসৎ",
        "meaning": "Behaving or prone to behave in an untrustworthy, deceitful, or insincere way.",
        "type": "adjective",
        "example": "He is a dishonest person.",
        "difficulty": "B2"
    },
    {
        "english": "disk",
        "bengali": "ডিস্ক",
        "meaning": "A flat, thin, round object.",
        "type": "noun",
        "example": "I have a lot of music on this disk.",
        "difficulty": "B2"
    },
    {
        "english": "dislike",
        "bengali": "অপছন্দ",
        "meaning": "Feel distaste for or hostility toward.",
        "type": "verb, noun",
        "example": "I dislike cold weather.",
        "difficulty": "B1"
    },
    {
        "english": "dismiss",
        "bengali": "খারিজ করা",
        "meaning": "Order or allow to leave; send away.",
        "type": "verb",
        "example": "The teacher dismissed the class.",
        "difficulty": "B2"
    },
    {
        "english": "display",
        "bengali": "প্রদর্শন",
        "meaning": "Put (something) in a prominent place in order that it may readily be seen.",
        "type": "verb, noun",
        "example": "The museum has a display of ancient artifacts.",
        "difficulty": "B2"
    },
    {
        "english": "distance",
        "bengali": "দূরত্ব",
        "meaning": "The length of the space between two points.",
        "type": "noun",
        "example": "What is the distance between Dhaka and Chittagong?",
        "difficulty": "A2"
    },
    {
        "english": "distribute",
        "bengali": "বিতরণ করা",
        "meaning": "Give shares of (something); deal out.",
        "type": "verb",
        "example": "The charity will distribute food to the poor.",
        "difficulty": "B2"
    },
    {
        "english": "distribution",
        "bengali": "বিতরণ",
        "meaning": "The action of sharing something out among a number of recipients.",
        "type": "noun",
        "example": "The distribution of wealth is unequal.",
        "difficulty": "B2"
    },
    {
        "english": "district",
        "bengali": "জেলা",
        "meaning": "An area of a country or city, especially one characterized by a particular feature or activity.",
        "type": "noun",
        "example": "This is a residential district.",
        "difficulty": "B1"
    },
    {
        "english": "divide",
        "bengali": "ভাগ করা",
        "meaning": "Separate or be separated into parts.",
        "type": "verb, noun",
        "example": "You can divide the cake into four pieces.",
        "difficulty": "B1"
    },
    {
        "english": "division",
        "bengali": "বিভাগ",
        "meaning": "The action of separating something into parts or the process of being separated.",
        "type": "noun",
        "example": "The division of the company into smaller units.",
        "difficulty": "B2"
    },
    {
        "english": "divorced",
        "bengali": "বিবাহবিচ্ছেদ",
        "meaning": "Legally dissolved from a marriage.",
        "type": "adjective",
        "example": "She is divorced.",
        "difficulty": "A2"
    },
    {
        "english": "do",
        "bengali": "করা",
        "meaning": "Perform (an action, the precise nature of which is often unspecified).",
        "type": "verb, auxiliary verb",
        "example": "What are you doing?",
        "difficulty": "A1"
    },
    {
        "english": "doctor",
        "bengali": "ডাক্তার",
        "meaning": "A person who is qualified to treat people who are ill.",
        "type": "noun",
        "example": "I need to see a doctor.",
        "difficulty": "A1"
    },
    {
        "english": "document",
        "bengali": "নথি",
        "meaning": "A piece of written, printed, or electronic matter that provides information or evidence or that serves as an official record.",
        "type": "noun, verb",
        "example": "Please sign this document.",
        "difficulty": "A2"
    },
    {
        "english": "documentary",
        "bengali": "প্রামাণ্যচিত্র",
        "meaning": "A movie or a television or radio program that provides a factual record or report.",
        "type": "noun",
        "example": "I watched a documentary about wildlife.",
        "difficulty": "B1"
    },
    {
        "english": "dog",
        "bengali": "কুকুর",
        "meaning": "A domesticated carnivorous mammal that typically has a long snout, an acute sense of smell, nonretractable claws, and a barking, howling, or whining voice.",
        "type": "noun",
        "example": "My dog loves to play fetch.",
        "difficulty": "A1"
    },
    {
        "english": "dollar",
        "bengali": "ডলার",
        "meaning": "The basic monetary unit of the US, Canada, Australia, and other countries.",
        "type": "noun",
        "example": "This costs ten dollars.",
        "difficulty": "A1"
    },
    {
        "english": "domestic",
        "bengali": "গার্হস্থ্য",
        "meaning": "Relating to the running of a home or to family relations.",
        "type": "adjective",
        "example": "She is interested in domestic chores.",
        "difficulty": "B2"
    },
    {
        "english": "dominate",
        "bengali": "আধিপত্য করা",
        "meaning": "Have a commanding influence on; exercise control over.",
        "type": "verb",
        "example": "The larger company dominates the market.",
        "difficulty": "B2"
    },
    {
        "english": "donate",
        "bengali": "দান করা",
        "meaning": "Give (money or goods) for a good cause, for example to a charity.",
        "type": "verb",
        "example": "He donated a large sum of money to the hospital.",
        "difficulty": "B1"
    },
    {
        "english": "door",
        "bengali": "দরজা",
        "meaning": "A hinged, sliding, or revolving barrier at the entrance to a building, room, or vehicle, or in the framework of a cupboard.",
        "type": "noun",
        "example": "Please close the door.",
        "difficulty": "A1"
    },
    {
        "english": "double",
        "bengali": "দ্বিগুণ",
        "meaning": "Consisting of two equal, identical, or similar parts or things.",
        "type": "adjective, determiner, pronoun, verb, adverb",
        "example": "I would like a double room, please.",
        "difficulty": "A2"
    },
    {
        "english": "doubt",
        "bengali": "সন্দেহ",
        "meaning": "A feeling of uncertainty or lack of conviction.",
        "type": "noun, verb",
        "example": "I have some doubts about his story.",
        "difficulty": "B1"
    },
    {
        "english": "down",
        "bengali": "নিচে",
        "meaning": "Toward or in a lower place or position, especially to or on the ground or another surface.",
        "type": "adverb, preposition",
        "example": "He fell down the stairs.",
        "difficulty": "A1"
    },
    {
        "english": "download",
        "bengali": "ডাউনলোড",
        "meaning": "Copy (data) from one computer system to another, typically over the Internet.",
        "type": "verb, noun",
        "example": "You can download the file from our website.",
        "difficulty": "A2"
    },
    {
        "english": "downstairs",
        "bengali": "নিচতলা",
        "meaning": "Down the stairs; on or to a lower floor.",
        "type": "adverb, adjective",
        "example": "The kitchen is downstairs.",
        "difficulty": "A1"
    },
    {
        "english": "downtown",
        "bengali": "ডাউনটাউন",
        "meaning": "In, to, or toward the central part of a city.",
        "type": "adverb, noun, adjective",
        "example": "Let's go downtown for dinner.",
        "difficulty": "A2"
    },
    {
        "english": "downward",
        "bengali": "নিম্নগামী",
        "meaning": "Toward a lower place, point, or level.",
        "type": "adjective, adverb",
        "example": "The path leads downward to the river.",
        "difficulty": "B2"
    },
    {
        "english": "dozen",
        "bengali": "ডজন",
        "meaning": "A group or set of twelve.",
        "type": "noun, determiner",
        "example": "I bought a dozen eggs.",
        "difficulty": "B2"
    },
    {
        "english": "draft",
        "bengali": "খসড়া",
        "meaning": "A preliminary version of a piece of writing.",
        "type": "noun, verb",
        "example": "I've written a first draft of my essay.",
        "difficulty": "B2"
    },
    {
        "english": "drag",
        "bengali": "টানা",
        "meaning": "Pull (someone or something) along forcefully, roughly, or with difficulty.",
        "type": "verb",
        "example": "He dragged the heavy suitcase across the floor.",
        "difficulty": "B2"
    },
    {
        "english": "drama",
        "bengali": "নাটক",
        "meaning": "A play for theater, radio, or television.",
        "type": "noun",
        "example": "She is studying drama at university.",
        "difficulty": "A2"
    },
    {
        "english": "dramatic",
        "bengali": "নাটকীয়",
        "meaning": "Relating to drama or the performance or study of drama.",
        "type": "adjective",
        "example": "There has been a dramatic increase in prices.",
        "difficulty": "B2"
    },
    {
        "english": "draw",
        "bengali": "আঁকা",
        "meaning": "Produce (a picture or diagram) by making lines and marks, especially with a pen, pencil, or crayon, on a surface.",
        "type": "verb",
        "example": "She can draw very well.",
        "difficulty": "A1"
    },
    {
        "english": "drawing",
        "bengali": "অঙ্কন",
        "meaning": "A picture or diagram made with a pencil, pen, or crayon rather than paint.",
        "type": "noun",
        "example": "He has a talent for drawing.",
        "difficulty": "A2"
    },
    {
        "english": "dream",
        "bengali": "স্বপ্ন",
        "meaning": "A series of thoughts, images, and sensations occurring in a person's mind during sleep.",
        "type": "noun, verb",
        "example": "I had a strange dream last night.",
        "difficulty": "A2"
    },
    {
        "english": "dress",
        "bengali": "পোশাক",
        "meaning": "Put on one's clothes.",
        "type": "noun, verb",
        "example": "She wore a beautiful dress to the party.",
        "difficulty": "A1"
    },
    {
        "english": "dressed",
        "bengali": "পোশাক পরা",
        "meaning": "Wearing clothes of a specified type.",
        "type": "adjective",
        "example": "She was dressed in black.",
        "difficulty": "B1"
    },
    {
        "english": "drink",
        "bengali": "পান করা",
        "meaning": "Take (a liquid) into the mouth and swallow.",
        "type": "noun, verb",
        "example": "What would you like to drink?",
        "difficulty": "A1"
    },
    {
        "english": "drive",
        "bengali": "চালানো",
        "meaning": "Operate and control the direction and speed of a motor vehicle.",
        "type": "verb, noun",
        "example": "I can drive a car.",
        "difficulty": "A1"
    },
    {
        "english": "driver",
        "bengali": "চালক",
        "meaning": "A person who drives a vehicle.",
        "type": "noun",
        "example": "He is a bus driver.",
        "difficulty": "A1"
    },
    {
        "english": "driving",
        "bengali": "চালনা",
        "meaning": "The control and operation of a motor vehicle.",
        "type": "noun",
        "example": "Driving in the city is very difficult.",
        "difficulty": "A2"
    },
    {
        "english": "drop",
        "bengali": "ফেলে দেওয়া",
        "meaning": "Let or make (something) fall vertically.",
        "type": "verb, noun",
        "example": "Be careful not to drop the glass.",
        "difficulty": "A2"
    },
    {
        "english": "drug",
        "bengali": "ঔষধ",
        "meaning": "A medicine or other substance which has a physiological effect when ingested or otherwise introduced into the body.",
        "type": "noun",
        "example": "He is taking drugs for his illness.",
        "difficulty": "A2"
    },
    {
        "english": "drum",
        "bengali": "ঢোল",
        "meaning": "A percussion instrument sounded by being struck with sticks or the hands, typically cylindrical, barrel-shaped, or bowl-shaped with a taut membrane over one or both ends.",
        "type": "noun",
        "example": "He plays the drums in a band.",
        "difficulty": "B1"
    },
    {
        "english": "drunk",
        "bengali": "মাতাল",
        "meaning": "Affected by alcohol to the extent of losing control of one's faculties or behavior.",
        "type": "adjective",
        "example": "He was drunk and disorderly.",
        "difficulty": "B1"
    },
    {
        "english": "dry",
        "bengali": "শুকনো",
        "meaning": "Free from moisture or liquid; not wet or damp.",
        "type": "adjective, verb",
        "example": "The clothes are dry.",
        "difficulty": "A2"
    },
    {
        "english": "due",
        "bengali": "প্রাপ্য",
        "meaning": "Expected at or planned for at a certain time.",
        "type": "adjective",
        "example": "The rent is due tomorrow.",
        "difficulty": "B1"
    },
    {
        "english": "during",
        "bengali": "সময়",
        "meaning": "Throughout the course or duration of (a period of time).",
        "type": "preposition",
        "example": "I will be on holiday during August.",
        "difficulty": "A1"
    },
    {
        "english": "dust",
        "bengali": "ধুলা",
        "meaning": "Fine, dry powder consisting of tiny particles of earth or waste matter lying on the ground or on surfaces or carried in the air.",
        "type": "noun",
        "example": "The furniture was covered in dust.",
        "difficulty": "B1"
    },
    {
        "english": "duty",
        "bengali": "কর্তব্য",
        "meaning": "A moral or legal obligation; a responsibility.",
        "type": "noun",
        "example": "It is my duty to help you.",
        "difficulty": "B1"
    },
    {
        "english": "DVD",
        "bengali": "ডিভিডি",
        "meaning": "A type of compact disc able to store large amounts of data, especially high-resolution audiovisual material.",
        "type": "noun",
        "example": "I watched a DVD last night.",
        "difficulty": "A1"
    },
    {
        "english": "each",
        "bengali": "প্রতিটি",
        "meaning": "Used to refer to every one of two or more people or things, regarded and identified separately.",
        "type": "determiner, pronoun, adverb",
        "example": "Each student has a book.",
        "difficulty": "A1"
    },
    {
        "english": "ear",
        "bengali": "কান",
        "meaning": "The organ of hearing and balance in humans and other vertebrates, especially the external part of this.",
        "type": "noun",
        "example": "I have a pain in my ear.",
        "difficulty": "A1"
    },
    {
        "english": "early",
        "bengali": "তাড়াতাড়ি",
        "meaning": "Happening or done before the usual or expected time.",
        "type": "adjective, adverb",
        "example": "I got up early this morning.",
        "difficulty": "A1"
    },
    {
        "english": "earn",
        "bengali": "উপার্জন করা",
        "meaning": "Obtain (money) in return for labor or services.",
        "type": "verb",
        "example": "How much do you earn?",
        "difficulty": "A2"
    },
    {
        "english": "earth",
        "bengali": "পৃথিবী",
        "meaning": "The planet on which we live; the world.",
        "type": "noun",
        "example": "The earth is a beautiful planet.",
        "difficulty": "A2"
    },
    {
        "english": "earthquake",
        "bengali": "ভূমিকম্প",
        "meaning": "A sudden violent shaking of the ground, typically causing great destruction, as a result of movements within the earth's crust or volcanic action.",
        "type": "noun",
        "example": "There was a major earthquake in Japan.",
        "difficulty": "B1"
    },
    {
        "english": "easily",
        "bengali": "সহজে",
        "meaning": "Without difficulty or effort.",
        "type": "adverb",
        "example": "I can do it easily.",
        "difficulty": "A2"
    },
    {
        "english": "east",
        "bengali": "পূর্ব",
        "meaning": "The direction toward the point of the horizon where the sun rises at the equinoxes, on the right-hand side of a person facing north, or the point on the horizon itself.",
        "type": "noun, adjective, adverb",
        "example": "The sun rises in the east.",
        "difficulty": "A1"
    },
    {
        "english": "eastern",
        "bengali": "পূর্বাঞ্চলীয়",
        "meaning": "Situated in, directed toward, or facing the east.",
        "type": "adjective",
        "example": "He lives in the eastern part of the country.",
        "difficulty": "B1"
    },
    {
        "english": "easy",
        "bengali": "সহজ",
        "meaning": "Achieved without great effort; presenting few difficulties.",
        "type": "adjective",
        "example": "This is an easy question.",
        "difficulty": "A1"
    },
    {
        "english": "eat",
        "bengali": "খাওয়া",
        "meaning": "Put (food) into the mouth and chew and swallow it.",
        "type": "verb",
        "example": "What do you want to eat?",
        "difficulty": "A1"
    },
    {
        "english": "economic",
        "bengali": "অর্থনৈতিক",
        "meaning": "Relating to economics or the economy.",
        "type": "adjective",
        "example": "The country is facing an economic crisis.",
        "difficulty": "B1"
    },
    {
        "english": "economy",
        "bengali": "অর্থনীতি",
        "meaning": "The state of a country or region in terms of the production and consumption of goods and services and the supply of money.",
        "type": "noun",
        "example": "The country has a strong economy.",
        "difficulty": "B1"
    },
    {
        "english": "edge",
        "bengali": "প্রান্ত",
        "meaning": "The outside limit of an object, area, or surface.",
        "type": "noun",
        "example": "He sat on the edge of the bed.",
        "difficulty": "B1"
    },
    {
        "english": "edit",
        "bengali": "সম্পাদনা করা",
        "meaning": "Prepare (written material) for publication by correcting, condensing, or otherwise modifying it.",
        "type": "verb",
        "example": "I need to edit this document.",
        "difficulty": "B2"
    },
    {
        "english": "edition",
        "bengali": "সংস্করণ",
        "meaning": "A particular form or version of a published text.",
        "type": "noun",
        "example": "This is the second edition of the book.",
        "difficulty": "B2"
    },
    {
        "english": "editor",
        "bengali": "সম্পাদক",
        "meaning": "A person who is in charge of and determines the final content of a text, particularly a newspaper or magazine.",
        "type": "noun",
        "example": "He is the editor of a famous magazine.",
        "difficulty": "B1"
    },
    {
        "english": "educate",
        "bengali": "শিক্ষিত করা",
        "meaning": "Give intellectual, moral, and social instruction to (someone), typically at a school or university.",
        "type": "verb",
        "example": "It is important to educate children about the dangers of drugs.",
        "difficulty": "B1"
    },
    {
        "english": "educated",
        "bengali": "শিক্ষিত",
        "meaning": "Having been educated.",
        "type": "adjective",
        "example": "She is a highly educated woman.",
        "difficulty": "B1"
    },
    {
        "english": "education",
        "bengali": "শিক্ষা",
        "meaning": "The process of receiving or giving systematic instruction, especially at a school or university.",
        "type": "noun",
        "example": "Education is very important.",
        "difficulty": "A2"
    },
    {
        "english": "educational",
        "bengali": "শিক্ষামূলক",
        "meaning": "Relating to the provision of education.",
        "type": "adjective",
        "example": "This is an educational program.",
        "difficulty": "B1"
    },
    {
        "english": "effect",
        "bengali": "প্রভাব",
        "meaning": "A change which is a consequence or result of an action or other cause.",
        "type": "noun",
        "example": "The medicine had a strong effect.",
        "difficulty": "A2"
    },
    {
        "english": "effective",
        "bengali": "কার্যকর",
        "meaning": "Successful in producing a desired or intended result.",
        "type": "adjective",
        "example": "This is a very effective medicine.",
        "difficulty": "B1"
    },
    {
        "english": "effectively",
        "bengali": "কার্যকরভাবে",
        "meaning": "In such a manner as to achieve a desired result.",
        "type": "adverb",
        "example": "We need to use our time effectively.",
        "difficulty": "B1"
    },
    {
        "english": "efficient",
        "bengali": "দক্ষ",
        "meaning": "(especially of a system or machine) achieving maximum productivity with minimum wasted effort or expense.",
        "type": "adjective",
        "example": "This is a very efficient machine.",
        "difficulty": "B2"
    },
    {
        "english": "effort",
        "bengali": "প্রচেষ্টা",
        "meaning": "A vigorous or determined attempt.",
        "type": "noun",
        "example": "He made a great effort to finish the race.",
        "difficulty": "B1"
    },
    {
        "english": "egg",
        "bengali": "ডিম",
        "meaning": "An oval or round object laid by female birds, reptiles, amphibians, fish, and insects, containing the developing embryo.",
        "type": "noun",
        "example": "I had a boiled egg for breakfast.",
        "difficulty": "A1"
    },
    {
        "english": "eight",
        "bengali": "আট",
        "meaning": "Equivalent to the product of two and four; one more than seven, or two less than ten; 8.",
        "type": "number",
        "example": "There are eight people in my family.",
        "difficulty": "A1"
    },
    {
        "english": "eighteen",
        "bengali": "আঠারো",
        "meaning": "Equivalent to the product of two and nine; one more than seventeen, or two less than twenty; 18.",
        "type": "number",
        "example": "She is eighteen years old.",
        "difficulty": "A1"
    },
    {
        "english": "eighty",
        "bengali": "আশি",
        "meaning": "The number equivalent to the product of eight and ten; ten less than ninety; 80.",
        "type": "number",
        "example": "My grandfather is eighty years old.",
        "difficulty": "A1"
    },
    {
        "english": "either",
        "bengali": "হয়",
        "meaning": "Used before the first of two (or occasionally more) alternatives that are being specified (the other being introduced by ‘or’).",
        "type": "determiner, pronoun, adverb",
        "example": "You can have either tea or coffee.",
        "difficulty": "A2"
    },
    {
        "english": "elderly",
        "bengali": "বয়স্ক",
        "meaning": "(of a person) old or aging.",
        "type": "adjective",
        "example": "She takes care of her elderly parents.",
        "difficulty": "B2"
    },
    {
        "english": "elect",
        "bengali": "নির্বাচিত করা",
        "meaning": "Choose (someone) to hold public office or some other position by voting.",
        "type": "verb",
        "example": "The people will elect a new president.",
        "difficulty": "B2"
    },
    {
        "english": "election",
        "bengali": "নির্বাচন",
        "meaning": "A formal and organized choice by vote of a person for a political office or other position.",
        "type": "noun",
        "example": "The country will hold an election next year.",
        "difficulty": "B1"
    },
    {
        "english": "electric",
        "bengali": "বৈদ্যুতিক",
        "meaning": "Of, worked by, charged with, or producing electricity.",
        "type": "adjective",
        "example": "I have an electric car.",
        "difficulty": "A2"
    },
    {
        "english": "electrical",
        "bengali": "বৈদ্যুতিক",
        "meaning": "Relating to electricity.",
        "type": "adjective",
        "example": "He is an electrical engineer.",
        "difficulty": "A2"
    },
    {
        "english": "electricity",
        "bengali": "বিদ্যুৎ",
        "meaning": "A form of energy resulting from the existence of charged particles (such as electrons or protons), either statically as an accumulation of charge or dynamically as a current.",
        "type": "noun",
        "example": "The power went out and we had no electricity.",
        "difficulty": "A2"
    },
    {
        "english": "electronic",
        "bengali": "ইলেকট্রনিক",
        "meaning": "(of a device) having or operating with the aid of many small components, especially microchips and transistors, that control and direct an electric current.",
        "type": "adjective",
        "example": "I have a lot of electronic gadgets.",
        "difficulty": "A2"
    },
    {
        "english": "element",
        "bengali": "উপাদান",
        "meaning": "A part or aspect of something abstract, especially one that is essential or characteristic.",
        "type": "noun",
        "example": "There is an element of truth in what he says.",
        "difficulty": "B1"
    },
    {
        "english": "elephant",
        "bengali": "হাতি",
        "meaning": "A very large plant-eating mammal with a prehensile trunk, long curved ivory tusks, and large ears, native to Africa and southern Asia. It is the largest living land animal.",
        "type": "noun",
        "example": "I saw an elephant at the zoo.",
        "difficulty": "A1"
    },
    {
        "english": "elevator",
        "bengali": "লিফট",
        "meaning": "A platform or compartment housed in a shaft for raising and lowering people or things to different levels.",
        "type": "noun",
        "example": "We took the elevator to the top floor.",
        "difficulty": "A2"
    },
    {
        "english": "eleven",
        "bengali": "এগারো",
        "meaning": "Equivalent to the sum of one and ten; one more than ten; 11.",
        "type": "number",
        "example": "There are eleven players on a football team.",
        "difficulty": "A1"
    },
    {
        "english": "else",
        "bengali": "অন্য",
        "meaning": "In addition; besides.",
        "type": "adverb",
        "example": "What else do you need?",
        "difficulty": "A1"
    },
    {
        "english": "elsewhere",
        "bengali": "অন্যত্র",
        "meaning": "In, at, or to some other place or other places.",
        "type": "adverb",
        "example": "We need to look for a solution elsewhere.",
        "difficulty": "B2"
    },
    {
        "english": "email",
        "bengali": "ইমেল",
        "meaning": "Messages distributed by electronic means from one computer user to one or more recipients via a network.",
        "type": "noun, verb",
        "example": "I will send you an email.",
        "difficulty": "A1"
    },
    {
        "english": "embarrassed",
        "bengali": "অস্বস্তিতে",
        "meaning": "Feeling awkward, self-conscious, or ashamed.",
        "type": "adjective",
        "example": "I was so embarrassed when I forgot his name.",
        "difficulty": "B1"
    },
    {
        "english": "embarrassing",
        "bengali": " বিব্রতকর",
        "meaning": "Causing embarrassment.",
        "type": "adjective",
        "example": "It was an embarrassing situation.",
        "difficulty": "B1"
    },
    {
        "english": "emerge",
        "bengali": "আবির্ভূত হওয়া",
        "meaning": "Move out of or away from something and come into view.",
        "type": "verb",
        "example": "The sun emerged from behind the clouds.",
        "difficulty": "B2"
    },
    {
        "english": "emergency",
        "bengali": "জরুরি অবস্থা",
        "meaning": "A serious, unexpected, and often dangerous situation requiring immediate action.",
        "type": "noun",
        "example": "In case of emergency, call this number.",
        "difficulty": "B1"
    },
    {
        "english": "emotion",
        "bengali": "আবেগ",
        "meaning": "A strong feeling deriving from one's circumstances, mood, or relationships with others.",
        "type": "noun",
        "example": "He shows no emotion.",
        "difficulty": "B1"
    },
    {
        "english": "emotional",
        "bengali": "আবেগপ্রবণ",
        "meaning": "Relating to a person's emotions.",
        "type": "adjective",
        "example": "She is a very emotional person.",
        "difficulty": "B2"
    },
    {
        "english": "emphasis",
        "bengali": "গুরুত্ব",
        "meaning": "Special importance, value, or prominence given to something.",
        "type": "noun",
        "example": "The emphasis is on quality.",
        "difficulty": "B2"
    },
    {
        "english": "emphasize",
        "bengali": "গুরুত্ব দেওয়া",
        "meaning": "Give special importance or prominence to (something) in speaking or writing.",
        "type": "verb",
        "example": "He emphasized the need for more research.",
        "difficulty": "B2"
    },
    {
        "english": "employ",
        "bengali": "নিয়োগ করা",
        "meaning": "Give work to (someone) and pay them for it.",
        "type": "verb",
        "example": "The company employs 100 people.",
        "difficulty": "A2"
    },
    {
        "english": "employee",
        "bengali": "কর্মচারী",
        "meaning": "A person employed for wages or salary, especially at nonexecutive level.",
        "type": "noun",
        "example": "He is an employee of the company.",
        "difficulty": "A2"
    },
    {
        "english": "employer",
        "bengali": "নিয়োগকর্তা",
        "meaning": "A person or organization that employs people.",
        "type": "noun",
        "example": "He is a good employer.",
        "difficulty": "A2"
    },
    {
        "english": "employment",
        "bengali": "কর্মসংস্থান",
        "meaning": "The state of having paid work.",
        "type": "noun",
        "example": "He is looking for employment.",
        "difficulty": "B1"
    },
    {
        "english": "empty",
        "bengali": "খালি",
        "meaning": "Containing nothing; not filled or occupied.",
        "type": "adjective, verb",
        "example": "The bottle is empty.",
        "difficulty": "A2"
    },
    {
        "english": "enable",
        "bengali": "সক্ষম করা",
        "meaning": "Give (someone or something) the authority or means to do something.",
        "type": "verb",
        "example": "This new software will enable us to work more efficiently.",
        "difficulty": "B2"
    },
    {
        "english": "encounter",
        "bengali": "মুখোমুখি হওয়া",
        "meaning": "Unexpectedly experience or be faced with (something difficult or hostile).",
        "type": "verb, noun",
        "example": "We encountered a lot of problems on our journey.",
        "difficulty": "B2"
    },
    {
        "english": "encourage",
        "bengali": "উৎসাহিত করা",
        "meaning": "Give support, confidence, or hope to (someone).",
        "type": "verb",
        "example": "My parents always encouraged me to do my best.",
        "difficulty": "B1"
    },
    {
        "english": "end",
        "bengali": "শেষ",
        "meaning": "A final part of something, especially a period of time, an activity, or a story.",
        "type": "noun, verb",
        "example": "This is the end of the road.",
        "difficulty": "A1"
    },
    {
        "english": "ending",
        "bengali": "সমাপ্তি",
        "meaning": "An end or final part of something.",
        "type": "noun",
        "example": "The movie has a happy ending.",
        "difficulty": "A2"
    },
    {
        "english": "enemy",
        "bengali": "শত্রু",
        "meaning": "A person who is actively opposed or hostile to someone or something.",
        "type": "noun",
        "example": "He is my sworn enemy.",
        "difficulty": "B1"
    },
    {
        "english": "energy",
        "bengali": "শক্তি",
        "meaning": "The strength and vitality required for sustained physical or mental activity.",
        "type": "noun",
        "example": "I don't have the energy to go out tonight.",
        "difficulty": "A2"
    },
    {
        "english": "engage",
        "bengali": "জড়িত থাকা",
        "meaning": "Occupy, attract, or involve (someone's interest or attention).",
        "type": "verb",
        "example": "He is engaged in a new project.",
        "difficulty": "B2"
    },
    {
        "english": "engaged",
        "bengali": "নিযুক্ত",
        "meaning": "Busy; occupied.",
        "type": "adjective",
        "example": "She is engaged to be married.",
        "difficulty": "B1"
    },
    {
        "english": "engine",
        "bengali": "ইঞ্জিন",
        "meaning": "A machine with moving parts that converts power into motion.",
        "type": "noun",
        "example": "The car has a powerful engine.",
        "difficulty": "A2"
    },
    {
        "english": "engineer",
        "bengali": "প্রকৌশলী",
        "meaning": "A person who designs, builds, or maintains engines, machines, or public works.",
        "type": "noun",
        "example": "He is a civil engineer.",
        "difficulty": "A2"
    },
    {
        "english": "engineering",
        "bengali": "প্রকৌশল",
        "meaning": "The branch of science and technology concerned with the design, building, and use of engines, machines, and structures.",
        "type": "noun",
        "example": "She is studying engineering at university.",
        "difficulty": "B1"
    },
    {
        "english": "enhance",
        "bengali": "বৃদ্ধি করা",
        "meaning": "Intensify, increase, or further improve the quality, value, or extent of.",
        "type": "verb",
        "example": "This will enhance the flavor of the dish.",
        "difficulty": "B2"
    },
    {
        "english": "enjoy",
        "bengali": "উপভোগ করা",
        "meaning": "Take delight or pleasure in (an activity or occasion).",
        "type": "verb",
        "example": "I enjoy playing tennis.",
        "difficulty": "A1"
    },
    {
        "english": "enormous",
        "bengali": "বিশাল",
        "meaning": "Very large in size, quantity, or extent.",
        "type": "adjective",
        "example": "He has an enormous house.",
        "difficulty": "A2"
    },
    {
        "english": "enough",
        "bengali": "যথেষ্ট",
        "meaning": "As much or as many as required.",
        "type": "determiner, pronoun, adverb",
        "example": "Do you have enough money?",
        "difficulty": "A1"
    },
    {
        "english": "ensure",
        "bengali": "নিশ্চিত করা",
        "meaning": "Make certain that (something) shall occur or be the case.",
        "type": "verb",
        "example": "Please ensure that the door is locked.",
        "difficulty": "B2"
    },
    {
        "english": "enter",
        "bengali": "প্রবেশ করা",
        "meaning": "Come or go into (a place).",
        "type": "verb",
        "example": "Please enter the room.",
        "difficulty": "A2"
    },
    {
        "english": "entertain",
        "bengali": "বিনোদন দেওয়া",
        "meaning": "Provide (someone) with amusement or enjoyment.",
        "type": "verb",
        "example": "He entertained us with his stories.",
        "difficulty": "B1"
    },
    {
        "english": "entertainment",
        "bengali": "বিনোদন",
        "meaning": "The action of providing or being provided with amusement or enjoyment.",
        "type": "noun",
        "example": "There is a lot of entertainment in this city.",
        "difficulty": "B1"
    },
    {
        "english": "enthusiasm",
        "bengali": "উৎসাহ",
        "meaning": "Intense and eager enjoyment, interest, or approval.",
        "type": "noun",
        "example": "He has a lot of enthusiasm for his work.",
        "difficulty": "B2"
    },
    {
        "english": "enthusiastic",
        "bengali": "উৎসাহী",
        "meaning": "Having or showing intense and eager enjoyment, interest, or approval.",
        "type": "adjective",
        "example": "She is an enthusiastic supporter of the team.",
        "difficulty": "B2"
    },
    {
        "english": "entire",
        "bengali": "সম্পূর্ণ",
        "meaning": "With no part left out; whole.",
        "type": "adjective",
        "example": "I read the entire book in one day.",
        "difficulty": "B2"
    },
    {
        "english": "entirely",
        "bengali": "সম্পূর্ণভাবে",
        "meaning": "Completely (often used for emphasis).",
        "type": "adverb",
        "example": "I entirely agree with you.",
        "difficulty": "B2"
    },
    {
        "english": "entrance",
        "bengali": "প্রবেশদ্বার",
        "meaning": "An opening, such as a door, passage, or gate, that allows access to a place.",
        "type": "noun",
        "example": "The entrance to the museum is on the other side.",
        "difficulty": "B1"
    },
    {
        "english": "entry",
        "bengali": "প্রবেশ",
        "meaning": "An act of going or coming in.",
        "type": "noun",
        "example": "The entry fee is five dollars.",
        "difficulty": "B1"
    },
    {
        "english": "environment",
        "bengali": "পরিবেশ",
        "meaning": "The surroundings or conditions in which a person, animal, or plant lives or operates.",
        "type": "noun",
        "example": "We need to protect the environment.",
        "difficulty": "A2"
    },
    {
        "english": "environmental",
        "bengali": "পরিবেশগত",
        "meaning": "Relating to the natural world and the impact of human activity on its condition.",
        "type": "adjective",
        "example": "Pollution is a major environmental problem.",
        "difficulty": "B1"
    },
    {
        "english": "episode",
        "bengali": "পর্ব",
        "meaning": "Each of the separate installments into which a serialized story or radio or television program is divided.",
        "type": "noun",
        "example": "I watched the latest episode of my favorite show.",
        "difficulty": "B1"
    },
    {
        "english": "equal",
        "bengali": "সমান",
        "meaning": "Being the same in quantity, size, degree, or value.",
        "type": "adjective, verb, noun",
        "example": "All people are equal.",
        "difficulty": "B1"
    },
    {
        "english": "equally",
        "bengali": "সমানভাবে",
        "meaning": "In the same manner or to the same extent.",
        "type": "adverb",
        "example": "The money was divided equally among the children.",
        "difficulty": "B1"
    },
    {
        "english": "equipment",
        "bengali": "সরঞ্জাম",
        "meaning": "The necessary items for a particular purpose.",
        "type": "noun",
        "example": "The school needs new sports equipment.",
        "difficulty": "A2"
    },
    {
        "english": "error",
        "bengali": "ত্রুটি",
        "meaning": "A mistake.",
        "type": "noun",
        "example": "There is an error in the calculation.",
        "difficulty": "A2"
    },
    {
        "english": "escape",
        "bengali": "পালানো",
        "meaning": "Break free from confinement or control.",
        "type": "verb, noun",
        "example": "The prisoner escaped from jail.",
        "difficulty": "B1"
    },
    {
        "english": "especially",
        "bengali": "বিশেষ করে",
        "meaning": "Used to single out one person, thing, or situation over all others.",
        "type": "adverb",
        "example": "I love all kinds of fruit, especially mangoes.",
        "difficulty": "A2"
    },
    {
        "english": "essay",
        "bengali": "প্রবন্ধ",
        "meaning": "A short piece of writing on a particular subject.",
        "type": "noun",
        "example": "I have to write an essay for my English class.",
        "difficulty": "A2"
    },
    {
        "english": "essential",
        "bengali": "অপরিহার্য",
        "meaning": "Absolutely necessary; extremely important.",
        "type": "adjective",
        "example": "Water is essential for life.",
        "difficulty": "B1"
    },
    {
        "english": "establish",
        "bengali": "স্থাপন করা",
        "meaning": "Set up (an organization, system, or set of rules) on a firm or permanent basis.",
        "type": "verb",
        "example": "The company was established in 1950.",
        "difficulty": "B2"
    },
    {
        "english": "estate",
        "bengali": "এস্টেট",
        "meaning": "An extensive area of land in the country, usually with a large house, owned by one person, family, or organization.",
        "type": "noun",
        "example": "He owns a large estate in the countryside.",
        "difficulty": "B2"
    },
    {
        "english": "estimate",
        "bengali": "হিসাব",
        "meaning": "Roughly calculate or judge the value, number, quantity, or extent of.",
        "type": "verb, noun",
        "example": "Can you give me an estimate of the cost?",
        "difficulty": "B2"
    },
    {
        "english": "ethical",
        "bengali": "নৈতিক",
        "meaning": "Relating to moral principles or the branch of knowledge dealing with these.",
        "type": "adjective",
        "example": "It is not ethical to lie.",
        "difficulty": "B2"
    },
    {
        "english": "euro",
        "bengali": "ইউরো",
        "meaning": "The single European currency, which replaced the national currencies of France, Germany, Spain, Italy, Greece, Portugal, Luxembourg, Austria, Finland, the Republic of Ireland, Belgium, and the Netherlands in 2002.",
        "type": "noun",
        "example": "This costs ten euros.",
        "difficulty": "A1"
    },
    {
        "english": "evaluate",
        "bengali": "মূল্যায়ন করা",
        "meaning": "Form an idea of the amount, number, or value of; assess.",
        "type": "verb",
        "example": "We need to evaluate the success of the project.",
        "difficulty": "B2"
    },
    {
        "english": "even",
        "bengali": "এমনকি",
        "meaning": "Used to emphasize something surprising or extreme.",
        "type": "adverb, adjective",
        "example": "He can't even write his own name.",
        "difficulty": "A1"
    },
    {
        "english": "evening",
        "bengali": "সন্ধ্যা",
        "meaning": "The period of time at the end of the day, usually from about 6 p.m. to bedtime.",
        "type": "noun",
        "example": "I will see you this evening.",
        "difficulty": "A1"
    },
    {
        "english": "event",
        "bengali": "ঘটনা",
        "meaning": "A thing that happens, especially one of importance.",
        "type": "noun",
        "example": "The wedding was a big event.",
        "difficulty": "A1"
    },
    {
        "english": "eventually",
        "bengali": "অবশেষে",
        "meaning": "In the end, especially after a long delay, dispute, or series of problems.",
        "type": "adverb",
        "example": "He eventually found a job.",
        "difficulty": "B1"
    },
    {
        "english": "ever",
        "bengali": "কখনো",
        "meaning": "At any time.",
        "type": "adverb",
        "example": "Have you ever been to London?",
        "difficulty": "A1"
    },
    {
        "english": "every",
        "bengali": "প্রতি",
        "meaning": "Used to refer to all the individual members of a set without exception.",
        "type": "determiner",
        "example": "Every student has a book.",
        "difficulty": "A1"
    },
    {
        "english": "everybody",
        "bengali": "সবাই",
        "meaning": "Every person.",
        "type": "pronoun",
        "example": "Everybody is welcome.",
        "difficulty": "A1"
    },
    {
        "english": "everyday",
        "bengali": "প্রতিদিনের",
        "meaning": "Happening or used every day; daily.",
        "type": "adjective",
        "example": "This is an everyday occurrence.",
        "difficulty": "A2"
    },
    {
        "english": "everyone",
        "bengali": "সবাই",
        "meaning": "Every person.",
        "type": "pronoun",
        "example": "Everyone is here.",
        "difficulty": "A1"
    },
    {
        "english": "everything",
        "bengali": "সবকিছু",
        "meaning": "All things.",
        "type": "pronoun",
        "example": "I have everything I need.",
        "difficulty": "A1"
    },
    {
        "english": "everywhere",
        "bengali": "সর্বত্র",
        "meaning": "In or to all places.",
        "type": "adverb",
        "example": "I have looked everywhere for my keys.",
        "difficulty": "A2"
    },
    {
        "english": "evidence",
        "bengali": "প্রমাণ",
        "meaning": "The available body of facts or information indicating whether a belief or proposition is true or valid.",
        "type": "noun",
        "example": "There is no evidence to support his claim.",
        "difficulty": "A2"
    },
    {
        "english": "evil",
        "bengali": "মন্দ",
        "meaning": "Profoundly immoral and wicked.",
        "type": "adjective, noun",
        "example": "He is an evil man.",
        "difficulty": "B2"
    },
    {
        "english": "exact",
        "bengali": "সঠিক",
        "meaning": "Not approximated in any way; precise.",
        "type": "adjective",
        "example": "What is the exact time?",
        "difficulty": "A2"
    },
    {
        "english": "exactly",
        "bengali": "ঠিক",
        "meaning": "Used to emphasize the accuracy of a figure or description.",
        "type": "adverb",
        "example": "That's exactly what I mean.",
        "difficulty": "A2"
    },
    {
        "english": "exam",
        "bengali": "পরীক্ষা",
        "meaning": "A formal test of a person's knowledge or proficiency in a particular subject or skill.",
        "type": "noun",
        "example": "I have an exam tomorrow.",
        "difficulty": "A1"
    },
    {
        "english": "examination",
        "bengali": "পরীক্ষা",
        "meaning": "A detailed inspection or study.",
        "type": "noun",
        "example": "The doctor gave me a thorough examination.",
        "difficulty": "B2"
    },
    {
        "english": "examine",
        "bengali": "পরীক্ষা করা",
        "meaning": "Inspect (someone or something) in detail to determine their nature or condition; investigate thoroughly.",
        "type": "verb",
        "example": "The doctor will examine you.",
        "difficulty": "B1"
    },
    {
        "english": "example",
        "bengali": "উদাহরণ",
        "meaning": "A thing characteristic of its kind or illustrating a general rule.",
        "type": "noun",
        "example": "Can you give me an example?",
        "difficulty": "A1"
    },
    {
        "english": "excellent",
        "bengali": "চমৎকার",
        "meaning": "Extremely good; outstanding.",
        "type": "adjective",
        "example": "This is an excellent book.",
        "difficulty": "A2"
    },
    {
        "english": "except",
        "bengali": "ছাড়া",
        "meaning": "Not including; other than.",
        "type": "preposition, conjunction",
        "example": "Everyone is here except John.",
        "difficulty": "A2"
    },
    {
        "english": "exchange",
        "bengali": "বিনিময়",
        "meaning": "An act of giving one thing and receiving another (especially of the same type or value) in return.",
        "type": "noun, verb",
        "example": "I would like to exchange this shirt for a different size.",
        "difficulty": "B1"
    },
    {
        "english": "excited",
        "bengali": "উত্তেজিত",
        "meaning": "Very enthusiastic and eager.",
        "type": "adjective",
        "example": "I am so excited about the trip.",
        "difficulty": "A1"
    },
    {
        "english": "excitement",
        "bengali": "উত্তেজনা",
        "meaning": "A feeling of great enthusiasm and eagerness.",
        "type": "noun",
        "example": "There was a lot of excitement in the air.",
        "difficulty": "B1"
    },
    {
        "english": "exciting",
        "bengali": "উত্তেজনাপূর্ণ",
        "meaning": "Causing great enthusiasm and eagerness.",
        "type": "adjective",
        "example": "This is a very exciting movie.",
        "difficulty": "A1"
    },
    {
        "english": "excuse",
        "bengali": "অজুহাত",
        "meaning": "A reason or explanation put forward to defend or justify a fault or offense.",
        "type": "noun, verb",
        "example": "What is your excuse for being late?",
        "difficulty": "B2"
    },
    {
        "english": "executive",
        "bengali": "নির্বাহী",
        "meaning": "Relating to or having the power to put plans, actions, or laws into effect.",
        "type": "noun, adjective",
        "example": "She is a senior executive in the company.",
        "difficulty": "B2"
    },
    {
        "english": "exercise",
        "bengali": "ব্যায়াম",
        "meaning": "Activity requiring physical effort, carried out to sustain or improve health and fitness.",
        "type": "noun, verb",
        "example": "You should do some exercise every day.",
        "difficulty": "A1"
    },
    {
        "english": "exhibit",
        "bengali": "প্রদর্শন করা",
        "meaning": "Publicly display (a work of art or item of interest) in an art gallery or museum or at a trade fair.",
        "type": "verb, noun",
        "example": "The museum is exhibiting a collection of ancient artifacts.",
        "difficulty": "B2"
    },
    {
        "english": "exhibition",
        "bengali": "প্রদর্শনী",
        "meaning": "A public display of works of art or other items of interest, held in an art gallery or museum or at a trade fair.",
        "type": "noun",
        "example": "I went to an art exhibition yesterday.",
        "difficulty": "B1"
    },
    {
        "english": "exist",
        "bengali": "অস্তিত্ব থাকা",
        "meaning": "Have objective reality or being.",
        "type": "verb",
        "example": "Do you believe that ghosts exist?",
        "difficulty": "A2"
    },
    {
        "english": "existence",
        "bengali": "অস্তিত্ব",
        "meaning": "The fact or state of living or having objective reality.",
        "type": "noun",
        "example": "The existence of life on other planets has not been proven.",
        "difficulty": "B2"
    },
    {
        "english": "exit",
        "bengali": "প্রস্থান",
        "meaning": "A way out of a public building or other place.",
        "type": "noun, verb",
        "example": "Where is the nearest exit?",
        "difficulty": "B1"
    },
    {
        "english": "expand",
        "bengali": "প্রসারিত করা",
        "meaning": "Become or make larger or more extensive.",
        "type": "verb",
        "example": "The company is planning to expand its operations.",
        "difficulty": "B1"
    },
    {
        "english": "expect",
        "bengali": "প্রত্যাশা করা",
        "meaning": "Regard (something) as likely to happen.",
        "type": "verb",
        "example": "I expect to be back tomorrow.",
        "difficulty": "A2"
    },
    {
        "english": "expectation",
        "bengali": "প্রত্যাশা",
        "meaning": "A strong belief that something will happen or be the case in the future.",
        "type": "noun",
        "example": "My expectations were not met.",
        "difficulty": "B2"
    },
    {
        "english": "expected",
        "bengali": "প্রত্যাশিত",
        "meaning": "Regarded as likely to happen or be the case.",
        "type": "adjective",
        "example": "The expected result did not materialize.",
        "difficulty": "B1"
    },
    {
        "english": "expense",
        "bengali": "খরচ",
        "meaning": "The cost required for something; the money spent on something.",
        "type": "noun",
        "example": "I have a lot of expenses this month.",
        "difficulty": "B2"
    },
    {
        "english": "expensive",
        "bengali": "দামী",
        "meaning": "Costing a lot of money.",
        "type": "adjective",
        "example": "This is a very expensive car.",
        "difficulty": "A1"
    },
    {
        "english": "experience",
        "bengali": "অভিজ্ঞতা",
        "meaning": "Practical contact with and observation of facts or events.",
        "type": "noun, verb",
        "example": "He has a lot of experience in this field.",
        "difficulty": "A2"
    },
    {
        "english": "experienced",
        "bengali": "অভিজ্ঞ",
        "meaning": "Having knowledge or skill in a particular field, especially a profession or job, gained over a period of time.",
        "type": "adjective",
        "example": "She is an experienced teacher.",
        "difficulty": "B1"
    },
    {
        "english": "experiment",
        "bengali": "পরীক্ষা",
        "meaning": "A scientific procedure undertaken to make a discovery, test a hypothesis, or demonstrate a known fact.",
        "type": "noun, verb",
        "example": "The scientists are conducting an experiment.",
        "difficulty": "A2"
    },
    {
        "english": "expert",
        "bengali": "বিশেষজ্ঞ",
        "meaning": "A person who has a comprehensive and authoritative knowledge of or skill in a particular area.",
        "type": "noun, adjective",
        "example": "He is an expert in his field.",
        "difficulty": "A2"
    },
    {
        "english": "explain",
        "bengali": "ব্যাখ্যা করা",
        "meaning": "Make (an idea, situation, or problem) clear to someone by describing it in more detail or revealing relevant facts or ideas.",
        "type": "verb",
        "example": "Can you explain this to me?",
        "difficulty": "A1"
    },
    {
        "english": "explanation",
        "bengali": "ব্যাখ্যা",
        "meaning": "A statement or account that makes something clear.",
        "type": "noun",
        "example": "I need an explanation for your behavior.",
        "difficulty": "A2"
    },
    {
        "english": "explode",
        "bengali": "বিস্ফোরিত হওয়া",
        "meaning": "Burst or shatter violently and noisily as a result of rapid combustion, decomposition, decomposition of an unstable compound, or other process.",
        "type": "verb",
        "example": "The bomb exploded.",
        "difficulty": "B1"
    },
    {
        "english": "exploration",
        "bengali": "অনুসন্ধান",
        "meaning": "The action of exploring an unfamiliar area.",
        "type": "noun",
        "example": "Space exploration is a fascinating subject.",
        "difficulty": "B2"
    },
    {
        "english": "explore",
        "bengali": "অনুসন্ধান করা",
        "meaning": "Travel in or through (an unfamiliar country or area) in order to learn about or familiarize oneself with it.",
        "type": "verb",
        "example": "We are going to explore the jungle.",
        "difficulty": "B1"
    },
    {
        "english": "explosion",
        "bengali": "বিস্ফোরণ",
        "meaning": "A violent and destructive shattering or blowing apart of something, as is caused by a bomb.",
        "type": "noun",
        "example": "There was a loud explosion.",
        "difficulty": "B1"
    },
    {
        "english": "export",
        "bengali": "রপ্তানি",
        "meaning": "Send (goods or services) to another country for sale.",
        "type": "noun, verb",
        "example": "The country exports a lot of goods to other countries.",
        "difficulty": "B1"
    },
    {
        "english": "expose",
        "bengali": "প্রকাশ করা",
        "meaning": "Make (something) visible by uncovering it.",
        "type": "verb",
        "example": "He was exposed as a liar.",
        "difficulty": "B2"
    },
    {
        "english": "express",
        "bengali": "প্রকাশ করা",
        "meaning": "Convey (a thought or feeling) in words or by gestures and conduct.",
        "type": "verb",
        "example": "She expressed her gratitude.",
        "difficulty": "A2"
    },
    {
        "english": "expression",
        "bengali": "অভিব্যক্তি",
        "meaning": "The action of making known one's thoughts or feelings.",
        "type": "noun",
        "example": "He had a sad expression on his face.",
        "difficulty": "A2"
    },
    {
        "english": "extend",
        "bengali": "প্রসারিত করা",
        "meaning": "Cause to cover a larger area; make longer or wider.",
        "type": "verb",
        "example": "We are going to extend our house.",
        "difficulty": "B2"
    },
    {
        "english": "extent",
        "bengali": "পরিধি",
        "meaning": "The area covered by something.",
        "type": "noun",
        "example": "I was amazed at the extent of his knowledge.",
        "difficulty": "B2"
    },
    {
        "english": "external",
        "bengali": "বাহ্যিক",
        "meaning": "Belonging to or forming the outer surface or structure of something.",
        "type": "adjective",
        "example": "This is for external use only.",
        "difficulty": "B2"
    },
    {
        "english": "extra",
        "bengali": "অতিরিক্ত",
        "meaning": "Added to an existing or usual amount or number.",
        "type": "adjective, noun, adverb",
        "example": "I need some extra money.",
        "difficulty": "A1"
    },
    {
        "english": "extraordinary",
        "bengali": "অসাধারণ",
        "meaning": "Very unusual or remarkable.",
        "type": "adjective",
        "example": "He is an extraordinary person.",
        "difficulty": "B2"
    },
    {
        "english": "extreme",
        "bengali": "চরম",
        "meaning": "Reaching a high or the highest degree; very great.",
        "type": "adjective, noun",
        "example": "The weather is extreme in this region.",
        "difficulty": "A2"
    },
    {
        "english": "extremely",
        "bengali": "অত্যন্ত",
        "meaning": "To a very great degree.",
        "type": "adverb",
        "example": "It is an extremely difficult problem.",
        "difficulty": "A2"
    },
    {
        "english": "eye",
        "bengali": "চোখ",
        "meaning": "Each of a pair of globular organs in the head through which people and vertebrate animals see, the visible part typically appearing almond-shaped in humans.",
        "type": "noun",
        "example": "She has beautiful eyes.",
        "difficulty": "A1"
    },
    {
        "english": "face",
        "bengali": "মুখ",
        "meaning": "The front part of a person's head from the forehead to the chin, or the corresponding part in an animal.",
        "type": "noun, verb",
        "example": "She has a beautiful face.",
        "difficulty": "A1"
    },
    {
        "english": "facility",
        "bengali": "সুবিধা",
        "meaning": "A place, amenity, or piece of equipment provided for a particular purpose.",
        "type": "noun",
        "example": "The hotel has a swimming pool and other sports facilities.",
        "difficulty": "B2"
    },
    {
        "english": "fact",
        "bengali": "সত্য",
        "meaning": "A thing that is known or proved to be true.",
        "type": "noun",
        "example": "It is a fact that the earth is round.",
        "difficulty": "A1"
    },
    {
        "english": "factor",
        "bengali": "উপাদান",
        "meaning": "A circumstance, fact, or influence that contributes to a result or outcome.",
        "type": "noun",
        "example": "Price is a major factor in our decision.",
        "difficulty": "A2"
    },
    {
        "english": "factory",
        "bengali": "কারখানা",
        "meaning": "A building or group of buildings where goods are manufactured or assembled chiefly by machine.",
        "type": "noun",
        "example": "He works in a factory.",
        "difficulty": "A2"
    },
    {
        "english": "fail",
        "bengali": "ব্যর্থ হওয়া",
        "meaning": "Be unsuccessful in achieving one's goal.",
        "type": "verb",
        "example": "He failed his exam.",
        "difficulty": "A2"
    },
    {
        "english": "failure",
        "bengali": "ব্যর্থতা",
        "meaning": "Lack of success.",
        "type": "noun",
        "example": "His business was a complete failure.",
        "difficulty": "B2"
    },
    {
        "english": "fair",
        "bengali": "ন্যায্য",
        "meaning": "Treating people equally without favoritism or discrimination.",
        "type": "adjective",
        "example": "The referee was fair to both teams.",
        "difficulty": "A2"
    },
    {
        "english": "fairly",
        "bengali": "মোটামুটি",
        "meaning": "With justice.",
        "type": "adverb",
        "example": "He is a fairly good player.",
        "difficulty": "B1"
    },
    {
        "english": "faith",
        "bengali": "বিশ্বাস",
        "meaning": "Complete trust or confidence in someone or something.",
        "type": "noun",
        "example": "I have faith in you.",
        "difficulty": "B2"
    },
    {
        "english": "fall",
        "bengali": "পড়ে যাওয়া",
        "meaning": "Move downward, typically rapidly and freely without control, from a higher to a lower level.",
        "type": "verb, noun",
        "example": "Be careful not to fall.",
        "difficulty": "A1"
    },
    {
        "english": "false",
        "bengali": "মিথ্যা",
        "meaning": "Not according with truth or fact; incorrect.",
        "type": "adjective",
        "example": "That statement is false.",
        "difficulty": "A1"
    },
    {
        "english": "familiar",
        "bengali": "পরিচিত",
        "meaning": "Well known from long or close association.",
        "type": "adjective",
        "example": "His face is familiar to me.",
        "difficulty": "B1"
    },
    {
        "english": "family",
        "bengali": "পরিবার",
        "meaning": "A group consisting of parents and children living together as a unit.",
        "type": "noun, adjective",
        "example": "I have a large family.",
        "difficulty": "A1"
    },
    {
        "english": "famous",
        "bengali": "বিখ্যাত",
        "meaning": "Known about by many people.",
        "type": "adjective",
        "example": "He is a famous actor.",
        "difficulty": "A1"
    },
    {
        "english": "fan",
        "bengali": "পাখা",
        "meaning": "An apparatus with rotating blades that creates a current of air for cooling or ventilation.",
        "type": "noun",
        "example": "Turn on the fan, it's hot.",
        "difficulty": "A2"
    },
    {
        "english": "fancy",
        "bengali": "অভিনব",
        "meaning": "Elaborate in structure or decoration.",
        "type": "adjective, verb, noun",
        "example": "She wore a fancy dress to the party.",
        "difficulty": "B1"
    },
    {
        "english": "fantastic",
        "bengali": "অসাধারণ",
        "meaning": "Extraordinarily good or attractive.",
        "type": "adjective",
        "example": "We had a fantastic time.",
        "difficulty": "A1"
    },
    {
        "english": "far",
        "bengali": "দূরে",
        "meaning": "At, to, or by a great distance (used to indicate the extent to which one thing is distant from another).",
        "type": "adverb, adjective",
        "example": "How far is it to the station?",
        "difficulty": "A1"
    },
    {
        "english": "farm",
        "bengali": "খামার",
        "meaning": "An area of land and its buildings used for growing crops and rearing animals.",
        "type": "noun, verb",
        "example": "My uncle has a farm.",
        "difficulty": "A1"
    },
    {
        "english": "farmer",
        "bengali": "কৃষক",
        "meaning": "A person who owns or manages a farm.",
        "type": "noun",
        "example": "He is a farmer.",
        "difficulty": "A1"
    },
    {
        "english": "farming",
        "bengali": "কৃষি",
        "meaning": "The activity or business of growing crops and raising livestock.",
        "type": "noun",
        "example": "Farming is an important industry in this country.",
        "difficulty": "A2"
    },
    {
        "english": "fascinating",
        "bengali": "চিত্তাকর্ষক",
        "meaning": "Extremely interesting.",
        "type": "adjective",
        "example": "This is a fascinating book.",
        "difficulty": "B1"
    },
    {
        "english": "fashion",
        "bengali": "ফ্যাশন",
        "meaning": "A popular or the latest style of clothing, hair, decoration, or behavior.",
        "type": "noun",
        "example": "She is very interested in fashion.",
        "difficulty": "A2"
    },
    {
        "english": "fashionable",
        "bengali": "ফ্যাশনেবল",
        "meaning": "Conforming to the latest trends of fashion; stylish.",
        "type": "adjective",
        "example": "She wears fashionable clothes.",
        "difficulty": "B1"
    },
    {
        "english": "fast",
        "bengali": "দ্রুত",
        "meaning": "Moving or capable of moving at high speed.",
        "type": "adjective, adverb",
        "example": "He is a fast runner.",
        "difficulty": "A1"
    },
    {
        "english": "fasten",
        "bengali": "আঁটা",
        "meaning": "Close or do up securely.",
        "type": "verb",
        "example": "Please fasten your seatbelt.",
        "difficulty": "B1"
    },
    {
        "english": "fat",
        "bengali": "মোটা",
        "meaning": "(of a person or animal) having a large amount of excess flesh.",
        "type": "adjective, noun",
        "example": "That cat is very fat.",
        "difficulty": "A1"
    },
    {
        "english": "father",
        "bengali": "বাবা",
        "meaning": "A man in relation to his natural child or children.",
        "type": "noun",
        "example": "My father is a doctor.",
        "difficulty": "A1"
    },
    {
        "english": "fault",
        "bengali": "দোষ",
        "meaning": "An unattractive or unsatisfactory feature, especially in a piece of work or in a person's character.",
        "type": "noun",
        "example": "It's not my fault.",
        "difficulty": "B2"
    },
    {
        "english": "favor",
        "bengali": "অনুগ্রহ",
        "meaning": "An act of kindness beyond what is due or usual.",
        "type": "noun, verb",
        "example": "Can you do me a favor?",
        "difficulty": "B1"
    },
    {
        "english": "favorite",
        "bengali": "প্রিয়",
        "meaning": "Preferred before all others of the same kind.",
        "type": "adjective, noun",
        "example": "What is your favorite color?",
        "difficulty": "A1"
    },
    {
        "english": "fear",
        "bengali": "ভয়",
        "meaning": "An unpleasant emotion caused by the belief that someone or something is dangerous, likely to cause pain, or a threat.",
        "type": "noun, verb",
        "example": "She has a fear of heights.",
        "difficulty": "A2"
    },
    {
        "english": "feather",
        "bengali": "পালক",
        "meaning": "Any of the flat appendages growing from a bird's skin and forming its plumage, consisting of a partly hollow horny shaft fringed with vanes of barbs.",
        "type": "noun",
        "example": "The bird has beautiful feathers.",
        "difficulty": "B2"
    },
    {
        "english": "feature",
        "bengali": "বৈশিষ্ট্য",
        "meaning": "A distinctive attribute or aspect of something.",
        "type": "noun, verb",
        "example": "This car has many new features.",
        "difficulty": "A2"
    },
    {
        "english": "February",
        "bengali": "ফেব্রুয়ারি",
        "meaning": "The second month of the year, in the northern hemisphere usually considered the last month of winter.",
        "type": "noun",
        "example": "My birthday is in February.",
        "difficulty": "A1"
    },
    {
        "english": "federal",
        "bengali": "যুক্তরাষ্ট্রীয়",
        "meaning": "Having or relating to a system of government in which several states form a unity but remain independent in internal affairs.",
        "type": "adjective",
        "example": "The United States has a federal government.",
        "difficulty": "B1"
    },
    {
        "english": "fee",
        "bengali": "ফি",
        "meaning": "A payment made to a professional person or to a professional or public body in exchange for advice or services.",
        "type": "noun",
        "example": "The lawyer's fee was very high.",
        "difficulty": "B2"
    },
    {
        "english": "feed",
        "bengali": "খাওয়ানো",
        "meaning": "Give food to.",
        "type": "verb, noun",
        "example": "It's time to feed the dog.",
        "difficulty": "A2"
    },
    {
        "english": "feedback",
        "bengali": "মতামত",
        "meaning": "Information about reactions to a product, a person's performance of a task, etc., used as a basis for improvement.",
        "type": "noun",
        "example": "I need some feedback on my work.",
        "difficulty": "B2"
    },
    {
        "english": "feel",
        "bengali": "অনুভব করা",
        "meaning": "Experience (an emotion or sensation).",
        "type": "verb, noun",
        "example": "How do you feel?",
        "difficulty": "A1"
    },
    {
        "english": "feeling",
        "bengali": "অনুভূতি",
        "meaning": "An emotional state or reaction.",
        "type": "noun",
        "example": "I have a strange feeling about this.",
        "difficulty": "A1"
    },
    {
        "english": "fellow",
        "bengali": "সহকর্মী",
        "meaning": "A person in the same position, involved in the same activity, or otherwise associated with another.",
        "type": "adjective, noun",
        "example": "He is a fellow of the Royal Society.",
        "difficulty": "B2"
    },
    {
        "english": "female",
        "bengali": "মহিলা",
        "meaning": "Of or denoting the sex that can bear offspring or produce eggs, distinguished biologically by the production of gametes (ova) that can be fertilized by male gametes.",
        "type": "adjective, noun",
        "example": "The lioness is a female lion.",
        "difficulty": "A2"
    },
    {
        "english": "fence",
        "bengali": "বেড়া",
        "meaning": "A barrier, railing, or other upright structure, typically of wood or wire, enclosing an area of ground to mark a boundary, control access, or prevent escape.",
        "type": "noun",
        "example": "There is a fence around the garden.",
        "difficulty": "B1"
    },
    {
        "english": "festival",
        "bengali": "উৎসব",
        "meaning": "A day or period of celebration, typically for religious reasons.",
        "type": "noun",
        "example": "Eid is a religious festival.",
        "difficulty": "A1"
    },
    {
        "english": "fever",
        "bengali": "জ্বর",
        "meaning": "An abnormally high body temperature, usually accompanied by shivering, headache, and in severe instances, delirium.",
        "type": "noun",
        "example": "I have a fever.",
        "difficulty": "A2"
    },
    {
        "english": "few",
        "bengali": "কয়েক",
        "meaning": "A small number of.",
        "type": "determiner, adjective, pronoun",
        "example": "I have a few books.",
        "difficulty": "A1"
    },
    {
        "english": "fiction",
        "bengali": "কথাসাহিত্য",
        "meaning": "Literature in the form of prose, especially short stories and novels, that describes imaginary events and people.",
        "type": "noun",
        "example": "I enjoy reading fiction.",
        "difficulty": "A2"
    },
    {
        "english": "field",
        "bengali": "মাঠ",
        "meaning": "An area of open land, especially one planted with crops or pasture, typically bounded by hedges or fences.",
        "type": "noun",
        "example": "The cows are in the field.",
        "difficulty": "A2"
    },
    {
        "english": "fifteen",
        "bengali": "পনেরো",
        "meaning": "Equivalent to the product of three and five; one more than fourteen; 15.",
        "type": "number",
        "example": "She is fifteen years old.",
        "difficulty": "A1"
    },
    {
        "english": "fifth",
        "bengali": "পঞ্চম",
        "meaning": "Constituting number five in a sequence; 5th.",
        "type": "number",
        "example": "This is the fifth time I have called you.",
        "difficulty": "A1"
    },
    {
        "english": "fifty",
        "bengali": "পঞ্চাশ",
        "meaning": "The number equivalent to the product of five and ten; ten less than sixty; 50.",
        "type": "number",
        "example": "My father is fifty years old.",
        "difficulty": "A1"
    },
    {
        "english": "fight",
        "bengali": "লড়াই",
        "meaning": "Take part in a violent struggle involving the exchange of physical blows or the use of weapons.",
        "type": "verb, noun",
        "example": "The two boys were fighting.",
        "difficulty": "A2"
    },
    {
        "english": "fighting",
        "bengali": "লড়াই",
        "meaning": "The action of fighting; violence or conflict.",
        "type": "noun",
        "example": "There was a lot of fighting in the streets.",
        "difficulty": "B1"
    },
    {
        "english": "figure",
        "bengali": "চিত্র",
        "meaning": "A number, especially one that forms part of official statistics or relates to the financial performance of a company.",
        "type": "noun, verb",
        "example": "The sales figures are very good.",
        "difficulty": "A2"
    },
    {
        "english": "file",
        "bengali": "ফাইল",
        "meaning": "A folder or box for holding loose papers that are typically arranged in a particular order for easy reference.",
        "type": "noun, verb",
        "example": "Please put this in the file.",
        "difficulty": "B1"
    },
    {
        "english": "fill",
        "bengali": "ভরা",
        "meaning": "Cause (a space or container) to become full or almost full.",
        "type": "verb",
        "example": "Please fill the glass with water.",
        "difficulty": "A1"
    },
    {
        "english": "film",
        "bengali": "চলচ্চিত্র",
        "meaning": "A story or event recorded by a camera as a set of moving images and shown in a theater or on television; a movie.",
        "type": "noun, verb",
        "example": "I watched a good film last night.",
        "difficulty": "A2"
    },
    {
        "english": "final",
        "bengali": "চূড়ান্ত",
        "meaning": "Coming at the end of a series.",
        "type": "adjective, noun",
        "example": "This is the final chapter of the book.",
        "difficulty": "A1"
    },
    {
        "english": "finally",
        "bengali": "অবশেষে",
        "meaning": "After a long time, typically when there has been difficulty or delay.",
        "type": "adverb",
        "example": "He finally arrived.",
        "difficulty": "A2"
    },
    {
        "english": "finance",
        "bengali": "অর্থ",
        "meaning": "The management of large amounts of money, especially by governments or large companies.",
        "type": "noun, verb",
        "example": "He works in finance.",
        "difficulty": "B2"
    },
    {
        "english": "financial",
        "bengali": "আর্থিক",
        "meaning": "Relating to finance.",
        "type": "adjective",
        "example": "The company is in financial trouble.",
        "difficulty": "B1"
    },
    {
        "english": "find",
        "bengali": "খুঁজে পাওয়া",
        "meaning": "Discover or perceive by chance or unexpectedly.",
        "type": "verb",
        "example": "I can't find my keys.",
        "difficulty": "A1"
    },
    {
        "english": "finding",
        "bengali": "আবিষ্কার",
        "meaning": "The action of finding someone or something.",
        "type": "noun",
        "example": "The finding of the missing child was a great relief.",
        "difficulty": "B2"
    },
    {
        "english": "fine",
        "bengali": "ভাল",
        "meaning": "Of high quality.",
        "type": "adjective, adverb, noun",
        "example": "I feel fine.",
        "difficulty": "A1"
    },
    {
        "english": "finger",
        "bengali": "আঙুল",
        "meaning": "Each of the four slender joints attached to either hand (or five if the thumb is included).",
        "type": "noun",
        "example": "He pointed his finger at me.",
        "difficulty": "A2"
    },
    {
        "english": "finish",
        "bengali": "শেষ করা",
        "meaning": "Bring (a task or activity) to an end; complete.",
        "type": "verb, noun",
        "example": "I have to finish my homework.",
        "difficulty": "A1"
    },
    {
        "english": "fire",
        "bengali": "আগুন",
        "meaning": "Combustion or burning, in which substances combine chemically with oxygen from the air and typically give out bright light, heat, and smoke.",
        "type": "noun, verb",
        "example": "The house is on fire.",
        "difficulty": "A1"
    },
    {
        "english": "firm",
        "bengali": "দৃঢ়",
        "meaning": "Having a solid, almost unyielding surface or structure.",
        "type": "adjective, noun, verb",
        "example": "This is a firm mattress.",
        "difficulty": "B2"
    },
    {
        "english": "first",
        "bengali": "প্রথম",
        "meaning": "Coming before all others in time or order; earliest; 1st.",
        "type": "determiner, number, adverb, noun",
        "example": "This is the first time I have been here.",
        "difficulty": "A1"
    },
    {
        "english": "fish",
        "bengali": "মাছ",
        "meaning": "A limbless cold-blooded vertebrate animal with gills and fins and living wholly in water.",
        "type": "noun, verb",
        "example": "I like to eat fish.",
        "difficulty": "A1"
    },
    {
        "english": "fishing",
        "bengali": "মাছ ধরা",
        "meaning": "The activity of catching fish, either for food or as a sport.",
        "type": "noun",
        "example": "We are going fishing tomorrow.",
        "difficulty": "A2"
    },
    {
        "english": "fit",
        "bengali": "উপযুক্ত",
        "meaning": "Of a suitable quality, standard, or type to meet the required purpose.",
        "type": "verb, adjective, noun",
        "example": "This shirt doesn't fit me.",
        "difficulty": "A2"
    },
    {
        "english": "fitness",
        "bengali": "ফিটনেস",
        "meaning": "The condition of being physically fit and healthy.",
        "type": "noun",
        "example": "She is a fitness enthusiast.",
        "difficulty": "B1"
    },
    {
        "english": "five",
        "bengali": "পাঁচ",
        "meaning": "Equivalent to the sum of two and three; one more than four; 5.",
        "type": "number",
        "example": "I have five fingers on each hand.",
        "difficulty": "A1"
    },
    {
        "english": "fix",
        "bengali": "ঠিক করা",
        "meaning": "Mend or repair.",
        "type": "verb, noun",
        "example": "Can you fix my car?",
        "difficulty": "A2"
    },
    {
        "english": "fixed",
        "bengali": "স্থির",
        "meaning": "Fastened securely in position.",
        "type": "adjective",
        "example": "The price is fixed.",
        "difficulty": "B1"
    },
    {
        "english": "flag",
        "bengali": "পতাকা",
        "meaning": "A piece of cloth or similar material, typically oblong or rectangular, attachable by one edge to a pole or rope and used as the symbol or emblem of a country or institution or as a decoration.",
        "type": "noun",
        "example": "The flag of Bangladesh is green and red.",
        "difficulty": "B1"
    },
    {
        "english": "flame",
        "bengali": "শিখা",
        "meaning": "A hot glowing body of ignited gas that is generated by something on fire.",
        "type": "noun",
        "example": "The flames were getting bigger.",
        "difficulty": "B2"
    },
    {
        "english": "flash",
        "bengali": "ঝলক",
        "meaning": "A sudden bright light.",
        "type": "noun, verb",
        "example": "There was a flash of lightning.",
        "difficulty": "B2"
    },
    {
        "english": "flat",
        "bengali": "সমতল",
        "meaning": "Having a level surface; without raised areas or indentations.",
        "type": "adjective, noun",
        "example": "The ground is very flat here.",
        "difficulty": "A2"
    },
    {
        "english": "flexible",
        "bengali": "নমনীয়",
        "meaning": "Capable of bending easily without breaking.",
        "type": "adjective",
        "example": "This material is very flexible.",
        "difficulty": "B2"
    },
    {
        "english": "flight",
        "bengali": "ফ্লাইট",
        "meaning": "The action or process of flying through the air.",
        "type": "noun",
        "example": "My flight leaves at 10 am.",
        "difficulty": "A1"
    },
    {
        "english": "float",
        "bengali": "ভাসা",
        "meaning": "Rest or move on or near the surface of a liquid without sinking.",
        "type": "verb",
        "example": "Wood floats on water.",
        "difficulty": "B2"
    },
    {
        "english": "flood",
        "bengali": "বন্যা",
        "meaning": "An overflowing of a large amount of water beyond its normal confines, especially over what is normally dry land.",
        "type": "noun, verb",
        "example": "The village was destroyed by a flood.",
        "difficulty": "B1"
    },
    {
        "english": "floor",
        "bengali": "মেঝে",
        "meaning": "The lower surface of a room, on which one may walk.",
        "type": "noun",
        "example": "The cat is sleeping on the floor.",
        "difficulty": "A1"
    },
    {
        "english": "flour",
        "bengali": "ময়দা",
        "meaning": "A powder obtained by grinding grain, typically wheat, and used to make bread, cakes, and pastry.",
        "type": "noun",
        "example": "We need some flour to make a cake.",
        "difficulty": "B1"
    },
    {
        "english": "flow",
        "bengali": "প্রবাহ",
        "meaning": "(of a liquid, gas, or electricity) move along or out steadily and continuously in a current or stream.",
        "type": "verb, noun",
        "example": "The river flows to the sea.",
        "difficulty": "B1"
    },
    {
        "english": "flower",
        "bengali": "ফুল",
        "meaning": "The seed-bearing part of a plant, consisting of reproductive organs (stamens and carpels) that are typically surrounded by a brightly colored corolla (petals) and a green calyx (sepals).",
        "type": "noun",
        "example": "She loves flowers.",
        "difficulty": "A1"
    },
    {
        "english": "flu",
        "bengali": "ফ্লু",
        "meaning": "A highly contagious viral infection of the respiratory passages causing fever, severe aching, and catarrh, and often occurring in epidemics.",
        "type": "noun",
        "example": "I have the flu.",
        "difficulty": "A2"
    },
    {
        "english": "fly",
        "bengali": "উড়া",
        "meaning": "(of a bird, bat, or insect) move through the air using wings.",
        "type": "verb, noun",
        "example": "Birds can fly.",
        "difficulty": "A1"
    },
    {
        "english": "flying",
        "bengali": "উড়ন্ত",
        "meaning": "Moving or able to move through the air with wings.",
        "type": "noun, adjective",
        "example": "I saw a flying saucer.",
        "difficulty": "A2"
    },
    {
        "english": "focus",
        "bengali": "মনোনিবেশ করা",
        "meaning": "The center of interest or activity.",
        "type": "verb, noun",
        "example": "Please focus on your work.",
        "difficulty": "A2"
    },
    {
        "english": "fold",
        "bengali": "ভাঁজ করা",
        "meaning": "Bend (something flexible and relatively flat) over on itself so that one part of it covers another.",
        "type": "verb, noun",
        "example": "Please fold the clothes.",
        "difficulty": "B1"
    },
    {
        "english": "folding",
        "bengali": "ভাঁজ",
        "meaning": "(of an object) able to be folded.",
        "type": "adjective",
        "example": "This is a folding chair.",
        "difficulty": "B2"
    },
    {
        "english": "folk",
        "bengali": "লোক",
        "meaning": "People in general.",
        "type": "noun, adjective",
        "example": "The local folk are very friendly.",
        "difficulty": "B1"
    },
    {
        "english": "follow",
        "bengali": "অনুসরণ করা",
        "meaning": "Go or come after (a person or thing proceeding ahead); move or travel behind.",
        "type": "verb",
        "example": "Please follow me.",
        "difficulty": "A1"
    },
    {
        "english": "following",
        "bengali": "অনুসরণকারী",
        "meaning": "Coming after or as a result of.",
        "type": "adjective, noun, preposition",
        "example": "The following day was sunny.",
        "difficulty": "A2"
    },
    {
        "english": "food",
        "bengali": "খাবার",
        "meaning": "Any nutritious substance that people or animals eat or drink or that plants absorb in order to maintain life and growth.",
        "type": "noun",
        "example": "I am hungry, I need some food.",
        "difficulty": "A1"
    },
    {
        "english": "foot",
        "bengali": "পা",
        "meaning": "The lower extremity of the leg below the ankle, on which a person stands or walks.",
        "type": "noun",
        "example": "I hurt my foot.",
        "difficulty": "A1"
    },
    {
        "english": "football",
        "bengali": "ফুটবল",
        "meaning": "A form of team game played with a ball between two teams of 11 players, the object being to get the ball into the opposing team's goal.",
        "type": "noun",
        "example": "I like to play football.",
        "difficulty": "A1"
    },
    {
        "english": "for",
        "bengali": "জন্য",
        "meaning": "In support of or in favor of (a person or policy).",
        "type": "preposition",
        "example": "This gift is for you.",
        "difficulty": "A1"
    },
    {
        "english": "force",
        "bengali": "শক্তি",
        "meaning": "Strength or energy as an attribute of physical action or movement.",
        "type": "noun, verb",
        "example": "The police used force to enter the building.",
        "difficulty": "B1"
    },
    {
        "english": "foreign",
        "bengali": "বিদেশী",
        "meaning": "Of, from, in, or characteristic of a country or language other than one's own.",
        "type": "adjective",
        "example": "She speaks several foreign languages.",
        "difficulty": "A2"
    },
    {
        "english": "forest",
        "bengali": "বন",
        "meaning": "A large area covered chiefly with trees and undergrowth.",
        "type": "noun",
        "example": "We went for a walk in the forest.",
        "difficulty": "A2"
    },
    {
        "english": "forever",
        "bengali": "চিরকাল",
        "meaning": "For all future time; for always.",
        "type": "adverb",
        "example": "I will love you forever.",
        "difficulty": "B1"
    },
    {
        "english": "forget",
        "bengali": "ভুলে যাওয়া",
        "meaning": "Fail to remember.",
        "type": "verb",
        "example": "Don't forget to lock the door.",
        "difficulty": "A1"
    },
    {
        "english": "forgive",
        "bengali": "ক্ষমা করা",
        "meaning": "Stop feeling angry or resentful toward (someone) for an offense, flaw, or mistake.",
        "type": "verb",
        "example": "Please forgive me.",
        "difficulty": "B2"
    },
    {
        "english": "fork",
        "bengali": "কাঁটাচামচ",
        "meaning": "A utensil, usually having two or more prongs, used for lifting food to the mouth or holding it when cutting.",
        "type": "noun",
        "example": "I need a knife and fork.",
        "difficulty": "A2"
    },
    {
        "english": "form",
        "bengali": "গঠন",
        "meaning": "The visible shape or configuration of something.",
        "type": "noun, verb",
        "example": "Please fill out this form.",
        "difficulty": "A1"
    },
    {
        "english": "formal",
        "bengali": "আনুষ্ঠানিক",
        "meaning": "Done in accordance with rules of convention or etiquette; suitable for or constituting an official or important occasion.",
        "type": "adjective",
        "example": "It was a formal dinner party.",
        "difficulty": "A2"
    },
    {
        "english": "former",
        "bengali": "প্রাক্তন",
        "meaning": "Having previously filled a particular role or been a particular thing.",
        "type": "adjective",
        "example": "The former president was at the ceremony.",
        "difficulty": "B2"
    },
    {
        "english": "fortunately",
        "bengali": "সৌভাগ্যবশত",
        "meaning": "It is fortunate that.",
        "type": "adverb",
        "example": "Fortunately, no one was hurt in the accident.",
        "difficulty": "B2"
    },
    {
        "english": "fortune",
        "bengali": "ভাগ্য",
        "meaning": "Chance or luck as an external, arbitrary force affecting human affairs.",
        "type": "noun",
        "example": "He had the good fortune to be born into a wealthy family.",
        "difficulty": "B2"
    },
    {
        "english": "forty",
        "bengali": "চল্লিশ",
        "meaning": "The number equivalent to the product of four and ten; ten less than fifty; 40.",
        "type": "number",
        "example": "She is forty years old.",
        "difficulty": "A1"
    },
    {
        "english": "forward",
        "bengali": "সামনে",
        "meaning": "In the direction that one is facing or traveling; toward the front.",
        "type": "adverb",
        "example": "He took a step forward.",
        "difficulty": "A2"
    },
    {
        "english": "found",
        "bengali": "স্থাপন করা",
        "meaning": "Establish or originate (an institution or organization), especially by providing an endowment.",
        "type": "verb",
        "example": "The company was founded in 1950.",
        "difficulty": "B2"
    },
    {
        "english": "four",
        "bengali": "চার",
        "meaning": "Equivalent to the sum of two and two; one more than three; 4.",
        "type": "number",
        "example": "There are four people in my family.",
        "difficulty": "A1"
    },
    {
        "english": "fourteen",
        "bengali": "চৌদ্দ",
        "meaning": "Equivalent to the sum of ten and four; one more than thirteen; 14.",
        "type": "number",
        "example": "She is fourteen years old.",
        "difficulty": "A1"
    },
    {
        "english": "fourth",
        "bengali": "চতুর্থ",
        "meaning": "Constituting number four in a sequence; 4th.",
        "type": "number",
        "example": "This is the fourth time I have called you.",
        "difficulty": "A1"
    },
    {
        "english": "frame",
        "bengali": "ফ্রেম",
        "meaning": "A rigid structure that surrounds or encloses something such as a picture, door, or windowpane.",
        "type": "noun, verb",
        "example": "The picture is in a beautiful frame.",
        "difficulty": "B1"
    },
    {
        "english": "free",
        "bengali": "বিনামূল্যে",
        "meaning": "Not under the control or in the power of another; able to do or be as one wishes.",
        "type": "adjective, adverb, verb",
        "example": "The museum is free on Sundays.",
        "difficulty": "A1"
    },
    {
        "english": "freedom",
        "bengali": "স্বাধীনতা",
        "meaning": "The power or right to act, speak, or think as one wants without hindrance or restraint.",
        "type": "noun",
        "example": "We fought for our freedom.",
        "difficulty": "A2"
    },
    {
        "english": "freeze",
        "bengali": "জমাট বাঁধা",
        "meaning": "(of a liquid) be turned into ice or another solid as a result of extreme cold.",
        "type": "verb",
        "example": "The water in the lake will freeze in winter.",
        "difficulty": "B1"
    },
    {
        "english": "frequency",
        "bengali": "কম্পাঙ্ক",
        "meaning": "The rate at which something occurs or is repeated over a particular period of time or in a given sample.",
        "type": "noun",
        "example": "The frequency of accidents on this road is high.",
        "difficulty": "B2"
    },
    {
        "english": "frequently",
        "bengali": "ঘন ঘন",
        "meaning": "Often.",
        "type": "adverb",
        "example": "He frequently travels abroad.",
        "difficulty": "A2"
    },
    {
        "english": "fresh",
        "bengali": "তাজা",
        "meaning": "(of food) recently made or obtained; not canned, frozen, or otherwise preserved.",
        "type": "adjective",
        "example": "I like fresh fruit.",
        "difficulty": "A2"
    },
    {
        "english": "Friday",
        "bengali": "শুক্রবার",
        "meaning": "The day of the week before Saturday and following Thursday.",
        "type": "noun",
        "example": "I have a meeting on Friday.",
        "difficulty": "A1"
    },
    {
        "english": "friend",
        "bengali": "বন্ধু",
        "meaning": "A person whom one knows and with whom one has a bond of mutual affection, typically exclusive of sexual or family relations.",
        "type": "noun",
        "example": "He is my best friend.",
        "difficulty": "A1"
    },
    {
        "english": "friendly",
        "bengali": "বন্ধুত্বপূর্ণ",
        "meaning": "Kind and pleasant.",
        "type": "adjective",
        "example": "She is a friendly person.",
        "difficulty": "A1"
    },
    {
        "english": "friendship",
        "bengali": "বন্ধুত্ব",
        "meaning": "The emotions or conduct of friends; the state of being friends.",
        "type": "noun",
        "example": "Their friendship is very strong.",
        "difficulty": "A2"
    },
    {
        "english": "frighten",
        "bengali": "ভয় দেখানো",
        "meaning": "Make (someone) afraid or anxious.",
        "type": "verb",
        "example": "The loud noise frightened the baby.",
        "difficulty": "B1"
    },
    {
        "english": "frightened",
        "bengali": "ভীত",
        "meaning": "Afraid or anxious.",
        "type": "adjective",
        "example": "I am frightened of spiders.",
        "difficulty": "A2"
    },
    {
        "english": "frightening",
        "bengali": "ভয়ঙ্কর",
        "meaning": "Making someone afraid or anxious; terrifying.",
        "type": "adjective",
        "example": "It was a frightening experience.",
        "difficulty": "B1"
    },
    {
        "english": "frog",
        "bengali": "ব্যাঙ",
        "meaning": "A tailless amphibian with a short stout body and short forelimbs, modified for leaping.",
        "type": "noun",
        "example": "The frog jumped into the pond.",
        "difficulty": "A2"
    },
    {
        "english": "from",
        "bengali": "থেকে",
        "meaning": "Indicating the point in space at which a journey, motion, or action starts.",
        "type": "preposition",
        "example": "I am from Bangladesh.",
        "difficulty": "A1"
    },
    {
        "english": "front",
        "bengali": "সামনে",
        "meaning": "The side or part of an object that presents itself to view or that is normally seen or used first; the most forward part of something.",
        "type": "noun, adjective",
        "example": "The front of the house needs painting.",
        "difficulty": "A1"
    },
    {
        "english": "frozen",
        "bengali": "হিমায়িত",
        "meaning": "(of a liquid) having been turned into ice or another solid as a result of extreme cold.",
        "type": "adjective",
        "example": "The lake is frozen in winter.",
        "difficulty": "B1"
    },
    {
        "english": "fruit",
        "bengali": "ফল",
        "meaning": "The sweet, fleshy product of a tree or other plant that contains seed and can be eaten as food.",
        "type": "noun",
        "example": "I like to eat fruit.",
        "difficulty": "A1"
    },
    {
        "english": "fry",
        "bengali": "ভাজা",
        "meaning": "Cook (food) in hot fat or oil, typically in a shallow pan.",
        "type": "verb",
        "example": "I will fry some eggs for breakfast.",
        "difficulty": "B1"
    },
    {
        "english": "fuel",
        "bengali": "জ্বালানী",
        "meaning": "Material such as coal, gas, or oil that is burned to produce heat or power.",
        "type": "noun, verb",
        "example": "The car is running out of fuel.",
        "difficulty": "B1"
    },
    {
        "english": "full",
        "bengali": "পূর্ণ",
        "meaning": "Containing or holding as much or as many as possible; having no empty space.",
        "type": "adjective",
        "example": "The glass is full of water.",
        "difficulty": "A1"
    },
    {
        "english": "fully",
        "bengali": "সম্পূর্ণভাবে",
        "meaning": "Completely or entirely.",
        "type": "adverb",
        "example": "I am fully aware of the situation.",
        "difficulty": "B2"
    },
    {
        "english": "fun",
        "bengali": "মজা",
        "meaning": "Enjoyment, amusement, or lighthearted pleasure.",
        "type": "noun, adjective",
        "example": "We had a lot of fun at the party.",
        "difficulty": "A1"
    },
    {
        "english": "function",
        "bengali": "কার্যকলাপ",
        "meaning": "An activity or purpose natural to or intended for a person or thing.",
        "type": "noun, verb",
        "example": "The function of the heart is to pump blood.",
        "difficulty": "B1"
    },
    {
        "english": "fund",
        "bengali": "তহবিল",
        "meaning": "A sum of money saved or made available for a particular purpose.",
        "type": "noun, verb",
        "example": "We need to raise funds for the new hospital.",
        "difficulty": "B2"
    },
    {
        "english": "fundamental",
        "bengali": "মৌলিক",
        "meaning": "Forming a necessary base or core; of central importance.",
        "type": "adjective",
        "example": "This is a fundamental principle of our society.",
        "difficulty": "B2"
    },
    {
        "english": "funding",
        "bengali": "তহবিল",
        "meaning": "Money provided, especially by an organization or government, for a particular purpose.",
        "type": "noun",
        "example": "The project has been canceled due to lack of funding.",
        "difficulty": "B2"
    },
    {
        "english": "funny",
        "bengali": "মজাদার",
        "meaning": "Causing laughter or amusement; humorous.",
        "type": "adjective",
        "example": "He told a funny story.",
        "difficulty": "A1"
    },
    {
        "english": "fur",
        "bengali": "পশম",
        "meaning": "The short, fine, soft hair of certain animals.",
        "type": "noun",
        "example": "The cat has soft fur.",
        "difficulty": "B1"
    },
    {
        "english": "furniture",
        "bengali": "আসবাবপত্র",
        "meaning": "The movable articles that are used to make a room or building suitable for living or working in, such as tables, chairs, or desks.",
        "type": "noun",
        "example": "We need to buy some new furniture.",
        "difficulty": "A2"
    },
    {
        "english": "further",
        "bengali": "আরও",
        "meaning": "At, to, or by a greater distance (used to indicate the extent to which one thing is distant from another).",
        "type": "adjective, adverb, verb",
        "example": "For further information, please contact us.",
        "difficulty": "B2"
    },
    {
        "english": "furthermore",
        "bengali": "অধিকন্তু",
        "meaning": "In addition; besides (used to add a point to an argument).",
        "type": "adverb",
        "example": "The house is beautiful. Furthermore, it's in a great location.",
        "difficulty": "B2"
    },
    {
        "english": "future",
        "bengali": "ভবিষ্যৎ",
        "meaning": "The time or a period of time following the moment of speaking or writing; time regarded as still to come.",
        "type": "noun, adjective",
        "example": "What are your plans for the future?",
        "difficulty": "A1"
    },
    {
        "english": "gain",
        "bengali": "লাভ",
        "meaning": "Obtain or secure (something desired, favorable, or profitable).",
        "type": "verb, noun",
        "example": "He hopes to gain some experience.",
        "difficulty": "B2"
    },
    {
        "english": "gallery",
        "bengali": "গ্যালারি",
        "meaning": "A room or building for the display or sale of works of art.",
        "type": "noun",
        "example": "I went to an art gallery yesterday.",
        "difficulty": "A2"
    },
    {
        "english": "game",
        "bengali": "খেলা",
        "meaning": "An activity that one engages in for amusement or fun.",
        "type": "noun",
        "example": "Let's play a game.",
        "difficulty": "A1"
    },
    {
        "english": "gang",
        "bengali": "দল",
        "meaning": "An organized group of criminals.",
        "type": "noun",
        "example": "He is a member of a gang.",
        "difficulty": "B2"
    },
    {
        "english": "gap",
        "bengali": "ফাঁক",
        "meaning": "A break or hole in an object or between two objects.",
        "type": "noun",
        "example": "There is a gap in the fence.",
        "difficulty": "A2"
    },
    {
        "english": "garage",
        "bengali": "গ্যারেজ",
        "meaning": "A building for housing a motor vehicle or vehicles.",
        "type": "noun",
        "example": "My car is in the garage.",
        "difficulty": "B1"
    },
    {
        "english": "garbage",
        "bengali": "আবর্জনা",
        "meaning": "Wasted or spoiled food and other refuse, as from a kitchen or household.",
        "type": "noun",
        "example": "Please take out the garbage.",
        "difficulty": "A2"
    },
    {
        "english": "garden",
        "bengali": "বাগান",
        "meaning": "A piece of ground, often near a house, used for growing flowers, fruit, or vegetables.",
        "type": "noun",
        "example": "My mother is working in the garden.",
        "difficulty": "A1"
    },
    {
        "english": "gas",
        "bengali": "গ্যাস",
        "meaning": "An airlike fluid substance which expands freely to fill any space available, irrespective of its quantity.",
        "type": "noun",
        "example": "The car is running on gas.",
        "difficulty": "A2"
    },
    {
        "english": "gate",
        "bengali": "ফটক",
        "meaning": "A hinged barrier used to close an opening in a wall, fence, or hedge.",
        "type": "noun",
        "example": "Please close the gate.",
        "difficulty": "A2"
    },
    {
        "english": "gather",
        "bengali": "জড়ো করা",
        "meaning": "Come together; assemble or accumulate.",
        "type": "verb",
        "example": "A crowd gathered to see what was happening.",
        "difficulty": "B1"
    },
    {
        "english": "general",
        "bengali": "সাধারণ",
        "meaning": "Affecting or concerning all or most people, places, or things; widespread.",
        "type": "adjective",
        "example": "This is a matter of general interest.",
        "difficulty": "A2"
    },
    {
        "english": "generally",
        "bengali": "সাধারণত",
        "meaning": "In most cases; usually.",
        "type": "adverb",
        "example": "Generally, I don't like spicy food.",
        "difficulty": "B1"
    },
    {
        "english": "generate",
        "bengali": "উৎপাদন করা",
        "meaning": "Cause (something, especially an emotion or situation) to arise or come about.",
        "type": "verb",
        "example": "The new factory will generate a lot of jobs.",
        "difficulty": "B2"
    },
    {
        "english": "generation",
        "bengali": "প্রজন্ম",
        "meaning": "All of the people born and living at about the same time, regarded collectively.",
        "type": "noun",
        "example": "The younger generation is very interested in technology.",
        "difficulty": "B1"
    },
    {
        "english": "generous",
        "bengali": "উদার",
        "meaning": "(of a person) showing a readiness to give more of something, as money or time, than is strictly necessary or expected.",
        "type": "adjective",
        "example": "He is a very generous person.",
        "difficulty": "B1"
    },
    {
        "english": "genre",
        "bengali": "ধরন",
        "meaning": "A style or category of art, music, or literature.",
        "type": "noun",
        "example": "What is your favorite genre of music?",
        "difficulty": "B2"
    },
    {
        "english": "gentle",
        "bengali": "শান্ত",
        "meaning": "Having or showing a mild, kind, or tender temperament or character.",
        "type": "adjective",
        "example": "He has a gentle voice.",
        "difficulty": "B1"
    },
    {
        "english": "gentleman",
        "bengali": "ভদ্রলোক",
        "meaning": "A chivalrous, courteous, or honorable man.",
        "type": "noun",
        "example": "He is a perfect gentleman.",
        "difficulty": "A2"
    },
    {
        "english": "geography",
        "bengali": "ভূগোল",
        "meaning": "The study of the physical features of the earth and its atmosphere, and of human activity as it affects and is affected by these.",
        "type": "noun",
        "example": "I am studying geography at university.",
        "difficulty": "A2"
    },
    {
        "english": "get",
        "bengali": "পাওয়া",
        "meaning": "Come to have or hold (something); receive.",
        "type": "verb",
        "example": "I need to get a new phone.",
        "difficulty": "A1"
    },
    {
        "english": "ghost",
        "bengali": "ভূত",
        "meaning": "An apparition of a dead person which is believed to appear or become manifest to the living, typically as a nebulous image.",
        "type": "noun",
        "example": "Do you believe in ghosts?",
        "difficulty": "B1"
    },
    {
        "english": "giant",
        "bengali": "দৈত্য",
        "meaning": "An imaginary or mythical being of human form but superhuman size.",
        "type": "adjective, noun",
        "example": "He is a giant of a man.",
        "difficulty": "B1"
    },
    {
        "english": "gift",
        "bengali": "উপহার",
        "meaning": "A thing given willingly to someone without payment; a present.",
        "type": "noun",
        "example": "I received a beautiful gift for my birthday.",
        "difficulty": "A2"
    },
    {
        "english": "girl",
        "bengali": "মেয়ে",
        "meaning": "A female child or young woman.",
        "type": "noun",
        "example": "The girl is playing with a doll.",
        "difficulty": "A1"
    },
    {
        "english": "girlfriend",
        "bengali": "প্রেমিকা",
        "meaning": "A person's regular female companion with whom they have a romantic or sexual relationship.",
        "type": "noun",
        "example": "He is going out with his girlfriend.",
        "difficulty": "A1"
    },
    {
        "english": "give",
        "bengali": "দেওয়া",
        "meaning": "Freely transfer the possession of something to (someone); hand over to.",
        "type": "verb",
        "example": "Can you give me a pen?",
        "difficulty": "A1"
    },
    {
        "english": "glad",
        "bengali": "খুশি",
        "meaning": "Feeling pleasure or happiness.",
        "type": "adjective",
        "example": "I am glad to see you.",
        "difficulty": "B1"
    },
    {
        "english": "glass",
        "bengali": "গ্লাস",
        "meaning": "A hard, brittle substance, typically transparent or translucent, made by fusing sand with soda, lime, and sometimes other ingredients and cooling rapidly. It is used to make windows, drinking containers, and other articles.",
        "type": "noun",
        "example": "I would like a glass of water.",
        "difficulty": "A1"
    },
    {
        "english": "global",
        "bengali": "বৈশ্বিক",
        "meaning": "Relating to the whole world; worldwide.",
        "type": "adjective",
        "example": "Climate change is a global problem.",
        "difficulty": "B1"
    },
    {
        "english": "glove",
        "bengali": "দস্তানা",
        "meaning": "A covering for the hand worn for protection against cold or dirt and typically having separate parts for each finger and the thumb.",
        "type": "noun",
        "example": "She was wearing a pair of white gloves.",
        "difficulty": "B1"
    },
    {
        "english": "go",
        "bengali": "যাওয়া",
        "meaning": "Move from one place to another; travel.",
        "type": "verb, noun",
        "example": "I need to go to the store.",
        "difficulty": "A1"
    },
    {
        "english": "goal",
        "bengali": "লক্ষ্য",
        "meaning": "The object of a person's ambition or effort; an aim or desired result.",
        "type": "noun",
        "example": "My goal is to become a doctor.",
        "difficulty": "A2"
    },
    {
        "english": "god",
        "bengali": "ঈশ্বর",
        "meaning": "(in Christianity and other monotheistic religions) the creator and ruler of the universe and source of all moral authority; the supreme being.",
        "type": "noun",
        "example": "Many people believe in God.",
        "difficulty": "A2"
    },
    {
        "english": "gold",
        "bengali": "সোনা",
        "meaning": "A yellow precious metal, the chemical element of atomic number 79, used especially in jewelry and decoration and to guarantee the value of currencies.",
        "type": "noun, adjective",
        "example": "The ring is made of gold.",
        "difficulty": "A2"
    },
    {
        "english": "golf",
        "bengali": "গলফ",
        "meaning": "A game played on a large open-air course, in which a small hard ball is struck with a club into a series of small holes in the ground, the object being to take the fewest possible strokes to complete the course.",
        "type": "noun",
        "example": "He loves to play golf.",
        "difficulty": "A2"
    },
    {
        "english": "good",
        "bengali": "ভাল",
        "meaning": "To be desired or approved of.",
        "type": "adjective, noun",
        "example": "This is a good book.",
        "difficulty": "A1"
    },
    {
        "english": "goodbye",
        "bengali": "বিদায়",
        "meaning": "Used to express good wishes when parting or at the end of a conversation.",
        "type": "exclamation, noun",
        "example": "He said goodbye and left.",
        "difficulty": "A1"
    },
    {
        "english": "goods",
        "bengali": "পণ্য",
        "meaning": "Merchandise or possessions.",
        "type": "noun",
        "example": "The store sells a variety of goods.",
        "difficulty": "B2"
    },
    {
        "english": "govern",
        "bengali": "শাসন করা",
        "meaning": "Conduct the policy, actions, and affairs of (a state, organization, or people).",
        "type": "verb",
        "example": "The country is governed by a president.",
        "difficulty": "B2"
    },
    {
        "english": "government",
        "bengali": "সরকার",
        "meaning": "The group of people with the authority to govern a country or state; a particular ministry in office.",
        "type": "noun",
        "example": "The government has announced new policies.",
        "difficulty": "A2"
    },
    {
        "english": "governor",
        "bengali": "গভর্নর",
        "meaning": "The elected executive head of a state of the US.",
        "type": "noun",
        "example": "He is the governor of the state.",
        "difficulty": "B2"
    },
    {
        "english": "grab",
        "bengali": "ধরা",
        "meaning": "Seize or grasp suddenly and roughly.",
        "type": "verb",
        "example": "He grabbed the bag and ran.",
        "difficulty": "B2"
    },
    {
        "english": "grade",
        "bengali": "গ্রেড",
        "meaning": "A particular level of rank, quality, proficiency, or value.",
        "type": "noun, verb",
        "example": "She got a good grade on her exam.",
        "difficulty": "B1"
    },
    {
        "english": "gradually",
        "bengali": "ধীরে ধীরে",
        "meaning": "In a gradual way; slowly; by degrees.",
        "type": "adverb",
        "example": "The weather is gradually getting warmer.",
        "difficulty": "B2"
    },
    {
        "english": "graduate",
        "bengali": "স্নাতক",
        "meaning": "A person who has successfully completed a course of study or training, especially a person who has been awarded an undergraduate academic degree.",
        "type": "noun, verb",
        "example": "She is a graduate of Dhaka University.",
        "difficulty": "B1"
    },
    {
        "english": "grain",
        "bengali": "শস্য",
        "meaning": "Wheat or any other cultivated cereal crop used as food.",
        "type": "noun",
        "example": "We need to buy some grain for the chickens.",
        "difficulty": "B1"
    },
    {
        "english": "grand",
        "bengali": "भव्य",
        "meaning": "Magnificent and imposing in appearance, size, or style.",
        "type": "adjective",
        "example": "It was a grand wedding.",
        "difficulty": "B2"
    },
    {
        "english": "grandfather",
        "bengali": "দাদা",
        "meaning": "The father of one's father or mother.",
        "type": "noun",
        "example": "My grandfather is a very wise man.",
        "difficulty": "A1"
    },
    {
        "english": "grandmother",
        "bengali": "দাদী",
        "meaning": "The mother of one's father or mother.",
        "type": "noun",
        "example": "My grandmother makes the best cookies.",
        "difficulty": "A1"
    },
    {
        "english": "grandparent",
        "bengali": "দাদা-দাদী",
        "meaning": "A parent of one's father or mother; a grandfather or grandmother.",
        "type": "noun",
        "example": "I am going to visit my grandparents.",
        "difficulty": "A1"
    },
    {
        "english": "grant",
        "bengali": "মঞ্জুর করা",
        "meaning": "Agree to give or allow (something requested) to.",
        "type": "verb, noun",
        "example": "The government granted him a visa.",
        "difficulty": "B2"
    },
    {
        "english": "grass",
        "bengali": "ঘাস",
        "meaning": "Vegetation consisting of typically short plants with long, narrow leaves, growing wild or cultivated on lawns and pasture, and as a fodder crop.",
        "type": "noun",
        "example": "The grass is green.",
        "difficulty": "A2"
    },
    {
        "english": "grateful",
        "bengali": "কৃতজ্ঞ",
        "meaning": "Feeling or showing an appreciation of kindness; thankful.",
        "type": "adjective",
        "example": "I am grateful for your help.",
        "difficulty": "B1"
    },
    {
        "english": "gray",
        "bengali": "ধূসর",
        "meaning": "Of a color intermediate between black and white, as of ashes or lead.",
        "type": "adjective, noun",
        "example": "The sky is gray.",
        "difficulty": "A1"
    },
    {
        "english": "great",
        "bengali": "মহান",
        "meaning": "Of an extent, amount, or intensity considerably above the normal or average.",
        "type": "adjective",
        "example": "He is a great leader.",
        "difficulty": "A1"
    },
    {
        "english": "green",
        "bengali": "সবুজ",
        "meaning": "Of the color between blue and yellow in the spectrum; colored like grass or emeralds.",
        "type": "adjective, noun",
        "example": "The trees are green.",
        "difficulty": "A1"
    },
    {
        "english": "greet",
        "bengali": "অভিবাদন জানানো",
        "meaning": "Give a polite word or sign of welcome or recognition to (someone) on meeting.",
        "type": "verb",
        "example": "He greeted me with a smile.",
        "difficulty": "A2"
    },
    {
        "english": "grocery",
        "bengali": "মুদি",
        "meaning": "A grocer's shop or business.",
        "type": "noun",
        "example": "I need to go to the grocery store.",
        "difficulty": "A2"
    },
    {
        "english": "ground",
        "bengali": "মাটি",
        "meaning": "The solid surface of the earth.",
        "type": "noun",
        "example": "He fell to the ground.",
        "difficulty": "A2"
    },
    {
        "english": "group",
        "bengali": "দল",
        "meaning": "A number of people or things that are located close together or are considered or classed together.",
        "type": "noun",
        "example": "A group of people were standing outside.",
        "difficulty": "A1"
    },
    {
        "english": "grow",
        "bengali": "বৃদ্ধি পাওয়া",
        "meaning": "(of a living thing) undergo natural development by increasing in size and changing physically; progress to maturity.",
        "type": "verb",
        "example": "The plants are growing well.",
        "difficulty": "A1"
    },
    {
        "english": "growth",
        "bengali": "বৃদ্ধি",
        "meaning": "The process of increasing in size.",
        "type": "noun",
        "example": "The company has seen rapid growth.",
        "difficulty": "B1"
    },
    {
        "english": "guarantee",
        "bengali": "গ্যারান্টি",
        "meaning": "A formal promise or assurance (typically in writing) that certain conditions will be fulfilled, especially that a product will be repaired or replaced if not of a specified quality and durability.",
        "type": "verb, noun",
        "example": "The watch comes with a two-year guarantee.",
        "difficulty": "B2"
    },
    {
        "english": "guard",
        "bengali": "পাহারাদার",
        "meaning": "Watch over in order to protect or control.",
        "type": "noun, verb",
        "example": "The soldiers are guarding the palace.",
        "difficulty": "B1"
    },
    {
        "english": "guess",
        "bengali": "অনুমান করা",
        "meaning": "Estimate or suppose (something) without sufficient information to be sure of being correct.",
        "type": "verb, noun",
        "example": "Can you guess the answer?",
        "difficulty": "A1"
    },
    {
        "english": "guest",
        "bengali": "অতিথি",
        "meaning": "A person who is invited to visit the home of or take part in a function organized by another.",
        "type": "noun",
        "example": "We have a guest for dinner.",
        "difficulty": "A2"
    },
    {
        "english": "guide",
        "bengali": "গাইড",
        "meaning": "A person who shows the way to others, especially one employed to show tourists around places of interest.",
        "type": "noun, verb",
        "example": "Our guide showed us around the city.",
        "difficulty": "A2"
    },
    {
        "english": "guilty",
        "bengali": "দোষী",
        "meaning": "Justly chargeable with a particular fault or error.",
        "type": "adjective",
        "example": "The jury found him guilty.",
        "difficulty": "B1"
    },
    {
        "english": "guitar",
        "bengali": "গিটার",
        "meaning": "A stringed musical instrument with a fretted fingerboard, typically incurved sides, and six or twelve strings, played by plucking or strumming with the fingers or a plectrum.",
        "type": "noun",
        "example": "He can play the guitar.",
        "difficulty": "A1"
    },
    {
        "english": "gun",
        "bengali": "বন্দুক",
        "meaning": "A weapon incorporating a metal tube from which bullets, shells, or other missiles are propelled by explosive force, typically making a characteristic loud report.",
        "type": "noun",
        "example": "The police found a gun at the scene of the crime.",
        "difficulty": "A2"
    },
    {
        "english": "guy",
        "bengali": "লোক",
        "meaning": "A man.",
        "type": "noun",
        "example": "He's a nice guy.",
        "difficulty": "A2"
    },
    {
        "english": "gym",
        "bengali": "জিম",
        "meaning": "A gymnasium.",
        "type": "noun",
        "example": "I go to the gym every day.",
        "difficulty": "A1"
    },
    {
        "english": "habit",
        "bengali": "অভ্যাস",
        "meaning": "A settled or regular tendency or practice, especially one that is hard to give up.",
        "type": "noun",
        "example": "Smoking is a bad habit.",
        "difficulty": "A2"
    },
    {
        "english": "hair",
        "bengali": "চুল",
        "meaning": "Any of the fine threadlike strands growing from the skin of humans, mammals, and some other animals.",
        "type": "noun",
        "example": "She has long hair.",
        "difficulty": "A1"
    },
    {
        "english": "half",
        "bengali": "অর্ধেক",
        "meaning": "Either of two equal or corresponding parts into which something is or can be divided.",
        "type": "noun, determiner, pronoun, adverb",
        "example": "I'll have half a glass of milk.",
        "difficulty": "A1"
    },
    {
        "english": "hall",
        "bengali": "হল",
        "meaning": "The room or space just inside the front entrance of a house or apartment.",
        "type": "noun",
        "example": "The meeting will be held in the main hall.",
        "difficulty": "A2"
    },
    {
        "english": "hand",
        "bengali": "হাত",
        "meaning": "The end part of a person's arm beyond the wrist, including the palm, fingers, and thumb.",
        "type": "noun, verb",
        "example": "He held her hand.",
        "difficulty": "A1"
    },
    {
        "english": "handle",
        "bengali": "হাতল",
        "meaning": "The part by which a thing is held, carried, or controlled.",
        "type": "verb, noun",
        "example": "The handle of the cup is broken.",
        "difficulty": "B2"
    },
    {
        "english": "hang",
        "bengali": "ঝুলানো",
        "meaning": "Suspend or be suspended from above with the lower part dangling free.",
        "type": "verb",
        "example": "Please hang your coat on the hook.",
        "difficulty": "B1"
    },
    {
        "english": "happen",
        "bengali": "ঘটা",
        "meaning": "Take place; occur.",
        "type": "verb",
        "example": "What happened?",
        "difficulty": "A1"
    },
    {
        "english": "happily",
        "bengali": "আনন্দের সাথে",
        "meaning": "In a happy way.",
        "type": "adverb",
        "example": "They lived happily ever after.",
        "difficulty": "A2"
    },
    {
        "english": "happiness",
        "bengali": "সুখ",
        "meaning": "The state of being happy.",
        "type": "noun",
        "example": "Money can't buy happiness.",
        "difficulty": "B1"
    },
    {
        "english": "happy",
        "bengali": "খুশি",
        "meaning": "Feeling or showing pleasure or contentment.",
        "type": "adjective",
        "example": "I am happy to see you.",
        "difficulty": "A1"
    },
    {
        "english": "hard",
        "bengali": "কঠিন",
        "meaning": "Solid, firm, and rigid; not easily broken, bent, or pierced.",
        "type": "adjective, adverb",
        "example": "This is a hard question.",
        "difficulty": "A1"
    },
    {
        "english": "hardly",
        "bengali": "কদাচিৎ",
        "meaning": "Scarcely (used to qualify a statement by saying that it is true to an insignificant degree).",
        "type": "adverb",
        "example": "I hardly know him.",
        "difficulty": "B1"
    },
    {
        "english": "harm",
        "bengali": "ক্ষতি",
        "meaning": "Physical injury, especially that which is deliberately inflicted.",
        "type": "noun, verb",
        "example": "The storm caused a lot of harm to the crops.",
        "difficulty": "B2"
    },
    {
        "english": "harmful",
        "bengali": "ক্ষতিকর",
        "meaning": "Causing or likely to cause harm.",
        "type": "adjective",
        "example": "Smoking is harmful to your health.",
        "difficulty": "B2"
    },
    {
        "english": "hat",
        "bengali": "টুপি",
        "meaning": "A shaped covering for the head worn for warmth, as a fashion item, or as part of a uniform.",
        "type": "noun",
        "example": "She was wearing a beautiful hat.",
        "difficulty": "A1"
    },
    {
        "english": "hate",
        "bengali": "ঘৃণা করা",
        "meaning": "Feel intense or passionate dislike for (someone).",
        "type": "verb, noun",
        "example": "I hate spiders.",
        "difficulty": "A1"
    },
    {
        "english": "have",
        "bengali": "আছে",
        "meaning": "Possess, own, or hold.",
        "type": "verb, auxiliary verb",
        "example": "I have a car.",
        "difficulty": "A1"
    },
    {
        "english": "have to",
        "bengali": "করতে হবে",
        "meaning": "Must (expressing obligation).",
        "type": "modal verb",
        "example": "I have to go now.",
        "difficulty": "A1"
    },
    {
        "english": "he",
        "bengali": "সে",
        "meaning": "Used to refer to a man, boy, or male animal previously mentioned or easily identified.",
        "type": "pronoun",
        "example": "He is my brother.",
        "difficulty": "A1"
    },
    {
        "english": "head",
        "bengali": "মাথা",
        "meaning": "The upper part of the human body, or the front or upper part of the body of an animal, typically separated from the rest of the body by a neck, and containing the brain, mouth, and sense organs.",
        "type": "noun, verb",
        "example": "I have a pain in my head.",
        "difficulty": "A1"
    },
    {
        "english": "headache",
        "bengali": "মাথাব্যথা",
        "meaning": "A continuous pain in the head.",
        "type": "noun",
        "example": "I have a headache.",
        "difficulty": "A2"
    },
    {
        "english": "headline",
        "bengali": "শিরোনাম",
        "meaning": "A heading at the top of an article or page in a newspaper or magazine.",
        "type": "noun",
        "example": "The story was on the front page headline.",
        "difficulty": "B1"
    },
    {
        "english": "health",
        "bengali": "স্বাস্থ্য",
        "meaning": "The state of being free from illness or injury.",
        "type": "noun",
        "example": "Health is wealth.",
        "difficulty": "A1"
    },
    {
        "english": "healthy",
        "bengali": "স্বাস্থ্যকর",
        "meaning": "In a good physical or mental condition; in good health.",
        "type": "adjective",
        "example": "She is a healthy person.",
        "difficulty": "A1"
    },
    {
        "english": "hear",
        "bengali": "শোনা",
        "meaning": "Perceive with the ear the sound made by (someone or something).",
        "type": "verb",
        "example": "Can you hear me?",
        "difficulty": "A1"
    },
    {
        "english": "hearing",
        "bengali": "শুনানি",
        "meaning": "The faculty of perceiving sounds.",
        "type": "noun",
        "example": "His hearing is not very good.",
        "difficulty": "B2"
    },
    {
        "english": "heart",
        "bengali": "হৃৎপিণ্ড",
        "meaning": "A hollow muscular organ that pumps the blood through the circulatory system by contraction and relaxation.",
        "type": "noun",
        "example": "He has a weak heart.",
        "difficulty": "A2"
    },
    {
        "english": "heat",
        "bengali": "তাপ",
        "meaning": "The quality of being hot; high temperature.",
        "type": "noun, verb",
        "example": "I can't stand the heat.",
        "difficulty": "A2"
    },
    {
        "english": "heating",
        "bengali": "গরম করা",
        "meaning": "The technology of providing warmth to a building or other space.",
        "type": "noun",
        "example": "The heating is not working.",
        "difficulty": "B1"
    },
    {
        "english": "heaven",
        "bengali": "স্বর্গ",
        "meaning": "A place regarded in various religions as the abode of God (or the gods) and the angels, and of the good after death, often traditionally depicted as being above the sky.",
        "type": "noun",
        "example": "She believes she will go to heaven when she dies.",
        "difficulty": "B2"
    },
    {
        "english": "heavily",
        "bengali": "প্রচুর পরিমাণে",
        "meaning": "To a great degree; in large amounts.",
        "type": "adverb",
        "example": "It was raining heavily.",
        "difficulty": "B1"
    },
    {
        "english": "heavy",
        "bengali": "ভারী",
        "meaning": "Of great weight; difficult to lift or move.",
        "type": "adjective",
        "example": "This box is very heavy.",
        "difficulty": "A2"
    },
    {
        "english": "heel",
        "bengali": "গোড়ালি",
        "meaning": "The back part of the foot below the ankle.",
        "type": "noun",
        "example": "I have a pain in my heel.",
        "difficulty": "B2"
    },
    {
        "english": "height",
        "bengali": "উচ্চতা",
        "meaning": "The measurement from base to top or (of a standing person) from head to foot.",
        "type": "noun",
        "example": "What is your height?",
        "difficulty": "A2"
    },
    {
        "english": "helicopter",
        "bengali": "হেলিকপ্টার",
        "meaning": "A type of aircraft which derives both lift and propulsion from one or more sets of horizontally revolving rotors.",
        "type": "noun",
        "example": "The helicopter landed on the roof of the building.",
        "difficulty": "B1"
    },
    {
        "english": "hell",
        "bengali": "নরক",
        "meaning": "A place regarded in various religions as a spiritual realm of evil and suffering, often traditionally depicted as a place of perpetual fire beneath the earth where the wicked are punished after death.",
        "type": "noun",
        "example": "He was going through hell.",
        "difficulty": "B2"
    },
    {
        "english": "hello",
        "bengali": "হ্যালো",
        "meaning": "Used as a greeting or to begin a phone conversation.",
        "type": "exclamation, noun",
        "example": "Hello, how are you?",
        "difficulty": "A1"
    },
    {
        "english": "help",
        "bengali": "সাহায্য করা",
        "meaning": "Make it easier for (someone) to do something by offering one's services or resources.",
        "type": "verb, noun",
        "example": "Can you help me?",
        "difficulty": "A1"
    },
    {
        "english": "helpful",
        "bengali": "সহায়ক",
        "meaning": "Giving or ready to give help.",
        "type": "adjective",
        "example": "He is a very helpful person.",
        "difficulty": "A2"
    },
    {
        "english": "her",
        "bengali": "তার",
        "meaning": "Used as the object of a verb or preposition to refer to a female person or animal previously mentioned or easily identified.",
        "type": "pronoun, determiner",
        "example": "I saw her yesterday.",
        "difficulty": "A1"
    },
    {
        "english": "here",
        "bengali": "এখানে",
        "meaning": "In, at, or to this place or position.",
        "type": "adverb",
        "example": "Please come here.",
        "difficulty": "A1"
    },
    {
        "english": "hero",
        "bengali": "নায়ক",
        "meaning": "A person who is admired or idealized for courage, outstanding achievements, or noble qualities.",
        "type": "noun",
        "example": "He is a national hero.",
        "difficulty": "A2"
    },
    {
        "english": "hers",
        "bengali": "তার",
        "meaning": "Used to refer to a thing or things belonging to or associated with a female person or animal previously mentioned.",
        "type": "pronoun",
        "example": "This book is hers.",
        "difficulty": "A2"
    },
    {
        "english": "herself",
        "bengali": "নিজেই",
        "meaning": "Used as the object of a verb or preposition to refer to a female person or animal previously mentioned as the subject of the clause.",
        "type": "pronoun",
        "example": "She did it herself.",
        "difficulty": "A2"
    },
    {
        "english": "hesitate",
        "bengali": "দ্বিধা করা",
        "meaning": "Pause before saying or doing something, especially through uncertainty.",
        "type": "verb",
        "example": "Don't hesitate to ask for help.",
        "difficulty": "B2"
    },
    {
        "english": "hey",
        "bengali": "হেই",
        "meaning": "Used to attract attention, to express surprise, interest, or annoyance, or to elicit agreement.",
        "type": "exclamation",
        "example": "Hey, what are you doing?",
        "difficulty": "A1"
    },
    {
        "english": "hi",
        "bengali": "হাই",
        "meaning": "Used as a friendly greeting.",
        "type": "exclamation",
        "example": "Hi, how are you?",
        "difficulty": "A1"
    },
    {
        "english": "hide",
        "bengali": "লুকানো",
        "meaning": "Put or keep out of sight; conceal from the view or notice of others.",
        "type": "verb",
        "example": "The cat is hiding under the bed.",
        "difficulty": "A2"
    },
    {
        "english": "high",
        "bengali": "উচ্চ",
        "meaning": "Of great vertical extent.",
        "type": "adjective, adverb, noun",
        "example": "The mountain is very high.",
        "difficulty": "A1"
    },
    {
        "english": "highlight",
        "bengali": "হাইলাইট",
        "meaning": "An outstanding part of an event or period of time.",
        "type": "verb, noun",
        "example": "The highlight of the show was the last song.",
        "difficulty": "B1"
    },
    {
        "english": "highly",
        "bengali": "অত্যন্ত",
        "meaning": "To a high degree or level.",
        "type": "adverb",
        "example": "He is a highly respected teacher.",
        "difficulty": "B1"
    },
    {
        "english": "highway",
        "bengali": "মহাসড়ক",
        "meaning": "A main road, especially one connecting major towns or cities.",
        "type": "noun",
        "example": "There was a lot of traffic on the highway.",
        "difficulty": "B1"
    },
    {
        "english": "hill",
        "bengali": "পাহাড়",
        "meaning": "A naturally raised area of land, not as high or craggy as a mountain.",
        "type": "noun",
        "example": "We walked up the hill.",
        "difficulty": "A2"
    },
    {
        "english": "him",
        "bengali": "তাকে",
        "meaning": "Used as the object of a verb or preposition to refer to a male person or animal previously mentioned or easily identified.",
        "type": "pronoun",
        "example": "I saw him yesterday.",
        "difficulty": "A1"
    },
    {
        "english": "himself",
        "bengali": "নিজেই",
        "meaning": "Used as the object of a verb or preposition to refer to a male person or animal previously mentioned as the subject of the clause.",
        "type": "pronoun",
        "example": "He did it himself.",
        "difficulty": "A2"
    },
    {
        "english": "hire",
        "bengali": "ভাড়া করা",
        "meaning": "Employ (someone) for wages.",
        "type": "verb, noun",
        "example": "We need to hire a new assistant.",
        "difficulty": "B1"
    },
    {
        "english": "his",
        "bengali": "তার",
        "meaning": "Belonging to or associated with a male person or animal previously mentioned or easily identified.",
        "type": "determiner, pronoun",
        "example": "This is his book.",
        "difficulty": "A1"
    },
    {
        "english": "historic",
        "bengali": "ঐতিহাসিক",
        "meaning": "Famous or important in history, or potentially so.",
        "type": "adjective",
        "example": "This is a historic moment.",
        "difficulty": "B1"
    },
    {
        "english": "historical",
        "bengali": "ঐতিহাসিক",
        "meaning": "Of or concerning history; concerning past events.",
        "type": "adjective",
        "example": "She is writing a historical novel.",
        "difficulty": "B1"
    },
    {
        "english": "history",
        "bengali": "ইতিহাস",
        "meaning": "The study of past events, particularly in human affairs.",
        "type": "noun",
        "example": "I am studying history at university.",
        "difficulty": "A1"
    },
    {
        "english": "hit",
        "bengali": "আঘাত করা",
        "meaning": "Bring one's hand or a tool or weapon into contact with (someone or something) quickly and forcefully.",
        "type": "verb, noun",
        "example": "He hit the ball with the bat.",
        "difficulty": "A2"
    },
    {
        "english": "hobby",
        "bengali": "শখ",
        "meaning": "An activity done regularly in one's leisure time for pleasure.",
        "type": "noun",
        "example": "My hobby is reading.",
        "difficulty": "A1"
    },
    {
        "english": "hockey",
        "bengali": "হকি",
        "meaning": "A game played between two teams of 11 players with hooked sticks and a small hard ball.",
        "type": "noun",
        "example": "He plays hockey for the school team.",
        "difficulty": "A2"
    },
    {
        "english": "hold",
        "bengali": "ধরা",
        "meaning": "Grasp, carry, or support with one's hands.",
        "type": "verb, noun",
        "example": "Please hold my hand.",
        "difficulty": "A2"
    },
    {
        "english": "hole",
        "bengali": "গর্ত",
        "meaning": "A hollow place in a solid body or surface.",
        "type": "noun",
        "example": "There is a hole in my sock.",
        "difficulty": "A2"
    },
    {
        "english": "holiday",
        "bengali": "ছুটি",
        "meaning": "An extended period of leisure and recreation, especially one spent away from home or in traveling.",
        "type": "noun",
        "example": "We are going on holiday next week.",
        "difficulty": "A2"
    },
    {
        "english": "hollow",
        "bengali": "ফাঁপা",
        "meaning": "Having a hole or empty space inside.",
        "type": "adjective",
        "example": "The tree is hollow inside.",
        "difficulty": "B2"
    },
    {
        "english": "holy",
        "bengali": "পবিত্র",
        "meaning": "Dedicated or consecrated to God or a religious purpose; sacred.",
        "type": "adjective",
        "example": "This is a holy place.",
        "difficulty": "B2"
    },
    {
        "english": "home",
        "bengali": "বাড়ি",
        "meaning": "The place where one lives permanently, especially as a member of a family or household.",
        "type": "noun, adverb, adjective",
        "example": "I want to go home.",
        "difficulty": "A1"
    },
    {
        "english": "homework",
        "bengali": "বাড়ির কাজ",
        "meaning": "Schoolwork that a student is required to do at home.",
        "type": "noun",
        "example": "I have a lot of homework to do.",
        "difficulty": "A1"
    },
    {
        "english": "honest",
        "bengali": "সৎ",
        "meaning": "Free of deceit and untruthfulness; sincere.",
        "type": "adjective",
        "example": "He is an honest man.",
        "difficulty": "B1"
    },
    {
        "english": "honor",
        "bengali": "সম্মান",
        "meaning": "High respect; great esteem.",
        "type": "noun, verb",
        "example": "It is an honor to meet you.",
        "difficulty": "B2"
    },
    {
        "english": "hope",
        "bengali": "আশা",
        "meaning": "A feeling of expectation and desire for a certain thing to happen.",
        "type": "verb, noun",
        "example": "I hope you have a good time.",
        "difficulty": "A1"
    },
    {
        "english": "horrible",
        "bengali": "ভয়ঙ্কর",
        "meaning": "Causing or likely to cause horror; shocking.",
        "type": "adjective",
        "example": "It was a horrible accident.",
        "difficulty": "B1"
    },
    {
        "english": "horror",
        "bengali": "ভয়",
        "meaning": "An intense feeling of fear, shock, or disgust.",
        "type": "noun",
        "example": "She screamed in horror.",
        "difficulty": "B1"
    },
    {
        "english": "horse",
        "bengali": "ঘোড়া",
        "meaning": "A large plant-eating domesticated mammal with solid hoofs and a flowing mane and tail, used for riding, racing, and to carry and pull loads.",
        "type": "noun",
        "example": "He is riding a horse.",
        "difficulty": "A1"
    },
    {
        "english": "hospital",
        "bengali": "হাসপাতাল",
        "meaning": "An institution providing medical and surgical treatment and nursing care for sick or injured people.",
        "type": "noun",
        "example": "She is in the hospital.",
        "difficulty": "A1"
    },
    {
        "english": "host",
        "bengali": "আয়োজক",
        "meaning": "A person who receives or entertains other people as guests.",
        "type": "noun, verb",
        "example": "He is a very good host.",
        "difficulty": "B1"
    },
    {
        "english": "hot",
        "bengali": "গরম",
        "meaning": "Having a high degree of heat or a high temperature.",
        "type": "adjective",
        "example": "It is very hot today.",
        "difficulty": "A1"
    },
    {
        "english": "hotel",
        "bengali": "হোটেল",
        "meaning": "An establishment providing accommodation, meals, and other services for travelers and tourists.",
        "type": "noun",
        "example": "We are staying in a nice hotel.",
        "difficulty": "A1"
    },
    {
        "english": "hour",
        "bengali": "ঘন্টা",
        "meaning": "A period of time equal to a twenty-fourth part of a day and night and divided into 60 minutes.",
        "type": "noun",
        "example": "I will be back in an hour.",
        "difficulty": "A1"
    },
    {
        "english": "house",
        "bengali": "বাড়ি",
        "meaning": "A building for human habitation, especially one that is lived in by a single family.",
        "type": "noun, verb",
        "example": "He lives in a big house.",
        "difficulty": "A1"
    },
    {
        "english": "household",
        "bengali": "গৃহস্থালী",
        "meaning": "A house and its occupants regarded as a unit.",
        "type": "noun",
        "example": "This is a common household problem.",
        "difficulty": "B2"
    },
    {
        "english": "housing",
        "bengali": "আবাসন",
        "meaning": "Houses and apartments considered collectively, especially when regarded as a social or economic issue.",
        "type": "noun",
        "example": "There is a shortage of affordable housing.",
        "difficulty": "B2"
    },
    {
        "english": "how",
        "bengali": "কিভাবে",
        "meaning": "In what way or manner; by what means.",
        "type": "adverb",
        "example": "How do you do that?",
        "difficulty": "A1"
    },
    {
        "english": "however",
        "bengali": "যাইহোক",
        "meaning": "Used to introduce a statement that contrasts with or seems to contradict something that has been said previously.",
        "type": "adverb",
        "example": "He is a good student, however, he is often late.",
        "difficulty": "A1"
    },
    {
        "english": "huge",
        "bengali": "বিশাল",
        "meaning": "Extremely large; enormous.",
        "type": "adjective",
        "example": "That is a huge building.",
        "difficulty": "A2"
    },
    {
        "english": "human",
        "bengali": "মানুষ",
        "meaning": "Relating to or characteristic of people or human beings.",
        "type": "adjective, noun",
        "example": "We are all human.",
        "difficulty": "A2"
    },
    {
        "english": "humor",
        "bengali": "রসিকতা",
        "meaning": "The quality of being amusing or comic, especially as expressed in literature or speech.",
        "type": "noun",
        "example": "He has a great sense of humor.",
        "difficulty": "B2"
    },
    {
        "english": "humorous",
        "bengali": "রসাত্মক",
        "meaning": "Causing laughter and amusement; comic.",
        "type": "adjective",
        "example": "He told a humorous story.",
        "difficulty": "B2"
    },
    {
        "english": "hundred",
        "bengali": "একশ",
        "meaning": "The number equivalent to the product of ten and ten; 100.",
        "type": "number",
        "example": "There are a hundred people here.",
        "difficulty": "A1"
    },
    {
        "english": "hungry",
        "bengali": "ক্ষুধার্ত",
        "meaning": "Feeling or displaying the need for food.",
        "type": "adjective",
        "example": "I am hungry.",
        "difficulty": "A1"
    },
    {
        "english": "hunt",
        "bengali": "শিকার করা",
        "meaning": "Pursue and kill (a wild animal) for sport or food.",
        "type": "verb, noun",
        "example": "He likes to hunt deer.",
        "difficulty": "B1"
    },
    {
        "english": "hunting",
        "bengali": "শিকার",
        "meaning": "The activity of hunting wild animals or game.",
        "type": "noun",
        "example": "Hunting is not allowed in this area.",
        "difficulty": "B2"
    },
    {
        "english": "hurricane",
        "bengali": "ঘূর্ণিঝড়",
        "meaning": "A storm with a violent wind, in particular a tropical cyclone in the Caribbean.",
        "type": "noun",
        "example": "The hurricane caused a lot of damage.",
        "difficulty": "B1"
    },
    {
        "english": "hurry",
        "bengali": "তাড়াতাড়ি করা",
        "meaning": "Move or act with great haste.",
        "type": "noun, verb",
        "example": "We need to hurry or we will be late.",
        "difficulty": "B1"
    },
    {
        "english": "hurt",
        "bengali": "আঘাত করা",
        "meaning": "Cause physical pain or injury to.",
        "type": "verb, adjective, noun",
        "example": "I hurt my leg.",
        "difficulty": "A2"
    },
    {
        "english": "husband",
        "bengali": "স্বামী",
        "meaning": "A married man considered in relation to his spouse.",
        "type": "noun",
        "example": "She loves her husband very much.",
        "difficulty": "A1"
    },
    {
        "english": "I",
        "bengali": "আমি",
        "meaning": "Used by a speaker to refer to himself or herself.",
        "type": "pronoun",
        "example": "I am a student.",
        "difficulty": "A1"
    },
    {
        "english": "ice",
        "bengali": "বরফ",
        "meaning": "Frozen water, a brittle transparent crystalline solid.",
        "type": "noun",
        "example": "The lake is covered with ice.",
        "difficulty": "A1"
    },
    {
        "english": "ice cream",
        "bengali": "আইসক্রিম",
        "meaning": "A soft, sweet frozen food made with milk and cream and typically flavored with vanilla, fruit, or other ingredients.",
        "type": "noun",
        "example": "I would like some ice cream.",
        "difficulty": "A1"
    },
    {
        "english": "idea",
        "bengali": "ধারণা",
        "meaning": "A thought or suggestion as to a possible course of action.",
        "type": "noun",
        "example": "I have a good idea.",
        "difficulty": "A1"
    },
    {
        "english": "ideal",
        "bengali": "আদর্শ",
        "meaning": "Satisfying one's conception of what is perfect; most suitable.",
        "type": "adjective, noun",
        "example": "This is an ideal place for a picnic.",
        "difficulty": "A2"
    },
    {
        "english": "identify",
        "bengali": "শনাক্ত করা",
        "meaning": "Establish or indicate who or what (someone or something) is.",
        "type": "verb",
        "example": "Can you identify the man in the picture?",
        "difficulty": "A2"
    },
    {
        "english": "identity",
        "bengali": "পরিচয়",
        "meaning": "The fact of being who or what a person or thing is.",
        "type": "noun",
        "example": "The police are trying to discover the identity of the killer.",
        "difficulty": "B1"
    },
    {
        "english": "if",
        "bengali": "যদি",
        "meaning": "Introducing a conditional clause.",
        "type": "conjunction",
        "example": "If you are hungry, you can eat an apple.",
        "difficulty": "A1"
    },
    {
        "english": "ignore",
        "bengali": "উপেক্ষা করা",
        "meaning": "Refuse to take notice of or acknowledge; disregard intentionally.",
        "type": "verb",
        "example": "He ignored my advice.",
        "difficulty": "B1"
    },
    {
        "english": "ill",
        "bengali": "অসুস্থ",
        "meaning": "Not in full health; sick.",
        "type": "adjective",
        "example": "She is very ill.",
        "difficulty": "A2"
    },
    {
        "english": "illegal",
        "bengali": "অবৈধ",
        "meaning": "Contrary to or forbidden by law, especially criminal law.",
        "type": "adjective",
        "example": "It is illegal to park here.",
        "difficulty": "B1"
    },
    {
        "english": "illness",
        "bengali": "অসুস্থতা",
        "meaning": "A disease or period of sickness affecting the body or mind.",
        "type": "noun",
        "example": "He died after a long illness.",
        "difficulty": "A2"
    },
    {
        "english": "illustrate",
        "bengali": "চিত্রিত করা",
        "meaning": "Provide (a book, newspaper, etc.) with pictures.",
        "type": "verb",
        "example": "The book is illustrated with beautiful drawings.",
        "difficulty": "B2"
    },
    {
        "english": "illustration",
        "bengali": "চিত্রণ",
        "meaning": "A picture illustrating a book, newspaper, etc.",
        "type": "noun",
        "example": "The book has many beautiful illustrations.",
        "difficulty": "B2"
    },
    {
        "english": "image",
        "bengali": "ছবি",
        "meaning": "A representation of the external form of a person or thing in art.",
        "type": "noun",
        "example": "The image is a bit blurry.",
        "difficulty": "A2"
    },
    {
        "english": "imaginary",
        "bengali": "কাল্পনিক",
        "meaning": "Existing only in the imagination.",
        "type": "adjective",
        "example": "The story is about an imaginary world.",
        "difficulty": "B1"
    },
    {
        "english": "imagination",
        "bengali": "কল্পনা",
        "meaning": "The faculty or action of forming new ideas, or images or concepts of external objects not present to the senses.",
        "type": "noun",
        "example": "He has a vivid imagination.",
        "difficulty": "B2"
    },
    {
        "english": "imagine",
        "bengali": "কল্পনা করা",
        "meaning": "Form a mental image or concept of.",
        "type": "verb",
        "example": "Can you imagine what it would be like to live on the moon?",
        "difficulty": "A1"
    },
    {
        "english": "immediate",
        "bengali": "অবিলম্বে",
        "meaning": "Occurring or done at once; instant.",
        "type": "adjective",
        "example": "We need an immediate answer.",
        "difficulty": "B1"
    },
    {
        "english": "immediately",
        "bengali": "অবিলম্বে",
        "meaning": "At once; instantly.",
        "type": "adverb",
        "example": "Please call me immediately.",
        "difficulty": "A2"
    },
    {
        "english": "immigrant",
        "bengali": "অভিবাসী",
        "meaning": "A person who comes to live permanently in a foreign country.",
        "type": "noun",
        "example": "He is an immigrant from China.",
        "difficulty": "B1"
    },
    {
        "english": "impact",
        "bengali": "প্রভাব",
        "meaning": "The action of one object coming forcibly into contact with another.",
        "type": "noun, verb",
        "example": "The new law will have a big impact on our lives.",
        "difficulty": "B1"
    },
    {
        "english": "impatient",
        "bengali": "অধৈর্য",
        "meaning": "Having or showing a tendency to be quickly irritated or provoked.",
        "type": "adjective",
        "example": "Don't be so impatient.",
        "difficulty": "B2"
    },
    {
        "english": "imply",
        "bengali": "বোঝানো",
        "meaning": "Strongly suggest the truth or existence of (something not expressly stated).",
        "type": "verb",
        "example": "What do you imply by that statement?",
        "difficulty": "B2"
    },
    {
        "english": "import",
        "bengali": "আমদানি",
        "meaning": "Bring (goods or services) into a country from abroad for sale.",
        "type": "noun, verb",
        "example": "The country imports a lot of goods from other countries.",
        "difficulty": "B1"
    },
    {
        "english": "importance",
        "bengali": "গুরুত্ব",
        "meaning": "The state or fact of being of great significance or value.",
        "type": "noun",
        "example": "This is a matter of great importance.",
        "difficulty": "B1"
    },
    {
        "english": "important",
        "bengali": "গুরুত্বপূর্ণ",
        "meaning": "Of great significance or value; likely to have a profound effect on success, survival, or well-being.",
        "type": "adjective",
        "example": "This is an important meeting.",
        "difficulty": "A1"
    },
    {
        "english": "impose",
        "bengali": "আরোপ করা",
        "meaning": "Force (something unwelcome or unfamiliar) to be accepted or put in place.",
        "type": "verb",
        "example": "The government has imposed a new tax.",
        "difficulty": "B2"
    },
    {
        "english": "impossible",
        "bengali": "অসম্ভব",
        "meaning": "Not able to occur, exist, or be done.",
        "type": "adjective",
        "example": "It is impossible to do this in one day.",
        "difficulty": "A2"
    },
    {
        "english": "impress",
        "bengali": "প্রভাবিত করা",
        "meaning": "Make (someone) feel admiration and respect.",
        "type": "verb",
        "example": "He tried to impress her with his knowledge.",
        "difficulty": "B2"
    },
    {
        "english": "impressed",
        "bengali": "প্রভাবিত",
        "meaning": "Feeling admiration and respect.",
        "type": "adjective",
        "example": "I was very impressed with his work.",
        "difficulty": "B2"
    },
    {
        "english": "impression",
        "bengali": "ছাপ",
        "meaning": "An idea, feeling, or opinion about something or someone, especially one formed without conscious thought or on the basis of little evidence.",
        "type": "noun",
        "example": "He made a good impression on me.",
        "difficulty": "B1"
    },
    {
        "english": "impressive",
        "bengali": "চিত্তাকর্ষক",
        "meaning": "Evoking admiration through size, quality, or skill; grand, imposing, or awesome.",
        "type": "adjective",
        "example": "That was an impressive performance.",
        "difficulty": "B1"
    },
    {
        "english": "improve",
        "bengali": "উন্নত করা",
        "meaning": "Make or become better.",
        "type": "verb",
        "example": "I need to improve my English.",
        "difficulty": "A1"
    },
    {
        "english": "improvement",
        "bengali": "উন্নতি",
        "meaning": "An example of improving or being improved.",
        "type": "noun",
        "example": "There has been a great improvement in her work.",
        "difficulty": "B1"
    },
    {
        "english": "in",
        "bengali": "মধ্যে",
        "meaning": "Expressing the situation of something that is or appears to be enclosed or surrounded by something else.",
        "type": "preposition, adverb",
        "example": "The book is in the bag.",
        "difficulty": "A1"
    },
    {
        "english": "inch",
        "bengali": "ইঞ্চি",
        "meaning": "A unit of linear measure equal to one twelfth of a foot (2.54 cm).",
        "type": "noun",
        "example": "He is five feet ten inches tall.",
        "difficulty": "B2"
    },
    {
        "english": "incident",
        "bengali": "ঘটনা",
        "meaning": "An event or occurrence.",
        "type": "noun",
        "example": "It was a strange incident.",
        "difficulty": "B2"
    },
    {
        "english": "include",
        "bengali": "অন্তর্ভুক্ত করা",
        "meaning": "Comprise or contain as part of a whole.",
        "type": "verb",
        "example": "The price includes breakfast.",
        "difficulty": "A1"
    },
    {
        "english": "included",
        "bengali": "অন্তর্ভুক্ত",
        "meaning": "Contained as part of a whole.",
        "type": "adjective",
        "example": "Breakfast is included in the price.",
        "difficulty": "A2"
    },
    {
        "english": "including",
        "bengali": "সহ",
        "meaning": "Containing as part of the whole being considered.",
        "type": "preposition",
        "example": "Everyone was there, including John.",
        "difficulty": "A2"
    },
    {
        "english": "income",
        "bengali": "আয়",
        "meaning": "Money received, especially on a regular basis, for work or through investments.",
        "type": "noun",
        "example": "He has a high income.",
        "difficulty": "B2"
    },
    {
        "english": "increase",
        "bengali": "বৃদ্ধি",
        "meaning": "Become or make greater in size, amount, intensity, or degree.",
        "type": "verb, noun",
        "example": "The population has increased in recent years.",
        "difficulty": "A2"
    },
    {
        "english": "increasingly",
        "bengali": "ক্রমশ",
        "meaning": "To an increasing extent; more and more.",
        "type": "adverb",
        "example": "It is becoming increasingly difficult to find a job.",
        "difficulty": "B2"
    },
    {
        "english": "incredible",
        "bengali": "অবিশ্বাস্য",
        "meaning": "Impossible to believe.",
        "type": "adjective",
        "example": "The story is incredible.",
        "difficulty": "A2"
    },
    {
        "english": "incredibly",
        "bengali": "অবিশ্বাস্যভাবে",
        "meaning": "To a great degree; extremely.",
        "type": "adverb",
        "example": "He is incredibly smart.",
        "difficulty": "B1"
    },
    {
        "english": "indeed",
        "bengali": "প্রকৃতপক্ষে",
        "meaning": "Used to emphasize a statement or response confirming something already suggested.",
        "type": "adverb",
        "example": "It is indeed a beautiful day.",
        "difficulty": "B1"
    },
    {
        "english": "independent",
        "bengali": "স্বাধীন",
        "meaning": "Free from outside control; not depending on another for livelihood or subsistence.",
        "type": "adjective",
        "example": "She is an independent woman.",
        "difficulty": "A2"
    },
    {
        "english": "indicate",
        "bengali": "নির্দেশ করা",
        "meaning": "Point out; show.",
        "type": "verb",
        "example": "The sign indicates the way to the station.",
        "difficulty": "B1"
    },
    {
        "english": "indirect",
        "bengali": "পরোক্ষ",
        "meaning": "Not directly caused by or resulting from something.",
        "type": "adjective",
        "example": "The indirect effects of the war were devastating.",
        "difficulty": "B1"
    },
    {
        "english": "individual",
        "bengali": "ব্যক্তি",
        "meaning": "A single human being as distinct from a group, class, or family.",
        "type": "noun, adjective",
        "example": "Each individual has a right to their own opinion.",
        "difficulty": "A2"
    },
    {
        "english": "indoor",
        "bengali": "ইনডোর",
        "meaning": "Situated, existing, or intended for use inside a building.",
        "type": "adjective",
        "example": "This is an indoor swimming pool.",
        "difficulty": "B1"
    },
    {
        "english": "indoors",
        "bengali": "ভিতরে",
        "meaning": "Into or within a building.",
        "type": "adverb",
        "example": "It's raining, let's go indoors.",
        "difficulty": "B1"
    },
    {
        "english": "industrial",
        "bengali": "শিল্প",
        "meaning": "Relating to or characterized by industry.",
        "type": "adjective",
        "example": "This is an industrial city.",
        "difficulty": "B2"
    },
    {
        "english": "industry",
        "bengali": "শিল্প",
        "meaning": "Economic activity concerned with the processing of raw materials and manufacture of goods in factories.",
        "type": "noun",
        "example": "The textile industry is very important in this country.",
        "difficulty": "A2"
    },
    {
        "english": "infection",
        "bengali": "সংক্রমণ",
        "meaning": "The process of infecting or the state of being infected.",
        "type": "noun",
        "example": "He has a throat infection.",
        "difficulty": "B2"
    },
    {
        "english": "influence",
        "bengali": "প্রভাব",
        "meaning": "The capacity to have an effect on the character, development, or behavior of someone or something, or the effect itself.",
        "type": "noun, verb",
        "example": "He has a great influence on his students.",
        "difficulty": "B1"
    },
    {
        "english": "inform",
        "bengali": "জানানো",
        "meaning": "Give (someone) facts or information; tell.",
        "type": "verb",
        "example": "Please inform me of any changes.",
        "difficulty": "B2"
    },
    {
        "english": "informal",
        "bengali": "অনানুষ্ঠানিক",
        "meaning": "Having a relaxed, friendly, or unofficial style, manner, or nature.",
        "type": "adjective",
        "example": "It was an informal meeting.",
        "difficulty": "A2"
    },
    {
        "english": "information",
        "bengali": "তথ্য",
        "meaning": "Facts provided or learned about something or someone.",
        "type": "noun",
        "example": "I need more information about this.",
        "difficulty": "A1"
    },
    {
        "english": "ingredient",
        "bengali": "উপাদান",
        "meaning": "Any of the foods or substances that are combined to make a particular dish.",
        "type": "noun",
        "example": "The main ingredients of this dish are flour, eggs, and sugar.",
        "difficulty": "B1"
    },
    {
        "english": "initial",
        "bengali": "প্রাথমিক",
        "meaning": "Existing or occurring at the beginning.",
        "type": "adjective",
        "example": "My initial reaction was surprise.",
        "difficulty": "B2"
    },
    {
        "english": "initially",
        "bengali": "প্রাথমিকভাবে",
        "meaning": "At first.",
        "type": "adverb",
        "example": "Initially, I was not sure what to do.",
        "difficulty": "B2"
    },
    {
        "english": "initiative",
        "bengali": "উদ্যোগ",
        "meaning": "The ability to assess and initiate things independently.",
        "type": "noun",
        "example": "She showed great initiative in solving the problem.",
        "difficulty": "B2"
    },
    {
        "english": "injure",
        "bengali": "আহত করা",
        "meaning": "Do physical harm or damage to (someone).",
        "type": "verb",
        "example": "He was injured in the accident.",
        "difficulty": "B1"
    },
    {
        "english": "injured",
        "bengali": "আহত",
        "meaning": "Harmed, damaged, or impaired.",
        "type": "adjective",
        "example": "The injured man was taken to the hospital.",
        "difficulty": "B1"
    },
    {
        "english": "injury",
        "bengali": "আঘাত",
        "meaning": "An instance of being injured.",
        "type": "noun",
        "example": "He suffered a serious injury.",
        "difficulty": "A2"
    },
    {
        "english": "inner",
        "bengali": "ভিতরের",
        "meaning": "Situated inside or further in; internal.",
        "type": "adjective",
        "example": "The inner part of the house is very beautiful.",
        "difficulty": "B2"
    },
    {
        "english": "innocent",
        "bengali": "নিরপরাধ",
        "meaning": "Not guilty of a crime or offense.",
        "type": "adjective",
        "example": "He is an innocent man.",
        "difficulty": "B1"
    },
    {
        "english": "inquiry",
        "bengali": "অনুসন্ধান",
        "meaning": "An act of asking for information.",
        "type": "noun",
        "example": "The police have launched an inquiry into the matter.",
        "difficulty": "B2"
    },
    {
        "english": "insect",
        "bengali": "পোকা",
        "meaning": "A small arthropod animal that has six legs and generally one or two pairs of wings.",
        "type": "noun",
        "example": "There are many insects in the garden.",
        "difficulty": "A2"
    },
    {
        "english": "inside",
        "bengali": "ভিতরে",
        "meaning": "The inner side or surface of something.",
        "type": "preposition, adverb, noun, adjective",
        "example": "The cat is inside the box.",
        "difficulty": "A2"
    },
    {
        "english": "insight",
        "bengali": "অন্তর্দৃষ্টি",
        "meaning": "The capacity to gain an accurate and deep intuitive understanding of a person or thing.",
        "type": "noun",
        "example": "The book gives a fascinating insight into the life of the author.",
        "difficulty": "B2"
    },
    {
        "english": "insist",
        "bengali": "জেদ করা",
        "meaning": "Demand something forcefully, not accepting refusal.",
        "type": "verb",
        "example": "He insisted on paying for the meal.",
        "difficulty": "B2"
    },
    {
        "english": "inspire",
        "bengali": "অনুপ্রাণিত করা",
        "meaning": "Fill (someone) with the urge or ability to do or feel something, especially to do something creative.",
        "type": "verb",
        "example": "His speech inspired us to work harder.",
        "difficulty": "B2"
    },
    {
        "english": "install",
        "bengali": "ইনস্টল করা",
        "meaning": "Place or fix (equipment or machinery) in position ready for use.",
        "type": "verb",
        "example": "We need to install a new software.",
        "difficulty": "B2"
    },
    {
        "english": "instance",
        "bengali": "দৃষ্টান্ত",
        "meaning": "An example or single occurrence of something.",
        "type": "noun",
        "example": "For instance, you could take the bus.",
        "difficulty": "B2"
    },
    {
        "english": "instead",
        "bengali": "পরিবর্তে",
        "meaning": "As an alternative to.",
        "type": "adverb",
        "example": "I will have tea instead of coffee.",
        "difficulty": "A2"
    },
    {
        "english": "institute",
        "bengali": "প্রতিষ্ঠান",
        "meaning": "An organization having a particular purpose, especially one that is connected with education or a particular profession.",
        "type": "noun",
        "example": "He works at a research institute.",
        "difficulty": "B2"
    },
    {
        "english": "institution",
        "bengali": "প্রতিষ্ঠান",
        "meaning": "A large important organization, such as a university, church, or bank.",
        "type": "noun",
        "example": "The university is a respected institution.",
        "difficulty": "B2"
    },
    {
        "english": "instruction",
        "bengali": "নির্দেশনা",
        "meaning": "A direction or order.",
        "type": "noun",
        "example": "Please follow the instructions carefully.",
        "difficulty": "A2"
    },
    {
        "english": "instructor",
        "bengali": "প্রশিক্ষক",
        "meaning": "A person who teaches something.",
        "type": "noun",
        "example": "He is a driving instructor.",
        "difficulty": "A2"
    },
    {
        "english": "instrument",
        "bengali": "যন্ত্র",
        "meaning": "A tool or implement, especially one for precision work.",
        "type": "noun",
        "example": "A thermometer is an instrument for measuring temperature.",
        "difficulty": "A2"
    },
    {
        "english": "insurance",
        "bengali": "বীমা",
        "meaning": "A practice or arrangement by which a company or government agency provides a guarantee of compensation for specified loss, damage, illness, or death in return for payment of a premium.",
        "type": "noun",
        "example": "Do you have car insurance?",
        "difficulty": "B2"
    },
    {
        "english": "intelligence",
        "bengali": "বুদ্ধিমত্তা",
        "meaning": "The ability to acquire and apply knowledge and skills.",
        "type": "noun",
        "example": "She is a woman of great intelligence.",
        "difficulty": "B1"
    },
    {
        "english": "intelligent",
        "bengali": "বুদ্ধিমান",
        "meaning": "Having or showing intelligence, especially of a high level.",
        "type": "adjective",
        "example": "He is a very intelligent student.",
        "difficulty": "A2"
    },
    {
        "english": "intend",
        "bengali": "ইচ্ছা করা",
        "meaning": "Have (a course of action) as one's purpose or objective; plan.",
        "type": "verb",
        "example": "What do you intend to do?",
        "difficulty": "B1"
    },
    {
        "english": "intended",
        "bengali": "উদ্দিষ্ট",
        "meaning": "Planned or meant.",
        "type": "adjective",
        "example": "The intended victim was not at home.",
        "difficulty": "B2"
    },
    {
        "english": "intense",
        "bengali": "তীব্র",
        "meaning": "Of extreme force, degree, or strength.",
        "type": "adjective",
        "example": "The heat was intense.",
        "difficulty": "B2"
    },
    {
        "english": "intention",
        "bengali": "উদ্দেশ্য",
        "meaning": "A thing intended; an aim or plan.",
        "type": "noun",
        "example": "I have no intention of leaving.",
        "difficulty": "B1"
    },
    {
        "english": "interest",
        "bengali": "আগ্রহ",
        "meaning": "The state of wanting to know or learn about something or someone.",
        "type": "noun, verb",
        "example": "I have no interest in politics.",
        "difficulty": "A1"
    },
    {
        "english": "interested",
        "bengali": "আগ্রহী",
        "meaning": "Showing curiosity or concern about something or someone; having a feeling of interest.",
        "type": "adjective",
        "example": "I am interested in art.",
        "difficulty": "A1"
    },
    {
        "english": "interesting",
        "bengali": "আকর্ষণীয়",
        "meaning": "Arousing curiosity or interest; holding or catching the attention.",
        "type": "adjective",
        "example": "This is an interesting book.",
        "difficulty": "A1"
    },
    {
        "english": "internal",
        "bengali": "অভ্যন্তরীণ",
        "meaning": "Of or situated on the inside.",
        "type": "adjective",
        "example": "The internal structure of the building is very complex.",
        "difficulty": "B2"
    },
    {
        "english": "international",
        "bengali": "আন্তর্জাতিক",
        "meaning": "Existing, occurring, or carried on between two or more nations.",
        "type": "adjective",
        "example": "This is an international company.",
        "difficulty": "A2"
    },
    {
        "english": "Internet",
        "bengali": "ইন্টারনেট",
        "meaning": "A global computer network providing a variety of information and communication facilities, consisting of interconnected networks using standardized communication protocols.",
        "type": "noun",
        "example": "I use the internet every day.",
        "difficulty": "A1"
    },
    {
        "english": "interpret",
        "bengali": "ব্যাখ্যা করা",
        "meaning": "Explain the meaning of (information, words, or actions).",
        "type": "verb",
        "example": "How do you interpret this poem?",
        "difficulty": "B2"
    },
    {
        "english": "interrupt",
        "bengali": "বাধা দেওয়া",
        "meaning": "Stop the continuous progress of (an activity or process).",
        "type": "verb",
        "example": "Please don't interrupt me.",
        "difficulty": "B2"
    },
    {
        "english": "interview",
        "bengali": "সাক্ষাৎকার",
        "meaning": "A meeting of people face to face, especially for consultation.",
        "type": "noun, verb",
        "example": "I have a job interview tomorrow.",
        "difficulty": "A1"
    },
    {
        "english": "into",
        "bengali": "ভিতরে",
        "meaning": "Expressing movement or action with the result that someone or something becomes enclosed or surrounded by something else.",
        "type": "preposition",
        "example": "The cat ran into the house.",
        "difficulty": "A1"
    },
    {
        "english": "introduce",
        "bengali": "পরিচয় করিয়ে দেওয়া",
        "meaning": "Bring (something, especially a product, measure, or concept) into use or operation for the first time.",
        "type": "verb",
        "example": "Let me introduce you to my friend.",
        "difficulty": "A1"
    },
    {
        "english": "introduction",
        "bengali": "ভূমিকা",
        "meaning": "The action of introducing something.",
        "type": "noun",
        "example": "The book has a long introduction.",
        "difficulty": "A2"
    },
    {
        "english": "invent",
        "bengali": "উদ্ভাবন করা",
        "meaning": "Create or design (something that has not existed before); be the originator of.",
        "type": "verb",
        "example": "Who invented the telephone?",
        "difficulty": "A2"
    },
    {
        "english": "invention",
        "bengali": "উদ্ভাবন",
        "meaning": "The action of inventing something, typically a process or device.",
        "type": "noun",
        "example": "The invention of the internet changed the world.",
        "difficulty": "A2"
    },
    {
        "english": "invest",
        "bengali": "বিনিয়োগ করা",
        "meaning": "Put (money) into financial schemes, shares, property, or a commercial venture with the expectation of achieving a profit.",
        "type": "verb",
        "example": "He invested his money in the stock market.",
        "difficulty": "B1"
    },
    {
        "english": "investigate",
        "bengali": "তদন্ত করা",
        "meaning": "Carry out a systematic or formal inquiry to discover and examine the facts of (an incident, allegation, etc.) so as to establish the truth.",
        "type": "verb",
        "example": "The police are investigating the crime.",
        "difficulty": "B1"
    },
    {
        "english": "investigation",
        "bengali": "তদন্ত",
        "meaning": "The action of investigating something or someone; formal or systematic examination or research.",
        "type": "noun",
        "example": "The police have launched an investigation into the matter.",
        "difficulty": "B2"
    },
    {
        "english": "investment",
        "bengali": "বিনিয়োগ",
        "meaning": "The action or process of investing money for profit or material result.",
        "type": "noun",
        "example": "He made a good investment.",
        "difficulty": "B2"
    },
    {
        "english": "invitation",
        "bengali": "আমন্ত্রণ",
        "meaning": "A written or verbal request inviting someone to go somewhere or to do something.",
        "type": "noun",
        "example": "I received an invitation to the party.",
        "difficulty": "A2"
    },
    {
        "english": "invite",
        "bengali": "আমন্ত্রণ করা",
        "meaning": "Make a polite, formal, or friendly request to (someone) to go somewhere or to do something.",
        "type": "verb",
        "example": "I invited her to my birthday party.",
        "difficulty": "A2"
    },
    {
        "english": "involve",
        "bengali": "জড়িত করা",
        "meaning": "(of a situation or event) include (something) as a necessary part or result.",
        "type": "verb",
        "example": "The job involves a lot of traveling.",
        "difficulty": "A2"
    },
    {
        "english": "involved",
        "bengali": "জড়িত",
        "meaning": "Difficult to understand; complicated.",
        "type": "adjective",
        "example": "He was involved in a car accident.",
        "difficulty": "B1"
    },
    {
        "english": "iron",
        "bengali": "লোহা",
        "meaning": "A strong, hard magnetic silvery-gray metal, the chemical element of atomic number 26, much used as a material for construction and manufacturing, especially in the form of steel.",
        "type": "noun, verb",
        "example": "The gate is made of iron.",
        "difficulty": "B1"
    },
    {
        "english": "island",
        "bengali": "দ্বীপ",
        "meaning": "A piece of land surrounded by water.",
        "type": "noun",
        "example": "We spent our holiday on a tropical island.",
        "difficulty": "A1"
    },
    {
        "english": "issue",
        "bengali": "বিষয়",
        "meaning": "An important topic or problem for debate or discussion.",
        "type": "noun, verb",
        "example": "This is a very important issue.",
        "difficulty": "B1"
    },
    {
        "english": "IT",
        "bengali": "আইটি",
        "meaning": "Information technology.",
        "type": "noun",
        "example": "He works in the IT department.",
        "difficulty": "A2"
    },
    {
        "english": "it",
        "bengali": "এটা",
        "meaning": "Used to refer to a thing previously mentioned or easily identified.",
        "type": "pronoun",
        "example": "It is a beautiful day.",
        "difficulty": "A1"
    },
    {
        "english": "item",
        "bengali": "আইটেম",
        "meaning": "An individual article or unit, especially one that is part of a list, collection, or set.",
        "type": "noun",
        "example": "There are many items on the shopping list.",
        "difficulty": "A2"
    },
    {
        "english": "its",
        "bengali": "এর",
        "meaning": "Belonging to or associated with a thing previously mentioned or easily identified.",
        "type": "determiner",
        "example": "The dog wagged its tail.",
        "difficulty": "A1"
    },
    {
        "english": "itself",
        "bengali": "নিজেই",
        "meaning": "Used as the object of a verb or preposition to refer to a thing or animal previously mentioned as the subject of the clause.",
        "type": "pronoun",
        "example": "The cat is washing itself.",
        "difficulty": "A2"
    },
    {
        "english": "jacket",
        "bengali": "জ্যাকেট",
        "meaning": "An outer garment extending either to the waist or the hips, typically having sleeves and a fastening down the front.",
        "type": "noun",
        "example": "He was wearing a leather jacket.",
        "difficulty": "A1"
    },
    {
        "english": "jam",
        "bengali": "জ্যাম",
        "meaning": "A sweet spread or conserve made from fruit and sugar boiled to a thick consistency.",
        "type": "noun",
        "example": "I like to eat jam on my toast.",
        "difficulty": "A2"
    },
    {
        "english": "January",
        "bengali": "জানুয়ারি",
        "meaning": "The first month of the year, in the northern hemisphere usually considered the middle of winter.",
        "type": "noun",
        "example": "My birthday is in January.",
        "difficulty": "A1"
    },
    {
        "english": "jazz",
        "bengali": "জ্যাজ",
        "meaning": "A type of music of black American origin characterized by improvisation, syncopation, and usually a regular or forceful rhythm, emerging at the beginning of the 20th century.",
        "type": "noun",
        "example": "I enjoy listening to jazz music.",
        "difficulty": "B1"
    },
    {
        "english": "jeans",
        "bengali": "জিন্স",
        "meaning": "Hard-wearing casual trousers made of denim or other cotton fabric.",
        "type": "noun",
        "example": "She was wearing a pair of blue jeans.",
        "difficulty": "A1"
    },
    {
        "english": "jewelry",
        "bengali": "গয়না",
        "meaning": "Personal ornaments, such as necklaces, rings, or bracelets, that are typically made from or contain jewels and precious metal.",
        "type": "noun",
        "example": "She loves to wear jewelry.",
        "difficulty": "A2"
    },
    {
        "english": "job",
        "bengali": "চাকরি",
        "meaning": "A paid position of regular employment.",
        "type": "noun",
        "example": "He is looking for a job.",
        "difficulty": "A1"
    },
    {
        "english": "join",
        "bengali": "যোগদান করা",
        "meaning": "Link; connect.",
        "type": "verb",
        "example": "Would you like to join us for dinner?",
        "difficulty": "A1"
    },
    {
        "english": "joke",
        "bengali": "কৌতুক",
        "meaning": "A thing that someone says to cause amusement or laughter, especially a story with a funny punchline.",
        "type": "noun, verb",
        "example": "He told a funny joke.",
        "difficulty": "A2"
    },
    {
        "english": "journal",
        "bengali": "জার্নাল",
        "meaning": "A newspaper or magazine that deals with a particular subject or professional activity.",
        "type": "noun",
        "example": "He writes for a medical journal.",
        "difficulty": "B1"
    },
    {
        "english": "journalist",
        "bengali": "সাংবাদিক",
        "meaning": "A person who writes for newspapers, magazines, or news websites or prepares news to be broadcast.",
        "type": "noun",
        "example": "She is a famous journalist.",
        "difficulty": "A2"
    },
    {
        "english": "journey",
        "bengali": "যাত্রা",
        "meaning": "An act of traveling from one place to another.",
        "type": "noun",
        "example": "It was a long journey.",
        "difficulty": "B1"
    },
    {
        "english": "joy",
        "bengali": "আনন্দ",
        "meaning": "A feeling of great pleasure and happiness.",
        "type": "noun",
        "example": "She was filled with joy.",
        "difficulty": "B2"
    },
    {
        "english": "judge",
        "bengali": "বিচারক",
        "meaning": "A public officer appointed to decide cases in a law court.",
        "type": "noun, verb",
        "example": "The judge sentenced him to ten years in prison.",
        "difficulty": "B1"
    },
    {
        "english": "judgment",
        "bengali": "বিচার",
        "meaning": "The ability to make considered decisions or come to sensible conclusions.",
        "type": "noun",
        "example": "He has good judgment.",
        "difficulty": "B2"
    },
    {
        "english": "juice",
        "bengali": "রস",
        "meaning": "The liquid obtained from or present in fruit or vegetables.",
        "type": "noun",
        "example": "I would like a glass of orange juice.",
        "difficulty": "A1"
    },
    {
        "english": "July",
        "bengali": "জুলাই",
        "meaning": "The seventh month of the year, in the northern hemisphere the second month of summer.",
        "type": "noun",
        "example": "My birthday is in July.",
        "difficulty": "A1"
    },
    {
        "english": "jump",
        "bengali": "লাফানো",
        "meaning": "Push oneself off a surface and into the air by using the muscles in one's legs and feet.",
        "type": "verb, noun",
        "example": "The cat jumped onto the table.",
        "difficulty": "A2"
    },
    {
        "english": "June",
        "bengali": "জুন",
        "meaning": "The sixth month of the year, in the northern hemisphere the first month of summer.",
        "type": "noun",
        "example": "My birthday is in June.",
        "difficulty": "A1"
    },
    {
        "english": "junior",
        "bengali": "কনিষ্ঠ",
        "meaning": "Of or for younger or more recent students.",
        "type": "adjective, noun",
        "example": "He is a junior employee.",
        "difficulty": "B2"
    },
    {
        "english": "just",
        "bengali": "মাত্র",
        "meaning": "Exactly.",
        "type": "adverb",
        "example": "I just arrived.",
        "difficulty": "A1"
    },
    {
        "english": "justice",
        "bengali": "ন্যায়বিচার",
        "meaning": "Just behavior or treatment.",
        "type": "noun",
        "example": "We are fighting for justice.",
        "difficulty": "B2"
    },
    {
        "english": "justify",
        "bengali": "ন্যায্যতা প্রতিপাদন করা",
        "meaning": "Show or prove to be right or reasonable.",
        "type": "verb",
        "example": "How can you justify your actions?",
        "difficulty": "B2"
    },
    {
        "english": "keep",
        "bengali": "রাখা",
        "meaning": "Have or retain possession of.",
        "type": "verb",
        "example": "Please keep the change.",
        "difficulty": "A1"
    },
    {
        "english": "key",
        "bengali": "চাবি",
        "meaning": "A small piece of shaped metal with incisions cut to fit the wards of a particular lock, which is inserted into a lock and turned to open or close it.",
        "type": "noun, adjective, verb",
        "example": "I can't find my keys.",
        "difficulty": "A1"
    },
    {
        "english": "keyboard",
        "bengali": "কিবোর্ড",
        "meaning": "A panel of keys that operate a computer or typewriter.",
        "type": "noun",
        "example": "I need a new keyboard for my computer.",
        "difficulty": "B1"
    },
    {
        "english": "kick",
        "bengali": "লাথি মারা",
        "meaning": "Strike or propel forcefully with the foot.",
        "type": "verb, noun",
        "example": "He kicked the ball.",
        "difficulty": "B1"
    },
    {
        "english": "kid",
        "bengali": "বাচ্চা",
        "meaning": "A child or young person.",
        "type": "noun",
        "example": "The kids are playing in the garden.",
        "difficulty": "A2"
    },
    {
        "english": "kill",
        "bengali": "হত্যা করা",
        "meaning": "Cause the death of (a person, animal, or other living thing).",
        "type": "verb",
        "example": "He was killed in a car accident.",
        "difficulty": "A2"
    },
    {
        "english": "killing",
        "bengali": "হত্যা",
        "meaning": "An act of causing death, especially deliberately.",
        "type": "noun",
        "example": "The killing of innocent people is a terrible crime.",
        "difficulty": "B1"
    },
    {
        "english": "kilometer",
        "bengali": "কিলোমিটার",
        "meaning": "A metric unit of measurement equal to 1,000 meters (approximately 0.62 miles).",
        "type": "noun",
        "example": "The nearest town is ten kilometers away.",
        "difficulty": "A2"
    },
    {
        "english": "kind (type)",
        "bengali": "ধরনের",
        "meaning": "A class or group of things or people having similar characteristics.",
        "type": "noun",
        "example": "What kind of music do you like?",
        "difficulty": "A1"
    },
    {
        "english": "kind (caring)",
        "bengali": "দয়ালু",
        "meaning": "Having or showing a friendly, generous, and considerate nature.",
        "type": "adjective",
        "example": "She is a very kind person.",
        "difficulty": "B1"
    },
    {
        "english": "king",
        "bengali": "রাজা",
        "meaning": "The male ruler of an independent state, especially one who inherits the position by right of birth.",
        "type": "noun",
        "example": "The king is a powerful ruler.",
        "difficulty": "A2"
    },
    {
        "english": "kiss",
        "bengali": "চুম্বন",
        "meaning": "Touch or caress with the lips as a sign of love, sexual desire, or greeting.",
        "type": "verb, noun",
        "example": "She gave him a kiss.",
        "difficulty": "B1"
    },
    {
        "english": "kitchen",
        "bengali": "রান্নাঘর",
        "meaning": "A room or area equipped for preparing and cooking food.",
        "type": "noun",
        "example": "My mother is in the kitchen.",
        "difficulty": "A1"
    },
    {
        "english": "knee",
        "bengali": "হাঁটু",
        "meaning": "The joint between the thigh and the lower leg in humans.",
        "type": "noun",
        "example": "I hurt my knee.",
        "difficulty": "A2"
    },
    {
        "english": "knife",
        "bengali": "ছুরি",
        "meaning": "An instrument composed of a blade fixed into a handle, used for cutting as a utensil or weapon.",
        "type": "noun",
        "example": "I need a knife to cut the bread.",
        "difficulty": "A2"
    },
    {
        "english": "knock",
        "bengali": "ঠক্ঠক্ করা",
        "meaning": "Strike a surface noisily to attract attention, especially when waiting to be let in through a door.",
        "type": "verb, noun",
        "example": "Someone is knocking on the door.",
        "difficulty": "A2"
    },
    {
        "english": "know",
        "bengali": "জানা",
        "meaning": "Have knowledge or information about something.",
        "type": "verb",
        "example": "I know the answer.",
        "difficulty": "A1"
    },
    {
        "english": "knowledge",
        "bengali": "জ্ঞান",
        "meaning": "Facts, information, and skills acquired by a person through experience or education; the theoretical or practical understanding of a subject.",
        "type": "noun",
        "example": "He has a good knowledge of history.",
        "difficulty": "A2"
    },
    {
        "english": "lab",
        "bengali": "ল্যাব",
        "meaning": "A laboratory.",
        "type": "noun",
        "example": "The scientists are working in the lab.",
        "difficulty": "A2"
    },
    {
        "english": "label",
        "bengali": "লেবেল",
        "meaning": "A small piece of paper, fabric, plastic, or similar material attached to an object and giving information about it.",
        "type": "noun, verb",
        "example": "Please put a label on your bag.",
        "difficulty": "B1"
    },
    {
        "english": "labor",
        "bengali": "শ্রম",
        "meaning": "Work, especially hard physical work.",
        "type": "noun",
        "example": "The new building was built with a lot of labor.",
        "difficulty": "B2"
    },
    {
        "english": "laboratory",
        "bengali": "গবেষণাগার",
        "meaning": "A room or building equipped for scientific experiments, research, or teaching, or for the manufacture of drugs or chemicals.",
        "type": "noun",
        "example": "The scientists are working in the laboratory.",
        "difficulty": "B1"
    },
    {
        "english": "lack",
        "bengali": "অভাব",
        "meaning": "The state of being without or not having enough of something.",
        "type": "noun, verb",
        "example": "There is a lack of food in some parts of the world.",
        "difficulty": "B1"
    },
    {
        "english": "lady",
        "bengali": "ভদ্রমহিলা",
        "meaning": "A woman (used as a polite or formal way of referring to a woman).",
        "type": "noun",
        "example": "The lady is wearing a beautiful dress.",
        "difficulty": "A2"
    },
    {
        "english": "lake",
        "bengali": "হ্রদ",
        "meaning": "A large area of water surrounded by land.",
        "type": "noun",
        "example": "We went for a swim in the lake.",
        "difficulty": "A2"
    },
    {
        "english": "lamp",
        "bengali": "বাতি",
        "meaning": "A device for giving light, either one consisting of an electric bulb together with its holder and shade, or one using oil or gas as fuel.",
        "type": "noun",
        "example": "Please turn on the lamp.",
        "difficulty": "A2"
    },
    {
        "english": "land",
        "bengali": "ভূমি",
        "meaning": "The part of the earth's surface that is not covered by water, as opposed to the sea or the air.",
        "type": "noun, verb",
        "example": "The plane is about to land.",
        "difficulty": "A1"
    },
    {
        "english": "landscape",
        "bengali": "ভূদৃশ্য",
        "meaning": "All the visible features of an area of land, often considered in terms of their aesthetic appeal.",
        "type": "noun",
        "example": "The landscape is beautiful.",
        "difficulty": "B2"
    },
    {
        "english": "language",
        "bengali": "ভাষা",
        "meaning": "The method of human communication, either spoken or written, consisting of the use of words in a structured and conventional way.",
        "type": "noun",
        "example": "English is a global language.",
        "difficulty": "A1"
    },
    {
        "english": "laptop",
        "bengali": "ল্যাপটপ",
        "meaning": "A computer that is portable and suitable for use while traveling.",
        "type": "noun",
        "example": "I have a new laptop.",
        "difficulty": "A2"
    },
    {
        "english": "large",
        "bengali": "বড়",
        "meaning": "Of considerable or relatively great size, extent, or capacity.",
        "type": "adjective",
        "example": "That is a large house.",
        "difficulty": "A1"
    },
    {
        "english": "largely",
        "bengali": "প্রধানত",
        "meaning": "To a great extent; on the whole; mostly.",
        "type": "adverb",
        "example": "The success of the project was largely due to her efforts.",
        "difficulty": "B2"
    },
    {
        "english": "last (final)",
        "bengali": "শেষ",
        "meaning": "Coming after all others in time or order; final.",
        "type": "determiner, adverb, noun",
        "example": "This is the last chapter of the book.",
        "difficulty": "A1"
    },
    {
        "english": "last (taking time)",
        "bengali": "স্থায়ী হওয়া",
        "meaning": "(of a process, activity, or state) continue for a specified period of time.",
        "type": "verb",
        "example": "The meeting lasted for two hours.",
        "difficulty": "A2"
    },
    {
        "english": "late",
        "bengali": "দেরি",
        "meaning": "Doing something or taking place after the expected, proper, or usual time.",
        "type": "adjective, adverb",
        "example": "I am late for work.",
        "difficulty": "A1"
    },
    {
        "english": "later",
        "bengali": "পরে",
        "meaning": "At a time in the future or after the time you have mentioned.",
        "type": "adverb, adjective",
        "example": "I will call you later.",
        "difficulty": "A1"
    },
    {
        "english": "latest",
        "bengali": "সর্বশেষ",
        "meaning": "Of most recent date.",
        "type": "adjective, noun",
        "example": "This is the latest news.",
        "difficulty": "B1"
    },
    {
        "english": "laugh",
        "bengali": "হাসা",
        "meaning": "Make the spontaneous sounds and movements of the face and body that are the instinctive expressions of lively amusement and sometimes also of derision.",
        "type": "verb, noun",
        "example": "She started to laugh.",
        "difficulty": "A1"
    },
    {
        "english": "laughter",
        "bengali": "হাসি",
        "meaning": "The action or sound of laughing.",
        "type": "noun",
        "example": "Her laughter is contagious.",
        "difficulty": "A2"
    },
    {
        "english": "launch",
        "bengali": "চালু করা",
        "meaning": "Start or set in motion (an activity or enterprise).",
        "type": "verb, noun",
        "example": "The company is going to launch a new product.",
        "difficulty": "B2"
    },
    {
        "english": "law",
        "bengali": "আইন",
        "meaning": "The system of rules which a particular country or community recognizes as regulating the actions of its members and which it may enforce by the imposition of penalties.",
        "type": "noun",
        "example": "We must obey the law.",
        "difficulty": "A2"
    },
    {
        "english": "lawyer",
        "bengali": "আইনজীবী",
        "meaning": "A person who practices or studies law; an attorney or a counselor.",
        "type": "noun",
        "example": "He is a famous lawyer.",
        "difficulty": "A2"
    },
    {
        "english": "lay",
        "bengali": "রাখা",
        "meaning": "Put down, especially gently or carefully.",
        "type": "verb",
        "example": "Please lay the book on the table.",
        "difficulty": "B1"
    },
    {
        "english": "layer",
        "bengali": "স্তর",
        "meaning": "A sheet, quantity, or thickness of material, typically one of several, covering a surface or body.",
        "type": "noun",
        "example": "The cake has three layers.",
        "difficulty": "B1"
    },
    {
        "english": "lazy",
        "bengali": "অলস",
        "meaning": "Unwilling to work or use energy; idle.",
        "type": "adjective",
        "example": "He is a lazy student.",
        "difficulty": "A2"
    },
    {
        "english": "lead",
        "bengali": "নেতৃত্ব দেওয়া",
        "meaning": "Cause (a person or animal) to go with one by holding them by the hand, a halter, a rope, etc. while moving forward.",
        "type": "verb, noun",
        "example": "He will lead the team.",
        "difficulty": "A2"
    },
    {
        "english": "leader",
        "bengali": "নেতা",
        "meaning": "The person who leads or commands a group, organization, or country.",
        "type": "noun",
        "example": "He is a great leader.",
        "difficulty": "A2"
    },
    {
        "english": "leadership",
        "bengali": "নেতৃত্ব",
        "meaning": "The action of leading a group of people or an organization.",
        "type": "noun",
        "example": "She has strong leadership skills.",
        "difficulty": "B2"
    },
    {
        "english": "leading",
        "bengali": "প্রধান",
        "meaning": "Most important.",
        "type": "adjective",
        "example": "He is a leading expert in his field.",
        "difficulty": "B1"
    },
    {
        "english": "leaf",
        "bengali": "পাতা",
        "meaning": "A flattened structure of a higher plant, typically green and bladelike, that is attached to a stem directly or via a stalk. Leaves are the main organs of photosynthesis and transpiration.",
        "type": "noun",
        "example": "The leaves are falling from the trees.",
        "difficulty": "B1"
    },
    {
        "english": "league",
        "bengali": "লীগ",
        "meaning": "A collection of people, countries, or groups that combine for a particular purpose, typically mutual protection or cooperation.",
        "type": "noun",
        "example": "He plays in a professional football league.",
        "difficulty": "B2"
    },
    {
        "english": "lean",
        "bengali": "ঝোঁকা",
        "meaning": "Be in or move into a sloping position.",
        "type": "verb",
        "example": "Don't lean against the wall.",
        "difficulty": "B2"
    },
    {
        "english": "learn",
        "bengali": "শেখা",
        "meaning": "Gain or acquire knowledge of or skill in (something) by study, experience, or being taught.",
        "type": "verb",
        "example": "I want to learn English.",
        "difficulty": "A1"
    },
    {
        "english": "learning",
        "bengali": "শেখা",
        "meaning": "The acquisition of knowledge or skills through experience, study, or by being taught.",
        "type": "noun",
        "example": "Learning a new language is not easy.",
        "difficulty": "A2"
    },
    {
        "english": "least",
        "bengali": "অন্তত",
        "meaning": "Smallest in amount, extent, or significance.",
        "type": "determiner, pronoun, adverb",
        "example": "At least you tried.",
        "difficulty": "A2"
    },
    {
        "english": "leather",
        "bengali": "চামড়া",
        "meaning": "A material made from the tanned skin of an animal by treating it with tanning agents to preserve it and make it pliable and durable.",
        "type": "noun",
        "example": "The bag is made of leather.",
        "difficulty": "B1"
    },
    {
        "english": "leave",
        "bengali": "ত্যাগ করা",
        "meaning": "Go away from.",
        "type": "verb, noun",
        "example": "I have to leave now.",
        "difficulty": "A1"
    },
    {
        "english": "lecture",
        "bengali": "বক্তৃতা",
        "meaning": "An educational talk to an audience, especially one of students in a university or college.",
        "type": "noun, verb",
        "example": "I have a lecture at 10 am.",
        "difficulty": "A2"
    },
    {
        "english": "left",
        "bengali": "বাম",
        "meaning": "On, toward, or relating to the side of a human body or of a thing that is to the west when the person or thing is facing north.",
        "type": "adjective, adverb, noun",
        "example": "Turn left at the next corner.",
        "difficulty": "A1"
    },
    {
        "english": "leg",
        "bengali": "পা",
        "meaning": "Each of the limbs on which a person or animal walks and stands.",
        "type": "noun",
        "example": "I broke my leg.",
        "difficulty": "A1"
    },
    {
        "english": "legal",
        "bengali": "আইনি",
        "meaning": "Relating to the law.",
        "type": "adjective",
        "example": "It is not legal to park here.",
        "difficulty": "B1"
    },
    {
        "english": "leisure",
        "bengali": "অবসর",
        "meaning": "Time when one is not working or occupied; free time.",
        "type": "noun",
        "example": "What do you do in your leisure time?",
        "difficulty": "B1"
    },
    {
        "english": "lemon",
        "bengali": "লেবু",
        "meaning": "A yellow, oval citrus fruit with thick skin and fragrant, acidic juice.",
        "type": "noun",
        "example": "I would like a glass of lemon juice.",
        "difficulty": "A2"
    },
    {
        "english": "lend",
        "bengali": "ধার দেওয়া",
        "meaning": "Grant to (someone) the use of (something) on the understanding that it shall be returned.",
        "type": "verb",
        "example": "Can you lend me some money?",
        "difficulty": "A2"
    },
    {
        "english": "length",
        "bengali": "দৈর্ঘ্য",
        "meaning": "The measurement or extent of something from end to end; the greater of two or the greatest of three dimensions of a body.",
        "type": "noun",
        "example": "What is the length of the room?",
        "difficulty": "B1"
    },
    {
        "english": "less",
        "bengali": "কম",
        "meaning": "A smaller amount of; not as much.",
        "type": "determiner, pronoun, adverb",
        "example": "I have less money than you.",
        "difficulty": "A2"
    },
    {
        "english": "lesson",
        "bengali": "পাঠ",
        "meaning": "A period of time during which a person is taught about a subject or how to do something.",
        "type": "noun",
        "example": "I have a piano lesson today.",
        "difficulty": "A1"
    },
    {
        "english": "let",
        "bengali": "অনুমতি দেওয়া",
        "meaning": "Not prevent or forbid; allow.",
        "type": "verb",
        "example": "Let me help you.",
        "difficulty": "A1"
    },
    {
        "english": "letter",
        "bengali": "চিঠি",
        "meaning": "A character representing one or more of the sounds used in speech; any of the symbols of an alphabet.",
        "type": "noun",
        "example": "I wrote a letter to my friend.",
        "difficulty": "A1"
    },
    {
        "english": "level",
        "bengali": "স্তর",
        "meaning": "A position on a real or imaginary scale of amount, quantity, extent, or quality.",
        "type": "noun, adjective, verb",
        "example": "The water level is rising.",
        "difficulty": "A2"
    },
    {
        "english": "library",
        "bengali": "গ্রন্থাগার",
        "meaning": "A building or room containing collections of books, periodicals, and sometimes films and recorded music for people to read, borrow, or refer to.",
        "type": "noun",
        "example": "I am going to the library.",
        "difficulty": "A1"
    },
    {
        "english": "license",
        "bengali": "লাইসেন্স",
        "meaning": "An official document giving you permission to own, do, or use something.",
        "type": "noun",
        "example": "Do you have a driver's license?",
        "difficulty": "B2"
    },
    {
        "english": "lie (down)",
        "bengali": "শুয়ে থাকা",
        "meaning": "(of a person or animal) be in or assume a horizontal or resting position on a supporting surface.",
        "type": "verb",
        "example": "The cat is lying on the sofa.",
        "difficulty": "A1"
    },
    {
        "english": "lie (tell a lie)",
        "bengali": "মিথ্যা বলা",
        "meaning": "Tell a lie or lies.",
        "type": "verb, noun",
        "example": "He is lying about his age.",
        "difficulty": "B1"
    },
    {
        "english": "life",
        "bengali": "জীবন",
        "meaning": "The condition that distinguishes animals and plants from inorganic matter, including the capacity for growth, reproduction, functional activity, and continual change preceding death.",
        "type": "noun",
        "example": "Life is beautiful.",
        "difficulty": "A1"
    },
    {
        "english": "lifestyle",
        "bengali": "জীবনধারা",
        "meaning": "The way in which a person or group lives.",
        "type": "noun",
        "example": "He has a healthy lifestyle.",
        "difficulty": "A2"
    },
    {
        "english": "lift",
        "bengali": "তোলা",
        "meaning": "Raise to a higher position or level.",
        "type": "verb",
        "example": "Can you help me lift this box?",
        "difficulty": "A2"
    },
    {
        "english": "light (from the sun/a lamp)",
        "bengali": "আলো",
        "meaning": "The natural agent that stimulates sight and makes things visible.",
        "type": "noun, adjective, verb",
        "example": "Please turn on the light.",
        "difficulty": "A1"
    },
    {
        "english": "light (not heavy)",
        "bengali": "হালকা",
        "meaning": "Of little weight; not heavy.",
        "type": "adjective",
        "example": "This box is very light.",
        "difficulty": "A2"
    },
    {
        "english": "like (similar)",
        "bengali": "মত",
        "meaning": "Having the same characteristics or qualities as; similar to.",
        "type": "preposition",
        "example": "She looks like her mother.",
        "difficulty": "A1"
    },
    {
        "english": "like (find pleasant)",
        "bengali": "পছন্দ করা",
        "meaning": "Find agreeable, enjoyable, or satisfactory.",
        "type": "verb, noun",
        "example": "I like you.",
        "difficulty": "A1"
    },
    {
        "english": "likely",
        "bengali": "সম্ভাব্য",
        "meaning": "Such as well might happen or be the case; probable.",
        "type": "adjective",
        "example": "It is likely to rain.",
        "difficulty": "A2"
    },
    {
        "english": "limit",
        "bengali": "সীমা",
        "meaning": "A point or level beyond which something does not or may not extend or pass.",
        "type": "noun, verb",
        "example": "There is a limit to my patience.",
        "difficulty": "B1"
    },
    {
        "english": "limited",
        "bengali": "সীমিত",
        "meaning": "Restricted in size, amount, or extent; few, small, or short.",
        "type": "adjective",
        "example": "We have a limited amount of time.",
        "difficulty": "B2"
    },
    {
        "english": "line",
        "bengali": "লাইন",
        "meaning": "A long, narrow mark or band.",
        "type": "noun, verb",
        "example": "Please draw a straight line.",
        "difficulty": "A1"
    },
    {
        "english": "link",
        "bengali": "সংযোগ",
        "meaning": "A relationship between two things or situations, especially where one affects the other.",
        "type": "noun, verb",
        "example": "There is a link between smoking and cancer.",
        "difficulty": "A2"
    },
    {
        "english": "lion",
        "bengali": "সিংহ",
        "meaning": "A large carnivorous feline mammal (Panthera leo) of Africa and India, having a tawny coat with a shaggy mane in the male.",
        "type": "noun",
        "example": "The lion is the king of the jungle.",
        "difficulty": "A1"
    },
    {
        "english": "lip",
        "bengali": "ঠোঁট",
        "meaning": "Either of the two fleshy parts which form the upper and lower edges of the opening of the mouth.",
        "type": "noun",
        "example": "She has beautiful lips.",
        "difficulty": "B1"
    },
    {
        "english": "liquid",
        "bengali": "তরল",
        "meaning": "A substance that flows freely but is of constant volume, having a consistency like that of water or oil.",
        "type": "noun, adjective",
        "example": "Water is a liquid.",
        "difficulty": "B1"
    },
    {
        "english": "list",
        "bengali": "তালিকা",
        "meaning": "A number of connected items or names written or printed consecutively, typically one below the other.",
        "type": "noun, verb",
        "example": "I have a shopping list.",
        "difficulty": "A1"
    },
    {
        "english": "listen",
        "bengali": "শোনা",
        "meaning": "Give one's attention to a sound.",
        "type": "verb",
        "example": "Please listen to me.",
        "difficulty": "A1"
    },
    {
        "english": "listener",
        "bengali": "শ্রোতা",
        "meaning": "A person who listens, especially to a radio broadcast or a piece of music.",
        "type": "noun",
        "example": "He is a good listener.",
        "difficulty": "A2"
    },
    {
        "english": "literature",
        "bengali": "সাহিত্য",
        "meaning": "Written works, especially those considered of superior or lasting artistic merit.",
        "type": "noun",
        "example": "I am studying English literature.",
        "difficulty": "B1"
    },
    {
        "english": "little",
        "bengali": "ছোট",
        "meaning": "Small in size, amount, or degree.",
        "type": "adjective, determiner, pronoun, adverb",
        "example": "She is a little girl.",
        "difficulty": "A1"
    },
    {
        "english": "live (verb)",
        "bengali": "বাস করা",
        "meaning": "Remain alive.",
        "type": "verb",
        "example": "I live in Dhaka.",
        "difficulty": "A1"
    },
    {
        "english": "live (adj/adv)",
        "bengali": "সরাসরি",
        "meaning": "(of a broadcast) transmitted at the time of occurrence, not recorded.",
        "type": "adjective, adverb",
        "example": "The concert will be broadcast live.",
        "difficulty": "B1"
    },
    {
        "english": "lively",
        "bengali": "প্রাণবন্ত",
        "meaning": "Full of life and energy; active and outgoing.",
        "type": "adjective",
        "example": "She is a lively person.",
        "difficulty": "B2"
    },
    {
        "english": "living",
        "bengali": "জীবন্ত",
        "meaning": "The pursuit of a lifestyle of the specified type.",
        "type": "adjective, noun",
        "example": "What do you do for a living?",
        "difficulty": "B1"
    },
    {
        "english": "load",
        "bengali": "বোঝা",
        "meaning": "A heavy or bulky thing that is being carried or is about to be carried.",
        "type": "noun, verb",
        "example": "The truck is carrying a heavy load.",
        "difficulty": "B2"
    },
    {
        "english": "loan",
        "bengali": "ঋণ",
        "meaning": "A thing that is borrowed, especially a sum of money that is expected to be paid back with interest.",
        "type": "noun",
        "example": "I need to get a loan from the bank.",
        "difficulty": "B2"
    },
    {
        "english": "local",
        "bengali": "স্থানীয়",
        "meaning": "Relating or restricted to a particular area or neighborhood.",
        "type": "adjective, noun",
        "example": "I buy my vegetables from the local market.",
        "difficulty": "A1"
    },
    {
        "english": "locate",
        "bengali": "অবস্থান নির্ণয় করা",
        "meaning": "Discover the exact place or position of.",
        "type": "verb",
        "example": "The police are trying to locate the missing child.",
        "difficulty": "B1"
    },
    {
        "english": "located",
        "bengali": "অবস্থিত",
        "meaning": "Situated in a particular place.",
        "type": "adjective",
        "example": "The hotel is located in the city center.",
        "difficulty": "B1"
    },
    {
        "english": "location",
        "bengali": "অবস্থান",
        "meaning": "A particular place or position.",
        "type": "noun",
        "example": "This is a great location for a new restaurant.",
        "difficulty": "B1"
    },
    {
        "english": "lock",
        "bengali": "তালা",
        "meaning": "A mechanism for keeping a door, lid, etc., fastened, typically operated by a key.",
        "type": "verb, noun",
        "example": "Please lock the door.",
        "difficulty": "A2"
    },
    {
        "english": "logical",
        "bengali": "যৌক্তিক",
        "meaning": "Of or according to the rules of logic or formal argument.",
        "type": "adjective",
        "example": "There is a logical explanation for everything.",
        "difficulty": "B2"
    },
    {
        "english": "lonely",
        "bengali": "একাকী",
        "meaning": "Sad because one has no friends or company.",
        "type": "adjective",
        "example": "She feels lonely sometimes.",
        "difficulty": "B1"
    },
    {
        "english": "long",
        "bengali": "দীর্ঘ",
        "meaning": "Measuring a great distance from end to end.",
        "type": "adjective, adverb",
        "example": "It is a long way to the station.",
        "difficulty": "A1"
    },
    {
        "english": "long-term",
        "bengali": "দীর্ঘমেয়াদী",
        "meaning": "Occurring over or relating to a long period of time.",
        "type": "adjective, adverb",
        "example": "We need a long-term solution to this problem.",
        "difficulty": "B2"
    },
    {
        "english": "look",
        "bengali": "তাকানো",
        "meaning": "Direct one's gaze toward someone or something or in a specified direction.",
        "type": "verb, noun",
        "example": "Look at that beautiful bird!",
        "difficulty": "A1"
    },
    {
        "english": "loose",
        "bengali": "ঢিলা",
        "meaning": "Not firmly or tightly fixed in place; detached or able to be detached.",
        "type": "adjective",
        "example": "My shoelaces are loose.",
        "difficulty": "B2"
    },
    {
        "english": "lord",
        "bengali": "প্রভু",
        "meaning": "Someone or something having power, authority, or influence; a master or ruler.",
        "type": "noun",
        "example": "He is the lord of the manor.",
        "difficulty": "B2"
    },
    {
        "english": "lose",
        "bengali": "হারানো",
        "meaning": "Be deprived of or cease to have or retain (something).",
        "type": "verb",
        "example": "I don't want to lose my keys.",
        "difficulty": "A1"
    },
    {
        "english": "loss",
        "bengali": "ক্ষতি",
        "meaning": "The fact or process of losing something or someone.",
        "type": "noun",
        "example": "The company suffered a great loss.",
        "difficulty": "B1"
    },
    {
        "english": "lost",
        "bengali": "হারিয়ে যাওয়া",
        "meaning": "Unable to find one's way; not knowing one's whereabouts.",
        "type": "adjective",
        "example": "I am lost.",
        "difficulty": "A2"
    },
    {
        "english": "lot",
        "bengali": "অনেক",
        "meaning": "A large number or amount; a great deal.",
        "type": "pronoun, determiner, adverb",
        "example": "I have a lot of friends.",
        "difficulty": "A1"
    },
    {
        "english": "loud",
        "bengali": "উচ্চশব্দ",
        "meaning": "Producing or capable of producing a great deal of noise.",
        "type": "adjective, adverb",
        "example": "The music is too loud.",
        "difficulty": "A2"
    },
    {
        "english": "loudly",
        "bengali": "জোরে",
        "meaning": "In a way that produces a great deal of noise.",
        "type": "adverb",
        "example": "He was talking loudly.",
        "difficulty": "A2"
    },
    {
        "english": "love",
        "bengali": "ভালোবাসা",
        "meaning": "An intense feeling of deep affection.",
        "type": "noun, verb",
        "example": "I love you.",
        "difficulty": "A1"
    },
    {
        "english": "low",
        "bengali": "নিম্ন",
        "meaning": "Of less than average height from top to bottom or to the top from the ground.",
        "type": "adjective, adverb, noun",
        "example": "The price is very low.",
        "difficulty": "A2"
    },
    {
        "english": "lower",
        "bengali": "নিচু করা",
        "meaning": "Move (someone or something) in a downward direction.",
        "type": "verb",
        "example": "Please lower the volume.",
        "difficulty": "B2"
    },
    {
        "english": "luck",
        "bengali": "ভাগ্য",
        "meaning": "Success or failure apparently brought by chance rather than through one's own actions.",
        "type": "noun",
        "example": "Good luck!",
        "difficulty": "A2"
    },
    {
        "english": "lucky",
        "bengali": "ভাগ্যবান",
        "meaning": "Having, bringing, or resulting from good luck.",
        "type": "adjective",
        "example": "He is a very lucky person.",
        "difficulty": "A2"
    },
    {
        "english": "lunch",
        "bengali": "দুপুরের খাবার",
        "meaning": "A meal eaten in the middle of the day, typically one that is lighter or less formal than an evening meal.",
        "type": "noun",
        "example": "What's for lunch?",
        "difficulty": "A1"
    },
    {
        "english": "lung",
        "bengali": "ফুসফুস",
        "meaning": "Each of the pair of organs situated within the rib cage, consisting of elastic sacs with branching passages into which air is drawn, so that oxygen can pass into the blood and carbon dioxide be removed.",
        "type": "noun",
        "example": "Smoking is bad for your lungs.",
        "difficulty": "B2"
    },
    {
        "english": "luxury",
        "bengali": "বিলাসিতা",
        "meaning": "A state of great comfort or elegance, especially when involving great expense.",
        "type": "noun",
        "example": "He lives a life of luxury.",
        "difficulty": "B1"
    },
    {
        "english": "machine",
        "bengali": "যন্ত্র",
        "meaning": "An apparatus using or applying mechanical power and having several parts, each with a definite function and together performing a particular task.",
        "type": "noun",
        "example": "This is a washing machine.",
        "difficulty": "A1"
    },
    {
        "english": "mad",
        "bengali": "পাগল",
        "meaning": "Mentally ill; insane.",
        "type": "adjective",
        "example": "He is a mad scientist.",
        "difficulty": "B1"
    },
    {
        "english": "magazine",
        "bengali": "ম্যাগাজিন",
        "meaning": "A periodical publication containing articles and illustrations, typically covering a particular subject or area of interest.",
        "type": "noun",
        "example": "I like to read magazines.",
        "difficulty": "A1"
    },
    {
        "english": "magic",
        "bengali": "যাদু",
        "meaning": "The power of apparently influencing the course of events by using mysterious or supernatural forces.",
        "type": "noun, adjective",
        "example": "Do you believe in magic?",
        "difficulty": "B1"
    },
    {
        "english": "mail",
        "bengali": "ডাক",
        "meaning": "Letters and parcels sent by post.",
        "type": "noun, verb",
        "example": "I received a lot of mail today.",
        "difficulty": "A2"
    },
    {
        "english": "main",
        "bengali": "প্রধান",
        "meaning": "Chief in size or importance.",
        "type": "adjective",
        "example": "The main reason for my decision is...",
        "difficulty": "A1"
    },
    {
        "english": "mainly",
        "bengali": "প্রধানত",
        "meaning": "For the most part; chiefly.",
        "type": "adverb",
        "example": "The audience was mainly composed of students.",
        "difficulty": "B1"
    },
    {
        "english": "maintain",
        "bengali": "বজায় রাখা",
        "meaning": "Cause or enable (a condition or state of affairs) to continue.",
        "type": "verb",
        "example": "We need to maintain a good relationship with our customers.",
        "difficulty": "B2"
    },
    {
        "english": "major",
        "bengali": "প্রধান",
        "meaning": "Important, serious, or significant.",
        "type": "adjective, noun",
        "example": "This is a major problem.",
        "difficulty": "A2"
    },
    {
        "english": "majority",
        "bengali": "সংখ্যাগরিষ্ঠ",
        "meaning": "The greater number.",
        "type": "noun",
        "example": "The majority of people voted for him.",
        "difficulty": "B2"
    },
    {
        "english": "make",
        "bengali": "তৈরি করা",
        "meaning": "Form (something) by putting parts together or combining substances; construct; create.",
        "type": "verb, noun",
        "example": "I will make a cake.",
        "difficulty": "A1"
    },
    {
        "english": "male",
        "bengali": "পুরুষ",
        "meaning": "Of or denoting the sex that produces small, typically motile gametes, especially spermatozoa, with which a female may be fertilized.",
        "type": "adjective, noun",
        "example": "The lion is a male animal.",
        "difficulty": "A2"
    },
    {
        "english": "mall",
        "bengali": "মল",
        "meaning": "A large enclosed shopping area from which traffic is excluded.",
        "type": "noun",
        "example": "Let's go to the mall.",
        "difficulty": "A1"
    },
    {
        "english": "man",
        "bengali": "মানুষ",
        "meaning": "An adult human male.",
        "type": "noun",
        "example": "He is a good man.",
        "difficulty": "A1"
    },
    {
        "english": "manage",
        "bengali": "ব্যবস্থাপনা করা",
        "meaning": "Be in charge of (a company, establishment, or undertaking); administer; run.",
        "type": "verb",
        "example": "She manages a large company.",
        "difficulty": "A2"
    },
    {
        "english": "management",
        "bengali": "ব্যবস্থাপনা",
        "meaning": "The process of dealing with or controlling things or people.",
        "type": "noun",
        "example": "The company has good management.",
        "difficulty": "B1"
    },
    {
        "english": "manager",
        "bengali": "ব্যবস্থাপক",
        "meaning": "A person responsible for controlling or administering all or part of a company or similar organization.",
        "type": "noun",
        "example": "He is the manager of the team.",
        "difficulty": "A2"
    },
    {
        "english": "manner",
        "bengali": "ধরন",
        "meaning": "A way in which a thing is done or happens.",
        "type": "noun",
        "example": "He has a strange manner of speaking.",
        "difficulty": "A2"
    },
    {
        "english": "many",
        "bengali": "অনেক",
        "meaning": "A large number of.",
        "type": "determiner, pronoun",
        "example": "I have many friends.",
        "difficulty": "A1"
    },
    {
        "english": "map",
        "bengali": "মানচিত্র",
        "meaning": "A diagrammatic representation of an area of land or sea showing physical features, cities, roads, etc.",
        "type": "noun, verb",
        "example": "I need a map of the city.",
        "difficulty": "A1"
    },
    {
        "english": "March",
        "bengali": "মার্চ",
        "meaning": "The third month of the year, in the northern hemisphere usually considered the first month of spring.",
        "type": "noun",
        "example": "My birthday is in March.",
        "difficulty": "A1"
    },
    {
        "english": "mark",
        "bengali": "চিহ্ন",
        "meaning": "A small area on a surface having a different color from its surroundings, typically one caused by damage or dirt.",
        "type": "verb, noun",
        "example": "There is a mark on your shirt.",
        "difficulty": "A2"
    },
    {
        "english": "market",
        "bengali": "বাজার",
        "meaning": "A regular gathering of people for the purchase and sale of provisions, livestock, and other commodities.",
        "type": "noun, verb",
        "example": "I am going to the market.",
        "difficulty": "A1"
    },
    {
        "english": "marketing",
        "bengali": "বিপণন",
        "meaning": "The action or business of promoting and selling products or services, including market research and advertising.",
        "type": "noun",
        "example": "She works in marketing.",
        "difficulty": "B1"
    },
    {
        "english": "marriage",
        "bengali": "বিবাহ",
        "meaning": "The legally or formally recognized union of two people as partners in a personal relationship (historically and in some jurisdictions specifically a union between a man and a woman).",
        "type": "noun",
        "example": "They have a happy marriage.",
        "difficulty": "B1"
    },
    {
        "english": "married",
        "bengali": "বিবাহিত",
        "meaning": "(of a person) united in marriage.",
        "type": "adjective",
        "example": "Are you married?",
        "difficulty": "A1"
    },
    {
        "english": "marry",
        "bengali": "বিয়ে করা",
        "meaning": "Join in marriage.",
        "type": "verb",
        "example": "Will you marry me?",
        "difficulty": "A2"
    },
    {
        "english": "mass",
        "bengali": "ভর",
        "meaning": "A large body of matter with no definite shape.",
        "type": "noun, adjective",
        "example": "The sun has a large mass.",
        "difficulty": "B2"
    },
    {
        "english": "massive",
        "bengali": "বিশাল",
        "meaning": "Large and heavy or solid.",
        "type": "adjective",
        "example": "It was a massive explosion.",
        "difficulty": "B2"
    },
    {
        "english": "master",
        "bengali": "মালিক",
        "meaning": "A man who has people working for him, especially servants or slaves.",
        "type": "noun, verb",
        "example": "He is the master of the house.",
        "difficulty": "B2"
    },
    {
        "english": "match (contest/correspond)",
        "bengali": "ম্যাচ",
        "meaning": "A game in which individuals or teams compete against each other.",
        "type": "noun, verb",
        "example": "Who won the football match?",
        "difficulty": "A1"
    },
    {
        "english": "matching",
        "bengali": "মানানসই",
        "meaning": "Corresponding in pattern, color, or design.",
        "type": "adjective",
        "example": "She was wearing a matching skirt and blouse.",
        "difficulty": "B2"
    },
    {
        "english": "material",
        "bengali": "উপাদান",
        "meaning": "The matter from which a thing is or can be made.",
        "type": "noun, adjective",
        "example": "What kind of material is this?",
        "difficulty": "A2"
    },
    {
        "english": "math",
        "bengali": "গণিত",
        "meaning": "Mathematics.",
        "type": "noun",
        "example": "I am good at math.",
        "difficulty": "A2"
    },
    {
        "english": "mathematics",
        "bengali": "গণিত",
        "meaning": "The abstract science of number, quantity, and space.",
        "type": "noun",
        "example": "She is studying mathematics at university.",
        "difficulty": "A2"
    },
    {
        "english": "matter",
        "bengali": "ব্যাপার",
        "meaning": "A subject or situation under consideration.",
        "type": "noun, verb",
        "example": "What is the matter?",
        "difficulty": "A2"
    },
    {
        "english": "maximum",
        "bengali": "সর্বাধিক",
        "meaning": "As great, high, or intense as possible or permitted.",
        "type": "adjective, noun",
        "example": "The maximum speed is 100 km/h.",
        "difficulty": "B2"
    },
    {
        "english": "May",
        "bengali": "মে",
        "meaning": "The fifth month of the year, in the northern hemisphere usually considered the last month of spring.",
        "type": "noun",
        "example": "My birthday is in May.",
        "difficulty": "A1"
    },
    {
        "english": "may",
        "bengali": "পারা",
        "meaning": "Expressing possibility.",
        "type": "modal verb",
        "example": "It may rain tomorrow.",
        "difficulty": "A2"
    },
    {
        "english": "maybe",
        "bengali": "হতে পারে",
        "meaning": "Perhaps; possibly.",
        "type": "adverb",
        "example": "Maybe he will come.",
        "difficulty": "A1"
    },
    {
        "english": "mayor",
        "bengali": "মেয়র",
        "meaning": "The elected head of a city, town, or other municipality.",
        "type": "noun",
        "example": "The mayor of Dhaka is a very busy person.",
        "difficulty": "A2"
    },
    {
        "english": "me",
        "bengali": "আমাকে",
        "meaning": "Used by a speaker to refer to himself or herself as the object of a verb or preposition.",
        "type": "pronoun",
        "example": "Can you help me?",
        "difficulty": "A1"
    },
    {
        "english": "meal",
        "bengali": "খাবার",
        "meaning": "Any of the regular occasions in a day when a reasonably large amount of food is eaten, such as breakfast, lunch, or dinner.",
        "type": "noun",
        "example": "I had a delicious meal.",
        "difficulty": "A1"
    },
    {
        "english": "mean",
        "bengali": "মানে",
        "meaning": "Intend to convey, indicate, or refer to (a particular thing or notion); signify.",
        "type": "verb",
        "example": "What does this word mean?",
        "difficulty": "A1"
    },
    {
        "english": "meaning",
        "bengali": "অর্থ",
        "meaning": "What is meant by a word, text, concept, or action.",
        "type": "noun",
        "example": "What is the meaning of this word?",
        "difficulty": "A1"
    },
    {
        "english": "means",
        "bengali": "উপায়",
        "meaning": "An action or system by which a result is achieved; a method.",
        "type": "noun",
        "example": "We have no means of transportation.",
        "difficulty": "B2"
    },
    {
        "english": "meanwhile",
        "bengali": "ইতিমধ্যে",
        "meaning": "In the intervening period of time.",
        "type": "adverb",
        "example": "Meanwhile, the other team was scoring goals.",
        "difficulty": "B1"
    },
    {
        "english": "measure",
        "bengali": "পরিমাপ করা",
        "meaning": "Ascertain the size, amount, or degree of (something) by using an instrument or device marked in standard units or by comparing it with an object of known size.",
        "type": "verb, noun",
        "example": "We need to measure the room.",
        "difficulty": "B1"
    },
    {
        "english": "measurement",
        "bengali": "পরিমাপ",
        "meaning": "The action of measuring something.",
        "type": "noun",
        "example": "The measurements are not accurate.",
        "difficulty": "B2"
    },
    {
        "english": "meat",
        "bengali": "মাংস",
        "meaning": "The flesh of an animal, typically a mammal or bird, as food.",
        "type": "noun",
        "example": "I don't eat meat.",
        "difficulty": "A1"
    },
    {
        "english": "media",
        "bengali": "গণমাধ্যম",
        "meaning": "The main means of mass communication (broadcasting, publishing, and the internet) regarded collectively.",
        "type": "noun",
        "example": "The media plays an important role in our society.",
        "difficulty": "A2"
    },
    {
        "english": "medical",
        "bengali": "চিকিৎসা",
        "meaning": "Relating to the science or practice of medicine.",
        "type": "adjective",
        "example": "I need medical attention.",
        "difficulty": "A2"
    },
    {
        "english": "medicine",
        "bengali": "ঔষধ",
        "meaning": "The science or practice of the diagnosis, treatment, and prevention of disease.",
        "type": "noun",
        "example": "He is taking medicine for his illness.",
        "difficulty": "A2"
    },
    {
        "english": "medium",
        "bengali": "মধ্যম",
        "meaning": "About halfway between two extremes of size or another quality; average.",
        "type": "adjective, noun",
        "example": "I would like a medium size shirt.",
        "difficulty": "B1"
    },
    {
        "english": "meet",
        "bengali": "দেখা করা",
        "meaning": "Arrange or happen to come into the presence or company of (someone).",
        "type": "verb",
        "example": "I will meet you at the station.",
        "difficulty": "A1"
    },
    {
        "english": "meeting",
        "bengali": "সভা",
        "meaning": "An assembly of people, especially the members of a society or committee, for discussion or entertainment.",
        "type": "noun",
        "example": "I have a meeting at 10 am.",
        "difficulty": "A1"
    },
    {
        "english": "melt",
        "bengali": "গলে যাওয়া",
        "meaning": "Make or become liquefied by heat.",
        "type": "verb",
        "example": "The ice is melting.",
        "difficulty": "B2"
    },
    {
        "english": "member",
        "bengali": "সদস্য",
        "meaning": "A person, country, or organization that has joined a group, society, or team.",
        "type": "noun",
        "example": "He is a member of the club.",
        "difficulty": "A1"
    },
    {
        "english": "memory",
        "bengali": "স্মৃতি",
        "meaning": "The faculty by which the mind stores and remembers information.",
        "type": "noun",
        "example": "I have a good memory.",
        "difficulty": "A2"
    },
    {
        "english": "mental",
        "bengali": "মানসিক",
        "meaning": "Relating to the mind.",
        "type": "adjective",
        "example": "He has a mental illness.",
        "difficulty": "B1"
    },
    {
        "english": "mention",
        "bengali": "উল্লেখ করা",
        "meaning": "Refer to (something) briefly and without going into detail.",
        "type": "verb, noun",
        "example": "He mentioned your name.",
        "difficulty": "A2"
    },
    {
        "english": "menu",
        "bengali": "মেনু",
        "meaning": "A list of dishes available in a restaurant.",
        "type": "noun",
        "example": "Can I see the menu, please?",
        "difficulty": "A1"
    },
    {
        "english": "mess",
        "bengali": "অগোছালো",
        "meaning": "A dirty or untidy state of things or of a place.",
        "type": "noun, verb",
        "example": "Your room is a mess.",
        "difficulty": "B1"
    },
    {
        "english": "message",
        "bengali": "বার্তা",
        "meaning": "A verbal, written, or recorded communication sent to or left for a recipient who cannot be contacted directly.",
        "type": "noun",
        "example": "I received a message from him.",
        "difficulty": "A1"
    },
    {
        "english": "metal",
        "bengali": "ধাতু",
        "meaning": "A solid material that is typically hard, shiny, malleable, fusible, and ductile, with good electrical and thermal conductivity (e.g., iron, gold, silver, copper, and aluminum, and alloys such as brass and steel).",
        "type": "noun",
        "example": "The bridge is made of metal.",
        "difficulty": "A2"
    },
    {
        "english": "method",
        "bengali": "পদ্ধতি",
        "meaning": "A particular form of procedure for accomplishing or approaching something, especially a systematic or established one.",
        "type": "noun",
        "example": "We need to find a new method to solve this problem.",
        "difficulty": "A2"
    },
    {
        "english": "meter",
        "bengali": "মিটার",
        "meaning": "The fundamental unit of length in the metric system, equal to 100 centimeters or approximately 39.37 inches.",
        "type": "noun",
        "example": "The room is five meters long.",
        "difficulty": "A1"
    },
    {
        "english": "middle",
        "bengali": "মধ্য",
        "meaning": "At an equal distance from the extremities of a thing.",
        "type": "noun, adjective",
        "example": "The house is in the middle of the forest.",
        "difficulty": "A2"
    },
    {
        "english": "midnight",
        "bengali": "মধ্যরাত",
        "meaning": "Twelve o'clock at night.",
        "type": "noun",
        "example": "I went to bed at midnight.",
        "difficulty": "A1"
    },
    {
        "english": "might",
        "bengali": "হতে পারে",
        "meaning": "Used to express possibility or make a suggestion.",
        "type": "modal verb",
        "example": "It might rain tomorrow.",
        "difficulty": "A2"
    },
    {
        "english": "mild",
        "bengali": "মৃদু",
        "meaning": "Not severe, serious, or harsh.",
        "type": "adjective",
        "example": "He has a mild fever.",
        "difficulty": "B1"
    },
    {
        "english": "mile",
        "bengali": "মাইল",
        "meaning": "A unit of linear measure equal to 1,760 yards (approximately 1.609 kilometers).",
        "type": "noun",
        "example": "The nearest town is ten miles away.",
        "difficulty": "A1"
    },
    {
        "english": "military",
        "bengali": "সামরিক",
        "meaning": "Relating to or characteristic of soldiers or armed forces.",
        "type": "adjective, noun",
        "example": "He is in the military.",
        "difficulty": "B2"
    },
    {
        "english": "milk",
        "bengali": "দুধ",
        "meaning": "An opaque white fluid rich in fat and protein, secreted by female mammals for the nourishment of their young.",
        "type": "noun",
        "example": "I drink milk every day.",
        "difficulty": "A1"
    },
    {
        "english": "million",
        "bengali": "মিলিয়ন",
        "meaning": "The number equivalent to the product of a thousand and a thousand; 1,000,000 or 10⁶.",
        "type": "number",
        "example": "There are over a million people living in this city.",
        "difficulty": "A1"
    },
    {
        "english": "mind",
        "bengali": "মন",
        "meaning": "The element of a person that enables them to be aware of the world and their experiences, to think, and to feel; the faculty of consciousness and thought.",
        "type": "noun, verb",
        "example": "I have a lot on my mind.",
        "difficulty": "A2"
    },
    {
        "english": "mine (belongs to me)",
        "bengali": "আমার",
        "meaning": "Used to refer to a thing or things belonging to or associated with the speaker.",
        "type": "pronoun",
        "example": "This book is mine.",
        "difficulty": "A2"
    },
    {
        "english": "mine (hole in the ground)",
        "bengali": "খনি",
        "meaning": "An excavation in the earth for extracting coal or other minerals.",
        "type": "noun",
        "example": "He works in a coal mine.",
        "difficulty": "B1"
    },
    {
        "english": "mineral",
        "bengali": "খনিজ",
        "meaning": "A solid, naturally occurring inorganic substance.",
        "type": "noun",
        "example": "The region is rich in minerals.",
        "difficulty": "B2"
    },
    {
        "english": "minimum",
        "bengali": "ন্যূনতম",
        "meaning": "The least or smallest amount or quantity possible, attainable, or required.",
        "type": "adjective, noun",
        "example": "The minimum age for driving is 18.",
        "difficulty": "B2"
    },
    {
        "english": "minister",
        "bengali": "মন্ত্রী",
        "meaning": "A head of a government department.",
        "type": "noun",
        "example": "He is the Minister of Education.",
        "difficulty": "B2"
    },
    {
        "english": "minor",
        "bengali": "গৌণ",
        "meaning": "Lesser in importance, seriousness, or significance.",
        "type": "adjective",
        "example": "It's only a minor problem.",
        "difficulty": "B2"
    },
    {
        "english": "minority",
        "bengali": "সংখ্যালঘু",
        "meaning": "The smaller number or part, especially a number or part representing less than half of the whole.",
        "type": "noun",
        "example": "Ethnic minorities often face discrimination.",
        "difficulty": "B2"
    },
    {
        "english": "minute",
        "bengali": "মিনিট",
        "meaning": "A period of time equal to sixty seconds or a sixtieth of an hour.",
        "type": "noun",
        "example": "I'll be ready in a minute.",
        "difficulty": "A1"
    },
    {
        "english": "mirror",
        "bengali": "আয়না",
        "meaning": "A surface, typically of glass coated with a metal amalgam, that reflects a clear image.",
        "type": "noun",
        "example": "She looked at herself in the mirror.",
        "difficulty": "A2"
    },
    {
        "english": "miss",
        "bengali": "মিস করা",
        "meaning": "Fail to hit, reach, or come into contact with (something aimed at).",
        "type": "verb",
        "example": "I missed the bus.",
        "difficulty": "A1"
    },
    {
        "english": "missing",
        "bengali": "অনুপস্থিত",
        "meaning": "(of a thing) not able to be found because it is not in its expected place.",
        "type": "adjective",
        "example": "My keys are missing.",
        "difficulty": "A2"
    },
    {
        "english": "mission",
        "bengali": "মিশন",
        "meaning": "An important assignment carried out for political, religious, or commercial purposes, typically involving travel.",
        "type": "noun",
        "example": "He was sent on a secret mission.",
        "difficulty": "B2"
    },
    {
        "english": "mistake",
        "bengali": "ভুল",
        "meaning": "An act or judgment that is misguided or wrong.",
        "type": "noun, verb",
        "example": "I made a mistake in my calculations.",
        "difficulty": "A1"
    },
    {
        "english": "mix",
        "bengali": "মেশানো",
        "meaning": "Combine or put together to form one substance or mass.",
        "type": "verb, noun",
        "example": "Mix the ingredients together.",
        "difficulty": "B1"
    },
    {
        "english": "mixed",
        "bengali": "মিশ্রিত",
        "meaning": "Consisting of different qualities or elements.",
        "type": "adjective",
        "example": "I have mixed feelings about the plan.",
        "difficulty": "B2"
    },
    {
        "english": "mixture",
        "bengali": "মিশ্রণ",
        "meaning": "A substance made by mixing other substances together.",
        "type": "noun",
        "example": "The cake is made from a mixture of flour, sugar, and eggs.",
        "difficulty": "B1"
    },
    {
        "english": "model",
        "bengali": "মডেল",
        "meaning": "A three-dimensional representation of a person or thing or of a proposed structure, typically on a smaller scale than the original.",
        "type": "noun, verb",
        "example": "This is a model of the new building.",
        "difficulty": "A1"
    },
    {
        "english": "modern",
        "bengali": "আধুনিক",
        "meaning": "Relating to the present or recent times as opposed to the remote past.",
        "type": "adjective",
        "example": "We live in a modern society.",
        "difficulty": "A1"
    },
    {
        "english": "modify",
        "bengali": "পরিবর্তন করা",
        "meaning": "Make partial or minor changes to (something), typically so as to improve it or to make it less extreme.",
        "type": "verb",
        "example": "We need to modify the design.",
        "difficulty": "B2"
    },
    {
        "english": "mom",
        "bengali": "মা",
        "meaning": "One's mother.",
        "type": "noun",
        "example": "My mom is the best cook.",
        "difficulty": "A1"
    },
    {
        "english": "moment",
        "bengali": "মুহূর্ত",
        "meaning": "A very brief period of time.",
        "type": "noun",
        "example": "Wait a moment, please.",
        "difficulty": "A1"
    },
    {
        "english": "Monday",
        "bengali": "সোমবার",
        "meaning": "The day of the week before Tuesday and following Sunday.",
        "type": "noun",
        "example": "I have a meeting on Monday.",
        "difficulty": "A1"
    },
    {
        "english": "money",
        "bengali": "টাকা",
        "meaning": "A current medium of exchange in the form of coins and banknotes; coins and banknotes collectively.",
        "type": "noun",
        "example": "I need some money.",
        "difficulty": "A1"
    },
    {
        "english": "monitor",
        "bengali": "মনিটর",
        "meaning": "A screen which displays an image generated by a computer.",
        "type": "noun, verb",
        "example": "The computer monitor is not working.",
        "difficulty": "B2"
    },
    {
        "english": "monkey",
        "bengali": "বানর",
        "meaning": "A small to medium-sized primate that typically has a long tail, most kinds of which live in trees in tropical countries.",
        "type": "noun",
        "example": "I saw a monkey at the zoo.",
        "difficulty": "A2"
    },
    {
        "english": "month",
        "bengali": "মাস",
        "meaning": "Each of the twelve named periods into which a year is divided.",
        "type": "noun",
        "example": "January is the first month of the year.",
        "difficulty": "A1"
    },
    {
        "english": "mood",
        "bengali": "মেজাজ",
        "meaning": "A temporary state of mind or feeling.",
        "type": "noun",
        "example": "I am in a good mood today.",
        "difficulty": "B1"
    },
    {
        "english": "moon",
        "bengali": "চাঁদ",
        "meaning": "The natural satellite of the earth, visible (chiefly at night) by reflected light from the sun.",
        "type": "noun",
        "example": "The moon is bright tonight.",
        "difficulty": "A2"
    },
    {
        "english": "moral",
        "bengali": "নৈতিক",
        "meaning": "Concerned with the principles of right and wrong behavior and the goodness or badness of human character.",
        "type": "adjective, noun",
        "example": "It is a moral issue.",
        "difficulty": "B2"
    },
    {
        "english": "more",
        "bengali": "আরও",
        "meaning": "A greater or additional amount or degree.",
        "type": "determiner, pronoun, adverb",
        "example": "I need more time.",
        "difficulty": "A1"
    },
    {
        "english": "morning",
        "bengali": "সকাল",
        "meaning": "The period of time between midnight and noon, especially from sunrise to noon.",
        "type": "noun",
        "example": "Good morning!",
        "difficulty": "A1"
    },
    {
        "english": "most",
        "bengali": "অধিকাংশ",
        "meaning": "Greatest in amount or degree.",
        "type": "determiner, pronoun, adverb",
        "example": "Most people like ice cream.",
        "difficulty": "A1"
    },
    {
        "english": "mostly",
        "bengali": "প্রধানত",
        "meaning": "Mainly.",
        "type": "adverb",
        "example": "The audience was mostly young people.",
        "difficulty": "A2"
    },
    {
        "english": "mother",
        "bengali": "মা",
        "meaning": "A woman in relation to her child or children.",
        "type": "noun",
        "example": "My mother is a teacher.",
        "difficulty": "A1"
    },
    {
        "english": "motor",
        "bengali": "মোটর",
        "meaning": "A machine, especially one powered by electricity or an internal combustion engine, that supplies motive power for a vehicle or for some other device with moving parts.",
        "type": "noun, adjective",
        "example": "The boat has a powerful motor.",
        "difficulty": "B2"
    },
    {
        "english": "motorcycle",
        "bengali": "মটরসাইকেল",
        "meaning": "A two-wheeled vehicle that is powered by a motor and has no pedals.",
        "type": "noun",
        "example": "He rides a motorcycle to work.",
        "difficulty": "A2"
    },
    {
        "english": "mount",
        "bengali": "আরোহণ করা",
        "meaning": "Climb up (stairs, a hill, or other rising surface).",
        "type": "verb",
        "example": "He mounted his horse and rode away.",
        "difficulty": "B2"
    },
    {
        "english": "mountain",
        "bengali": "পর্বত",
        "meaning": "A large natural elevation of the earth's surface rising abruptly from the surrounding level; a large steep hill.",
        "type": "noun",
        "example": "We climbed the mountain.",
        "difficulty": "A1"
    },
    {
        "english": "mouse",
        "bengali": "ইঁদুর",
        "meaning": "A small rodent that typically has a pointed snout, relatively large ears and eyes, and a long tail.",
        "type": "noun",
        "example": "I saw a mouse in the kitchen.",
        "difficulty": "A1"
    },
    {
        "english": "mouth",
        "bengali": "মুখ",
        "meaning": "The opening in the lower part of the human face, surrounded by the lips, through which food is taken in and from which speech and other sounds are emitted.",
        "type": "noun",
        "example": "Open your mouth.",
        "difficulty": "A1"
    },
    {
        "english": "move",
        "bengali": "চলা",
        "meaning": "Go in a specified direction or manner; travel.",
        "type": "verb, noun",
        "example": "Please move your car.",
        "difficulty": "A1"
    },
    {
        "english": "movement",
        "bengali": "আন্দোলন",
        "meaning": "An act of changing physical location or position or of having this changed.",
        "type": "noun",
        "example": "I saw a movement in the bushes.",
        "difficulty": "A2"
    },
    {
        "english": "movie",
        "bengali": "চলচ্চিত্র",
        "meaning": "A story or event recorded by a camera as a set of moving images and shown in a theater or on television; a film.",
        "type": "noun",
        "example": "I watched a movie last night.",
        "difficulty": "A1"
    },
    {
        "english": "much",
        "bengali": "অনেক",
        "meaning": "A large amount.",
        "type": "determiner, pronoun, adverb",
        "example": "I don't have much money.",
        "difficulty": "A1"
    },
    {
        "english": "mud",
        "bengali": "কাদা",
        "meaning": "Soft, sticky matter resulting from the mixing of earth and water.",
        "type": "noun",
        "example": "There was a lot of mud on the road.",
        "difficulty": "B1"
    },
    {
        "english": "multiple",
        "bengali": "একাধিক",
        "meaning": "Having or involving several parts, elements, or members.",
        "type": "adjective",
        "example": "He has multiple injuries.",
        "difficulty": "B2"
    },
    {
        "english": "multiply",
        "bengali": "গুণ করা",
        "meaning": "Obtain from (a number) another which contains the first number a specified number of times.",
        "type": "verb",
        "example": "If you multiply 2 by 3, you get 6.",
        "difficulty": "B2"
    },
    {
        "english": "murder",
        "bengali": "হত্যা",
        "meaning": "The unlawful premeditated killing of one human being by another.",
        "type": "noun, verb",
        "example": "He was convicted of murder.",
        "difficulty": "B1"
    },
    {
        "english": "muscle",
        "bengali": "পেশী",
        "meaning": "A band or bundle of fibrous tissue in a human or animal body that has the ability to contract, producing movement in or maintaining the position of parts of the body.",
        "type": "noun",
        "example": "He has strong muscles.",
        "difficulty": "B1"
    },
    {
        "english": "museum",
        "bengali": "জাদুঘর",
        "meaning": "A building in which objects of historical, scientific, artistic, or cultural interest are stored and exhibited.",
        "type": "noun",
        "example": "We visited the museum yesterday.",
        "difficulty": "A1"
    },
    {
        "english": "music",
        "bengali": "সঙ্গীত",
        "meaning": "Vocal or instrumental sounds (or both) combined in such a way as to produce beauty of form, harmony, and expression of emotion.",
        "type": "noun",
        "example": "I love to listen to music.",
        "difficulty": "A1"
    },
    {
        "english": "musical",
        "bengali": "সঙ্গীতধর্মী",
        "meaning": "Relating to music.",
        "type": "adjective, noun",
        "example": "He is a very musical person.",
        "difficulty": "A2"
    },
    {
        "english": "musician",
        "bengali": "সঙ্গীতশিল্পী",
        "meaning": "A person who plays a musical instrument, especially as a profession, or is musically talented.",
        "type": "noun",
        "example": "He is a professional musician.",
        "difficulty": "A2"
    },
    {
        "english": "must",
        "bengali": "অবশ্যই",
        "meaning": "Be obliged to; should (expressing necessity).",
        "type": "modal verb",
        "example": "I must go now.",
        "difficulty": "A1"
    },
    {
        "english": "my",
        "bengali": "আমার",
        "meaning": "Belonging to or associated with the speaker.",
        "type": "determiner",
        "example": "This is my book.",
        "difficulty": "A1"
    },
    {
        "english": "myself",
        "bengali": "নিজেই",
        "meaning": "Used by a speaker to refer to himself or herself as the object of a verb or preposition when he or she is the subject of the clause.",
        "type": "pronoun",
        "example": "I did it myself.",
        "difficulty": "A2"
    },
    {
        "english": "mysterious",
        "bengali": "রহস্যময়",
        "meaning": "Difficult or impossible to understand, explain, or identify.",
        "type": "adjective",
        "example": "It was a mysterious disappearance.",
        "difficulty": "B2"
    },
    {
        "english": "mystery",
        "bengali": "রহস্য",
        "meaning": "Something that is difficult or impossible to understand or explain.",
        "type": "noun",
        "example": "The cause of the accident is a mystery.",
        "difficulty": "B1"
    },
    {
        "english": "nail",
        "bengali": "পেরেক",
        "meaning": "A small metal spike with a broadened flat head, driven typically into wood with a hammer to join things together or to serve as a hook.",
        "type": "noun",
        "example": "I need a hammer and some nails.",
        "difficulty": "B1"
    },
    {
        "english": "name",
        "bengali": "নাম",
        "meaning": "A word or set of words by which a person, animal, place, or thing is known, addressed, or referred to.",
        "type": "noun, verb",
        "example": "What is your name?",
        "difficulty": "A1"
    },
    {
        "english": "narrative",
        "bengali": "বর্ণনা",
        "meaning": "A spoken or written account of connected events; a story.",
        "type": "noun, adjective",
        "example": "He is writing a narrative of his travels.",
        "difficulty": "B1"
    },
    {
        "english": "narrow",
        "bengali": "সংকীর্ণ",
        "meaning": "Of small width in relation to length.",
        "type": "adjective, verb",
        "example": "The road is very narrow.",
        "difficulty": "A2"
    },
    {
        "english": "nation",
        "bengali": "জাতি",
        "meaning": "A large body of people united by common descent, history, culture, or language, inhabiting a particular country or territory.",
        "type": "noun",
        "example": "Bangladesh is a sovereign nation.",
        "difficulty": "B1"
    },
    {
        "english": "national",
        "bengali": "জাতীয়",
        "meaning": "Relating to a nation; common to or characteristic of a whole nation.",
        "type": "adjective, noun",
        "example": "This is a national holiday.",
        "difficulty": "A2"
    },
    {
        "english": "native",
        "bengali": "দেশীয়",
        "meaning": "A person born in a specified place or associated with a place by birth, whether subsequently resident there or not.",
        "type": "adjective, noun",
        "example": "He is a native of Dhaka.",
        "difficulty": "B1"
    },
    {
        "english": "natural",
        "bengali": "প্রাকৃতিক",
        "meaning": "Existing in or derived from nature; not made or caused by humankind.",
        "type": "adjective",
        "example": "This is a natural disaster.",
        "difficulty": "A1"
    },
    {
        "english": "naturally",
        "bengali": "স্বাভাবিকভাবে",
        "meaning": "In a natural manner.",
        "type": "adverb",
        "example": "He is naturally talented.",
        "difficulty": "B1"
    },
    {
        "english": "nature",
        "bengali": "প্রকৃতি",
        "meaning": "The phenomena of the physical world collectively, including plants, animals, the landscape, and other features and products of the earth, as opposed to humans or human creations.",
        "type": "noun",
        "example": "I love nature.",
        "difficulty": "A2"
    },
    {
        "english": "near",
        "bengali": "কাছে",
        "meaning": "At or to a short distance away; a short time away.",
        "type": "preposition, adjective, adverb",
        "example": "My house is near the school.",
        "difficulty": "A1"
    },
    {
        "english": "nearly",
        "bengali": "প্রায়",
        "meaning": "Almost.",
        "type": "adverb",
        "example": "It's nearly time to go.",
        "difficulty": "A2"
    },
    {
        "english": "neat",
        "bengali": "পরিষ্কার",
        "meaning": "Arranged in an orderly, tidy way.",
        "type": "adjective",
        "example": "Your room is very neat.",
        "difficulty": "B1"
    },
    {
        "english": "necessarily",
        "bengali": "অগত্যা",
        "meaning": "As a necessary result; inevitably.",
        "type": "adverb",
        "example": "That is not necessarily true.",
        "difficulty": "B1"
    },
    {
        "english": "necessary",
        "bengali": "প্রয়োজনীয়",
        "meaning": "Required to be done, achieved, or present; needed; essential.",
        "type": "adjective",
        "example": "Is it necessary to go?",
        "difficulty": "A2"
    },
    {
        "english": "neck",
        "bengali": "ঘাড়",
        "meaning": "The part of a person's or animal's body connecting the head to the rest of the body.",
        "type": "noun",
        "example": "I have a pain in my neck.",
        "difficulty": "A2"
    },
    {
        "english": "need",
        "bengali": "প্রয়োজন",
        "meaning": "Require (something) because it is essential or very important.",
        "type": "verb, noun, modal verb",
        "example": "I need your help.",
        "difficulty": "A1"
    },
    {
        "english": "needle",
        "bengali": "সূঁচ",
        "meaning": "A small slender tool with a pointed end and a hole or eye in it for thread, used in sewing.",
        "type": "noun",
        "example": "I need a needle and thread.",
        "difficulty": "B1"
    },
    {
        "english": "negative",
        "bengali": "নেতিবাচক",
        "meaning": "(of a statement or decision) expressing or containing a denial, refusal, or contradiction.",
        "type": "adjective, noun",
        "example": "He has a negative attitude.",
        "difficulty": "A1"
    },
    {
        "english": "neighbor",
        "bengali": "প্রতিবেশী",
        "meaning": "A person living near or next door to the speaker or person referred to.",
        "type": "noun",
        "example": "My neighbor is very friendly.",
        "difficulty": "A1"
    },
    {
        "english": "neighborhood",
        "bengali": "পাড়া",
        "meaning": "A district, especially one forming a community within a town or city.",
        "type": "noun",
        "example": "I live in a quiet neighborhood.",
        "difficulty": "A1"
    },
    {
        "english": "neither",
        "bengali": "কোনোটিই না",
        "meaning": "Not the one nor the other of two people or things.",
        "type": "determiner, pronoun, adverb",
        "example": "Neither of them came.",
        "difficulty": "A2"
    },
    {
        "english": "nerve",
        "bengali": "স্নায়ু",
        "meaning": "A whitish fiber or bundle of fibers that transmits impulses of sensation to the brain or spinal cord, and impulses from these to the muscles and organs.",
        "type": "noun",
        "example": "He has a lot of nerve.",
        "difficulty": "B2"
    },
    {
        "english": "nervous",
        "bengali": "নার্ভাস",
        "meaning": "Easily agitated or alarmed; tending to be anxious; highly strung.",
        "type": "adjective",
        "example": "I am nervous about the exam.",
        "difficulty": "A2"
    },
    {
        "english": "net",
        "bengali": "জাল",
        "meaning": "A piece of open-meshed material made of twine, cord, or something similar, used for catching fish, surrounding or protecting things, or for other purposes.",
        "type": "noun",
        "example": "The fisherman cast his net into the sea.",
        "difficulty": "B1"
    },
    {
        "english": "network",
        "bengali": "নেটওয়ার্ক",
        "meaning": "A group or system of interconnected people or things.",
        "type": "noun",
        "example": "I have a large network of friends.",
        "difficulty": "A2"
    },
    {
        "english": "never",
        "bengali": "কখনো না",
        "meaning": "At no time in the past or future; on no occasion; not ever.",
        "type": "adverb",
        "example": "I have never been to London.",
        "difficulty": "A1"
    },
    {
        "english": "nevertheless",
        "bengali": "তথাপি",
        "meaning": "In spite of that; notwithstanding; all the same.",
        "type": "adverb",
        "example": "He was very tired, but nevertheless he continued to work.",
        "difficulty": "B2"
    },
    {
        "english": "new",
        "bengali": "নতুন",
        "meaning": "Produced, introduced, or discovered recently or now for the first time; not existing before.",
        "type": "adjective",
        "example": "I have a new car.",
        "difficulty": "A1"
    },
    {
        "english": "news",
        "bengali": "খবর",
        "meaning": "Newly received or noteworthy information, especially about recent or important events.",
        "type": "noun",
        "example": "I have some good news for you.",
        "difficulty": "A1"
    },
    {
        "english": "newspaper",
        "bengali": "সংবাদপত্র",
        "meaning": "A printed publication (usually issued daily or weekly) consisting of folded unstapled sheets and containing news, feature articles, advertisements, and correspondence.",
        "type": "noun",
        "example": "I read the newspaper every day.",
        "difficulty": "A1"
    },
    {
        "english": "next",
        "bengali": "পরবর্তী",
        "meaning": "Coming immediately after the present one in time or order.",
        "type": "adjective, adverb, noun",
        "example": "Who is next?",
        "difficulty": "A1"
    },
    {
        "english": "next to",
        "bengali": "পাশে",
        "meaning": "In or into a position immediately to one side of; beside.",
        "type": "preposition",
        "example": "The bank is next to the post office.",
        "difficulty": "A1"
    },
    {
        "english": "nice",
        "bengali": "সুন্দর",
        "meaning": "Pleasant; agreeable; satisfactory.",
        "type": "adjective",
        "example": "Have a nice day!",
        "difficulty": "A1"
    },
    {
        "english": "night",
        "bengali": "রাত",
        "meaning": "The period of darkness in each twenty-four hours; the time from sunset to sunrise.",
        "type": "noun",
        "example": "I will see you tomorrow night.",
        "difficulty": "A1"
    },
    {
        "english": "nightmare",
        "bengali": "দুঃস্বপ্ন",
        "meaning": "A frightening or unpleasant dream.",
        "type": "noun",
        "example": "I had a nightmare last night.",
        "difficulty": "B2"
    },
    {
        "english": "nine",
        "bengali": "নয়",
        "meaning": "Equivalent to the product of three and three; one more than eight; 9.",
        "type": "number",
        "example": "I have nine books.",
        "difficulty": "A1"
    },
    {
        "english": "nineteen",
        "bengali": "উনিশ",
        "meaning": "Equivalent to the sum of ten and nine; one more than eighteen; 19.",
        "type": "number",
        "example": "She is nineteen years old.",
        "difficulty": "A1"
    },
    {
        "english": "ninety",
        "bengali": "নব্বই",
        "meaning": "The number equivalent to the product of nine and ten; 90.",
        "type": "number",
        "example": "My grandfather is ninety years old.",
        "difficulty": "A1"
    },
    {
        "english": "no",
        "bengali": "না",
        "meaning": "Used to give a negative response.",
        "type": "exclamation, determiner",
        "example": "No, I am not hungry.",
        "difficulty": "A1"
    },
    {
        "english": "no one",
        "bengali": "কেউ না",
        "meaning": "No person; not a single person.",
        "type": "pronoun",
        "example": "No one was at home.",
        "difficulty": "A1"
    },
    {
        "english": "nobody",
        "bengali": "কেউ না",
        "meaning": "No person; no one.",
        "type": "pronoun",
        "example": "Nobody knows the answer.",
        "difficulty": "A1"
    },
    {
        "english": "noise",
        "bengali": "গোলমাল",
        "meaning": "A sound, especially one that is loud or unpleasant or that causes disturbance.",
        "type": "noun",
        "example": "Please don't make so much noise.",
        "difficulty": "A2"
    },
    {
        "english": "noisy",
        "bengali": "কোলাহলপূর্ণ",
        "meaning": "Making or given to making a lot of noise.",
        "type": "adjective",
        "example": "The children are very noisy.",
        "difficulty": "A2"
    },
    {
        "english": "none",
        "bengali": "কিছুই না",
        "meaning": "Not any.",
        "type": "pronoun",
        "example": "None of the students passed the exam.",
        "difficulty": "A2"
    },
    {
        "english": "nor",
        "bengali": "না",
        "meaning": "Used before the second or further of two or more alternatives (the first being introduced by a negative such as ‘neither’ or ‘not’) to indicate that they are each untrue or each do not happen.",
        "type": "conjunction, adverb",
        "example": "He is neither rich nor famous.",
        "difficulty": "B1"
    },
    {
        "english": "normal",
        "bengali": "স্বাভাবিক",
        "meaning": "Conforming to a standard; usual, typical, or expected.",
        "type": "adjective, noun",
        "example": "It's normal to feel nervous before an exam.",
        "difficulty": "A2"
    },
    {
        "english": "normally",
        "bengali": "সাধারণত",
        "meaning": "Under normal or usual conditions; as a rule.",
        "type": "adverb",
        "example": "I normally go to bed at 10 pm.",
        "difficulty": "A2"
    },
    {
        "english": "north",
        "bengali": "উত্তর",
        "meaning": "The direction in which a compass needle normally points, toward the horizon on the left-hand side of a person facing east, or the part of the horizon lying in this direction.",
        "type": "noun, adjective, adverb",
        "example": "The birds are flying north for the winter.",
        "difficulty": "A1"
    },
    {
        "english": "northern",
        "bengali": "উত্তরাঞ্চলীয়",
        "meaning": "Situated in, directed toward, or facing the north.",
        "type": "adjective",
        "example": "He lives in the northern part of the country.",
        "difficulty": "B1"
    },
    {
        "english": "nose",
        "bengali": "নাক",
        "meaning": "The part projecting above the mouth on the face of a person or animal, containing the nostrils and used for breathing and smelling.",
        "type": "noun",
        "example": "I have a runny nose.",
        "difficulty": "A1"
    },
    {
        "english": "not",
        "bengali": "না",
        "meaning": "Used with an auxiliary verb or ‘be’ to form the negative.",
        "type": "adverb",
        "example": "I am not hungry.",
        "difficulty": "A1"
    },
    {
        "english": "note",
        "bengali": "নোট",
        "meaning": "A brief record of facts, topics, or thoughts, written down as an aid to memory.",
        "type": "noun, verb",
        "example": "Please take a note of this.",
        "difficulty": "A1"
    },
    {
        "english": "nothing",
        "bengali": "কিছুই না",
        "meaning": "Not anything; no single thing.",
        "type": "pronoun",
        "example": "There is nothing in the box.",
        "difficulty": "A1"
    },
    {
        "english": "notice",
        "bengali": "লক্ষ্য করা",
        "meaning": "Become aware of.",
        "type": "verb, noun",
        "example": "Did you notice that he was not there?",
        "difficulty": "A2"
    },
    {
        "english": "notion",
        "bengali": "ধারণা",
        "meaning": "A conception of or belief about something.",
        "type": "noun",
        "example": "I have no notion of what you mean.",
        "difficulty": "B2"
    },
    {
        "english": "novel",
        "bengali": "উপন্যাস",
        "meaning": "A fictitious prose narrative of book length, typically representing character and action with some degree of realism.",
        "type": "noun",
        "example": "She has written a new novel.",
        "difficulty": "A2"
    },
    {
        "english": "November",
        "bengali": "নভেম্বর",
        "meaning": "The eleventh month of the year, in the northern hemisphere usually considered the last month of autumn.",
        "type": "noun",
        "example": "My birthday is in November.",
        "difficulty": "A1"
    },
    {
        "english": "now",
        "bengali": "এখন",
        "meaning": "At the present time or moment.",
        "type": "adverb, conjunction",
        "example": "I am busy now.",
        "difficulty": "A1"
    },
    {
        "english": "nowhere",
        "bengali": "কোথাও না",
        "meaning": "Not in or to any place.",
        "type": "adverb",
        "example": "There is nowhere to go.",
        "difficulty": "A2"
    },
    {
        "english": "nuclear",
        "bengali": "পারমাণবিক",
        "meaning": "Relating to the nucleus of an atom.",
        "type": "adjective",
        "example": "Nuclear energy is a powerful source of energy.",
        "difficulty": "B1"
    },
    {
        "english": "number",
        "bengali": "সংখ্যা",
        "meaning": "An arithmetical value, expressed by a word, symbol, or figure, representing a particular quantity and used in counting and making calculations and for showing order in a series or for identification.",
        "type": "noun, verb",
        "example": "What is your phone number?",
        "difficulty": "A1"
    },
    {
        "english": "numerous",
        "bengali": "অসংখ্য",
        "meaning": "Great in number; many.",
        "type": "adjective",
        "example": "There are numerous reasons for my decision.",
        "difficulty": "B2"
    },
    {
        "english": "nurse",
        "bengali": "নার্স",
        "meaning": "A person trained to care for the sick or infirm, especially in a hospital.",
        "type": "noun",
        "example": "She is a nurse.",
        "difficulty": "A1"
    },
    {
        "english": "nut",
        "bengali": "বাদাম",
        "meaning": "A fruit consisting of a hard or tough shell around an edible kernel.",
        "type": "noun",
        "example": "I like to eat nuts.",
        "difficulty": "A2"
    },
    {
        "english": "obey",
        "bengali": "মান্য করা",
        "meaning": "Submit to the authority of (someone) or comply with (a law).",
        "type": "verb",
        "example": "You must obey the rules.",
        "difficulty": "B2"
    },
    {
        "english": "object",
        "bengali": "বস্তু",
        "meaning": "A material thing that can be seen and touched.",
        "type": "noun, verb",
        "example": "What is that object on the table?",
        "difficulty": "A1"
    },
    {
        "english": "objective",
        "bengali": "উদ্দেশ্য",
        "meaning": "A thing aimed at or sought; a goal.",
        "type": "noun, adjective",
        "example": "Our main objective is to increase sales.",
        "difficulty": "B2"
    },
    {
        "english": "obligation",
        "bengali": "বাধ্যবাধকতা",
        "meaning": "An act or course of action to which a person is morally or legally bound; a duty or commitment.",
        "type": "noun",
        "example": "I have an obligation to help my family.",
        "difficulty": "B2"
    },
    {
        "english": "observation",
        "bengali": "পর্যবেক্ষণ",
        "meaning": "The action or process of observing something or someone carefully or in order to gain information.",
        "type": "noun",
        "example": "She is under observation at the hospital.",
        "difficulty": "B2"
    },
    {
        "english": "observe",
        "bengali": "পর্যবেক্ষণ করা",
        "meaning": "Notice or perceive (something) and register it as being significant.",
        "type": "verb",
        "example": "The scientists are observing the behavior of the animals.",
        "difficulty": "B2"
    },
    {
        "english": "obtain",
        "bengali": "অর্জন করা",
        "meaning": "Get, acquire, or secure (something).",
        "type": "verb",
        "example": "I need to obtain a visa to travel to that country.",
        "difficulty": "B2"
    },
    {
        "english": "obvious",
        "bengali": "সুস্পষ্ট",
        "meaning": "Easily perceived or understood; clear, self-evident, or apparent.",
        "type": "adjective",
        "example": "The answer is obvious.",
        "difficulty": "B1"
    },
    {
        "english": "obviously",
        "bengali": "স্পষ্টতই",
        "meaning": "In a way that is easily perceived or understood; clearly.",
        "type": "adverb",
        "example": "Obviously, he is not happy.",
        "difficulty": "B1"
    },
    {
        "english": "occasion",
        "bengali": "উপলক্ষ",
        "meaning": "A particular time or instance of an event.",
        "type": "noun",
        "example": "This is a special occasion.",
        "difficulty": "B1"
    },
    {
        "english": "occasionally",
        "bengali": "মাঝে মাঝে",
        "meaning": "At infrequent or irregular intervals; now and then.",
        "type": "adverb",
        "example": "I occasionally go to the cinema.",
        "difficulty": "B2"
    },
    {
        "english": "occur",
        "bengali": "ঘটা",
        "meaning": "Happen; take place.",
        "type": "verb",
        "example": "The accident occurred at 10 am.",
        "difficulty": "B1"
    },
    {
        "english": "ocean",
        "bengali": "মহাসাগর",
        "meaning": "A very large expanse of sea, in particular each of the main areas into which the sea is divided geographically.",
        "type": "noun",
        "example": "The Pacific Ocean is the largest ocean in the world.",
        "difficulty": "A1"
    },
    {
        "english": "o'clock",
        "bengali": "টা",
        "meaning": "Used after a number from one to twelve to say what time it is.",
        "type": "adverb",
        "example": "It's three o'clock.",
        "difficulty": "A1"
    },
    {
        "english": "October",
        "bengali": "অক্টোবর",
        "meaning": "The tenth month of the year, in the northern hemisphere the second month of autumn.",
        "type": "noun",
        "example": "My birthday is in October.",
        "difficulty": "A1"
    },
    {
        "english": "odd",
        "bengali": "অদ্ভুত",
        "meaning": "Different to what is usual or expected; strange.",
        "type": "adjective",
        "example": "That's an odd thing to say.",
        "difficulty": "B1"
    },
    {
        "english": "of",
        "bengali": "এর",
        "meaning": "Expressing the relationship between a part and a whole.",
        "type": "preposition",
        "example": "A piece of cake.",
        "difficulty": "A1"
    },
    {
        "english": "off",
        "bengali": "বন্ধ",
        "meaning": "Away from the place in question; to or at a distance.",
        "type": "adverb, preposition",
        "example": "Please turn off the light.",
        "difficulty": "A1"
    },
    {
        "english": "offend",
        "bengali": "আহত করা",
        "meaning": "Cause to feel upset, annoyed, or resentful.",
        "type": "verb",
        "example": "I'm sorry if I offended you.",
        "difficulty": "B2"
    },
    {
        "english": "offense",
        "bengali": "অপরাধ",
        "meaning": "A breach of a law or rule; an illegal act.",
        "type": "noun",
        "example": "He was arrested for a minor offense.",
        "difficulty": "B2"
    },
    {
        "english": "offensive",
        "bengali": "আক্রমণাত্মক",
        "meaning": "Causing someone to feel deeply hurt, upset, or angry.",
        "type": "adjective",
        "example": "His comments were very offensive.",
        "difficulty": "B2"
    },
    {
        "english": "offer",
        "bengali": "প্রস্তাব",
        "meaning": "Present or proffer (something) for (someone) to accept or reject as so desired.",
        "type": "verb, noun",
        "example": "He offered me a job.",
        "difficulty": "A2"
    },
    {
        "english": "office",
        "bengali": "অফিস",
        "meaning": "A room, set of rooms, or building used as a place for commercial, professional, or bureaucratic work.",
        "type": "noun",
        "example": "I work in an office.",
        "difficulty": "A1"
    },
    {
        "english": "officer",
        "bengali": "কর্মকর্তা",
        "meaning": "A person holding a position of command or authority in the armed services, in the merchant marine, or on a passenger ship.",
        "type": "noun",
        "example": "He is a police officer.",
        "difficulty": "A2"
    },
    {
        "english": "official",
        "bengali": "সরকারি",
        "meaning": "Relating to an authority or public body and its duties, actions, and responsibilities.",
        "type": "adjective, noun",
        "example": "This is an official document.",
        "difficulty": "B1"
    },
    {
        "english": "often",
        "bengali": "প্রায়ই",
        "meaning": "Frequently; many times.",
        "type": "adverb",
        "example": "I often go to the cinema.",
        "difficulty": "A1"
    },
    {
        "english": "oh",
        "bengali": "ওহ",
        "meaning": "Used to express a range of emotions including surprise, pain, or sympathy.",
        "type": "exclamation",
        "example": "Oh, I see.",
        "difficulty": "A1"
    },
    {
        "english": "oil",
        "bengali": "তেল",
        "meaning": "A viscous liquid derived from petroleum, especially for use as a fuel or lubricant.",
        "type": "noun",
        "example": "We need some oil for cooking.",
        "difficulty": "A2"
    },
    {
        "english": "OK",
        "bengali": "ঠিক আছে",
        "meaning": "Used to express assent, agreement, or acceptance.",
        "type": "exclamation, adjective, adverb",
        "example": "OK, I'll do it.",
        "difficulty": "A1"
    },
    {
        "english": "old",
        "bengali": "পুরানো",
        "meaning": "Having lived for a long time; no longer young.",
        "type": "adjective",
        "example": "He is an old man.",
        "difficulty": "A1"
    },
    {
        "english": "old-fashioned",
        "bengali": "পুরানো ধাঁচের",
        "meaning": "In or according to styles or types no longer current or fashionable.",
        "type": "adjective",
        "example": "He has very old-fashioned ideas.",
        "difficulty": "B1"
    },
    {
        "english": "on",
        "bengali": "উপরে",
        "meaning": "Physically in contact with and supported by (a surface).",
        "type": "preposition, adverb",
        "example": "The book is on the table.",
        "difficulty": "A1"
    },
    {
        "english": "once",
        "bengali": "একদা",
        "meaning": "On one occasion or for one time only.",
        "type": "adverb, conjunction",
        "example": "I have been to London once.",
        "difficulty": "A1"
    },
    {
        "english": "one",
        "bengali": "এক",
        "meaning": "The lowest cardinal number; half of two; 1.",
        "type": "number, determiner, pronoun",
        "example": "I have one brother.",
        "difficulty": "A1"
    },
    {
        "english": "onion",
        "bengali": "পেঁয়াজ",
        "meaning": "A swollen edible bulb used as a vegetable, having a pungent taste and smell and composed of several concentric layers.",
        "type": "noun",
        "example": "I need to buy some onions.",
        "difficulty": "A1"
    },
    {
        "english": "online",
        "bengali": "অনলাইন",
        "meaning": "Controlled by or connected to another computer or to a network.",
        "type": "adjective, adverb",
        "example": "I do my shopping online.",
        "difficulty": "A1"
    },
    {
        "english": "only",
        "bengali": "শুধু",
        "meaning": "And no one or nothing more besides; solely or exclusively.",
        "type": "adjective, adverb",
        "example": "I only have one brother.",
        "difficulty": "A1"
    },
    {
        "english": "onto",
        "bengali": "উপর",
        "meaning": "Moving to a position on the surface of.",
        "type": "preposition",
        "example": "The cat jumped onto the table.",
        "difficulty": "A2"
    },
    {
        "english": "open",
        "bengali": "খোলা",
        "meaning": "Allowing access, passage, or a view through an empty space; not closed or blocked up.",
        "type": "adjective, verb",
        "example": "Please open the door.",
        "difficulty": "A1"
    },
    {
        "english": "opening",
        "bengali": "খোলা",
        "meaning": "An unfilled space; a gap.",
        "type": "noun",
        "example": "There is an opening in the fence.",
        "difficulty": "B2"
    },
    {
        "english": "operate",
        "bengali": "চালানো",
        "meaning": "(of a person) control the functioning of (a machine, process, or system).",
        "type": "verb",
        "example": "He knows how to operate this machine.",
        "difficulty": "B2"
    },
    {
        "english": "operation",
        "bengali": "অপারেশন",
        "meaning": "The action of functioning or the fact of being active or in effect.",
        "type": "noun",
        "example": "The operation was a success.",
        "difficulty": "B1"
    },
    {
        "english": "opinion",
        "bengali": "মতামত",
        "meaning": "A view or judgment formed about something, not necessarily based on fact or knowledge.",
        "type": "noun",
        "example": "What is your opinion about this?",
        "difficulty": "A1"
    },
    {
        "english": "opponent",
        "bengali": "প্রতিপক্ষ",
        "meaning": "Someone who competes against or fights another in a contest, game, or argument; a rival or adversary.",
        "type": "noun",
        "example": "He is a strong opponent.",
        "difficulty": "B2"
    },
    {
        "english": "opportunity",
        "bengali": "সুযোগ",
        "meaning": "A set of circumstances that makes it possible to do something.",
        "type": "noun",
        "example": "This is a great opportunity for you.",
        "difficulty": "A2"
    },
    {
        "english": "oppose",
        "bengali": "বিরোধিতা করা",
        "meaning": "Actively resist or refuse to comply with (a person or a system).",
        "type": "verb",
        "example": "He opposed the new law.",
        "difficulty": "B2"
    },
    {
        "english": "opposed",
        "bengali": "বিরোধী",
        "meaning": "Eager to prevent or put an end to; disapproving of or disagreeing with.",
        "type": "adjective",
        "example": "I am opposed to this plan.",
        "difficulty": "B2"
    },
    {
        "english": "opposite",
        "bengali": "বিপরীত",
        "meaning": "Situated on the other or further side when seen from a particular point of view; facing.",
        "type": "adjective, adverb, preposition, noun",
        "example": "The bank is on the opposite side of the street.",
        "difficulty": "A1"
    },
    {
        "english": "opposition",
        "bengali": "বিরোধিতা",
        "meaning": "Resistance or dissent, expressed in action or argument.",
        "type": "noun",
        "example": "There was a lot of opposition to the new law.",
        "difficulty": "B2"
    },
    {
        "english": "option",
        "bengali": "বিকল্প",
        "meaning": "A thing that is or may be chosen.",
        "type": "noun",
        "example": "You have two options.",
        "difficulty": "A2"
    },
    {
        "english": "or",
        "bengali": "বা",
        "meaning": "Used to link alternatives.",
        "type": "conjunction",
        "example": "Would you like tea or coffee?",
        "difficulty": "A1"
    },
    {
        "english": "orange",
        "bengali": "কমলা",
        "meaning": "A large round juicy citrus fruit with a tough bright reddish-yellow rind.",
        "type": "noun, adjective",
        "example": "I would like an orange.",
        "difficulty": "A1"
    },
    {
        "english": "order",
        "bengali": "আদেশ",
        "meaning": "An authoritative command, direction, or instruction.",
        "type": "noun, verb",
        "example": "The soldier obeyed the order.",
        "difficulty": "A1"
    },
    {
        "english": "ordinary",
        "bengali": "সাধারণ",
        "meaning": "With no special or distinctive features; normal.",
        "type": "adjective",
        "example": "It was just an ordinary day.",
        "difficulty": "A2"
    },
    {
        "english": "organ",
        "bengali": "অঙ্গ",
        "meaning": "A part of an organism that is typically self-contained and has a specific vital function, such as the heart or liver in humans.",
        "type": "noun",
        "example": "The heart is a vital organ.",
        "difficulty": "B2"
    },
    {
        "english": "organization",
        "bengali": "সংগঠন",
        "meaning": "An organized body of people with a particular purpose, especially a business, society, association, etc.",
        "type": "noun",
        "example": "He works for a large organization.",
        "difficulty": "A2"
    },
    {
        "english": "organize",
        "bengali": "সংগঠিত করা",
        "meaning": "Arrange into a structured whole; order.",
        "type": "verb",
        "example": "We need to organize a meeting.",
        "difficulty": "A2"
    },
    {
        "english": "organized",
        "bengali": "সংগঠিত",
        "meaning": "Arranged or structured in a systematic way.",
        "type": "adjective",
        "example": "She is a very organized person.",
        "difficulty": "B1"
    },
    {
        "english": "organizer",
        "bengali": "সংগঠক",
        "meaning": "A person who arranges an event or activity.",
        "type": "noun",
        "example": "He is the organizer of the conference.",
        "difficulty": "B1"
    },
    {
        "english": "origin",
        "bengali": "উৎস",
        "meaning": "The point or place where something begins, arises, or is derived.",
        "type": "noun",
        "example": "What is the origin of this word?",
        "difficulty": "B2"
    },
    {
        "english": "original",
        "bengali": "আসল",
        "meaning": "Present or existing from the beginning; first or earliest.",
        "type": "adjective, noun",
        "example": "This is the original painting.",
        "difficulty": "A2"
    },
    {
        "english": "originally",
        "bengali": "মূলত",
        "meaning": "From or in the beginning; at first.",
        "type": "adverb",
        "example": "The house was originally a school.",
        "difficulty": "B1"
    },
    {
        "english": "other",
        "bengali": "অন্য",
        "meaning": "Used to refer to a person or thing that is different or distinct from one already mentioned or known about.",
        "type": "adjective, pronoun",
        "example": "I have another brother.",
        "difficulty": "A1"
    },
    {
        "english": "otherwise",
        "bengali": "অন্যথায়",
        "meaning": "In circumstances different from those present or considered; or else.",
        "type": "adverb",
        "example": "You must study hard, otherwise you will fail.",
        "difficulty": "B2"
    },
    {
        "english": "ought",
        "bengali": "উচিত",
        "meaning": "Used to indicate duty or correctness, typically when criticizing someone's actions.",
        "type": "modal verb",
        "example": "You ought to be more careful.",
        "difficulty": "B1"
    },
    {
        "english": "our",
        "bengali": "আমাদের",
        "meaning": "Belonging to or associated with the speaker and one or more other people considered together.",
        "type": "determiner",
        "example": "This is our house.",
        "difficulty": "A1"
    },
    {
        "english": "ours",
        "bengali": "আমাদের",
        "meaning": "Used to refer to a thing or things belonging to or associated with the speaker and one or more other people previously mentioned.",
        "type": "pronoun",
        "example": "This house is ours.",
        "difficulty": "B1"
    },
    {
        "english": "ourselves",
        "bengali": "আমরা নিজেরাই",
        "meaning": "Used by a speaker to refer to himself or herself and one or more other people as the object of a verb or preposition when he or she and the other people are the subject of the clause.",
        "type": "pronoun",
        "example": "We did it ourselves.",
        "difficulty": "A2"
    },
    {
        "english": "out",
        "bengali": "বাইরে",
        "meaning": "Moving or appearing to move away from a particular place, especially one that is enclosed or hidden.",
        "type": "adverb, preposition",
        "example": "The cat is out of the house.",
        "difficulty": "A1"
    },
    {
        "english": "outcome",
        "bengali": "ফলাফল",
        "meaning": "The way a thing turns out; a consequence.",
        "type": "noun",
        "example": "What was the outcome of the meeting?",
        "difficulty": "B2"
    },
    {
        "english": "outdoor",
        "bengali": "বহিরাঙ্গন",
        "meaning": "Situated, existing, or intended for use in the open air.",
        "type": "adjective",
        "example": "This is an outdoor swimming pool.",
        "difficulty": "B1"
    },
    {
        "english": "outdoors",
        "bengali": "বাইরে",
        "meaning": "In or into the open air.",
        "type": "adverb",
        "example": "Let's eat outdoors.",
        "difficulty": "B1"
    },
    {
        "english": "outer",
        "bengali": "বাইরের",
        "meaning": "Outside; external.",
        "type": "adjective",
        "example": "The outer layer of the skin.",
        "difficulty": "B2"
    },
    {
        "english": "outline",
        "bengali": "রূপরেখা",
        "meaning": "A line or set of lines enclosing or indicating the shape of an object in a sketch or diagram.",
        "type": "noun, verb",
        "example": "Please give me an outline of your plan.",
        "difficulty": "B2"
    },
    {
        "english": "outside",
        "bengali": "বাইরে",
        "meaning": "The external side or surface of something.",
        "type": "adverb, preposition, noun, adjective",
        "example": "The cat is outside the house.",
        "difficulty": "A1"
    },
    {
        "english": "oven",
        "bengali": "চুল্লি",
        "meaning": "An enclosed compartment, as in a kitchen range, for cooking and heating food.",
        "type": "noun",
        "example": "The cake is in the oven.",
        "difficulty": "A2"
    },
    {
        "english": "over",
        "bengali": "উপর",
        "meaning": "Extending directly upward from.",
        "type": "preposition, adverb",
        "example": "The plane is flying over the clouds.",
        "difficulty": "A1"
    },
    {
        "english": "overall",
        "bengali": "সামগ্রিকভাবে",
        "meaning": "Taking everything into account.",
        "type": "adjective, adverb",
        "example": "Overall, the project was a success.",
        "difficulty": "B2"
    },
    {
        "english": "overseas",
        "bengali": "বিদেশ",
        "meaning": "In or to a foreign country, especially one across the sea.",
        "type": "adverb, adjective",
        "example": "He works overseas.",
        "difficulty": "A2"
    },
    {
        "english": "owe",
        "bengali": "ঋণী থাকা",
        "meaning": "Have an obligation to pay or repay (something, especially money) in return for something received.",
        "type": "verb",
        "example": "I owe you a lot of money.",
        "difficulty": "B2"
    },
    {
        "english": "own",
        "bengali": "নিজের",
        "meaning": "Used with a possessive to emphasize that someone or something belongs or relates to the person or thing mentioned.",
        "type": "adjective, pronoun, verb",
        "example": "This is my own car.",
        "difficulty": "A1"
    },
    {
        "english": "owner",
        "bengali": "মালিক",
        "meaning": "A person who owns something.",
        "type": "noun",
        "example": "Who is the owner of this house?",
        "difficulty": "A2"
    },
    {
        "english": "pace",
        "bengali": "গতি",
        "meaning": "A single step taken when walking or running.",
        "type": "noun, verb",
        "example": "He walked with a slow pace.",
        "difficulty": "B2"
    },
    {
        "english": "pack",
        "bengali": "প্যাক করা",
        "meaning": "Fill (a suitcase or bag) with clothes and other items needed for travel.",
        "type": "verb, noun",
        "example": "I need to pack my bags for the trip.",
        "difficulty": "A2"
    },
    {
        "english": "package",
        "bengali": "প্যাকেজ",
        "meaning": "An object or group of objects wrapped in paper or plastic, or packed in a box.",
        "type": "noun, verb",
        "example": "I received a package in the mail.",
        "difficulty": "B1"
    },
    {
        "english": "page",
        "bengali": "পৃষ্ঠা",
        "meaning": "One side of a sheet of paper in a collection of sheets bound together, especially in a book, magazine, or newspaper.",
        "type": "noun",
        "example": "Please turn to page 10.",
        "difficulty": "A1"
    },
    {
        "english": "pain",
        "bengali": "ব্যথা",
        "meaning": "Highly unpleasant physical sensation caused by illness or injury.",
        "type": "noun",
        "example": "I have a pain in my back.",
        "difficulty": "A2"
    },
    {
        "english": "painful",
        "bengali": "বেদনাদায়ক",
        "meaning": "(of a part of the body) affected with pain.",
        "type": "adjective",
        "example": "My leg is very painful.",
        "difficulty": "B1"
    },
    {
        "english": "paint",
        "bengali": "রং করা",
        "meaning": "Cover the surface of (something) with paint, as a decoration or protection.",
        "type": "verb, noun",
        "example": "We need to paint the walls.",
        "difficulty": "A1"
    },
    {
        "english": "painter",
        "bengali": "চিত্রকর",
        "meaning": "An artist who paints pictures.",
        "type": "noun",
        "example": "He is a famous painter.",
        "difficulty": "A2"
    },
    {
        "english": "painting",
        "bengali": "চিত্রাঙ্কন",
        "meaning": "The action or skill of using paint, either in a picture or as decoration.",
        "type": "noun",
        "example": "This is a beautiful painting.",
        "difficulty": "A1"
    },
    {
        "english": "pair",
        "bengali": "জোড়া",
        "meaning": "A set of two things used together or regarded as a unit.",
        "type": "noun",
        "example": "I need a new pair of shoes.",
        "difficulty": "A1"
    },
    {
        "english": "palace",
        "bengali": "প্রাসাদ",
        "meaning": "The official residence of a sovereign, archbishop, bishop, or other exalted person.",
        "type": "noun",
        "example": "The queen lives in a beautiful palace.",
        "difficulty": "A2"
    },
    {
        "english": "pale",
        "bengali": "ফ্যাকাশে",
        "meaning": "Light in color or having little color.",
        "type": "adjective",
        "example": "She has a pale complexion.",
        "difficulty": "B1"
    },
    {
        "english": "pan",
        "bengali": "প্যান",
        "meaning": "A metal container used for cooking food in.",
        "type": "noun",
        "example": "I need a frying pan.",
        "difficulty": "B1"
    },
    {
        "english": "panel",
        "bengali": "প্যানেল",
        "meaning": "A flat or curved component, typically rectangular, that forms or is set into the surface of a door, wall, or ceiling.",
        "type": "noun",
        "example": "The door is made of wooden panels.",
        "difficulty": "B2"
    },
    {
        "english": "pants",
        "bengali": "প্যান্ট",
        "meaning": "Trousers.",
        "type": "noun",
        "example": "He is wearing a pair of blue pants.",
        "difficulty": "A1"
    },
    {
        "english": "paper",
        "bengali": "কাগজ",
        "meaning": "Material manufactured in thin sheets from the pulp of wood or other fibrous substances, used for writing, drawing, or printing on, or as wrapping material.",
        "type": "noun",
        "example": "I need a piece of paper.",
        "difficulty": "A1"
    },
    {
        "english": "paragraph",
        "bengali": "অনুচ্ছেদ",
        "meaning": "A distinct section of a piece of writing, usually dealing with a single theme and indicated by a new line, indentation, or numbering.",
        "type": "noun",
        "example": "Please read the first paragraph.",
        "difficulty": "A1"
    },
    {
        "english": "parent",
        "bengali": "অভিভাবক",
        "meaning": "A father or mother.",
        "type": "noun",
        "example": "My parents are very supportive.",
        "difficulty": "A1"
    },
    {
        "english": "park",
        "bengali": "পার্ক",
        "meaning": "A large public garden or area of land used for recreation.",
        "type": "noun, verb",
        "example": "Let's go to the park.",
        "difficulty": "A1"
    },
    {
        "english": "parking",
        "bengali": "পার্কিং",
        "meaning": "The action of parking a vehicle.",
        "type": "noun",
        "example": "There is a parking lot near the station.",
        "difficulty": "A2"
    },
    {
        "english": "part",
        "bengali": "অংশ",
        "meaning": "An amount or section which, when combined with others, makes up the whole of something.",
        "type": "noun",
        "example": "This is the best part of the movie.",
        "difficulty": "A1"
    },
    {
        "english": "participant",
        "bengali": "অংশগ্রহণকারী",
        "meaning": "A person who takes part in something.",
        "type": "noun",
        "example": "All participants will receive a certificate.",
        "difficulty": "B2"
    },
    {
        "english": "participate",
        "bengali": "অংশগ্রহণ করা",
        "meaning": "Take part.",
        "type": "verb",
        "example": "I would like to participate in the competition.",
        "difficulty": "B1"
    },
    {
        "english": "particular",
        "bengali": "বিশেষ",
        "meaning": "Used to single out an individual member of a specified group or class.",
        "type": "adjective",
        "example": "I have no particular reason for my decision.",
        "difficulty": "A2"
    },
    {
        "english": "particularly",
        "bengali": "বিশেষত",
        "meaning": "To a higher degree than is usual or average.",
        "type": "adverb",
        "example": "I am particularly interested in this subject.",
        "difficulty": "B1"
    },
    {
        "english": "partly",
        "bengali": "আংশিকভাবে",
        "meaning": "To some extent; not completely.",
        "type": "adverb",
        "example": "The project was partly successful.",
        "difficulty": "B2"
    },
    {
        "english": "partner",
        "bengali": "অংশীদার",
        "meaning": "A person who takes part in an undertaking with another or others, especially in a business or firm with shared risks and profits.",
        "type": "noun",
        "example": "He is my business partner.",
        "difficulty": "A1"
    },
    {
        "english": "party",
        "bengali": "পার্টি",
        "meaning": "A social gathering of invited guests, typically involving eating, drinking, and entertainment.",
        "type": "noun",
        "example": "Are you going to the party tonight?",
        "difficulty": "A1"
    },
    {
        "english": "pass",
        "bengali": "পাস করা",
        "meaning": "Go past or across; leave behind or on one side in proceeding.",
        "type": "verb, noun",
        "example": "He passed his exam.",
        "difficulty": "A2"
    },
    {
        "english": "passage",
        "bengali": "অনুচ্ছেদ",
        "meaning": "The action or process of moving through or past somewhere on the way from one place to another.",
        "type": "noun",
        "example": "Please read the following passage.",
        "difficulty": "B2"
    },
    {
        "english": "passenger",
        "bengali": "যাত্রী",
        "meaning": "A traveler on a public or private conveyance other than the driver, pilot, or crew.",
        "type": "noun",
        "example": "The train was full of passengers.",
        "difficulty": "A2"
    },
    {
        "english": "passion",
        "bengali": "আবেগ",
        "meaning": "Strong and barely controllable emotion.",
        "type": "noun",
        "example": "He has a passion for music.",
        "difficulty": "B1"
    },
    {
        "english": "passport",
        "bengali": "পাসপোর্ট",
        "meaning": "An official document issued by a government, certifying the holder's identity and citizenship and entitling them to travel under its protection to and from foreign countries.",
        "type": "noun",
        "example": "I need to renew my passport.",
        "difficulty": "A1"
    },
    {
        "english": "past",
        "bengali": "অতীত",
        "meaning": "Gone by in time and no longer existing.",
        "type": "adjective, noun, preposition, adverb",
        "example": "That's all in the past.",
        "difficulty": "A1"
    },
    {
        "english": "path",
        "bengali": "পথ",
        "meaning": "A way or track laid down for walking or made by continual treading.",
        "type": "noun",
        "example": "Follow this path to the village.",
        "difficulty": "B1"
    },
    {
        "english": "patient",
        "bengali": "রোগী",
        "meaning": "A person receiving or registered to receive medical treatment.",
        "type": "noun, adjective",
        "example": "The doctor is with a patient.",
        "difficulty": "A2"
    },
    {
        "english": "pattern",
        "bengali": "প্যাটার্ন",
        "meaning": "A repeated decorative design.",
        "type": "noun",
        "example": "I like the pattern on your dress.",
        "difficulty": "A2"
    },
    {
        "english": "pay",
        "bengali": "পরিশোধ করা",
        "meaning": "Give (someone) money that is due for work done, goods received, or a debt incurred.",
        "type": "verb, noun",
        "example": "I have to pay the rent.",
        "difficulty": "A1"
    },
    {
        "english": "payment",
        "bengali": "পরিশোধ",
        "meaning": "The action or process of paying someone or something, or of being paid.",
        "type": "noun",
        "example": "The payment is due tomorrow.",
        "difficulty": "B1"
    },
    {
        "english": "peace",
        "bengali": "শান্তি",
        "meaning": "Freedom from disturbance; tranquility.",
        "type": "noun",
        "example": "I need some peace and quiet.",
        "difficulty": "A2"
    },
    {
        "english": "peaceful",
        "bengali": "শান্তিপূর্ণ",
        "meaning": "Free from disturbance; tranquil.",
        "type": "adjective",
        "example": "It's a peaceful place.",
        "difficulty": "B1"
    },
    {
        "english": "pen",
        "bengali": "কলম",
        "meaning": "An instrument for writing or drawing with ink, typically consisting of a metal nib or ballpoint fitted into a metal or plastic holder.",
        "type": "noun",
        "example": "I need a pen.",
        "difficulty": "A1"
    },
    {
        "english": "pencil",
        "bengali": "পেন্সিল",
        "meaning": "An instrument for writing or drawing, consisting of a thin stick of graphite or a similar solid pigment encased in a cylinder of wood or metal.",
        "type": "noun",
        "example": "I need a pencil.",
        "difficulty": "A1"
    },
    {
        "english": "penny",
        "bengali": "পেনি",
        "meaning": "A British bronze coin and monetary unit equal to one hundredth of a pound.",
        "type": "noun",
        "example": "I don't have a single penny.",
        "difficulty": "A2"
    },
    {
        "english": "people",
        "bengali": "মানুষ",
        "meaning": "Human beings in general or considered collectively.",
        "type": "noun",
        "example": "There are a lot of people here.",
        "difficulty": "A1"
    },
    {
        "english": "pepper",
        "bengali": "গোলমরিচ",
        "meaning": "A pungent hot-tasting powder prepared from dried and ground peppercorns, used as a spice or condiment to flavor food.",
        "type": "noun",
        "example": "I need some salt and pepper.",
        "difficulty": "A1"
    },
    {
        "english": "per",
        "bengali": "প্রতি",
        "meaning": "For each (used with units to express a rate).",
        "type": "preposition",
        "example": "The car can travel 50 miles per gallon.",
        "difficulty": "A2"
    },
    {
        "english": "percent",
        "bengali": "শতাংশ",
        "meaning": "By a specified amount in or for every hundred.",
        "type": "noun, adjective, adverb",
        "example": "I got 90 percent on the exam.",
        "difficulty": "A2"
    },
    {
        "english": "percentage",
        "bengali": "শতাংশ",
        "meaning": "A rate, number, or amount in each hundred.",
        "type": "noun",
        "example": "What is the percentage of students who passed the exam?",
        "difficulty": "B1"
    },
    {
        "english": "perfect",
        "bengali": "নিখুঁত",
        "meaning": "Having all the required or desirable elements, qualities, or characteristics; as good as it is possible to be.",
        "type": "adjective",
        "example": "This is a perfect day for a picnic.",
        "difficulty": "A1"
    },
    {
        "english": "perfectly",
        "bengali": "নিখুঁতভাবে",
        "meaning": "In a manner or way that is perfect.",
        "type": "adverb",
        "example": "The plan worked perfectly.",
        "difficulty": "B1"
    },
    {
        "english": "perform",
        "bengali": "সম্পাদন করা",
        "meaning": "Carry out, accomplish, or fulfill (an action, task, or function).",
        "type": "verb",
        "example": "The actors performed the play beautifully.",
        "difficulty": "A2"
    },
    {
        "english": "performance",
        "bengali": "কর্মক্ষমতা",
        "meaning": "An act of staging or presenting a play, concert, or other form of entertainment.",
        "type": "noun",
        "example": "It was a great performance.",
        "difficulty": "B1"
    },
    {
        "english": "perhaps",
        "bengali": "সম্ভবত",
        "meaning": "Used to express uncertainty or possibility.",
        "type": "adverb",
        "example": "Perhaps he will come.",
        "difficulty": "A2"
    },
    {
        "english": "period",
        "bengali": "সময়কাল",
        "meaning": "A length or portion of time.",
        "type": "noun",
        "example": "I will be on holiday for a period of two weeks.",
        "difficulty": "A1"
    },
    {
        "english": "permanent",
        "bengali": "স্থায়ী",
        "meaning": "Lasting or intended to last or remain unchanged indefinitely.",
        "type": "adjective",
        "example": "This is a permanent job.",
        "difficulty": "B2"
    },
    {
        "english": "permission",
        "bengali": "অনুমতি",
        "meaning": "The action of officially allowing someone to do a particular thing; consent or authorization.",
        "type": "noun",
        "example": "You need permission to enter this building.",
        "difficulty": "A2"
    },
    {
        "english": "permit",
        "bengali": "অনুমতি দেওয়া",
        "meaning": "Officially allow (someone) to do something.",
        "type": "verb, noun",
        "example": "Smoking is not permitted here.",
        "difficulty": "B2"
    },
    {
        "english": "person",
        "bengali": "ব্যক্তি",
        "meaning": "A human being regarded as an individual.",
        "type": "noun",
        "example": "He is a very nice person.",
        "difficulty": "A1"
    },
    {
        "english": "personal",
        "bengali": "ব্যক্তিগত",
        "meaning": "Of, affecting, or belonging to a particular person rather than to anyone else.",
        "type": "adjective",
        "example": "This is a personal matter.",
        "difficulty": "A1"
    },
    {
        "english": "personality",
        "bengali": "ব্যক্তিত্ব",
        "meaning": "The combination of characteristics or qualities that form an individual's distinctive character.",
        "type": "noun",
        "example": "She has a great personality.",
        "difficulty": "A2"
    },
    {
        "english": "personally",
        "bengali": "ব্যক্তিগতভাবে",
        "meaning": "By a particular person and not someone acting on their behalf.",
        "type": "adverb",
        "example": "I will deal with this matter personally.",
        "difficulty": "B1"
    },
    {
        "english": "perspective",
        "bengali": "দৃষ্টিভঙ্গি",
        "meaning": "A particular attitude toward or way of regarding something; a point of view.",
        "type": "noun",
        "example": "From my perspective, this is a good idea.",
        "difficulty": "B2"
    },
    {
        "english": "persuade",
        "bengali": "প্ররোচিত করা",
        "meaning": "Cause (someone) to do something through reasoning or argument.",
        "type": "verb",
        "example": "I persuaded him to go to the doctor.",
        "difficulty": "B1"
    },
    {
        "english": "pet",
        "bengali": "পোষা প্রাণী",
        "meaning": "A domestic or tamed animal kept for companionship or pleasure.",
        "type": "noun",
        "example": "Do you have a pet?",
        "difficulty": "A2"
    },
    {
        "english": "phase",
        "bengali": "পর্যায়",
        "meaning": "A distinct period or stage in a series of events or a process of change or development.",
        "type": "noun",
        "example": "The project is in its final phase.",
        "difficulty": "B2"
    },
    {
        "english": "phenomenon",
        "bengali": "ঘটনা",
        "meaning": "A fact or situation that is observed to exist or happen, especially one whose cause or explanation is in question.",
        "type": "noun",
        "example": "The Northern Lights are a natural phenomenon.",
        "difficulty": "B2"
    },
    {
        "english": "philosophy",
        "bengali": "দর্শন",
        "meaning": "The study of the fundamental nature of knowledge, reality, and existence, especially when considered as an academic discipline.",
        "type": "noun",
        "example": "He is studying philosophy at university.",
        "difficulty": "B2"
    },
    {
        "english": "phone",
        "bengali": "ফোন",
        "meaning": "A telephone.",
        "type": "noun, verb",
        "example": "I will call you on the phone.",
        "difficulty": "A1"
    },
    {
        "english": "photo",
        "bengali": "ছবি",
        "meaning": "A photograph.",
        "type": "noun",
        "example": "I took a lot of photos on my holiday.",
        "difficulty": "A1"
    },
    {
        "english": "photograph",
        "bengali": "ছবি",
        "meaning": "A picture made using a camera, in which an image is focused onto film or other light-sensitive material and then made visible and permanent by chemical treatment, or stored digitally.",
        "type": "noun, verb",
        "example": "This is a photograph of my family.",
        "difficulty": "A1"
    },
    {
        "english": "photographer",
        "bengali": "ফটোগ্রাফার",
        "meaning": "A person who takes photographs, especially as a job.",
        "type": "noun",
        "example": "He is a professional photographer.",
        "difficulty": "B1"
    },
    {
        "english": "photography",
        "bengali": "ফটোগ্রাফি",
        "meaning": "The art or process of taking photographs.",
        "type": "noun",
        "example": "She is studying photography.",
        "difficulty": "B1"
    },
    {
        "english": "phrase",
        "bengali": "বাক্যাংশ",
        "meaning": "A small group of words standing together as a conceptual unit, typically forming a component of a clause.",
        "type": "noun",
        "example": "Can you explain this phrase to me?",
        "difficulty": "A1"
    },
    {
        "english": "physical",
        "bengali": "শারীরিক",
        "meaning": "Relating to the body as opposed to the mind.",
        "type": "adjective",
        "example": "He is in good physical condition.",
        "difficulty": "A2"
    },
    {
        "english": "physics",
        "bengali": "পদার্থবিজ্ঞান",
        "meaning": "The branch of science concerned with the nature and properties of matter and energy. The subject matter of physics, distinguished from that of chemistry and biology, includes mechanics, heat, light and other radiation, sound, electricity, magnetism, and the structure of atoms.",
        "type": "noun",
        "example": "I am studying physics at university.",
        "difficulty": "A2"
    },
    {
        "english": "piano",
        "bengali": "পিয়ানো",
        "meaning": "A large keyboard musical instrument with a wooden case enclosing a soundboard and metal strings, which are struck by hammers when the keys are depressed. The strings' vibration is stopped by dampers when the keys are released and can be regulated for length and volume by two or three pedals.",
        "type": "noun",
        "example": "She can play the piano.",
        "difficulty": "A1"
    },
    {
        "english": "pick",
        "bengali": "তোলা",
        "meaning": "Take hold of and lift or move (someone or something).",
        "type": "verb, noun",
        "example": "Please pick up your clothes.",
        "difficulty": "A2"
    },
    {
        "english": "picture",
        "bengali": "ছবি",
        "meaning": "A painting or drawing.",
        "type": "noun, verb",
        "example": "This is a beautiful picture.",
        "difficulty": "A1"
    },
    {
        "english": "piece",
        "bengali": "টুকরা",
        "meaning": "A part or portion of something.",
        "type": "noun",
        "example": "I would like a piece of cake.",
        "difficulty": "A1"
    },
    {
        "english": "pig",
        "bengali": "শূকর",
        "meaning": "An omnivorous domesticated hoofed mammal with sparse bristly hair and a flat snout for rooting in the soil, kept for its meat.",
        "type": "noun",
        "example": "The pig is a farm animal.",
        "difficulty": "A1"
    },
    {
        "english": "pile",
        "bengali": "স্তূপ",
        "meaning": "A heap of things laid or lying one on top of another.",
        "type": "noun, verb",
        "example": "There is a pile of books on the table.",
        "difficulty": "B2"
    },
    {
        "english": "pilot",
        "bengali": "বিমানচালক",
        "meaning": "A person who operates the flying controls of an aircraft.",
        "type": "noun",
        "example": "He is a pilot.",
        "difficulty": "A2"
    },
    {
        "english": "pin",
        "bengali": "পিন",
        "meaning": "A thin piece of metal with a sharp point at one end and a round head at the other, used for fastening pieces of cloth, paper, etc.",
        "type": "noun, verb",
        "example": "I need a pin to fasten this.",
        "difficulty": "B1"
    },
    {
        "english": "pink",
        "bengali": "গোলাপী",
        "meaning": "Of a color intermediate between red and white, as of coral or salmon.",
        "type": "adjective, noun",
        "example": "She is wearing a pink dress.",
        "difficulty": "A1"
    },
    {
        "english": "pipe",
        "bengali": "পাইপ",
        "meaning": "A tube of metal, plastic, or other material used to convey water, gas, oil, or other fluid substances.",
        "type": "noun",
        "example": "The water is leaking from the pipe.",
        "difficulty": "B1"
    },
    {
        "english": "pitch",
        "bengali": "পিচ",
        "meaning": "The quality of a sound governed by the rate of vibrations producing it; the degree of highness or lowness of a tone.",
        "type": "noun",
        "example": "He has a high-pitched voice.",
        "difficulty": "B2"
    },
    {
        "english": "place",
        "bengali": "স্থান",
        "meaning": "A particular position or point in space.",
        "type": "noun, verb",
        "example": "This is a beautiful place.",
        "difficulty": "A1"
    },
    {
        "english": "plain",
        "bengali": "সাধারণ",
        "meaning": "Not decorated or elaborate; simple or ordinary in character.",
        "type": "adjective",
        "example": "The food was very plain.",
        "difficulty": "B2"
    },
    {
        "english": "plan",
        "bengali": "পরিকল্পনা",
        "meaning": "A detailed proposal for doing or achieving something.",
        "type": "noun, verb",
        "example": "What are your plans for the weekend?",
        "difficulty": "A1"
    },
    {
        "english": "plane",
        "bengali": "বিমান",
        "meaning": "A powered flying vehicle with fixed wings and a weight greater than that of the air it displaces, driven forward by propellers or jet engines.",
        "type": "noun",
        "example": "I am going to travel by plane.",
        "difficulty": "A1"
    },
    {
        "english": "planet",
        "bengali": "গ্রহ",
        "meaning": "A celestial body moving in an elliptical orbit around a star.",
        "type": "noun",
        "example": "The Earth is a planet.",
        "difficulty": "A2"
    },
    {
        "english": "planning",
        "bengali": "পরিকল্পনা",
        "meaning": "The process of making plans for something.",
        "type": "noun",
        "example": "Good planning is essential for success.",
        "difficulty": "B1"
    },
    {
        "english": "plant",
        "bengali": "উদ্ভিদ",
        "meaning": "A living organism of the kind exemplified by trees, shrubs, herbs, grasses, ferns, and mosses, typically growing in a permanent site, absorbing water and inorganic substances through its roots, and synthesizing nutrients in its leaves by photosynthesis using the green pigment chlorophyll.",
        "type": "noun, verb",
        "example": "I have a lot of plants in my garden.",
        "difficulty": "A1"
    },
    {
        "english": "plastic",
        "bengali": "প্লাস্টিক",
        "meaning": "A synthetic material made from a wide range of organic polymers such as polyethylene, PVC, nylon, etc., that can be molded into shape while soft and then set into a rigid or slightly elastic form.",
        "type": "noun, adjective",
        "example": "The toy is made of plastic.",
        "difficulty": "A2"
    },
    {
        "english": "plate",
        "bengali": "থালা",
        "meaning": "A flat dish, typically circular and made of china, from which food is eaten or served.",
        "type": "noun",
        "example": "Please put your plate in the sink.",
        "difficulty": "A2"
    },
    {
        "english": "platform",
        "bengali": "প্ল্যাটফর্ম",
        "meaning": "A raised level surface on which people or things can stand.",
        "type": "noun",
        "example": "The train will depart from platform 2.",
        "difficulty": "A2"
    },
    {
        "english": "play",
        "bengali": "খেলা",
        "meaning": "Engage in activity for enjoyment and recreation rather than a serious or practical purpose.",
        "type": "verb, noun",
        "example": "The children are playing in the garden.",
        "difficulty": "A1"
    },
    {
        "english": "player",
        "bengali": "খেলোয়াড়",
        "meaning": "A person taking part in a sport or game.",
        "type": "noun",
        "example": "He is a famous football player.",
        "difficulty": "A1"
    },
    {
        "english": "pleasant",
        "bengali": " মনোরম",
        "meaning": "Giving a sense of happy satisfaction or enjoyment.",
        "type": "adjective",
        "example": "We had a pleasant evening.",
        "difficulty": "B1"
    },
    {
        "english": "please",
        "bengali": "দয়া করে",
        "meaning": "Used in polite requests or questions.",
        "type": "exclamation, verb",
        "example": "Please help me.",
        "difficulty": "A1"
    },
    {
        "english": "pleased",
        "bengali": "খুশি",
        "meaning": "Feeling or showing pleasure and satisfaction, especially at an event or a situation.",
        "type": "adjective",
        "example": "I am pleased with your work.",
        "difficulty": "A2"
    },
    {
        "english": "pleasure",
        "bengali": "আনন্দ",
        "meaning": "A feeling of happy satisfaction and enjoyment.",
        "type": "noun",
        "example": "It was a pleasure to meet you.",
        "difficulty": "B1"
    },
    {
        "english": "plenty",
        "bengali": "প্রচুর",
        "meaning": "A large or sufficient amount or quantity; more than enough.",
        "type": "pronoun",
        "example": "We have plenty of time.",
        "difficulty": "B1"
    },
    {
        "english": "plot",
        "bengali": "পটভূমি",
        "meaning": "The main events of a play, novel, movie, or similar work, devised and presented by the writer as an interrelated sequence.",
        "type": "noun, verb",
        "example": "The plot of the movie was very exciting.",
        "difficulty": "B1"
    },
    {
        "english": "plus",
        "bengali": "যোগ",
        "meaning": "With the addition of.",
        "type": "preposition, adjective, conjunction, noun",
        "example": "Two plus two equals four.",
        "difficulty": "B1"
    },
    {
        "english": "pocket",
        "bengali": "পকেট",
        "meaning": "A small bag sewn into or on clothing so as to form part of it, used for carrying small articles.",
        "type": "noun",
        "example": "I have a hole in my pocket.",
        "difficulty": "A2"
    },
    {
        "english": "poem",
        "bengali": "কবিতা",
        "meaning": "A piece of writing in which words are chosen for their beauty and sound and are carefully arranged, often in short lines which rhyme.",
        "type": "noun",
        "example": "He wrote a beautiful poem.",
        "difficulty": "B1"
    },
    {
        "english": "poet",
        "bengali": "কবি",
        "meaning": "A person who writes poems.",
        "type": "noun",
        "example": "Rabindranath Tagore was a great poet.",
        "difficulty": "B1"
    },
    {
        "english": "poetry",
        "bengali": "কবিতা",
        "meaning": "Poems in general or as a form of literature.",
        "type": "noun",
        "example": "I enjoy reading poetry.",
        "difficulty": "B1"
    },
    {
        "english": "point",
        "bengali": "বিন্দু",
        "meaning": "The tapered, sharp end of a tool, weapon, or other object.",
        "type": "noun, verb",
        "example": "What is the point of this story?",
        "difficulty": "A1"
    },
    {
        "english": "pointed",
        "bengali": "তীক্ষ্ণ",
        "meaning": "Having a sharpened or tapered tip or end.",
        "type": "adjective",
        "example": "The pencil has a pointed end.",
        "difficulty": "B2"
    },
    {
        "english": "poison",
        "bengali": "বিষ",
        "meaning": "A substance that is capable of causing the illness or death of a living organism when introduced or absorbed.",
        "type": "noun, verb",
        "example": "The snake's bite contains a deadly poison.",
        "difficulty": "B1"
    },
    {
        "english": "poisonous",
        "bengali": "বিষাক্ত",
        "meaning": "(of a substance or plant) causing or capable of causing death or illness if taken into the body.",
        "type": "adjective",
        "example": "Some mushrooms are poisonous.",
        "difficulty": "B1"
    },
    {
        "english": "police",
        "bengali": "পুলিশ",
        "meaning": "The civil force of a state, responsible for the prevention and detection of crime and the maintenance of public order.",
        "type": "noun",
        "example": "The police are investigating the crime.",
        "difficulty": "A1"
    },
    {
        "english": "policeman",
        "bengali": "পুলিশ",
        "meaning": "A male police officer.",
        "type": "noun",
        "example": "The policeman helped the old lady to cross the street.",
        "difficulty": "A1"
    },
    {
        "english": "policy",
        "bengali": "নীতি",
        "meaning": "A course or principle of action adopted or proposed by a government, party, business, or individual.",
        "type": "noun",
        "example": "The company has a new policy.",
        "difficulty": "B1"
    },
    {
        "english": "polite",
        "bengali": "ভদ্র",
        "meaning": "Having or showing behavior that is respectful and considerate of other people.",
        "type": "adjective",
        "example": "He is a very polite person.",
        "difficulty": "A2"
    },
    {
        "english": "political",
        "bengali": "রাজনৈতিক",
        "meaning": "Relating to the government or public affairs of a country.",
        "type": "adjective",
        "example": "He is a political leader.",
        "difficulty": "B1"
    },
    {
        "english": "politician",
        "bengali": "রাজনীতিবিদ",
        "meaning": "A person who is professionally involved in politics, especially as a holder of an elected office.",
        "type": "noun",
        "example": "He is a famous politician.",
        "difficulty": "B1"
    },
    {
        "english": "politics",
        "bengali": "রাজনীতি",
        "meaning": "The activities associated with the governance of a country or other area, especially the debate or conflict among individuals or parties having or hoping to achieve power.",
        "type": "noun",
        "example": "I am not interested in politics.",
        "difficulty": "B1"
    },
    {
        "english": "pollution",
        "bengali": "দূষণ",
        "meaning": "The presence in or introduction into the environment of a substance or thing that has harmful or poisonous effects.",
        "type": "noun",
        "example": "Air pollution is a major problem in big cities.",
        "difficulty": "A2"
    },
    {
        "english": "pool",
        "bengali": "পুল",
        "meaning": "A small area of still water, typically one formed naturally.",
        "type": "noun",
        "example": "Let's go for a swim in the pool.",
        "difficulty": "A1"
    },
    {
        "english": "poor",
        "bengali": "দরিদ্র",
        "meaning": "Lacking sufficient money to live at a standard considered comfortable or normal in a society.",
        "type": "adjective",
        "example": "He is a poor man.",
        "difficulty": "A1"
    },
    {
        "english": "pop",
        "bengali": "পপ",
        "meaning": "Modern popular music of a kind associated with the charts, appealing to teenagers and young adults.",
        "type": "noun, adjective",
        "example": "I like to listen to pop music.",
        "difficulty": "A2"
    },
    {
        "english": "popular",
        "bengali": "জনপ্রিয়",
        "meaning": "Liked, admired, or enjoyed by many people or by a particular person or group.",
        "type": "adjective",
        "example": "He is a popular singer.",
        "difficulty": "A1"
    },
    {
        "english": "popularity",
        "bengali": "জনপ্রিয়তা",
        "meaning": "The state or condition of being liked, admired, or supported by many people.",
        "type": "noun",
        "example": "His popularity has grown in recent years.",
        "difficulty": "B2"
    },
    {
        "english": "population",
        "bengali": "জনসংখ্যা",
        "meaning": "All the inhabitants of a particular town, area, or country.",
        "type": "noun",
        "example": "The population of Bangladesh is over 160 million.",
        "difficulty": "A2"
    },
    {
        "english": "port",
        "bengali": "বন্দর",
        "meaning": "A town or city with a harbor where ships load or unload, especially one where customs officers are stationed.",
        "type": "noun",
        "example": "The ship is in the port.",
        "difficulty": "B1"
    },
    {
        "english": "portrait",
        "bengali": "প্রতিকৃতি",
        "meaning": "A painting, drawing, photograph, or engraving of a person, especially one depicting only the face or head and shoulders.",
        "type": "noun",
        "example": "This is a portrait of my grandmother.",
        "difficulty": "B1"
    },
    {
        "english": "pose",
        "bengali": "ভঙ্গি",
        "meaning": "Present or constitute (a problem, danger, or difficulty).",
        "type": "verb, noun",
        "example": "He posed for a photograph.",
        "difficulty": "B2"
    },
    {
        "english": "position",
        "bengali": "অবস্থান",
        "meaning": "A place where someone or something is located or has been put.",
        "type": "noun, verb",
        "example": "What is your position on this issue?",
        "difficulty": "A2"
    },
    {
        "english": "positive",
        "bengali": "ইতিবাচক",
        "meaning": "Consisting in or characterized by the presence or possession of features or qualities rather than their absence.",
        "type": "adjective, noun",
        "example": "He has a positive attitude.",
        "difficulty": "A1"
    },
    {
        "english": "possess",
        "bengali": "অধিকার করা",
        "meaning": "Have as belonging to one; own.",
        "type": "verb",
        "example": "He possesses great wealth.",
        "difficulty": "B2"
    },
    {
        "english": "possession",
        "bengali": "দখল",
        "meaning": "The state of having, owning, or controlling something.",
        "type": "noun",
        "example": "He was arrested for possession of drugs.",
        "difficulty": "A2"
    },
    {
        "english": "possibility",
        "bengali": "সম্ভাবনা",
        "meaning": "A thing that may happen or be the case.",
        "type": "noun",
        "example": "There is a possibility of rain.",
        "difficulty": "A2"
    },
    {
        "english": "possible",
        "bengali": "সম্ভব",
        "meaning": "Able to be done; within the power or capacity of someone or something.",
        "type": "adjective",
        "example": "Is it possible to finish this today?",
        "difficulty": "A1"
    },
    {
        "english": "possibly",
        "bengali": "সম্ভবত",
        "meaning": "Perhaps (used to indicate that something is not certain).",
        "type": "adverb",
        "example": "Possibly, he will come.",
        "difficulty": "B1"
    },
    {
        "english": "post",
        "bengali": "ডাক",
        "meaning": "The official service or system that delivers letters and parcels.",
        "type": "noun, verb",
        "example": "I will send the letter by post.",
        "difficulty": "A1"
    },
    {
        "english": "poster",
        "bengali": "পোস্টার",
        "meaning": "A large printed picture, photograph, or notice, used for advertising or decoration.",
        "type": "noun",
        "example": "There is a poster of my favorite band on the wall.",
        "difficulty": "A2"
    },
    {
        "english": "pot",
        "bengali": "পাত্র",
        "meaning": "A rounded or cylindrical container, typically of metal, used for cooking.",
        "type": "noun",
        "example": "I need a pot to cook the soup.",
        "difficulty": "B1"
    },
    {
        "english": "potato",
        "bengali": "আলু",
        "meaning": "A starchy plant tuber which is one of the most important food crops, cooked and eaten as a vegetable.",
        "type": "noun",
        "example": "I like to eat potatoes.",
        "difficulty": "A1"
    },
    {
        "english": "potential",
        "bengali": "সম্ভাব্য",
        "meaning": "Having or showing the capacity to become or develop into something in the future.",
        "type": "adjective, noun",
        "example": "He has the potential to be a great leader.",
        "difficulty": "B2"
    },
    {
        "english": "pound",
        "bengali": "পাউন্ড",
        "meaning": "A unit of weight equal to 16 ounces (453.6 g).",
        "type": "noun",
        "example": "I weigh 150 pounds.",
        "difficulty": "A1"
    },
    {
        "english": "pour",
        "bengali": "ঢালা",
        "meaning": "Flow rapidly in a steady stream.",
        "type": "verb",
        "example": "She poured the milk into a glass.",
        "difficulty": "B1"
    },
    {
        "english": "poverty",
        "bengali": "দারিদ্র্য",
        "meaning": "The state of being extremely poor.",
        "type": "noun",
        "example": "Many people in the world live in poverty.",
        "difficulty": "B1"
    },
    {
        "english": "powder",
        "bengali": "গুঁড়া",
        "meaning": "A dry, fine substance, such as flour or sugar, that is made by grinding or crushing a solid.",
        "type": "noun",
        "example": "I need some milk powder.",
        "difficulty": "B1"
    },
    {
        "english": "power",
        "bengali": "শক্তি",
        "meaning": "The ability or capacity to do something or act in a particular way.",
        "type": "noun, verb",
        "example": "Knowledge is power.",
        "difficulty": "A2"
    },
    {
        "english": "powerful",
        "bengali": "শক্তিশালী",
        "meaning": "Having great power or strength.",
        "type": "adjective",
        "example": "He is a powerful man.",
        "difficulty": "B1"
    },
    {
        "english": "practical",
        "bengali": "বাস্তবসম্মত",
        "meaning": "Of or concerned with the actual doing or use of something rather than with theory and ideas.",
        "type": "adjective",
        "example": "We need a practical solution to this problem.",
        "difficulty": "B1"
    },
    {
        "english": "practice",
        "bengali": "অনুশীলন",
        "meaning": "The actual application or use of an idea, belief, or method as opposed to theories about such application or use.",
        "type": "noun, verb",
        "example": "Practice makes perfect.",
        "difficulty": "A1"
    },
    {
        "english": "praise",
        "bengali": "প্রশংসা করা",
        "meaning": "Express warm approval or admiration of.",
        "type": "noun, verb",
        "example": "He praised her for her hard work.",
        "difficulty": "B2"
    },
    {
        "english": "pray",
        "bengali": "প্রার্থনা করা",
        "meaning": "Address a prayer to God or another deity.",
        "type": "verb",
        "example": "She prays every day.",
        "difficulty": "B1"
    },
    {
        "english": "prayer",
        "bengali": "প্রার্থনা",
        "meaning": "A solemn request for help or expression of thanks addressed to God or an object of worship.",
        "type": "noun",
        "example": "He said a prayer for the sick.",
        "difficulty": "B1"
    },
    {
        "english": "predict",
        "bengali": "ভবিষ্যদ্বাণী করা",
        "meaning": "Say or estimate that (a specified thing) will happen in the future or will be a consequence of something.",
        "type": "verb",
        "example": "It is difficult to predict the future.",
        "difficulty": "A2"
    },
    {
        "english": "prediction",
        "bengali": "ভবিষ্যদ্বাণী",
        "meaning": "A thing predicted; a forecast.",
        "type": "noun",
        "example": "His prediction came true.",
        "difficulty": "B1"
    },
    {
        "english": "prefer",
        "bengali": "পছন্দ করা",
        "meaning": "Like (one thing or person) better than another or others; tend to choose.",
        "type": "verb",
        "example": "I prefer tea to coffee.",
        "difficulty": "A1"
    },
    {
        "english": "pregnant",
        "bengali": "গর্ভবতী",
        "meaning": "(of a woman or female animal) having a child or young developing in the uterus.",
        "type": "adjective",
        "example": "She is pregnant.",
        "difficulty": "B2"
    },
    {
        "english": "preparation",
        "bengali": "প্রস্তুতি",
        "meaning": "The action or process of making ready or being made ready for use or consideration.",
        "type": "noun",
        "example": "We need to make preparations for the party.",
        "difficulty": "B2"
    },
    {
        "english": "prepare",
        "bengali": "প্রস্তুত করা",
        "meaning": "Make (something) ready for use or consideration.",
        "type": "verb",
        "example": "I need to prepare for the exam.",
        "difficulty": "A1"
    },
    {
        "english": "prepared",
        "bengali": "প্রস্তুত",
        "meaning": "Made ready for use.",
        "type": "adjective",
        "example": "I am prepared for the exam.",
        "difficulty": "B1"
    },
    {
        "english": "presence",
        "bengali": "উপস্থিতি",
        "meaning": "The state or fact of existing, occurring, or being present in a place or thing.",
        "type": "noun",
        "example": "His presence made me nervous.",
        "difficulty": "B2"
    },
    {
        "english": "present",
        "bengali": "উপহার",
        "meaning": "A thing given to someone as a gift.",
        "type": "adjective, noun, verb",
        "example": "I have a present for you.",
        "difficulty": "A1"
    },
    {
        "english": "presentation",
        "bengali": "উপস্থাপনা",
        "meaning": "The giving of something to someone, especially as part of a formal ceremony.",
        "type": "noun",
        "example": "He gave a presentation on his research.",
        "difficulty": "B1"
    },
    {
        "english": "preserve",
        "bengali": "সংরক্ষণ করা",
        "meaning": "Maintain (something) in its original or existing state.",
        "type": "verb",
        "example": "We need to preserve our historical monuments.",
        "difficulty": "B2"
    },
    {
        "english": "president",
        "bengali": "রাষ্ট্রপতি",
        "meaning": "The elected head of a republican state.",
        "type": "noun",
        "example": "He is the president of the country.",
        "difficulty": "A2"
    },
    {
        "english": "press",
        "bengali": "চাপ দেওয়া",
        "meaning": "Move or cause to move into a position of contact with something by exerting continuous physical force.",
        "type": "verb, noun",
        "example": "Please press the button.",
        "difficulty": "B1"
    },
    {
        "english": "pressure",
        "bengali": "চাপ",
        "meaning": "Continuous physical force exerted on or against an object by something in contact with it.",
        "type": "noun",
        "example": "He is under a lot of pressure at work.",
        "difficulty": "B1"
    },
    {
        "english": "pretend",
        "bengali": "ভান করা",
        "meaning": "Speak and act so as to make it appear that something is the case when in fact it is not.",
        "type": "verb",
        "example": "He pretended to be asleep.",
        "difficulty": "B1"
    },
    {
        "english": "pretty",
        "bengali": "সুন্দর",
        "meaning": "(of a person, especially a woman or child) attractive in a delicate way without being truly beautiful.",
        "type": "adjective, adverb",
        "example": "She is a pretty girl.",
        "difficulty": "A1"
    },
    {
        "english": "prevent",
        "bengali": "প্রতিরোধ করা",
        "meaning": "Keep (something) from happening or arising.",
        "type": "verb",
        "example": "We need to prevent accidents.",
        "difficulty": "A2"
    },
    {
        "english": "previous",
        "bengali": "পূর্ববর্তী",
        "meaning": "Existing or occurring before in time or order.",
        "type": "adjective",
        "example": "I met him on a previous occasion.",
        "difficulty": "B1"
    },
    {
        "english": "previously",
        "bengali": "পূর্বে",
        "meaning": "At a previous or earlier time; before.",
        "type": "adverb",
        "example": "I have seen this movie previously.",
        "difficulty": "B1"
    },
    {
        "english": "price",
        "bengali": "দাম",
        "meaning": "The amount of money expected, required, or given in payment for something.",
        "type": "noun, verb",
        "example": "What is the price of this shirt?",
        "difficulty": "A1"
    },
    {
        "english": "priest",
        "bengali": "পুরোহিত",
        "meaning": "An ordained minister of the Catholic, Orthodox, or Anglican Church having the authority to perform certain rites and administer certain sacraments.",
        "type": "noun",
        "example": "He is a Catholic priest.",
        "difficulty": "B1"
    },
    {
        "english": "primary",
        "bengali": "প্রাথমিক",
        "meaning": "Of chief importance; principal.",
        "type": "adjective",
        "example": "Our primary concern is safety.",
        "difficulty": "B1"
    },
    {
        "english": "prime",
        "bengali": "প্রধান",
        "meaning": "Of first importance; main.",
        "type": "adjective, noun",
        "example": "This is a prime example of his work.",
        "difficulty": "B2"
    },
    {
        "english": "prince",
        "bengali": "রাজকুমার",
        "meaning": "The son of a monarch.",
        "type": "noun",
        "example": "The prince will one day become king.",
        "difficulty": "B1"
    },
    {
        "english": "princess",
        "bengali": "রাজকন্যা",
        "meaning": "The daughter of a monarch.",
        "type": "noun",
        "example": "The princess is beautiful.",
        "difficulty": "B1"
    },
    {
        "english": "principal",
        "bengali": "অধ্যক্ষ",
        "meaning": "The person with the highest authority or most important position in an organization, institution, or group.",
        "type": "noun, adjective",
        "example": "He is the principal of the school.",
        "difficulty": "B1"
    },
    {
        "english": "principle",
        "bengali": "নীতি",
        "meaning": "A fundamental truth or proposition that serves as the foundation for a system of belief or behavior or for a chain of reasoning.",
        "type": "noun",
        "example": "He is a man of principle.",
        "difficulty": "B2"
    },
    {
        "english": "print",
        "bengali": "ছাপা",
        "meaning": "Produce (books, newspapers, magazines, etc.), especially in large quantities, by a mechanical process involving the transfer of text, images, or designs to paper.",
        "type": "verb, noun",
        "example": "I need to print this document.",
        "difficulty": "A2"
    },
    {
        "english": "printer",
        "bengali": "প্রিন্টার",
        "meaning": "A machine for printing text or pictures onto paper, especially one linked to a computer.",
        "type": "noun",
        "example": "My printer is not working.",
        "difficulty": "A2"
    },
    {
        "english": "printing",
        "bengali": "মুদ্রণ",
        "meaning": "The production of books, newspapers, or other printed matter.",
        "type": "noun",
        "example": "The invention of printing was a major breakthrough.",
        "difficulty": "B1"
    },
    {
        "english": "priority",
        "bengali": "অগ্রাধিকার",
        "meaning": "A thing that is regarded as more important than another.",
        "type": "noun",
        "example": "My first priority is my family.",
        "difficulty": "B2"
    },
    {
        "english": "prison",
        "bengali": "কারাগার",
        "meaning": "A building in which people are legally held as a punishment for a crime they have committed or while awaiting trial.",
        "type": "noun",
        "example": "He was sent to prison.",
        "difficulty": "A2"
    },
    {
        "english": "prisoner",
        "bengali": "বন্দী",
        "meaning": "A person legally held in a prison as a punishment for a crime they have committed or while awaiting trial.",
        "type": "noun",
        "example": "The prisoners escaped from jail.",
        "difficulty": "B1"
    },
    {
        "english": "privacy",
        "bengali": "গোপনীয়তা",
        "meaning": "A state in which one is not observed or disturbed by other people.",
        "type": "noun",
        "example": "I need some privacy.",
        "difficulty": "B2"
    },
    {
        "english": "private",
        "bengali": "ব্যক্তিগত",
        "meaning": "For or concerning an individual person or group rather than the public.",
        "type": "adjective",
        "example": "This is a private matter.",
        "difficulty": "B1"
    },
    {
        "english": "prize",
        "bengali": "পুরস্কার",
        "meaning": "A thing given as a reward to the winner of a competition or in recognition of an outstanding achievement.",
        "type": "noun",
        "example": "He won the first prize.",
        "difficulty": "A2"
    },
    {
        "english": "probably",
        "bengali": "সম্ভবত",
        "meaning": "Almost certainly; as far as one knows or can tell.",
        "type": "adverb",
        "example": "He will probably come.",
        "difficulty": "A1"
    },
    {
        "english": "problem",
        "bengali": "সমস্যা",
        "meaning": "A matter or situation regarded as unwelcome or harmful and needing to be dealt with and overcome.",
        "type": "noun",
        "example": "I have a problem.",
        "difficulty": "A1"
    },
    {
        "english": "procedure",
        "bengali": "পদ্ধতি",
        "meaning": "An established or official way of doing something.",
        "type": "noun",
        "example": "We need to follow the correct procedure.",
        "difficulty": "B2"
    },
    {
        "english": "process",
        "bengali": "প্রক্রিয়া",
        "meaning": "A series of actions or steps taken in order to achieve a particular end.",
        "type": "noun, verb",
        "example": "Learning a new language is a long process.",
        "difficulty": "A2"
    },
    {
        "english": "produce",
        "bengali": "উৎপাদন করা",
        "meaning": "Make or manufacture from components or raw materials.",
        "type": "verb, noun",
        "example": "The factory produces cars.",
        "difficulty": "A2"
    },
    {
        "english": "producer",
        "bengali": "প্রযোজক",
        "meaning": "A person, company, or country that makes, grows, or supplies goods or commodities for sale.",
        "type": "noun",
        "example": "He is a famous film producer.",
        "difficulty": "B1"
    },
    {
        "english": "product",
        "bengali": "পণ্য",
        "meaning": "An article or substance that is manufactured or refined for sale.",
        "type": "noun",
        "example": "This is a new product.",
        "difficulty": "A1"
    },
    {
        "english": "production",
        "bengali": "উৎপাদন",
        "meaning": "The action of making or manufacturing from components or raw materials, or the process of being so manufactured.",
        "type": "noun",
        "example": "The company has increased its production.",
        "difficulty": "B1"
    },
    {
        "english": "profession",
        "bengali": "পেশা",
        "meaning": "A paid occupation, especially one that involves prolonged training and a formal qualification.",
        "type": "noun",
        "example": "He is a doctor by profession.",
        "difficulty": "B1"
    },
    {
        "english": "professional",
        "bengali": "পেশাদার",
        "meaning": "Relating to or belonging to a profession.",
        "type": "adjective, noun",
        "example": "He is a professional photographer.",
        "difficulty": "A2"
    },
    {
        "english": "professor",
        "bengali": "অধ্যাপক",
        "meaning": "A university academic of the highest rank; the holder of a university chair.",
        "type": "noun",
        "example": "He is a professor of history.",
        "difficulty": "A2"
    },
    {
        "english": "profile",
        "bengali": "প্রোফাইল",
        "meaning": "An outline of something, especially a person's face, as seen from one side.",
        "type": "noun",
        "example": "She has a beautiful profile.",
        "difficulty": "A2"
    },
    {
        "english": "profit",
        "bengali": "লাভ",
        "meaning": "A financial gain, especially the difference between the amount earned and the amount spent in buying, operating, or producing something.",
        "type": "noun",
        "example": "The company made a huge profit.",
        "difficulty": "B1"
    },
    {
        "english": "program",
        "bengali": "প্রোগ্রাম",
        "meaning": "A set of related measures or activities with a particular long-term aim.",
        "type": "noun, verb",
        "example": "What's on the program tonight?",
        "difficulty": "A1"
    },
    {
        "english": "progress",
        "bengali": "অগ্রগতি",
        "meaning": "Forward or onward movement toward a destination.",
        "type": "noun, verb",
        "example": "He has made great progress in his studies.",
        "difficulty": "A2"
    },
    {
        "english": "project",
        "bengali": "প্রকল্প",
        "meaning": "An individual or collaborative enterprise that is carefully planned to achieve a particular aim.",
        "type": "noun, verb",
        "example": "I am working on a new project.",
        "difficulty": "A1"
    },
    {
        "english": "promise",
        "bengali": "প্রতিশ্রুতি",
        "meaning": "A declaration or assurance that one will do a particular thing or that a particular thing will happen.",
        "type": "verb, noun",
        "example": "I promise I will be there.",
        "difficulty": "A2"
    },
    {
        "english": "promote",
        "bengali": "প্রচার করা",
        "meaning": "Further the progress of (a cause, venture, or aim); support or actively encourage.",
        "type": "verb",
        "example": "We need to promote our new product.",
        "difficulty": "B1"
    },
    {
        "english": "pronounce",
        "bengali": "উচ্চারণ করা",
        "meaning": "Make the sound of (a word or part of a word) in the correct or a particular way.",
        "type": "verb",
        "example": "How do you pronounce this word?",
        "difficulty": "A2"
    },
    {
        "english": "proof",
        "bengali": "প্রমাণ",
        "meaning": "Evidence or argument establishing or helping to establish a fact or the truth of a statement.",
        "type": "noun",
        "example": "Do you have any proof?",
        "difficulty": "B2"
    },
    {
        "english": "proper",
        "bengali": "যথাযথ",
        "meaning": "Truly what something is said or regarded to be; genuine.",
        "type": "adjective",
        "example": "Please use the proper tools for the job.",
        "difficulty": "B1"
    },
    {
        "english": "properly",
        "bengali": "সঠিকভাবে",
        "meaning": "Correctly or satisfactorily.",
        "type": "adverb",
        "example": "Please do the job properly.",
        "difficulty": "B1"
    },
    {
        "english": "property",
        "bengali": "সম্পত্তি",
        "meaning": "A thing or things belonging to someone; possessions collectively.",
        "type": "noun",
        "example": "This is my property.",
        "difficulty": "B1"
    },
    {
        "english": "proposal",
        "bengali": "প্রস্তাব",
        "meaning": "A plan or suggestion, especially a formal or written one, put forward for consideration or discussion by others.",
        "type": "noun",
        "example": "He made a proposal of marriage.",
        "difficulty": "B2"
    },
    {
        "english": "propose",
        "bengali": "প্রস্তাব করা",
        "meaning": "Put forward (an idea or plan) for consideration or discussion by others.",
        "type": "verb",
        "example": "I propose that we go to the cinema.",
        "difficulty": "B2"
    },
    {
        "english": "prospect",
        "bengali": "সম্ভাবনা",
        "meaning": "The possibility or likelihood of some future event occurring.",
        "type": "noun",
        "example": "There is a good prospect of success.",
        "difficulty": "B2"
    },
    {
        "english": "protect",
        "bengali": "রক্ষা করা",
        "meaning": "Keep safe from harm or injury.",
        "type": "verb",
        "example": "We need to protect the environment.",
        "difficulty": "A2"
    },
    {
        "english": "protection",
        "bengali": "সুরক্ষা",
        "meaning": "The action of protecting, or the state of being protected.",
        "type": "noun",
        "example": "This is for your own protection.",
        "difficulty": "B2"
    },
    {
        "english": "protest",
        "bengali": "প্রতিবাদ",
        "meaning": "A statement or action expressing disapproval of or objection to something.",
        "type": "noun, verb",
        "example": "There was a protest against the new law.",
        "difficulty": "B1"
    },
    {
        "english": "proud",
        "bengali": "গর্বিত",
        "meaning": "Feeling deep pleasure or satisfaction as a result of one's own achievements, qualities, or possessions or those of someone with whom one is closely associated.",
        "type": "adjective",
        "example": "I am proud of you.",
        "difficulty": "B1"
    },
    {
        "english": "prove",
        "bengali": "প্রমাণ করা",
        "meaning": "Demonstrate the truth or existence of (something) by evidence or argument.",
        "type": "verb",
        "example": "Can you prove it?",
        "difficulty": "B1"
    },
    {
        "english": "provide",
        "bengali": "সরবরাহ করা",
        "meaning": "Make available for use; supply.",
        "type": "verb",
        "example": "The hotel provides free breakfast.",
        "difficulty": "A2"
    },
    {
        "english": "psychologist",
        "bengali": "মনোবিজ্ঞানী",
        "meaning": "An expert or specialist in psychology.",
        "type": "noun",
        "example": "She is a child psychologist.",
        "difficulty": "B2"
    },
    {
        "english": "psychology",
        "bengali": "মনোবিজ্ঞান",
        "meaning": "The scientific study of the human mind and its functions, especially those affecting behavior in a given context.",
        "type": "noun",
        "example": "He is studying psychology at university.",
        "difficulty": "B2"
    },
    {
        "english": "public",
        "bengali": "জনসাধারণ",
        "meaning": "Of or concerning the people as a whole.",
        "type": "adjective, noun",
        "example": "This is a public park.",
        "difficulty": "A2"
    },
    {
        "english": "publication",
        "bengali": "প্রকাশনা",
        "meaning": "A book, journal, or other text that is printed and issued for public sale.",
        "type": "noun",
        "example": "This is a new publication.",
        "difficulty": "B2"
    },
    {
        "english": "publish",
        "bengali": "প্রকাশ করা",
        "meaning": "(of an author or company) prepare and issue (a book, journal, piece of music, or other work) for public sale.",
        "type": "verb",
        "example": "She has published a new book.",
        "difficulty": "A2"
    },
    {
        "english": "pull",
        "bengali": "টানা",
        "meaning": "Exert force on (someone or something) so as to cause movement toward oneself.",
        "type": "verb, noun",
        "example": "Please pull the door.",
        "difficulty": "A2"
    },
    {
        "english": "punish",
        "bengali": "শাস্তি দেওয়া",
        "meaning": "Inflict a penalty or sanction on (someone) as retribution for an offense, especially a transgression of a legal or moral code.",
        "type": "verb",
        "example": "The teacher punished the student.",
        "difficulty": "B1"
    },
    {
        "english": "punishment",
        "bengali": "শাস্তি",
        "meaning": "The infliction or imposition of a penalty as retribution for an offense.",
        "type": "noun",
        "example": "What is the punishment for this crime?",
        "difficulty": "B1"
    },
    {
        "english": "purchase",
        "bengali": "ক্রয় করা",
        "meaning": "Acquire (something) by paying for it; buy.",
        "type": "noun, verb",
        "example": "I need to purchase a new car.",
        "difficulty": "B2"
    },
    {
        "english": "pure",
        "bengali": "বিশুদ্ধ",
        "meaning": "Not mixed or adulterated with any other substance or material.",
        "type": "adjective",
        "example": "This is pure gold.",
        "difficulty": "B2"
    },
    {
        "english": "purple",
        "bengali": "বেগুনি",
        "meaning": "Of a color intermediate between red and blue.",
        "type": "adjective, noun",
        "example": "She is wearing a purple dress.",
        "difficulty": "A1"
    },
    {
        "english": "purpose",
        "bengali": "উদ্দেশ্য",
        "meaning": "The reason for which something is done or created or for which something exists.",
        "type": "noun",
        "example": "What is the purpose of your visit?",
        "difficulty": "A2"
    },
    {
        "english": "pursue",
        "bengali": "অনুসরণ করা",
        "meaning": "Follow (someone or something) in order to catch or attack them.",
        "type": "verb",
        "example": "He is pursuing a career in medicine.",
        "difficulty": "B2"
    },
    {
        "english": "push",
        "bengali": "ধাক্কা দেওয়া",
        "meaning": "Exert force on (someone or something), typically with one's hand, in order to move them away from oneself or from their previous position.",
        "type": "verb, noun",
        "example": "Please push the door.",
        "difficulty": "A2"
    },
    {
        "english": "put",
        "bengali": "রাখা",
        "meaning": "Move to or place in a particular position.",
        "type": "verb",
        "example": "Please put the book on the table.",
        "difficulty": "A1"
    },
    {
        "english": "qualification",
        "bengali": "যোগ্যতা",
        "meaning": "A quality or accomplishment that makes someone suitable for a particular job or activity.",
        "type": "noun",
        "example": "He has the necessary qualifications for the job.",
        "difficulty": "B1"
    },
    {
        "english": "qualified",
        "bengali": "যোগ্য",
        "meaning": "Officially recognized as being trained to perform a particular job; certified.",
        "type": "adjective",
        "example": "She is a qualified doctor.",
        "difficulty": "B1"
    },
    {
        "english": "qualify",
        "bengali": "যোগ্যতা অর্জন করা",
        "meaning": "Be entitled to a particular benefit or privilege by fulfilling a necessary condition.",
        "type": "verb",
        "example": "He qualified for the final.",
        "difficulty": "B1"
    },
    {
        "english": "quality",
        "bengali": "গুণমান",
        "meaning": "The standard of something as measured against other things of a similar kind; the degree of excellence of something.",
        "type": "noun",
        "example": "This is a high-quality product.",
        "difficulty": "A2"
    },
    {
        "english": "quantity",
        "bengali": "পরিমাণ",
        "meaning": "The amount or number of a material or abstract thing not usually estimated by spatial measurement.",
        "type": "noun",
        "example": "We need a large quantity of food.",
        "difficulty": "A2"
    },
    {
        "english": "quarter",
        "bengali": "চতুর্থাংশ",
        "meaning": "Each of four equal or corresponding parts into which something is or can be divided.",
        "type": "noun",
        "example": "It's a quarter past three.",
        "difficulty": "A1"
    },
    {
        "english": "queen",
        "bengali": "রানী",
        "meaning": "The female ruler of an independent state, especially one who inherits the position by right of birth.",
        "type": "noun",
        "example": "The queen is a powerful ruler.",
        "difficulty": "A2"
    },
    {
        "english": "question",
        "bengali": "প্রশ্ন",
        "meaning": "A sentence worded or expressed so as to elicit information.",
        "type": "noun, verb",
        "example": "Can I ask you a question?",
        "difficulty": "A1"
    },
    {
        "english": "quick",
        "bengali": "দ্রুত",
        "meaning": "Moving fast or doing something in a short time.",
        "type": "adjective",
        "example": "He is a quick learner.",
        "difficulty": "A1"
    },
    {
        "english": "quickly",
        "bengali": "দ্রুত",
        "meaning": "At a fast speed; rapidly.",
        "type": "adverb",
        "example": "He ran quickly.",
        "difficulty": "A1"
    },
    {
        "english": "quiet",
        "bengali": "শান্ত",
        "meaning": "Making little or no noise.",
        "type": "adjective",
        "example": "Please be quiet.",
        "difficulty": "A1"
    },
    {
        "english": "quietly",
        "bengali": "চুপচাপ",
        "meaning": "In a way that makes little or no noise.",
        "type": "adverb",
        "example": "He spoke quietly.",
        "difficulty": "A2"
    },
    {
        "english": "quit",
        "bengali": "ছেড়ে দেওয়া",
        "meaning": "Leave (a place), usually permanently.",
        "type": "verb",
        "example": "He quit his job.",
        "difficulty": "B1"
    },
    {
        "english": "quite",
        "bengali": "বেশ",
        "meaning": "To the utmost or most absolute extent or degree; absolutely; completely.",
        "type": "adverb",
        "example": "I am quite tired.",
        "difficulty": "A1"
    },
    {
        "english": "quotation",
        "bengali": "উদ্ধৃতি",
        "meaning": "A group of words taken from a text or speech and repeated by someone other than the original author or speaker.",
        "type": "noun",
        "example": "This is a quotation from Shakespeare.",
        "difficulty": "B1"
    },
    {
        "english": "quote",
        "bengali": "উদ্ধৃতি",
        "meaning": "Repeat or copy out (a group of words from a text or speech), typically with an indication that one is not the original author or speaker.",
        "type": "verb, noun",
        "example": "Can you quote a line from the poem?",
        "difficulty": "B1"
    },
    {
        "english": "race (competition)",
        "bengali": "দৌড় প্রতিযোগিতা",
        "meaning": "A competition between runners, horses, vehicles, etc. to see which is the fastest in covering a set course.",
        "type": "noun, verb",
        "example": "He won the race.",
        "difficulty": "A2"
    },
    {
        "english": "race (of people)",
        "bengali": "জাতি",
        "meaning": "A group of people of common ancestry, distinguished from others by physical characteristics, such as skin color, hair type, or facial features.",
        "type": "noun",
        "example": "People of all races should be treated equally.",
        "difficulty": "B1"
    },
    {
        "english": "racing",
        "bengali": "দৌড়",
        "meaning": "The sport of competing in races.",
        "type": "noun",
        "example": "He is interested in car racing.",
        "difficulty": "B1"
    },
    {
        "english": "radio",
        "bengali": "রেডিও",
        "meaning": "The transmission and reception of electromagnetic waves of radio frequency, especially those carrying sound messages.",
        "type": "noun",
        "example": "I listen to the radio every morning.",
        "difficulty": "A1"
    },
    {
        "english": "railroad",
        "bengali": "রেলপথ",
        "meaning": "A track or set of tracks made of steel rails along which passenger and freight trains run.",
        "type": "noun",
        "example": "The railroad was built in the 19th century.",
        "difficulty": "A2"
    },
    {
        "english": "rain",
        "bengali": "বৃষ্টি",
        "meaning": "Moisture condensed from the atmosphere that falls visibly in separate drops.",
        "type": "noun, verb",
        "example": "It's raining outside.",
        "difficulty": "A1"
    },
    {
        "english": "raise",
        "bengali": "তোলা",
        "meaning": "Lift or move to a higher position or level.",
        "type": "verb, noun",
        "example": "Please raise your hand if you have a question.",
        "difficulty": "A2"
    },
    {
        "english": "range",
        "bengali": "পরিসর",
        "meaning": "The area of variation between upper and lower limits on a particular scale.",
        "type": "noun, verb",
        "example": "The price range is from $100 to $200.",
        "difficulty": "B1"
    },
    {
        "english": "rank",
        "bengali": "পদমর্যাদা",
        "meaning": "A position in the hierarchy of the armed forces.",
        "type": "noun, verb",
        "example": "He holds the rank of captain.",
        "difficulty": "B2"
    },
    {
        "english": "rapid",
        "bengali": "দ্রুত",
        "meaning": "Happening in a short time or at a fast pace.",
        "type": "adjective",
        "example": "There has been a rapid increase in prices.",
        "difficulty": "B2"
    },
    {
        "english": "rapidly",
        "bengali": "দ্রুত",
        "meaning": "Very quickly.",
        "type": "adverb",
        "example": "The company is growing rapidly.",
        "difficulty": "B2"
    },
    {
        "english": "rare",
        "bengali": "বিরল",
        "meaning": "(of an event, situation, or condition) not occurring very often.",
        "type": "adjective",
        "example": "This is a rare opportunity.",
        "difficulty": "B1"
    },
    {
        "english": "rarely",
        "bengali": "কদাচিৎ",
        "meaning": "Not often; seldom.",
        "type": "adverb",
        "example": "I rarely go to the cinema.",
        "difficulty": "B1"
    },
    {
        "english": "rate",
        "bengali": "হার",
        "meaning": "A measure, quantity, or frequency, typically one measured against some other quantity or measure.",
        "type": "noun, verb",
        "example": "What is the interest rate?",
        "difficulty": "A2"
    },
    {
        "english": "rather",
        "bengali": "বরং",
        "meaning": "Used to express an opinion, preference, or correction.",
        "type": "adverb",
        "example": "I would rather go to the cinema.",
        "difficulty": "A2"
    },
    {
        "english": "raw",
        "bengali": "কাঁচা",
        "meaning": "(of food) uncooked.",
        "type": "adjective",
        "example": "I like to eat raw vegetables.",
        "difficulty": "B2"
    },
    {
        "english": "reach",
        "bengali": "পৌঁছানো",
        "meaning": "Arrive at; get as far as.",
        "type": "verb, noun",
        "example": "We will reach Dhaka tomorrow.",
        "difficulty": "A2"
    },
    {
        "english": "react",
        "bengali": "প্রতিক্রিয়া",
        "meaning": "Act in response to something.",
        "type": "verb",
        "example": "How did he react to the news?",
        "difficulty": "A2"
    },
    {
        "english": "reaction",
        "bengali": "প্রতিক্রিয়া",
        "meaning": "An action performed or a feeling experienced in response to a situation or event.",
        "type": "noun",
        "example": "What was his reaction to the news?",
        "difficulty": "B1"
    },
    {
        "english": "read",
        "bengali": "পড়া",
        "meaning": "Look at and comprehend the meaning of (written or printed matter) by mentally interpreting the characters or symbols of which it is composed.",
        "type": "verb",
        "example": "I like to read books.",
        "difficulty": "A1"
    },
    {
        "english": "reader",
        "bengali": "পাঠক",
        "meaning": "A person who reads or who is fond of reading.",
        "type": "noun",
        "example": "He is a voracious reader.",
        "difficulty": "A1"
    },
    {
        "english": "reading",
        "bengali": "পড়া",
        "meaning": "The action or skill of reading written or printed matter silently or aloud.",
        "type": "noun",
        "example": "Reading is my favorite hobby.",
        "difficulty": "A1"
    },
    {
        "english": "ready",
        "bengali": "প্রস্তুত",
        "meaning": "In a suitable state for an activity, action, or situation; fully prepared.",
        "type": "adjective",
        "example": "Are you ready to go?",
        "difficulty": "A1"
    },
    {
        "english": "real",
        "bengali": "আসল",
        "meaning": "Actually existing as a thing or occurring in fact; not imagined or supposed.",
        "type": "adjective",
        "example": "This is a real diamond.",
        "difficulty": "A1"
    },
    {
        "english": "realistic",
        "bengali": "বাস্তবসম্মত",
        "meaning": "Having or showing a sensible and practical idea of what can be achieved or expected.",
        "type": "adjective",
        "example": "We need to be realistic about our chances of success.",
        "difficulty": "B2"
    },
    {
        "english": "reality",
        "bengali": "বাস্তবতা",
        "meaning": "The state of things as they actually exist, as opposed to an idealistic or notional idea of them.",
        "type": "noun",
        "example": "You need to face reality.",
        "difficulty": "B1"
    },
    {
        "english": "realize",
        "bengali": "উপলব্ধি করা",
        "meaning": "Become fully aware of (something) as a fact; understand clearly.",
        "type": "verb",
        "example": "I realize my mistake.",
        "difficulty": "A2"
    },
    {
        "english": "really",
        "bengali": "সত্যি",
        "meaning": "In actual fact, as opposed to what is said or imagined; in reality.",
        "type": "adverb",
        "example": "I am really tired.",
        "difficulty": "A1"
    },
    {
        "english": "reason",
        "bengali": "কারণ",
        "meaning": "A cause, explanation, or justification for an action or event.",
        "type": "noun",
        "example": "What is the reason for your decision?",
        "difficulty": "A1"
    },
    {
        "english": "reasonable",
        "bengali": "যুক্তিসঙ্গত",
        "meaning": "Having sound judgment; fair and sensible.",
        "type": "adjective",
        "example": "The price is reasonable.",
        "difficulty": "B2"
    },
    {
        "english": "recall",
        "bengali": "স্মরণ করা",
        "meaning": "Bring (a fact, event, or situation) back into one's mind; remember.",
        "type": "verb",
        "example": "I can't recall his name.",
        "difficulty": "B2"
    },
    {
        "english": "receipt",
        "bengali": "রসিদ",
        "meaning": "The action of receiving something or the fact of its being received.",
        "type": "noun",
        "example": "Please keep the receipt.",
        "difficulty": "B1"
    },
    {
        "english": "receive",
        "bengali": "গ্রহণ করা",
        "meaning": "Be given, presented with, or paid (something).",
        "type": "verb",
        "example": "I received a letter from him.",
        "difficulty": "A2"
    },
    {
        "english": "recent",
        "bengali": "সাম্প্রতিক",
        "meaning": "Having happened, begun, or been done not long ago or not long before; belonging to a past period of time comparatively close to the present.",
        "type": "adjective",
        "example": "This is a recent photograph.",
        "difficulty": "A2"
    },
    {
        "english": "recently",
        "bengali": "সম্প্রতি",
        "meaning": "At a recent time; not long ago.",
        "type": "adverb",
        "example": "I have seen him recently.",
        "difficulty": "A2"
    },
    {
        "english": "reception",
        "bengali": "অভ্যর্থনা",
        "meaning": "The action or process of receiving something sent, given, or inflicted.",
        "type": "noun",
        "example": "The wedding reception was held in a hotel.",
        "difficulty": "A2"
    },
    {
        "english": "recipe",
        "bengali": "রেসিপি",
        "meaning": "A set of instructions for preparing a particular dish, including a list of the ingredients required.",
        "type": "noun",
        "example": "I have a good recipe for chicken soup.",
        "difficulty": "A2"
    },
    {
        "english": "recognize",
        "bengali": "চিনতে পারা",
        "meaning": "Identify (someone or something) from having encountered them before; know again.",
        "type": "verb",
        "example": "I didn't recognize you.",
        "difficulty": "A2"
    },
    {
        "english": "recommend",
        "bengali": "সুপারিশ করা",
        "meaning": "Put forward (someone or something) with approval as being suitable for a particular purpose or role.",
        "type": "verb",
        "example": "Can you recommend a good restaurant?",
        "difficulty": "A2"
    },
    {
        "english": "recommendation",
        "bengali": "সুপারিশ",
        "meaning": "A suggestion or proposal as to the best course of action, especially one put forward by an authoritative body.",
        "type": "noun",
        "example": "I have a recommendation for you.",
        "difficulty": "B1"
    },
    {
        "english": "record",
        "bengali": "রেকর্ড",
        "meaning": "A thing constituting a piece of evidence about the past, especially an account of an act or occurrence kept in writing or some other permanent form.",
        "type": "noun, verb",
        "example": "He holds the world record for the 100 meters.",
        "difficulty": "A2"
    },
    {
        "english": "recording",
        "bengali": "রেকর্ডিং",
        "meaning": "The action or process of recording sound or a performance for subsequent reproduction or broadcast.",
        "type": "noun",
        "example": "This is a recording of a live concert.",
        "difficulty": "A2"
    },
    {
        "english": "recover",
        "bengali": "আরোগ্য লাভ করা",
        "meaning": "Return to a normal state of health, mind, or strength.",
        "type": "verb",
        "example": "He is recovering from a long illness.",
        "difficulty": "B2"
    },
    {
        "english": "recycle",
        "bengali": "পুনর্ব্যবহার করা",
        "meaning": "Convert (waste) into reusable material.",
        "type": "verb",
        "example": "We should recycle paper and plastic.",
        "difficulty": "A2"
    },
    {
        "english": "red",
        "bengali": "লাল",
        "meaning": "Of a color at the end of the spectrum next to orange and opposite violet, as of blood, fire, or rubies.",
        "type": "adjective, noun",
        "example": "She is wearing a red dress.",
        "difficulty": "A1"
    },
    {
        "english": "reduce",
        "bengali": "কমানো",
        "meaning": "Make smaller or less in amount, degree, or size.",
        "type": "verb",
        "example": "We need to reduce our expenses.",
        "difficulty": "A2"
    },
    {
        "english": "reduction",
        "bengali": "হ্রাস",
        "meaning": "The action or fact of making a specified thing smaller or less in amount, degree, or size.",
        "type": "noun",
        "example": "There has been a reduction in the price of gas.",
        "difficulty": "B2"
    },
    {
        "english": "refer",
        "bengali": "উল্লেখ করা",
        "meaning": "Mention or allude to.",
        "type": "verb",
        "example": "He referred to the book in his speech.",
        "difficulty": "A2"
    },
    {
        "english": "reference",
        "bengali": "উল্লেখ",
        "meaning": "The action of mentioning or alluding to something.",
        "type": "noun",
        "example": "He made a reference to his previous work.",
        "difficulty": "B1"
    },
    {
        "english": "reflect",
        "bengali": "প্রতিফলিত করা",
        "meaning": "(of a surface or body) throw back (heat, light, or sound) without absorbing it.",
        "type": "verb",
        "example": "The mirror reflects my image.",
        "difficulty": "B1"
    },
    {
        "english": "refrigerator",
        "bengali": "ফ্রিজ",
        "meaning": "An appliance or compartment that is artificially kept cool and used to store food and drink.",
        "type": "noun",
        "example": "The milk is in the refrigerator.",
        "difficulty": "A2"
    },
    {
        "english": "refuse",
        "bengali": "প্রত্যাখ্যান করা",
        "meaning": "Indicate or show that one is not willing to do something.",
        "type": "verb",
        "example": "He refused to help me.",
        "difficulty": "A2"
    },
    {
        "english": "regard",
        "bengali": "বিবেচনা করা",
        "meaning": "Consider or think of in a specified way.",
        "type": "verb, noun",
        "example": "I regard him as a friend.",
        "difficulty": "B2"
    },
    {
        "english": "region",
        "bengali": "অঞ্চল",
        "meaning": "An area, especially part of a country or the world having definable characteristics but not always fixed boundaries.",
        "type": "noun",
        "example": "This is a mountainous region.",
        "difficulty": "A2"
    },
    {
        "english": "regional",
        "bengali": "আঞ্চলিক",
        "meaning": "Relating to or characteristic of a region.",
        "type": "adjective",
        "example": "There are regional differences in language.",
        "difficulty": "B2"
    },
    {
        "english": "register",
        "bengali": "নিবন্ধন করা",
        "meaning": "Enter or record on an official list or directory.",
        "type": "verb, noun",
        "example": "You need to register to vote.",
        "difficulty": "B2"
    },
    {
        "english": "regret",
        "bengali": "অনুশোচনা",
        "meaning": "Feel sad, repentant, or disappointed over (something that has happened or been done, especially a loss or missed opportunity).",
        "type": "verb, noun",
        "example": "I regret my decision.",
        "difficulty": "B2"
    },
    {
        "english": "regular",
        "bengali": "নিয়মিত",
        "meaning": "Arranged in or constituting a constant or definite pattern, especially with the same space between individual instances.",
        "type": "adjective",
        "example": "He is a regular customer.",
        "difficulty": "A2"
    },
    {
        "english": "regularly",
        "bengali": "নিয়মিতভাবে",
        "meaning": "At uniform intervals of time or space.",
        "type": "adverb",
        "example": "I exercise regularly.",
        "difficulty": "B1"
    },
    {
        "english": "regulation",
        "bengali": "নিয়ন্ত্রণ",
        "meaning": "A rule or directive made and maintained by an authority.",
        "type": "noun",
        "example": "There are strict regulations about smoking.",
        "difficulty": "B2"
    },
    {
        "english": "reject",
        "bengali": "প্রত্যাখ্যান করা",
        "meaning": "Dismiss as inadequate, inappropriate, or not to one's taste.",
        "type": "verb",
        "example": "He rejected my offer.",
        "difficulty": "B1"
    },
    {
        "english": "relate",
        "bengali": "সম্পর্কিত করা",
        "meaning": "Make or show a connection between.",
        "type": "verb",
        "example": "I can't relate to this story.",
        "difficulty": "B1"
    },
    {
        "english": "related",
        "bengali": "সম্পর্কিত",
        "meaning": "Belonging to the same family, group, or type; connected.",
        "type": "adjective",
        "example": "These two issues are related.",
        "difficulty": "B1"
    },
    {
        "english": "relation",
        "bengali": "সম্পর্ক",
        "meaning": "The way in which two or more concepts, objects, or people are connected; a thing's effect on or relevance to another.",
        "type": "noun",
        "example": "What is the relation between these two events?",
        "difficulty": "B1"
    },
    {
        "english": "relationship",
        "bengali": "সম্পর্ক",
        "meaning": "The way in which two or more people or things are connected, or the state of being connected.",
        "type": "noun",
        "example": "They have a good relationship.",
        "difficulty": "A2"
    },
    {
        "english": "relative",
        "bengali": "আত্মীয়",
        "meaning": "A person connected by blood or marriage.",
        "type": "adjective, noun",
        "example": "He is a close relative of mine.",
        "difficulty": "B1"
    },
    {
        "english": "relatively",
        "bengali": "তুলনামূলকভাবে",
        "meaning": "In relation, comparison, or proportion to something else.",
        "type": "adverb",
        "example": "The exam was relatively easy.",
        "difficulty": "B2"
    },
    {
        "english": "relax",
        "bengali": "আরাম করা",
        "meaning": "Make or become less tense or anxious.",
        "type": "verb",
        "example": "You need to relax.",
        "difficulty": "A1"
    },
    {
        "english": "relaxed",
        "bengali": "স্বচ্ছন্দ",
        "meaning": "Free from tension and anxiety; at ease.",
        "type": "adjective",
        "example": "I feel very relaxed.",
        "difficulty": "B1"
    },
    {
        "english": "relaxing",
        "bengali": "আরামদায়ক",
        "meaning": "Reducing tension or anxiety.",
        "type": "adjective",
        "example": "It was a relaxing holiday.",
        "difficulty": "B1"
    },
    {
        "english": "release",
        "bengali": "মুক্তি দেওয়া",
        "meaning": "Allow or enable to escape from confinement; set free.",
        "type": "verb, noun",
        "example": "The prisoner was released from jail.",
        "difficulty": "B1"
    },
    {
        "english": "relevant",
        "bengali": "প্রাসঙ্গিক",
        "meaning": "Closely connected or appropriate to what is being done or considered.",
        "type": "adjective",
        "example": "This is not relevant to the discussion.",
        "difficulty": "B2"
    },
    {
        "english": "reliable",
        "bengali": "নির্ভরযোগ্য",
        "meaning": "Consistently good in quality or performance; able to be trusted.",
        "type": "adjective",
        "example": "He is a reliable worker.",
        "difficulty": "B1"
    },
    {
        "english": "relief",
        "bengali": "স্বস্তি",
        "meaning": "A feeling of reassurance and relaxation following release from anxiety or distress.",
        "type": "noun",
        "example": "It was a great relief to hear that you were safe.",
        "difficulty": "B2"
    },
    {
        "english": "religion",
        "bengali": "ধর্ম",
        "meaning": "The belief in and worship of a superhuman controlling power, especially a personal God or gods.",
        "type": "noun",
        "example": "What is your religion?",
        "difficulty": "B1"
    },
    {
        "english": "religious",
        "bengali": "ধার্মিক",
        "meaning": "Relating to or believing in a religion.",
        "type": "adjective",
        "example": "She is a very religious person.",
        "difficulty": "B1"
    },
    {
        "english": "rely",
        "bengali": "নির্ভর করা",
        "meaning": "Depend on with full trust or confidence.",
        "type": "verb",
        "example": "You can rely on me.",
        "difficulty": "B2"
    },
    {
        "english": "remain",
        "bengali": "থাকা",
        "meaning": "Continue to exist, especially after other similar or related people or things have ceased to exist.",
        "type": "verb",
        "example": "He remained silent.",
        "difficulty": "B1"
    },
    {
        "english": "remark",
        "bengali": "মন্তব্য",
        "meaning": "A written or spoken comment.",
        "type": "noun, verb",
        "example": "He made a rude remark.",
        "difficulty": "B2"
    },
    {
        "english": "remember",
        "bengali": "মনে রাখা",
        "meaning": "Have in or be able to bring to one's mind an awareness of (someone or something that one has seen, known, or experienced in the past).",
        "type": "verb",
        "example": "I remember you.",
        "difficulty": "A1"
    },
    {
        "english": "remind",
        "bengali": "মনে করিয়ে দেওয়া",
        "meaning": "Cause (someone) to remember someone or something.",
        "type": "verb",
        "example": "Please remind me to call him.",
        "difficulty": "B1"
    },
    {
        "english": "remote",
        "bengali": "দূরবর্তী",
        "meaning": "(of a place) situated far from the main centers of population; distant.",
        "type": "adjective",
        "example": "He lives in a remote village.",
        "difficulty": "B1"
    },
    {
        "english": "remove",
        "bengali": "সরানো",
        "meaning": "Take (something) away or off from the position occupied.",
        "type": "verb",
        "example": "Please remove your shoes.",
        "difficulty": "A2"
    },
    {
        "english": "rent",
        "bengali": "ভাড়া",
        "meaning": "A tenant's regular payment to a landlord for the use of property or land.",
        "type": "noun, verb",
        "example": "I have to pay the rent.",
        "difficulty": "B1"
    },
    {
        "english": "repair",
        "bengali": "মেরামত",
        "meaning": "Restore (something damaged, faulty, or worn) to a good condition.",
        "type": "verb, noun",
        "example": "I need to repair my car.",
        "difficulty": "A2"
    },
    {
        "english": "repeat",
        "bengali": "পুনরাবৃত্তি করা",
        "meaning": "Say again something one has already said.",
        "type": "verb, noun",
        "example": "Please repeat what you said.",
        "difficulty": "A1"
    },
    {
        "english": "repeated",
        "bengali": "বারবার",
        "meaning": "Done or occurring again several times in the same way.",
        "type": "adjective",
        "example": "He made repeated attempts to pass the exam.",
        "difficulty": "B1"
    },
    {
        "english": "replace",
        "bengali": "প্রতিস্থাপন করা",
        "meaning": "Take the place of.",
        "type": "verb",
        "example": "I need to replace the battery.",
        "difficulty": "A2"
    },
    {
        "english": "reply",
        "bengali": "উত্তর দেওয়া",
        "meaning": "Say something in response to something someone has said.",
        "type": "verb, noun",
        "example": "He didn't reply to my letter.",
        "difficulty": "A2"
    },
    {
        "english": "report",
        "bengali": "প্রতিবেদন",
        "meaning": "Give a spoken or written account of something that one has observed, heard, done, or investigated.",
        "type": "noun, verb",
        "example": "I need to write a report.",
        "difficulty": "A1"
    },
    {
        "english": "reporter",
        "bengali": "প্রতিবেদক",
        "meaning": "A person who reports, especially one employed to report news or conduct interviews for newspapers or broadcasts.",
        "type": "noun",
        "example": "He is a famous reporter.",
        "difficulty": "A2"
    },
    {
        "english": "represent",
        "bengali": "প্রতিনিধিত্ব করা",
        "meaning": "Be entitled or appointed to act or speak for (someone), especially in an official capacity.",
        "type": "verb",
        "example": "He will represent our country at the conference.",
        "difficulty": "B1"
    },
    {
        "english": "representative",
        "bengali": "প্রতিনিধি",
        "meaning": "Typical of a class, group, or body of opinion.",
        "type": "noun, adjective",
        "example": "He is a representative of the company.",
        "difficulty": "B2"
    },
    {
        "english": "reputation",
        "bengali": "খ্যাতি",
        "meaning": "The beliefs or opinions that are generally held about someone or something.",
        "type": "noun",
        "example": "He has a good reputation.",
        "difficulty": "B2"
    },
    {
        "english": "request",
        "bengali": "অনুরোধ",
        "meaning": "An act of asking politely or formally for something.",
        "type": "noun, verb",
        "example": "I have a request.",
        "difficulty": "A2"
    },
    {
        "english": "require",
        "bengali": "প্রয়োজন হওয়া",
        "meaning": "Need for a particular purpose.",
        "type": "verb",
        "example": "This job requires a lot of experience.",
        "difficulty": "B1"
    },
    {
        "english": "requirement",
        "bengali": "প্রয়োজনীয়তা",
        "meaning": "A thing that is needed or wanted.",
        "type": "noun",
        "example": "What are the requirements for this job?",
        "difficulty": "B2"
    },
    {
        "english": "rescue",
        "bengali": "উদ্ধার",
        "meaning": "Save (someone) from a dangerous or distressing situation.",
        "type": "verb, noun",
        "example": "The firefighters rescued the people from the burning building.",
        "difficulty": "B2"
    },
    {
        "english": "research",
        "bengali": "গবেষণা",
        "meaning": "The systematic investigation into and study of materials and sources in order to establish facts and reach new conclusions.",
        "type": "noun, verb",
        "example": "He is doing research on cancer.",
        "difficulty": "A2"
    },
    {
        "english": "researcher",
        "bengali": "গবেষক",
        "meaning": "A person who carries out academic or scientific research.",
        "type": "noun",
        "example": "She is a famous researcher.",
        "difficulty": "A2"
    },
    {
        "english": "reservation",
        "bengali": "সংরক্ষণ",
        "meaning": "An arrangement whereby something, especially a seat or room, is reserved for a particular person.",
        "type": "noun",
        "example": "I have a reservation at the hotel.",
        "difficulty": "B1"
    },
    {
        "english": "reserve",
        "bengali": "সংরক্ষণ করা",
        "meaning": "Refrain from using or disposing of (something); keep for future use.",
        "type": "noun, verb",
        "example": "I would like to reserve a table for two.",
        "difficulty": "B2"
    },
    {
        "english": "resident",
        "bengali": "নিবাসী",
        "meaning": "A person who lives somewhere permanently or on a long-term basis.",
        "type": "noun, adjective",
        "example": "He is a resident of this city.",
        "difficulty": "B2"
    },
    {
        "english": "resist",
        "bengali": "প্রতিরোধ করা",
        "meaning": "Withstand the action or effect of.",
        "type": "verb",
        "example": "He resisted arrest.",
        "difficulty": "B2"
    },
    {
        "english": "resolve",
        "bengali": "সমাধান করা",
        "meaning": "Settle or find a solution to (a problem, dispute, or contentious matter).",
        "type": "verb",
        "example": "We need to resolve this issue.",
        "difficulty": "B2"
    },
    {
        "english": "resort",
        "bengali": "রিসোর্ট",
        "meaning": "A place that is a popular destination for vacations or recreation, or which is frequented for a particular purpose.",
        "type": "noun",
        "example": "We are staying at a beautiful resort.",
        "difficulty": "B2"
    },
    {
        "english": "resource",
        "bengali": "সম্পদ",
        "meaning": "A stock or supply of money, materials, staff, and other assets that can be drawn on by a person or organization in order to function effectively.",
        "type": "noun",
        "example": "We have limited resources.",
        "difficulty": "B1"
    },
    {
        "english": "respect",
        "bengali": "সম্মান",
        "meaning": "A feeling of deep admiration for someone or something elicited by their abilities, qualities, or achievements.",
        "type": "noun, verb",
        "example": "You should respect your elders.",
        "difficulty": "B1"
    },
    {
        "english": "respond",
        "bengali": "সাড়া দেওয়া",
        "meaning": "Say something in reply.",
        "type": "verb",
        "example": "He didn't respond to my question.",
        "difficulty": "A2"
    },
    {
        "english": "response",
        "bengali": "প্রতিক্রিয়া",
        "meaning": "A verbal or written answer.",
        "type": "noun",
        "example": "I received a positive response to my proposal.",
        "difficulty": "A2"
    },
    {
        "english": "responsibility",
        "bengali": "দায়িত্ব",
        "meaning": "The state or fact of having a duty to deal with something or of having control over someone.",
        "type": "noun",
        "example": "It is your responsibility to do your homework.",
        "difficulty": "B1"
    },
    {
        "english": "responsible",
        "bengali": "দায়ী",
        "meaning": "Having an obligation to do something, or having control over or care for someone, as part of one's job or role.",
        "type": "adjective",
        "example": "You are responsible for your own actions.",
        "difficulty": "B1"
    },
    {
        "english": "rest (remaining part)",
        "bengali": "বাকি",
        "meaning": "The remaining part of something.",
        "type": "noun",
        "example": "I will do the rest of the work tomorrow.",
        "difficulty": "A2"
    },
    {
        "english": "rest (sleep/relax)",
        "bengali": "বিশ্রাম",
        "meaning": "Cease work or movement in order to relax, refresh oneself, or recover strength.",
        "type": "noun, verb",
        "example": "You need to get some rest.",
        "difficulty": "A2"
    },
    {
        "english": "restaurant",
        "bengali": "রেস্তোরাঁ",
        "meaning": "A place where people pay to sit and eat meals that are cooked and served on the premises.",
        "type": "noun",
        "example": "Let's go to a restaurant for dinner.",
        "difficulty": "A1"
    },
    {
        "english": "result",
        "bengali": "ফলাফল",
        "meaning": "A consequence, effect, or outcome of something.",
        "type": "noun, verb",
        "example": "What was the result of the exam?",
        "difficulty": "A1"
    },
    {
        "english": "retain",
        "bengali": "ধরে রাখা",
        "meaning": "Continue to have (something); keep possession of.",
        "type": "verb",
        "example": "He managed to retain his title.",
        "difficulty": "B2"
    },
    {
        "english": "retire",
        "bengali": "অবসর গ্রহণ করা",
        "meaning": "Leave one's job and cease to work, typically on reaching the normal age for leaving service.",
        "type": "verb",
        "example": "He is going to retire next year.",
        "difficulty": "B1"
    },
    {
        "english": "retired",
        "bengali": "অবসরপ্রাপ্ত",
        "meaning": "Having left one's job and ceased to work.",
        "type": "adjective",
        "example": "He is a retired teacher.",
        "difficulty": "B1"
    },
    {
        "english": "return",
        "bengali": "ফিরে আসা",
        "meaning": "Come or go back to a place or person.",
        "type": "verb, noun",
        "example": "When will you return?",
        "difficulty": "A1"
    },
    {
        "english": "reveal",
        "bengali": "প্রকাশ করা",
        "meaning": "Make (previously unknown or secret information) known to others.",
        "type": "verb",
        "example": "He refused to reveal the secret.",
        "difficulty": "B2"
    },
    {
        "english": "review",
        "bengali": "পর্যালোচনা",
        "meaning": "A formal assessment or examination of something with the possibility or intention of instituting change if necessary.",
        "type": "noun, verb",
        "example": "I need to review my notes before the exam.",
        "difficulty": "A2"
    },
    {
        "english": "revise",
        "bengali": "সংশোধন করা",
        "meaning": "Re-examine and make alterations to (written or printed matter).",
        "type": "verb",
        "example": "I need to revise my essay.",
        "difficulty": "B1"
    },
    {
        "english": "revolution",
        "bengali": "বিপ্লব",
        "meaning": "A forcible overthrow of a government or social order in favor of a new system.",
        "type": "noun",
        "example": "The French Revolution was a major historical event.",
        "difficulty": "B2"
    },
    {
        "english": "reward",
        "bengali": "পুরস্কার",
        "meaning": "A thing given in recognition of one's service, effort, or achievement.",
        "type": "noun, verb",
        "example": "He received a reward for his bravery.",
        "difficulty": "B2"
    },
    {
        "english": "rhythm",
        "bengali": "ছন্দ",
        "meaning": "A strong, regular repeated pattern of movement or sound.",
        "type": "noun",
        "example": "The song has a good rhythm.",
        "difficulty": "B2"
    },
    {
        "english": "rice",
        "bengali": "ভাত",
        "meaning": "A swamp grass which is widely cultivated as a source of food, especially in Asia.",
        "type": "noun",
        "example": "I eat rice every day.",
        "difficulty": "A1"
    },
    {
        "english": "rich",
        "bengali": "ধনী",
        "meaning": "Having a great deal of money or assets; wealthy.",
        "type": "adjective",
        "example": "He is a rich man.",
        "difficulty": "A1"
    },
    {
        "english": "rid",
        "bengali": "মুক্তি পাওয়া",
        "meaning": "Make someone or something free of (a troublesome or unwanted person or thing).",
        "type": "verb",
        "example": "I want to get rid of this old car.",
        "difficulty": "B2"
    },
    {
        "english": "ride",
        "bengali": "চড়া",
        "meaning": "Sit on and control the movement of (a horse, bicycle, or motorcycle), typically as a recreation or form of transport.",
        "type": "verb, noun",
        "example": "I like to ride my bike.",
        "difficulty": "A1"
    },
    {
        "english": "right",
        "bengali": "ডান",
        "meaning": "On, toward, or relating to the side of a human body or of a thing that is to the east when the person or thing is facing north.",
        "type": "adjective, adverb, noun",
        "example": "Turn right at the corner.",
        "difficulty": "A1"
    },
    {
        "english": "ring (on a finger)",
        "bengali": "আংটি",
        "meaning": "A small circular band, typically of precious metal and often set with one or more gemstones, worn on a finger as an ornament or a token of marriage, engagement, or authority.",
        "type": "noun",
        "example": "She is wearing a beautiful ring.",
        "difficulty": "A2"
    },
    {
        "english": "ring (sound)",
        "bengali": "বাজা",
        "meaning": "Make a clear resonant sound.",
        "type": "verb, noun",
        "example": "The phone is ringing.",
        "difficulty": "A2"
    },
    {
        "english": "rise",
        "bengali": "ওঠা",
        "meaning": "Move from a lower position to a higher one; come or go up.",
        "type": "verb, noun",
        "example": "The sun rises in the east.",
        "difficulty": "A2"
    },
    {
        "english": "risk",
        "bengali": "ঝুঁকি",
        "meaning": "A situation involving exposure to danger.",
        "type": "noun, verb",
        "example": "There is a risk of fire.",
        "difficulty": "B1"
    },
    {
        "english": "river",
        "bengali": "নদী",
        "meaning": "A large natural stream of water flowing in a channel to the sea, a lake, or another such stream.",
        "type": "noun",
        "example": "The river is very wide.",
        "difficulty": "A1"
    },
    {
        "english": "road",
        "bengali": "রাস্তা",
        "meaning": "A wide way leading from one place to another, especially one with a specially prepared surface which vehicles can use.",
        "type": "noun",
        "example": "This is a busy road.",
        "difficulty": "A1"
    },
    {
        "english": "robot",
        "bengali": "রোবট",
        "meaning": "A machine capable of carrying out a complex series of actions automatically, especially one programmable by a computer.",
        "type": "noun",
        "example": "The factory uses robots to assemble the cars.",
        "difficulty": "B1"
    },
    {
        "english": "rock (stone)",
        "bengali": "পাথর",
        "meaning": "The solid mineral material forming part of the surface of the earth and other similar planets, exposed on the surface or underlying the soil or oceans.",
        "type": "noun",
        "example": "The house is built on a rock.",
        "difficulty": "A2"
    },
    {
        "english": "rock (music)",
        "bengali": "রক (সংগীত)",
        "meaning": "A form of popular music that evolved from rock and roll and pop music during the mid- and late 1960s. Harsher and often self-consciously more serious than its predecessors, it was characterized by musical experimentation and drug-related or anti-establishment lyrics.",
        "type": "noun",
        "example": "I like to listen to rock music.",
        "difficulty": "A2"
    },
    {
        "english": "role",
        "bengali": "ভূমিকা",
        "meaning": "An actor's part in a play, movie, etc.",
        "type": "noun",
        "example": "He played the role of the hero.",
        "difficulty": "A2"
    },
    {
        "english": "roll",
        "bengali": "গড়ানো",
        "meaning": "Move or cause to move in a particular direction by turning over and over on an axis.",
        "type": "verb, noun",
        "example": "The ball rolled down the hill.",
        "difficulty": "B1"
    },
    {
        "english": "romantic",
        "bengali": "রোমান্টিক",
        "meaning": "Of, characterized by, or suggestive of an idealized view of reality.",
        "type": "adjective",
        "example": "It was a romantic dinner.",
        "difficulty": "B1"
    },
    {
        "english": "roof",
        "bengali": "ছাদ",
        "meaning": "The structure forming the upper covering of a building or vehicle.",
        "type": "noun",
        "example": "The roof of the house is leaking.",
        "difficulty": "A2"
    },
    {
        "english": "room",
        "bengali": "রুম",
        "meaning": "Space that can be occupied or where something can be done, especially viewed in terms of its adequacy.",
        "type": "noun",
        "example": "This is my room.",
        "difficulty": "A1"
    },
    {
        "english": "root",
        "bengali": "মূল",
        "meaning": "The part of a plant which attaches it to the ground or to a support, typically underground, conveying water and nourishment to the rest of the plant via numerous branches and fibers.",
        "type": "noun",
        "example": "The tree has deep roots.",
        "difficulty": "B2"
    },
    {
        "english": "rope",
        "bengali": "দড়ি",
        "meaning": "A length of strong cord made by twisting together strands of natural fibers such as hemp or manila, or synthetic fibers such as nylon.",
        "type": "noun",
        "example": "He tied the boat to the post with a rope.",
        "difficulty": "B1"
    },
    {
        "english": "rough",
        "bengali": "অমসৃণ",
        "meaning": "Having an uneven or irregular surface; not smooth or level.",
        "type": "adjective",
        "example": "The road was very rough.",
        "difficulty": "B1"
    },
    {
        "english": "round",
        "bengali": "গোল",
        "meaning": "Shaped like or approximately like a circle or cylinder.",
        "type": "adjective, adverb, preposition, noun",
        "example": "The earth is round.",
        "difficulty": "A2"
    },
    {
        "english": "route",
        "bengali": "পথ",
        "meaning": "A way or course taken in getting from a starting point to a destination.",
        "type": "noun",
        "example": "What is the best route to the station?",
        "difficulty": "A2"
    },
    {
        "english": "routine",
        "bengali": "রুটিন",
        "meaning": "A sequence of actions regularly followed; a fixed program.",
        "type": "noun, adjective",
        "example": "I have a daily routine.",
        "difficulty": "A1"
    },
    {
        "english": "row",
        "bengali": "সারি",
        "meaning": "A number of people or things in a more or less straight line.",
        "type": "noun",
        "example": "We sat in the front row.",
        "difficulty": "B1"
    },
    {
        "english": "royal",
        "bengali": "রাজকীয়",
        "meaning": "Having the status of a king or queen or a member of their family.",
        "type": "adjective",
        "example": "The royal family lives in the palace.",
        "difficulty": "B1"
    },
    {
        "english": "rub",
        "bengali": "ঘষা",
        "meaning": "Move one's hand or a cloth repeatedly back and forth on the surface of (something) with firm pressure.",
        "type": "verb",
        "example": "She rubbed her eyes.",
        "difficulty": "B2"
    },
    {
        "english": "rubber",
        "bengali": "রাবার",
        "meaning": "A tough elastic polymeric substance made from the latex of a tropical plant or synthetically.",
        "type": "noun, adjective",
        "example": "The tires are made of rubber.",
        "difficulty": "B2"
    },
    {
        "english": "rude",
        "bengali": "অসভ্য",
        "meaning": "Offensively impolite or ill-mannered.",
        "type": "adjective",
        "example": "He is a very rude person.",
        "difficulty": "A2"
    },
    {
        "english": "rule",
        "bengali": "নিয়ম",
        "meaning": "One of a set of explicit or understood regulations or principles governing conduct within a particular activity or sphere.",
        "type": "noun, verb",
        "example": "You must follow the rules.",
        "difficulty": "A1"
    },
    {
        "english": "run",
        "bengali": "দৌড়ানো",
        "meaning": "Move at a speed faster than a walk, never having both or all the feet on the ground at the same time.",
        "type": "verb, noun",
        "example": "I can run very fast.",
        "difficulty": "A1"
    },
    {
        "english": "runner",
        "bengali": "দৌড়বিদ",
        "meaning": "A person who runs, especially in a race.",
        "type": "noun",
        "example": "He is a long-distance runner.",
        "difficulty": "A2"
    },
    {
        "english": "running",
        "bengali": "দৌড়",
        "meaning": "The action or movement of a runner.",
        "type": "noun",
        "example": "Running is good exercise.",
        "difficulty": "A2"
    },
    {
        "english": "rural",
        "bengali": "গ্রামীণ",
        "meaning": "In, relating to, or characteristic of the countryside rather than the town.",
        "type": "adjective",
        "example": "He lives in a rural area.",
        "difficulty": "B2"
    },
    {
        "english": "rush",
        "bengali": "তাড়াহুড়ো",
        "meaning": "Move with urgent haste.",
        "type": "verb, noun",
        "example": "There's no need to rush.",
        "difficulty": "B2"
    },
    {
        "english": "sad",
        "bengali": "দুঃখিত",
        "meaning": "Feeling or showing sorrow; unhappy.",
        "type": "adjective",
        "example": "I am sad to hear the news.",
        "difficulty": "A1"
    },
    {
        "english": "sadly",
        "bengali": "দুঃখের বিষয়",
        "meaning": "In an unhappy way.",
        "type": "adverb",
        "example": "Sadly, he passed away last year.",
        "difficulty": "A2"
    },
    {
        "english": "safe",
        "bengali": "নিরাপদ",
        "meaning": "Protected from or not exposed to danger or risk; not likely to be harmed or lost.",
        "type": "adjective",
        "example": "This is a safe place.",
        "difficulty": "A2"
    },
    {
        "english": "safety",
        "bengali": "নিরাপত্তা",
        "meaning": "The condition of being protected from or unlikely to cause danger, risk, or injury.",
        "type": "noun",
        "example": "Your safety is our priority.",
        "difficulty": "B1"
    },
    {
        "english": "sail",
        "bengali": "পাল তোলা",
        "meaning": "Travel in a boat with sails, especially as a sport or recreation.",
        "type": "verb, noun",
        "example": "We sailed around the island.",
        "difficulty": "A2"
    },
    {
        "english": "sailing",
        "bengali": "নৌকা চালনা",
        "meaning": "The action of sailing a boat or ship.",
        "type": "noun",
        "example": "Sailing is a popular sport.",
        "difficulty": "A2"
    },
    {
        "english": "sailor",
        "bengali": "নাবিক",
        "meaning": "A person whose job it is to work as a member of the crew of a commercial or naval ship or boat, especially one who is below the rank of officer.",
        "type": "noun",
        "example": "He is a sailor in the navy.",
        "difficulty": "B1"
    },
    {
        "english": "salad",
        "bengali": "সালাদ",
        "meaning": "A cold dish of various mixtures of raw or cooked vegetables, usually seasoned with oil, vinegar, or other dressing and sometimes accompanied by meat, fish, or other ingredients.",
        "type": "noun",
        "example": "I would like a salad for lunch.",
        "difficulty": "A1"
    },
    {
        "english": "salary",
        "bengali": "বেতন",
        "meaning": "A fixed regular payment, typically paid on a monthly or biweekly basis but often expressed as an annual sum, made by an employer to an employee, especially a professional or white-collar worker.",
        "type": "noun",
        "example": "He has a high salary.",
        "difficulty": "A2"
    },
    {
        "english": "sale",
        "bengali": "বিক্রয়",
        "meaning": "The exchange of a commodity for money; the action of selling something.",
        "type": "noun",
        "example": "This house is for sale.",
        "difficulty": "A2"
    },
    {
        "english": "salt",
        "bengali": "লবণ",
        "meaning": "A white crystalline substance which gives seawater its characteristic taste and is used for seasoning or preserving food.",
        "type": "noun",
        "example": "I need some salt for my food.",
        "difficulty": "A1"
    },
    {
        "english": "same",
        "bengali": "একই",
        "meaning": "Identical; not different.",
        "type": "adjective, pronoun, adverb",
        "example": "We are the same age.",
        "difficulty": "A1"
    },
    {
        "english": "sample",
        "bengali": "নমুনা",
        "meaning": "A small part or quantity intended to show what the whole is like.",
        "type": "noun, verb",
        "example": "Can I have a sample of this product?",
        "difficulty": "B1"
    },
    {
        "english": "sand",
        "bengali": "বালি",
        "meaning": "A loose granular substance, typically pale yellowish brown, resulting from the erosion of siliceous and other rocks and forming a major constituent of beaches, riverbeds, the seabed, and deserts.",
        "type": "noun",
        "example": "The children are playing in the sand.",
        "difficulty": "B1"
    },
    {
        "english": "sandwich",
        "bengali": "স্যান্ডউইচ",
        "meaning": "An item of food consisting of two pieces of bread with meat, cheese, or other filling between them, eaten as a light meal.",
        "type": "noun",
        "example": "I had a sandwich for lunch.",
        "difficulty": "A1"
    },
    {
        "english": "satellite",
        "bengali": "উপগ্রহ",
        "meaning": "An artificial body placed in orbit around the earth or moon or another planet in order to collect information or for communication.",
        "type": "noun",
        "example": "The satellite is orbiting the earth.",
        "difficulty": "B2"
    },
    {
        "english": "satisfied",
        "bengali": "সন্তুষ্ট",
        "meaning": "Contented; pleased.",
        "type": "adjective",
        "example": "I am satisfied with your work.",
        "difficulty": "B2"
    },
    {
        "english": "satisfy",
        "bengali": "সন্তুষ্ট করা",
        "meaning": "Meet the expectations, needs, or desires of (someone).",
        "type": "verb",
        "example": "I hope this will satisfy you.",
        "difficulty": "B2"
    },
    {
        "english": "Saturday",
        "bengali": "শনিবার",
        "meaning": "The day of the week before Sunday and following Friday.",
        "type": "noun",
        "example": "I will see you on Saturday.",
        "difficulty": "A1"
    },
    {
        "english": "sauce",
        "bengali": "সস",
        "meaning": "A thick liquid served with food, usually savory dishes, to add moistness and flavor.",
        "type": "noun",
        "example": "I would like some tomato sauce.",
        "difficulty": "A2"
    },
    {
        "english": "save",
        "bengali": "বাঁচানো",
        "meaning": "Keep safe or rescue (someone or something) from harm or danger.",
        "type": "verb",
        "example": "He saved the child from drowning.",
        "difficulty": "A2"
    },
    {
        "english": "saving",
        "bengali": "সঞ্চয়",
        "meaning": "An economy of or reduction in money, time, or another resource.",
        "type": "noun",
        "example": "I have a lot of savings in the bank.",
        "difficulty": "B2"
    },
    {
        "english": "say",
        "bengali": "বলা",
        "meaning": "Utter words so as to convey information, an opinion, a feeling or intention, or a question.",
        "type": "verb",
        "example": "What did you say?",
        "difficulty": "A1"
    },
    {
        "english": "scale",
        "bengali": "স্কেল",
        "meaning": "Each of the small, thin horny or bony plates protecting the skin of fish and reptiles, typically overlapping one another.",
        "type": "noun",
        "example": "The fish has scales.",
        "difficulty": "B2"
    },
    {
        "english": "scan",
        "bengali": "স্ক্যান করা",
        "meaning": "Look at all parts of (something) carefully in order to detect some feature.",
        "type": "verb",
        "example": "Please scan this document.",
        "difficulty": "B1"
    },
    {
        "english": "scared",
        "bengali": "ভীত",
        "meaning": "Fearful; frightened.",
        "type": "adjective",
        "example": "I am scared of spiders.",
        "difficulty": "A2"
    },
    {
        "english": "scary",
        "bengali": "ভয়ংকর",
        "meaning": "Frightening; causing fear.",
        "type": "adjective",
        "example": "It was a scary movie.",
        "difficulty": "A2"
    },
    {
        "english": "scene",
        "bengali": "দৃশ্য",
        "meaning": "The place where an incident in real life or fiction occurs or occurred.",
        "type": "noun",
        "example": "The police arrived at the scene of the crime.",
        "difficulty": "A2"
    },
    {
        "english": "schedule",
        "bengali": "সময়সূচী",
        "meaning": "A plan for carrying out a process or procedure, giving lists of intended events and times.",
        "type": "noun, verb",
        "example": "What is your schedule for tomorrow?",
        "difficulty": "A2"
    },
    {
        "english": "school",
        "bengali": "স্কুল",
        "meaning": "An institution for educating children.",
        "type": "noun",
        "example": "I go to school every day.",
        "difficulty": "A1"
    },
    {
        "english": "science",
        "bengali": "বিজ্ঞান",
        "meaning": "The intellectual and practical activity encompassing the systematic study of the structure and behavior of the physical and natural world through observation and experiment.",
        "type": "noun",
        "example": "I am interested in science.",
        "difficulty": "A1"
    },
    {
        "english": "scientific",
        "bengali": "বৈজ্ঞানিক",
        "meaning": "Based on or characterized by the methods and principles of science.",
        "type": "adjective",
        "example": "This is a scientific discovery.",
        "difficulty": "B1"
    },
    {
        "english": "scientist",
        "bengali": "বিজ্ঞানী",
        "meaning": "A person who is studying or has expert knowledge of one or more of the natural or physical sciences.",
        "type": "noun",
        "example": "He is a famous scientist.",
        "difficulty": "A1"
    },
    {
        "english": "score",
        "bengali": "স্কোর",
        "meaning": "The number of points, goals, runs, etc. achieved in a game or competition.",
        "type": "verb, noun",
        "example": "What's the score?",
        "difficulty": "A2"
    },
    {
        "english": "scream",
        "bengali": "চিৎকার",
        "meaning": "Give a long, loud, piercing cry or cries expressing excitement, great emotion, or pain.",
        "type": "verb, noun",
        "example": "She screamed when she saw the spider.",
        "difficulty": "B2"
    },
    {
        "english": "screen",
        "bengali": "পর্দা",
        "meaning": "A flat panel or area on an electronic device such as a television, computer, or smartphone, on which images and data are displayed.",
        "type": "noun, verb",
        "example": "The computer screen is broken.",
        "difficulty": "A2"
    },
    {
        "english": "script",
        "bengali": "লিপি",
        "meaning": "Handwriting as distinct from print; written characters.",
        "type": "noun",
        "example": "The actors are reading the script.",
        "difficulty": "B1"
    },
    {
        "english": "sculpture",
        "bengali": "ভাস্কর্য",
        "meaning": "The art of making two- or three-dimensional representative or abstract forms, especially by carving stone or wood or by casting metal or plaster.",
        "type": "noun",
        "example": "This is a beautiful sculpture.",
        "difficulty": "B1"
    },
    {
        "english": "sea",
        "bengali": "সমুদ্র",
        "meaning": "The expanse of salt water that covers most of the earth's surface and surrounds its landmasses.",
        "type": "noun",
        "example": "We live near the sea.",
        "difficulty": "A2"
    },
    {
        "english": "search",
        "bengali": "অনুসন্ধান",
        "meaning": "Try to find something by looking or otherwise seeking carefully and thoroughly.",
        "type": "noun, verb",
        "example": "The police are searching for the missing child.",
        "difficulty": "A2"
    },
    {
        "english": "season",
        "bengali": "ঋতু",
        "meaning": "Each of the four divisions of the year (spring, summer, autumn, and winter) marked by particular weather patterns and daylight hours, resulting from the earth's changing position with regard to the sun.",
        "type": "noun",
        "example": "My favorite season is spring.",
        "difficulty": "A2"
    },
    {
        "english": "seat",
        "bengali": "আসন",
        "meaning": "A thing made or used for sitting on, such as a chair or stool.",
        "type": "noun, verb",
        "example": "Please take a seat.",
        "difficulty": "A2"
    },
    {
        "english": "second (next after the first)",
        "bengali": "দ্বিতীয়",
        "meaning": "Constituting number two in a sequence; 2nd.",
        "type": "determiner, number, adverb",
        "example": "This is the second time I have called you.",
        "difficulty": "A1"
    },
    {
        "english": "second (unit of time)",
        "bengali": "সেকেন্ড",
        "meaning": "The SI base unit of time (equivalent to the duration of 9,192,631,770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom).",
        "type": "noun",
        "example": "There are sixty seconds in a minute.",
        "difficulty": "A1"
    },
    {
        "english": "secondary",
        "bengali": "মাধ্যমিক",
        "meaning": "Coming after, less important than, or resulting from someone or something else that is primary.",
        "type": "adjective",
        "example": "This is a secondary issue.",
        "difficulty": "B1"
    },
    {
        "english": "secret",
        "bengali": "গোপন",
        "meaning": "Not known or seen or not meant to be known or seen by others.",
        "type": "adjective, noun",
        "example": "Can you keep a secret?",
        "difficulty": "A2"
    },
    {
        "english": "secretary",
        "bengali": "সচিব",
        "meaning": "A person employed by an individual or in an office to assist with correspondence, keep records, make appointments, and carry out similar tasks.",
        "type": "noun",
        "example": "My secretary will call you to make an appointment.",
        "difficulty": "A2"
    },
    {
        "english": "section",
        "bengali": "বিভাগ",
        "meaning": "Any of the more or less distinct parts into which something is or may be divided or from which it is made up.",
        "type": "noun",
        "example": "Please read the next section.",
        "difficulty": "A1"
    },
    {
        "english": "sector",
        "bengali": "খাত",
        "meaning": "An area or portion that is distinct from others.",
        "type": "noun",
        "example": "He works in the private sector.",
        "difficulty": "B2"
    },
    {
        "english": "secure",
        "bengali": "নিরাপদ করা",
        "meaning": "Fix or attach (something) firmly so that it cannot be moved or lost.",
        "type": "verb, adjective",
        "example": "Please secure the door.",
        "difficulty": "B2"
    },
    {
        "english": "security",
        "bengali": "নিরাপত্তা",
        "meaning": "The state of being free from danger or threat.",
        "type": "noun",
        "example": "The company has good security.",
        "difficulty": "B1"
    },
    {
        "english": "see",
        "bengali": "দেখা",
        "meaning": "Perceive with the eyes; discern visually.",
        "type": "verb",
        "example": "I can see you.",
        "difficulty": "A1"
    },
    {
        "english": "seed",
        "bengali": "বীজ",
        "meaning": "A flowering plant's unit of reproduction, capable of developing into another such plant.",
        "type": "noun",
        "example": "I planted some seeds in the garden.",
        "difficulty": "B1"
    },
    {
        "english": "seek",
        "bengali": "খোঁজা",
        "meaning": "Attempt to find (something).",
        "type": "verb",
        "example": "He is seeking a new job.",
        "difficulty": "B2"
    },
    {
        "english": "seem",
        "bengali": "মনে হওয়া",
        "meaning": "Give the impression or sensation of being something or having a particular quality.",
        "type": "verb",
        "example": "You seem happy.",
        "difficulty": "A2"
    },
    {
        "english": "select",
        "bengali": "নির্বাচন করা",
        "meaning": "Carefully choose as being the best or most suitable.",
        "type": "verb",
        "example": "Please select a song.",
        "difficulty": "B2"
    },
    {
        "english": "selection",
        "bengali": "নির্বাচন",
        "meaning": "The action or fact of carefully choosing someone or something as being the best or most suitable.",
        "type": "noun",
        "example": "The hotel has a good selection of wines.",
        "difficulty": "B2"
    },
    {
        "english": "self",
        "bengali": "আত্ম",
        "meaning": "A person's essential being that distinguishes them from others, especially considered as the object of introspection or reflexive action.",
        "type": "noun",
        "example": "He is very selfish.",
        "difficulty": "B2"
    },
    {
        "english": "sell",
        "bengali": "বিক্রি করা",
        "meaning": "Give or hand over (something) in exchange for money.",
        "type": "verb",
        "example": "I want to sell my car.",
        "difficulty": "A1"
    },
    {
        "english": "senate",
        "bengali": "সিনেট",
        "meaning": "The smaller upper assembly in the US Congress, most US states, France, and other countries.",
        "type": "noun",
        "example": "The bill was passed by the Senate.",
        "difficulty": "B2"
    },
    {
        "english": "senator",
        "bengali": "সিনেটর",
        "meaning": "A member of a senate.",
        "type": "noun",
        "example": "He is a senator from California.",
        "difficulty": "B2"
    },
    {
        "english": "send",
        "bengali": "পাঠানো",
        "meaning": "Cause (a letter, package, or message) to go or be taken to a particular destination.",
        "type": "verb",
        "example": "I will send you a letter.",
        "difficulty": "A1"
    },
    {
        "english": "senior",
        "bengali": "জ্যেষ্ঠ",
        "meaning": "Of a more advanced age.",
        "type": "adjective",
        "example": "He is a senior employee.",
        "difficulty": "B2"
    },
    {
        "english": "sense",
        "bengali": "অনুভূতি",
        "meaning": "A faculty by which the body perceives an external stimulus; one of the faculties of sight, smell, hearing, taste, and touch.",
        "type": "noun, verb",
        "example": "He has a good sense of humor.",
        "difficulty": "A2"
    },
    {
        "english": "sensible",
        "bengali": "বিচক্ষণ",
        "meaning": "(of a statement or course of action) chosen in accordance with wisdom or prudence; likely to be of benefit.",
        "type": "adjective",
        "example": "That was a sensible decision.",
        "difficulty": "B1"
    },
    {
        "english": "sensitive",
        "bengali": "সংবেদনশীল",
        "meaning": "Quick to detect or respond to slight changes, signals, or influences.",
        "type": "adjective",
        "example": "She is a very sensitive person.",
        "difficulty": "B2"
    },
    {
        "english": "sentence",
        "bengali": "বাক্য",
        "meaning": "A set of words that is complete in itself, typically containing a subject and predicate, conveying a statement, question, exclamation, or command, and consisting of a main clause and sometimes one or more subordinate clauses.",
        "type": "noun, verb",
        "example": "Please write a sentence.",
        "difficulty": "A1"
    },
    {
        "english": "separate",
        "bengali": "আলাদা",
        "meaning": "Forming or viewed as a unit apart or by itself.",
        "type": "adjective, verb",
        "example": "We have separate rooms.",
        "difficulty": "A2"
    },
    {
        "english": "September",
        "bengali": "সেপ্টেম্বর",
        "meaning": "The ninth month of the year, in the northern hemisphere the first month of autumn.",
        "type": "noun",
        "example": "My birthday is in September.",
        "difficulty": "A1"
    },
    {
        "english": "sequence",
        "bengali": "ক্রম",
        "meaning": "A particular order in which related events, movements, or things follow each other.",
        "type": "noun",
        "example": "The movie has a strange sequence of events.",
        "difficulty": "B2"
    },
    {
        "english": "series",
        "bengali": "সিরিজ",
        "meaning": "A number of things, events, or people of a similar kind or related nature coming one after another.",
        "type": "noun",
        "example": "This is a new TV series.",
        "difficulty": "A2"
    },
    {
        "english": "serious",
        "bengali": "গুরুতর",
        "meaning": "Demanding or characterized by careful consideration or application.",
        "type": "adjective",
        "example": "This is a serious problem.",
        "difficulty": "A2"
    },
    {
        "english": "seriously",
        "bengali": "গুরুতরভাবে",
        "meaning": "In a solemn or considered manner.",
        "type": "adverb",
        "example": "He was seriously injured in the accident.",
        "difficulty": "B1"
    },
    {
        "english": "servant",
        "bengali": "চাকর",
        "meaning": "A person who performs duties for others, especially a person employed in a house on domestic duties or as a personal attendant.",
        "type": "noun",
        "example": "She has a servant to do the housework.",
        "difficulty": "B1"
    },
    {
        "english": "serve",
        "bengali": "পরিবেশন করা",
        "meaning": "Perform duties or services for (another person or an organization).",
        "type": "verb",
        "example": "The waiter is serving the food.",
        "difficulty": "A2"
    },
    {
        "english": "service",
        "bengali": "সেবা",
        "meaning": "The action of helping or doing work for someone.",
        "type": "noun",
        "example": "The service at this restaurant is very good.",
        "difficulty": "A2"
    },
    {
        "english": "session",
        "bengali": "অধিবেশন",
        "meaning": "A meeting of a deliberative or judicial body to conduct its business.",
        "type": "noun",
        "example": "The conference has a morning and an afternoon session.",
        "difficulty": "B2"
    },
    {
        "english": "set (put)",
        "bengali": "স্থাপন করা",
        "meaning": "Put, lay, or stand (something) in a specified place or position.",
        "type": "verb",
        "example": "Please set the table.",
        "difficulty": "B1"
    },
    {
        "english": "set (group)",
        "bengali": "সেট",
        "meaning": "A group or collection of things that belong together or resemble one another or are usually found together.",
        "type": "noun",
        "example": "I have a new set of tools.",
        "difficulty": "B1"
    },
    {
        "english": "setting",
        "bengali": "সেটিং",
        "meaning": "The place or type of surroundings where something is positioned or where an event takes place.",
        "type": "noun",
        "example": "The setting of the story is in a small village.",
        "difficulty": "B1"
    },
    {
        "english": "settle",
        "bengali": "নিষ্পত্তি করা",
        "meaning": "Resolve or reach an agreement about (an argument or problem).",
        "type": "verb",
        "example": "We need to settle this matter.",
        "difficulty": "B2"
    },
    {
        "english": "seven",
        "bengali": "সাত",
        "meaning": "Equivalent to the sum of three and four; one more than six; 7.",
        "type": "number",
        "example": "There are seven days in a week.",
        "difficulty": "A1"
    },
    {
        "english": "seventeen",
        "bengali": "সতেরো",
        "meaning": "Equivalent to the sum of ten and seven; one more than sixteen; 17.",
        "type": "number",
        "example": "She is seventeen years old.",
        "difficulty": "A1"
    },
    {
        "english": "seventy",
        "bengali": "সত্তর",
        "meaning": "The number equivalent to the product of seven and ten; 70.",
        "type": "number",
        "example": "My grandfather is seventy years old.",
        "difficulty": "A1"
    },
    {
        "english": "several",
        "bengali": "বেশ কয়েকটি",
        "meaning": "More than two but not many.",
        "type": "determiner, pronoun",
        "example": "I have several books on this topic.",
        "difficulty": "A2"
    },
    {
        "english": "severe",
        "bengali": "তীব্র",
        "meaning": "(of something bad or undesirable) very great; intense.",
        "type": "adjective",
        "example": "He is suffering from a severe headache.",
        "difficulty": "B2"
    },
    {
        "english": "sex",
        "bengali": "লিঙ্গ",
        "meaning": "Either of the two main categories (male and female) into which humans and most other living things are divided on the basis of their reproductive functions.",
        "type": "noun",
        "example": "Please state your name, age, and sex.",
        "difficulty": "B1"
    },
    {
        "english": "sexual",
        "bengali": "যৌন",
        "meaning": "Relating to the instincts, physiological processes, and activities connected with physical attraction or intimate physical contact between individuals.",
        "type": "adjective",
        "example": "The book is about sexual health.",
        "difficulty": "B1"
    },
    {
        "english": "shade",
        "bengali": "ছায়া",
        "meaning": "Comparative darkness and coolness caused by shelter from direct sunlight.",
        "type": "noun",
        "example": "Let's sit in the shade of the tree.",
        "difficulty": "B2"
    },
    {
        "english": "shadow",
        "bengali": "ছায়া",
        "meaning": "A dark area or shape produced by a body coming between rays of light and a surface.",
        "type": "noun",
        "example": "The tree cast a long shadow.",
        "difficulty": "B2"
    },
    {
        "english": "shake",
        "bengali": "ঝাঁকুনি",
        "meaning": "(of a structure or area of land) tremble or vibrate.",
        "type": "verb, noun",
        "example": "The house shook during the earthquake.",
        "difficulty": "A2"
    },
    {
        "english": "shall",
        "bengali": "করব",
        "meaning": "(in the first person) expressing the future tense.",
        "type": "modal verb",
        "example": "I shall be there at 8 o'clock.",
        "difficulty": "B2"
    },
    {
        "english": "shallow",
        "bengali": "অগভীর",
        "meaning": "Of little depth.",
        "type": "adjective",
        "example": "The river is shallow here.",
        "difficulty": "B2"
    },
    {
        "english": "shame",
        "bengali": "লজ্জা",
        "meaning": "A painful feeling of humiliation or distress caused by the consciousness of wrong or foolish behavior.",
        "type": "noun",
        "example": "He felt a sense of shame.",
        "difficulty": "B2"
    },
    {
        "english": "shape",
        "bengali": "আকৃতি",
        "meaning": "The external form or appearance characteristic of someone or something; the outline of an area or figure.",
        "type": "noun, verb",
        "example": "The box is a square shape.",
        "difficulty": "A2"
    },
    {
        "english": "share",
        "bengali": "ভাগ করা",
        "meaning": "Have a portion of (something) with another or others.",
        "type": "verb, noun",
        "example": "Please share your food with me.",
        "difficulty": "A1"
    },
    {
        "english": "sharp",
        "bengali": "ধারালো",
        "meaning": "Having an edge or point that is able to cut or pierce something.",
        "type": "adjective",
        "example": "This knife is very sharp.",
        "difficulty": "B1"
    },
    {
        "english": "she",
        "bengali": "সে",
        "meaning": "Used to refer to a woman, girl, or female animal previously mentioned or easily identified.",
        "type": "pronoun",
        "example": "She is my sister.",
        "difficulty": "A1"
    },
    {
        "english": "sheep",
        "bengali": "ভেড়া",
        "meaning": "A domesticated ruminant animal with a thick woolly coat and (typically only in the male) curving horns. It is kept in flocks for its wool or meat.",
        "type": "noun",
        "example": "The farmer has a flock of sheep.",
        "difficulty": "A1"
    },
    {
        "english": "sheet",
        "bengali": "চাদর",
        "meaning": "A large rectangular piece of cotton or other fabric, used on a bed to lie on or under.",
        "type": "noun",
        "example": "I need to change the sheets on my bed.",
        "difficulty": "A2"
    },
    {
        "english": "shelf",
        "bengali": "তাক",
        "meaning": "A flat length of wood or other rigid material, attached to a wall or forming part of a piece of furniture, that provides a surface for the storage or display of objects.",
        "type": "noun",
        "example": "The book is on the shelf.",
        "difficulty": "B1"
    },
    {
        "english": "shell",
        "bengali": "খোলস",
        "meaning": "The hard protective outer case of a mollusk or crustacean.",
        "type": "noun",
        "example": "I found a beautiful shell on the beach.",
        "difficulty": "B1"
    },
    {
        "english": "shelter",
        "bengali": "আশ্রয়",
        "meaning": "A place giving temporary protection from bad weather or danger.",
        "type": "noun, verb",
        "example": "We took shelter from the rain.",
        "difficulty": "B2"
    },
    {
        "english": "shift",
        "bengali": "স্থানান্তর",
        "meaning": "Move or cause to move from one place to another, especially over a small distance.",
        "type": "noun, verb",
        "example": "Can you help me shift this table?",
        "difficulty": "B1"
    },
    {
        "english": "shine",
        "bengali": "জ্বলজ্বল করা",
        "meaning": "(of the sun or another source of light) give out a bright light.",
        "type": "verb",
        "example": "The sun is shining.",
        "difficulty": "B1"
    },
    {
        "english": "shiny",
        "bengali": "চকচকে",
        "meaning": "(of a smooth surface) reflecting light, typically because very clean or polished.",
        "type": "adjective",
        "example": "She has shiny hair.",
        "difficulty": "B1"
    },
    {
        "english": "ship",
        "bengali": "জাহাজ",
        "meaning": "A large boat for transporting people or goods by sea or other large bodies of water.",
        "type": "noun, verb",
        "example": "The ship is sailing to Dhaka.",
        "difficulty": "A2"
    },
    {
        "english": "shirt",
        "bengali": "শার্ট",
        "meaning": "A garment for the upper body made of cotton or a similar fabric, with a collar and sleeves, and buttons down the front.",
        "type": "noun",
        "example": "He is wearing a white shirt.",
        "difficulty": "A1"
    },
    {
        "english": "shock",
        "bengali": "ধাক্কা",
        "meaning": "A sudden upsetting or surprising event or experience.",
        "type": "noun, verb",
        "example": "The news came as a great shock.",
        "difficulty": "B2"
    },
    {
        "english": "shocked",
        "bengali": "হতবাক",
        "meaning": "Cause (someone) to feel surprised and upset.",
        "type": "adjective",
        "example": "I was shocked to hear the news.",
        "difficulty": "B2"
    },
    {
        "english": "shoe",
        "bengali": "জুতা",
        "meaning": "A covering for the foot, typically made of leather, having a sturdy sole and not reaching above the ankle.",
        "type": "noun",
        "example": "I need a new pair of shoes.",
        "difficulty": "A1"
    },
    {
        "english": "shoot",
        "bengali": "গুলি করা",
        "meaning": "Kill or wound (a person or animal) with a bullet or arrow.",
        "type": "verb",
        "example": "The police shot the robber.",
        "difficulty": "B1"
    },
    {
        "english": "shooting",
        "bengali": "শুটিং",
        "meaning": "The action or practice of shooting with a gun.",
        "type": "noun",
        "example": "There was a shooting in the city center.",
        "difficulty": "B2"
    },
    {
        "english": "shop",
        "bengali": "দোকান",
        "meaning": "A building or part of a building where goods or services are sold.",
        "type": "noun, verb",
        "example": "I am going to the shop.",
        "difficulty": "A1"
    },
    {
        "english": "shopping",
        "bengali": "কেনাকাটা",
        "meaning": "The action or activity of buying goods from shops.",
        "type": "noun",
        "example": "I like to go shopping.",
        "difficulty": "A1"
    },
    {
        "english": "short",
        "bengali": "ছোট",
        "meaning": "Measuring a small distance from end to end.",
        "type": "adjective",
        "example": "She has short hair.",
        "difficulty": "A1"
    },
    {
        "english": "shot",
        "bengali": "শট",
        "meaning": "The firing of a gun or cannon.",
        "type": "noun",
        "example": "I heard a shot.",
        "difficulty": "B2"
    },
    {
        "english": "should",
        "bengali": "উচিত",
        "meaning": "Used to indicate obligation, duty, or correctness, typically when criticizing someone's actions.",
        "type": "modal verb",
        "example": "You should do your homework.",
        "difficulty": "A1"
    },
    {
        "english": "shoulder",
        "bengali": "কাঁধ",
        "meaning": "The upper joint of the human arm and the part of the body between this and the neck.",
        "type": "noun",
        "example": "I have a pain in my shoulder.",
        "difficulty": "A2"
    },
    {
        "english": "shout",
        "bengali": "চিৎকার করা",
        "meaning": "(of a person) utter a loud call or cry, typically as an expression of a strong emotion.",
        "type": "verb, noun",
        "example": "Please don't shout.",
        "difficulty": "A2"
    },
    {
        "english": "show",
        "bengali": "প্রদর্শন করা",
        "meaning": "Allow or cause to be visible.",
        "type": "verb, noun",
        "example": "Can you show me the way?",
        "difficulty": "A1"
    },
    {
        "english": "shower",
        "bengali": "ঝরনা",
        "meaning": "A cubicle or bath in which a person stands under a spray of water to wash.",
        "type": "noun",
        "example": "I'm going to take a shower.",
        "difficulty": "A1"
    },
    {
        "english": "shut",
        "bengali": "বন্ধ করা",
        "meaning": "Move (something) into a position so as to block an opening; close.",
        "type": "verb, adjective",
        "example": "Please shut the door.",
        "difficulty": "A2"
    },
    {
        "english": "shy",
        "bengali": "লাজুক",
        "meaning": "Nervous or timid in the company of other people.",
        "type": "adjective",
        "example": "She is a shy person.",
        "difficulty": "B1"
    },
    {
        "english": "sick",
        "bengali": "অসুস্থ",
        "meaning": "Affected by physical or mental illness.",
        "type": "adjective",
        "example": "I am sick.",
        "difficulty": "A1"
    },
    {
        "english": "side",
        "bengali": "পাশ",
        "meaning": "A position to the left or right of an object, place, or central point.",
        "type": "noun",
        "example": "The house is on the other side of the street.",
        "difficulty": "A2"
    },
    {
        "english": "sight",
        "bengali": "দৃষ্টি",
        "meaning": "The faculty or power of seeing.",
        "type": "noun",
        "example": "He lost his sight in an accident.",
        "difficulty": "B1"
    },
    {
        "english": "sign",
        "bengali": "চিহ্ন",
        "meaning": "A gesture or action used to convey information or instructions.",
        "type": "noun, verb",
        "example": "This is a good sign.",
        "difficulty": "A2"
    },
    {
        "english": "signal",
        "bengali": "সংকেত",
        "meaning": "A gesture, action, or sound that is used to convey information or instructions, typically by prearrangement between the parties concerned.",
        "type": "noun, verb",
        "example": "He gave me a signal to start.",
        "difficulty": "B1"
    },
    {
        "english": "significant",
        "bengali": "তাৎপর্যপূর্ণ",
        "meaning": "Sufficiently great or important to be worthy of attention; noteworthy.",
        "type": "adjective",
        "example": "This is a significant discovery.",
        "difficulty": "B2"
    },
    {
        "english": "significantly",
        "bengali": "উল্লেখযোগ্যভাবে",
        "meaning": "In a sufficiently great or important way as to be worthy of attention.",
        "type": "adverb",
        "example": "The price has increased significantly.",
        "difficulty": "B2"
    },
    {
        "english": "silence",
        "bengali": "নীরবতা",
        "meaning": "Complete absence of sound.",
        "type": "noun",
        "example": "There was a complete silence in the room.",
        "difficulty": "B2"
    },
    {
        "english": "silent",
        "bengali": "নীরব",
        "meaning": "Not making or accompanied by any sound.",
        "type": "adjective",
        "example": "Please be silent.",
        "difficulty": "B1"
    },
    {
        "english": "silk",
        "bengali": "রেশম",
        "meaning": "A fine, strong, soft, lustrous fiber produced by silkworms in making cocoons and collected to make thread and fabric.",
        "type": "noun",
        "example": "The dress is made of silk.",
        "difficulty": "B2"
    },
    {
        "english": "silly",
        "bengali": "নির্বোধ",
        "meaning": "Having or showing a lack of common sense or judgment; absurd and foolish.",
        "type": "adjective",
        "example": "That was a silly thing to do.",
        "difficulty": "B1"
    },
    {
        "english": "silver",
        "bengali": "রূপা",
        "meaning": "A precious shiny grayish-white metal, the chemical element of atomic number 47.",
        "type": "noun, adjective",
        "example": "The ring is made of silver.",
        "difficulty": "A2"
    },
    {
        "english": "similar",
        "bengali": "একই রকম",
        "meaning": "Resembling without being identical.",
        "type": "adjective",
        "example": "We have similar interests.",
        "difficulty": "A1"
    },
    {
        "english": "similarity",
        "bengali": "সাদৃশ্য",
        "meaning": "The state or fact of being similar.",
        "type": "noun",
        "example": "There is a great similarity between the two sisters.",
        "difficulty": "B1"
    },
    {
        "english": "similarly",
        "bengali": "একইভাবে",
        "meaning": "In a similar way.",
        "type": "adverb",
        "example": "The two brothers dress similarly.",
        "difficulty": "B1"
    },
    {
        "english": "simple",
        "bengali": "সরল",
        "meaning": "Easily understood or done; presenting no difficulty.",
        "type": "adjective",
        "example": "This is a simple question.",
        "difficulty": "A2"
    },
    {
        "english": "simply",
        "bengali": "সহজভাবে",
        "meaning": "In a straightforward or plain manner.",
        "type": "adverb",
        "example": "I simply don't have the time.",
        "difficulty": "B1"
    },
    {
        "english": "since",
        "bengali": "থেকে",
        "meaning": "In the intervening period between (the time mentioned) and the time under consideration, typically the present.",
        "type": "preposition, conjunction, adverb",
        "example": "I have been waiting for you since morning.",
        "difficulty": "A2"
    },
    {
        "english": "sincere",
        "bengali": "আন্তরিক",
        "meaning": "Free from pretense or deceit; proceeding from genuine feelings.",
        "type": "adjective",
        "example": "He is a sincere person.",
        "difficulty": "B2"
    },
    {
        "english": "sing",
        "bengali": "গান করা",
        "meaning": "Make musical sounds with the voice, especially words with a set tune.",
        "type": "verb",
        "example": "I like to sing.",
        "difficulty": "A1"
    },
    {
        "english": "singer",
        "bengali": "গায়ক",
        "meaning": "A person who sings, especially professionally.",
        "type": "noun",
        "example": "He is a famous singer.",
        "difficulty": "A1"
    },
    {
        "english": "singing",
        "bengali": "গান",
        "meaning": "The activity of making musical sounds with the voice.",
        "type": "noun",
        "example": "Singing is her hobby.",
        "difficulty": "A2"
    },
    {
        "english": "single",
        "bengali": "একক",
        "meaning": "Only one; not one of several.",
        "type": "adjective, noun",
        "example": "I am single.",
        "difficulty": "A2"
    },
    {
        "english": "sink",
        "bengali": "ডুবে যাওয়া",
        "meaning": "Go down below the surface of something, especially of a liquid; become submerged.",
        "type": "verb",
        "example": "The ship is sinking.",
        "difficulty": "B1"
    },
    {
        "english": "sir",
        "bengali": "স্যার",
        "meaning": "Used as a polite or respectful way of addressing a man, especially one in a position of authority.",
        "type": "noun",
        "example": "Yes, sir.",
        "difficulty": "A2"
    },
    {
        "english": "sister",
        "bengali": "বোন",
        "meaning": "A woman or girl who has one or both parents in common with another person.",
        "type": "noun",
        "example": "I have a sister.",
        "difficulty": "A1"
    },
    {
        "english": "sit",
        "bengali": "বসা",
        "meaning": "Adopt or be in a position in which one's weight is supported by one's buttocks rather than one's feet and one's back is upright.",
        "type": "verb",
        "example": "Please sit down.",
        "difficulty": "A1"
    },
    {
        "english": "site",
        "bengali": "সাইট",
        "meaning": "An area of ground on which a town, building, or monument is constructed.",
        "type": "noun",
        "example": "This is the site for the new hospital.",
        "difficulty": "A2"
    },
    {
        "english": "situation",
        "bengali": "পরিস্থিতি",
        "meaning": "A set of circumstances in which one finds oneself; a state of affairs.",
        "type": "noun",
        "example": "This is a difficult situation.",
        "difficulty": "A1"
    },
    {
        "english": "six",
        "bengali": "ছয়",
        "meaning": "Equivalent to the product of two and three; one more than five, or four less than ten; 6.",
        "type": "number",
        "example": "I have six books.",
        "difficulty": "A1"
    },
    {
        "english": "sixteen",
        "bengali": "ষোল",
        "meaning": "Equivalent to the sum of ten and six; one more than fifteen; 16.",
        "type": "number",
        "example": "She is sixteen years old.",
        "difficulty": "A1"
    },
    {
        "english": "sixty",
        "bengali": "ষাট",
        "meaning": "The number equivalent to the product of six and ten; ten less than seventy; 60.",
        "type": "number",
        "example": "My grandfather is sixty years old.",
        "difficulty": "A1"
    },
    {
        "english": "size",
        "bengali": "আকার",
        "meaning": "The relative extent of something; a thing's overall dimensions or magnitude; how large something is.",
        "type": "noun",
        "example": "What size are your shoes?",
        "difficulty": "A2"
    },
    {
        "english": "ski",
        "bengali": "স্কি",
        "meaning": "Each of a pair of long narrow runners of wood, plastic, or metal that are attached to boots for traveling over snow.",
        "type": "verb, noun",
        "example": "I like to ski in the winter.",
        "difficulty": "A2"
    },
    {
        "english": "skiing",
        "bengali": "স্কিইং",
        "meaning": "The action of traveling over snow on skis, especially as a sport or recreation.",
        "type": "noun",
        "example": "Skiing is a popular winter sport.",
        "difficulty": "A2"
    },
    {
        "english": "skill",
        "bengali": "দক্ষতা",
        "meaning": "The ability to do something well; expertise.",
        "type": "noun",
        "example": "He has great skill in playing the piano.",
        "difficulty": "A1"
    },
    {
        "english": "skin",
        "bengali": "ত্বক",
        "meaning": "The thin layer of tissue forming the natural outer covering of the body of a person or animal.",
        "type": "noun",
        "example": "She has beautiful skin.",
        "difficulty": "A2"
    },
    {
        "english": "skirt",
        "bengali": "স্কার্ট",
        "meaning": "A woman's outer garment fastened around the waist and hanging down around the legs.",
        "type": "noun",
        "example": "She is wearing a beautiful skirt.",
        "difficulty": "A1"
    },
    {
        "english": "sky",
        "bengali": "আকাশ",
        "meaning": "The region of the atmosphere and outer space seen from the earth.",
        "type": "noun",
        "example": "The sky is blue.",
        "difficulty": "A2"
    },
    {
        "english": "slave",
        "bengali": "দাস",
        "meaning": "A person who is the legal property of another and is forced to obey them.",
        "type": "noun",
        "example": "He was a slave.",
        "difficulty": "B1"
    },
    {
        "english": "sleep",
        "bengali": "ঘুমানো",
        "meaning": "A condition of body and mind such as that which typically recurs for several hours every night, in which the nervous system is inactive, the eyes closed, the postural muscles relaxed, and consciousness practically suspended.",
        "type": "verb, noun",
        "example": "I need to get some sleep.",
        "difficulty": "A1"
    },
    {
        "english": "slice",
        "bengali": "স্লাইস",
        "meaning": "A thin, broad piece of food, such as bread, meat, or cake, cut from a larger portion.",
        "type": "noun, verb",
        "example": "I would like a slice of cake.",
        "difficulty": "B1"
    },
    {
        "english": "slide",
        "bengali": "স্লাইড",
        "meaning": "Move along a smooth surface while maintaining continuous contact with it.",
        "type": "verb, noun",
        "example": "The children are playing on the slide.",
        "difficulty": "B2"
    },
    {
        "english": "slight",
        "bengali": "সামান্য",
        "meaning": "Small in degree; inconsiderable.",
        "type": "adjective",
        "example": "There is a slight chance of rain.",
        "difficulty": "B2"
    },
    {
        "english": "slightly",
        "bengali": "সামান্য",
        "meaning": "To a small degree; not considerably.",
        "type": "adverb",
        "example": "I am slightly tired.",
        "difficulty": "B1"
    },
    {
        "english": "slip",
        "bengali": "স্লিপ",
        "meaning": "An act of sliding unintentionally for a short distance.",
        "type": "verb",
        "example": "Be careful not to slip on the wet floor.",
        "difficulty": "B2"
    },
    {
        "english": "slope",
        "bengali": "ঢাল",
        "meaning": "A surface of which one end or side is at a higher level than another; a rising or falling surface.",
        "type": "noun, verb",
        "example": "The house is built on a slope.",
        "difficulty": "B2"
    },
    {
        "english": "slow",
        "bengali": "ধীর",
        "meaning": "Moving or operating, or designed to do so, only at a low speed; not quick or fast.",
        "type": "adjective, verb",
        "example": "He is a slow runner.",
        "difficulty": "A1"
    },
    {
        "english": "slowly",
        "bengali": "ধীরে ধীরে",
        "meaning": "At a slow speed.",
        "type": "adverb",
        "example": "Please speak slowly.",
        "difficulty": "A2"
    },
    {
        "english": "small",
        "bengali": "ছোট",
        "meaning": "Of a size that is less than normal or usual.",
        "type": "adjective",
        "example": "This is a small house.",
        "difficulty": "A1"
    },
    {
        "english": "smart",
        "bengali": "স্মার্ট",
        "meaning": "Having or showing a quick-witted intelligence.",
        "type": "adjective",
        "example": "She is a smart student.",
        "difficulty": "A1"
    },
    {
        "english": "smartphone",
        "bengali": "স্মার্টফোন",
        "meaning": "A mobile phone that performs many of the functions of a computer, typically having a touchscreen interface, internet access, and an operating system capable of running downloaded apps.",
        "type": "noun",
        "example": "I have a new smartphone.",
        "difficulty": "A2"
    },
    {
        "english": "smell",
        "bengali": "গন্ধ",
        "meaning": "The faculty or power of perceiving odors or scents by means of the organs in the nose.",
        "type": "verb, noun",
        "example": "I can smell something burning.",
        "difficulty": "A2"
    },
    {
        "english": "smile",
        "bengali": "হাসি",
        "meaning": "Form one's features into a pleased, kind, or amused expression, typically with the corners of the mouth turned up and the front teeth exposed.",
        "type": "verb, noun",
        "example": "She has a beautiful smile.",
        "difficulty": "A2"
    },
    {
        "english": "smoke",
        "bengali": "ধোঁয়া",
        "meaning": "A visible suspension of carbon or other particles in air, typically one emitted from a burning substance.",
        "type": "noun, verb",
        "example": "The house is full of smoke.",
        "difficulty": "A2"
    },
    {
        "english": "smoking",
        "bengali": "ধূমপান",
        "meaning": "The action or habit of inhaling and exhaling the smoke of tobacco or a drug.",
        "type": "noun",
        "example": "Smoking is bad for your health.",
        "difficulty": "A2"
    },
    {
        "english": "smooth",
        "bengali": "মসৃণ",
        "meaning": "Having an even and regular surface or consistency; free from perceptible projections, lumps, or indentations.",
        "type": "adjective",
        "example": "The surface is very smooth.",
        "difficulty": "B1"
    },
    {
        "english": "snake",
        "bengali": "সাপ",
        "meaning": "A long limbless reptile that has no eyelids, a short tail, and jaws that are capable of considerable extension. Some snakes have a venomous bite.",
        "type": "noun",
        "example": "I saw a snake in the garden.",
        "difficulty": "A1"
    },
    {
        "english": "sneaker",
        "bengali": "স্নিকার",
        "meaning": "A soft shoe worn for sports or casual occasions.",
        "type": "noun",
        "example": "I need a new pair of sneakers.",
        "difficulty": "A2"
    },
    {
        "english": "snow",
        "bengali": "তুষার",
        "meaning": "Atmospheric water vapor frozen into ice crystals and falling in light white flakes or lying on the ground as a white layer.",
        "type": "noun, verb",
        "example": "It's snowing outside.",
        "difficulty": "A1"
    },
    {
        "english": "so",
        "bengali": "তাই",
        "meaning": "And for this reason; therefore.",
        "type": "adverb, conjunction",
        "example": "I was tired, so I went to bed.",
        "difficulty": "A1"
    },
    {
        "english": "soap",
        "bengali": "সাবান",
        "meaning": "A substance used with water for washing and cleaning, made of a compound of natural oils or fats with sodium hydroxide or another strong alkali, and typically having perfume and coloring added.",
        "type": "noun",
        "example": "I need to buy some soap.",
        "difficulty": "A2"
    },
    {
        "english": "soccer",
        "bengali": "সকার",
        "meaning": "A form of football played by two teams of eleven players with a round ball that may not be touched with the hands or arms during play except by the goalkeepers. The object of the game is to score by kicking or heading the ball into the opponents' goal.",
        "type": "noun",
        "example": "I like to play soccer.",
        "difficulty": "A2"
    },
    {
        "english": "social",
        "bengali": "সামাজিক",
        "meaning": "Relating to society or its organization.",
        "type": "adjective",
        "example": "Humans are social animals.",
        "difficulty": "A2"
    },
    {
        "english": "society",
        "bengali": "সমাজ",
        "meaning": "The aggregate of people living together in a more or less ordered community.",
        "type": "noun",
        "example": "We live in a modern society.",
        "difficulty": "A2"
    },
    {
        "english": "sock",
        "bengali": "মোজা",
        "meaning": "A garment for the foot and lower part of the leg, typically knitted from wool, cotton, or nylon.",
        "type": "noun",
        "example": "I need a new pair of socks.",
        "difficulty": "A2"
    },
    {
        "english": "soft",
        "bengali": "নরম",
        "meaning": "Easy to mold, cut, compress, or fold; not hard or firm to the touch.",
        "type": "adjective",
        "example": "The bed is very soft.",
        "difficulty": "A2"
    },
    {
        "english": "software",
        "bengali": "সফ্টওয়্যার",
        "meaning": "The programs and other operating information used by a computer.",
        "type": "noun",
        "example": "I need to install new software on my computer.",
        "difficulty": "B1"
    },
    {
        "english": "soil",
        "bengali": "মাটি",
        "meaning": "The upper layer of earth in which plants grow, a black or dark brown material typically consisting of a mixture of organic remains, clay, and rock particles.",
        "type": "noun",
        "example": "The soil is very fertile here.",
        "difficulty": "B1"
    },
    {
        "english": "solar",
        "bengali": "সৌর",
        "meaning": "Relating to or determined by the sun.",
        "type": "adjective",
        "example": "Solar energy is a renewable source of energy.",
        "difficulty": "B2"
    },
    {
        "english": "soldier",
        "bengali": "সৈনিক",
        "meaning": "A person who serves in an army.",
        "type": "noun",
        "example": "He is a brave soldier.",
        "difficulty": "A2"
    },
    {
        "english": "solid",
        "bengali": "কঠিন",
        "meaning": "Firm and stable in shape; not liquid or fluid.",
        "type": "adjective, noun",
        "example": "Ice is a solid.",
        "difficulty": "B1"
    },
    {
        "english": "solution",
        "bengali": "সমাধান",
        "meaning": "A means of solving a problem or dealing with a difficult situation.",
        "type": "noun",
        "example": "We need to find a solution to this problem.",
        "difficulty": "A2"
    },
    {
        "english": "solve",
        "bengali": "সমাধান করা",
        "meaning": "Find an answer to, explanation for, or means of effectively dealing with (a problem or mystery).",
        "type": "verb",
        "example": "I can't solve this problem.",
        "difficulty": "A2"
    },
    {
        "english": "some",
        "bengali": "কিছু",
        "meaning": "An unspecified amount or number of.",
        "type": "determiner, pronoun",
        "example": "I need some help.",
        "difficulty": "A1"
    },
    {
        "english": "somebody",
        "bengali": "কেউ",
        "meaning": "Someone.",
        "type": "pronoun",
        "example": "Somebody is at the door.",
        "difficulty": "A1"
    },
    {
        "english": "someone",
        "bengali": "কেউ",
        "meaning": "An unknown or unspecified person; some person.",
        "type": "pronoun",
        "example": "Someone is calling you.",
        "difficulty": "A1"
    },
    {
        "english": "something",
        "bengali": "কিছু",
        "meaning": "A thing that is unspecified or unknown.",
        "type": "pronoun",
        "example": "I have something for you.",
        "difficulty": "A1"
    },
    {
        "english": "sometimes",
        "bengali": "মাঝে মাঝে",
        "meaning": "Occasionally, rather than all of the time.",
        "type": "adverb",
        "example": "I sometimes go to the cinema.",
        "difficulty": "A1"
    },
    {
        "english": "somewhat",
        "bengali": "কিছুটা",
        "meaning": "To a moderate extent or degree.",
        "type": "adverb",
        "example": "I am somewhat tired.",
        "difficulty": "B2"
    },
    {
        "english": "somewhere",
        "bengali": "কোথাও",
        "meaning": "In or to some place.",
        "type": "adverb, pronoun",
        "example": "I have seen him somewhere before.",
        "difficulty": "A2"
    },
    {
        "english": "son",
        "bengali": "পুত্র",
        "meaning": "A boy or man in relation to either of his parents.",
        "type": "noun",
        "example": "He is my son.",
        "difficulty": "A1"
    },
    {
        "english": "song",
        "bengali": "গান",
        "meaning": "A short poem or other set of words set to music or meant to be sung.",
        "type": "noun",
        "example": "I like this song.",
        "difficulty": "A1"
    },
    {
        "english": "soon",
        "bengali": "শীঘ্রই",
        "meaning": "In or after a short time.",
        "type": "adverb",
        "example": "I will be back soon.",
        "difficulty": "A1"
    },
    {
        "english": "sorry",
        "bengali": "দুঃখিত",
        "meaning": "Feeling distress, especially through sympathy with someone else's misfortune.",
        "type": "adjective, exclamation",
        "example": "I am sorry for your loss.",
        "difficulty": "A1"
    },
    {
        "english": "sort",
        "bengali": "ধরণ",
        "meaning": "A category of things or people with a common feature; a type.",
        "type": "noun, verb",
        "example": "What sort of music do you like?",
        "difficulty": "A2"
    },
    {
        "english": "soul",
        "bengali": "আত্মা",
        "meaning": "The spiritual or immaterial part of a human being or animal, regarded as immortal.",
        "type": "noun",
        "example": "He has a kind soul.",
        "difficulty": "B2"
    },
    {
        "english": "sound",
        "bengali": "শব্দ",
        "meaning": "Vibrations that travel through the air or another medium and can be heard when they reach a person's or animal's ear.",
        "type": "noun, verb",
        "example": "I heard a strange sound.",
        "difficulty": "A1"
    },
    {
        "english": "soup",
        "bengali": "স্যুপ",
        "meaning": "A liquid dish, typically made by boiling ingredients in stock or water.",
        "type": "noun",
        "example": "I would like some soup.",
        "difficulty": "A1"
    },
    {
        "english": "source",
        "bengali": "উৎস",
        "meaning": "A place, person, or thing from which something comes or can be obtained.",
        "type": "noun",
        "example": "What is the source of this information?",
        "difficulty": "A2"
    },
    {
        "english": "south",
        "bengali": "দক্ষিণ",
        "meaning": "The direction toward the point of the horizon 90° clockwise from east, or the part of the horizon lying in this direction.",
        "type": "noun, adjective, adverb",
        "example": "The birds are flying south for the winter.",
        "difficulty": "A1"
    },
    {
        "english": "southern",
        "bengali": "দক্ষিণাঞ্চলীয়",
        "meaning": "Situated in, directed toward, or facing the south.",
        "type": "adjective",
        "example": "He lives in the southern part of the country.",
        "difficulty": "B1"
    },
    {
        "english": "space",
        "bengali": "স্থান",
        "meaning": "A continuous area or expanse that is free, available, or unoccupied.",
        "type": "noun",
        "example": "There is a lot of space in this room.",
        "difficulty": "A1"
    },
    {
        "english": "speak",
        "bengali": "কথা বলা",
        "meaning": "Say something in order to convey information, an opinion, or a feeling.",
        "type": "verb",
        "example": "Can you speak English?",
        "difficulty": "A1"
    },
    {
        "english": "speaker",
        "bengali": "বক্তা",
        "meaning": "A person who speaks.",
        "type": "noun",
        "example": "The speaker was very engaging.",
        "difficulty": "A2"
    },
    {
        "english": "special",
        "bengali": "বিশেষ",
        "meaning": "Better, greater, or otherwise different from what is usual.",
        "type": "adjective",
        "example": "This is a special occasion.",
        "difficulty": "A1"
    },
    {
        "english": "specialist",
        "bengali": "বিশেষজ্ঞ",
        "meaning": "A person who concentrates primarily on a particular subject or activity; a person highly skilled in a specific and restricted field.",
        "type": "noun",
        "example": "He is a specialist in heart surgery.",
        "difficulty": "B2"
    },
    {
        "english": "specific",
        "bengali": "নির্দিষ্ট",
        "meaning": "Clearly defined or identified.",
        "type": "adjective",
        "example": "I have a specific question.",
        "difficulty": "B1"
    },
    {
        "english": "specifically",
        "bengali": "বিশেষভাবে",
        "meaning": "In a way that is exact and clear; precisely.",
        "type": "adverb",
        "example": "I specifically asked you not to do that.",
        "difficulty": "B1"
    },
    {
        "english": "speech",
        "bengali": "বক্তৃতা",
        "meaning": "The expression of or the ability to express thoughts and feelings by articulate sounds.",
        "type": "noun",
        "example": "He gave a long speech.",
        "difficulty": "A2"
    },
    {
        "english": "speed",
        "bengali": "গতি",
        "meaning": "The rate at which someone or something is able to move or operate.",
        "type": "noun, verb",
        "example": "The car was traveling at a high speed.",
        "difficulty": "A1"
    },
    {
        "english": "spell",
        "bengali": "বানান করা",
        "meaning": "Write or name the letters that form (a word) in correct sequence.",
        "type": "verb",
        "example": "How do you spell your name?",
        "difficulty": "A1"
    },
    {
        "english": "spelling",
        "bengali": "বানান",
        "meaning": "The process or activity of writing or naming the letters of a word.",
        "type": "noun",
        "example": "My spelling is not very good.",
        "difficulty": "A1"
    },
    {
        "english": "spend",
        "bengali": "ব্যয় করা",
        "meaning": "Pay out (money) in buying or hiring goods or services.",
        "type": "verb",
        "example": "I spent a lot of money on this car.",
        "difficulty": "A1"
    },
    {
        "english": "spicy",
        "bengali": "মশলাদার",
        "meaning": "Flavored with or fragrant with spice.",
        "type": "adjective",
        "example": "I like spicy food.",
        "difficulty": "B1"
    },
    {
        "english": "spirit",
        "bengali": "আত্মা",
        "meaning": "The nonphysical part of a person which is the seat of emotions and character; the soul.",
        "type": "noun",
        "example": "He has a kind spirit.",
        "difficulty": "B2"
    },
    {
        "english": "spiritual",
        "bengali": "আধ্যাত্মিক",
        "meaning": "Relating to or affecting the human spirit or soul as opposed to material or physical things.",
        "type": "adjective",
        "example": "She is a very spiritual person.",
        "difficulty": "B2"
    },
    {
        "english": "spite",
        "bengali": "বিদ্বেষ",
        "meaning": "A desire to hurt, annoy, or offend someone.",
        "type": "noun",
        "example": "He did it out of spite.",
        "difficulty": "B2"
    },
    {
        "english": "split",
        "bengali": "ভাগ করা",
        "meaning": "Break or cause to break forcefully into parts, especially into halves or along the grain.",
        "type": "verb, noun",
        "example": "Let's split the bill.",
        "difficulty": "B1"
    },
    {
        "english": "sport",
        "bengali": "খেলা",
        "meaning": "An activity involving physical exertion and skill in which an individual or team competes against another or others for entertainment.",
        "type": "noun",
        "example": "My favorite sport is football.",
        "difficulty": "A1"
    },
    {
        "english": "spot",
        "bengali": "স্থান",
        "meaning": "A small round or roundish mark, differing in color or texture from the surface around it.",
        "type": "noun, verb",
        "example": "This is a good spot for a picnic.",
        "difficulty": "B1"
    },
    {
        "english": "spread",
        "bengali": "ছড়িয়ে পড়া",
        "meaning": "Open out (something) so as to extend its surface area, width, or length.",
        "type": "verb, noun",
        "example": "The fire spread quickly.",
        "difficulty": "B1"
    },
    {
        "english": "spring",
        "bengali": "বসন্ত",
        "meaning": "The season after winter and before summer, in which vegetation begins to appear, in the northern hemisphere from March to May and in the southern hemisphere from September to November.",
        "type": "noun, verb",
        "example": "Spring is my favorite season.",
        "difficulty": "A1"
    },
    {
        "english": "square",
        "bengali": "বর্গক্ষেত্র",
        "meaning": "A plane figure with four equal straight sides and four right angles.",
        "type": "noun, adjective",
        "example": "The room is square.",
        "difficulty": "A2"
    },
    {
        "english": "stable",
        "bengali": "স্থিতিশীল",
        "meaning": "(of an object or structure) not likely to give way or overturn; firmly fixed.",
        "type": "adjective",
        "example": "The patient's condition is stable.",
        "difficulty": "B2"
    },
    {
        "english": "staff",
        "bengali": "কর্মী",
        "meaning": "All the people employed by a particular organization.",
        "type": "noun",
        "example": "The company has a large staff.",
        "difficulty": "B1"
    },
    {
        "english": "stage",
        "bengali": "মঞ্চ",
        "meaning": "A point, period, or step in a process or development.",
        "type": "noun",
        "example": "The project is in its final stage.",
        "difficulty": "A2"
    },
    {
        "english": "stair",
        "bengali": "সিঁড়ি",
        "meaning": "A set of steps leading from one floor of a building to another, typically inside the building.",
        "type": "noun",
        "example": "Be careful on the stairs.",
        "difficulty": "A2"
    },
    {
        "english": "stamp",
        "bengali": "স্ট্যাম্প",
        "meaning": "A small adhesive piece of paper stuck to something to show that an amount of money has been paid, in particular a postage stamp.",
        "type": "noun, verb",
        "example": "I need to buy some stamps.",
        "difficulty": "A2"
    },
    {
        "english": "stand",
        "bengali": "দাঁড়ানো",
        "meaning": "Have or maintain an upright position, supported by one's feet.",
        "type": "verb, noun",
        "example": "Please stand up.",
        "difficulty": "A1"
    },
    {
        "english": "standard",
        "bengali": "মান",
        "meaning": "A level of quality or attainment.",
        "type": "noun, adjective",
        "example": "This is a high-standard hotel.",
        "difficulty": "A2"
    },
    {
        "english": "star",
        "bengali": "তারা",
        "meaning": "A fixed luminous point in the night sky that is a large, remote incandescent body like the sun.",
        "type": "noun",
        "example": "The stars are bright tonight.",
        "difficulty": "A1"
    },
    {
        "english": "stare",
        "bengali": "তাকিয়ে থাকা",
        "meaning": "Look fixedly or vacantly at someone or something with one's eyes wide open.",
        "type": "verb",
        "example": "Don't stare at people.",
        "difficulty": "B2"
    },
    {
        "english": "start",
        "bengali": "শুরু করা",
        "meaning": "Begin or be reckoned from a particular point in time or space.",
        "type": "verb, noun",
        "example": "Let's start the meeting.",
        "difficulty": "A1"
    },
    {
        "english": "state",
        "bengali": "অবস্থা",
        "meaning": "The particular condition that someone or something is in at a specific time.",
        "type": "noun, verb",
        "example": "The country is in a state of emergency.",
        "difficulty": "A2"
    },
    {
        "english": "statement",
        "bengali": "বিবৃতি",
        "meaning": "A definite or clear expression of something in speech or writing.",
        "type": "noun",
        "example": "He made a statement to the police.",
        "difficulty": "A1"
    },
    {
        "english": "station",
        "bengali": "স্টেশন",
        "meaning": "A place on a railway line where trains regularly stop so that passengers can get on or off.",
        "type": "noun",
        "example": "I will meet you at the station.",
        "difficulty": "A1"
    },
    {
        "english": "statistic",
        "bengali": "পরিসংখ্যান",
        "meaning": "A fact or piece of data from a study of a large quantity of numerical data.",
        "type": "noun",
        "example": "This is an interesting statistic.",
        "difficulty": "B1"
    },
    {
        "english": "statue",
        "bengali": "মূর্তি",
        "meaning": "A carved or cast figure of a person or animal, especially one that is life-size or larger.",
        "type": "noun",
        "example": "There is a statue of a famous poet in the park.",
        "difficulty": "B1"
    },
    {
        "english": "status",
        "bengali": "অবস্থা",
        "meaning": "The relative social, professional, or other standing of someone or something.",
        "type": "noun",
        "example": "What is your marital status?",
        "difficulty": "B2"
    },
    {
        "english": "stay",
        "bengali": "থাকা",
        "meaning": "Remain in the same place.",
        "type": "verb, noun",
        "example": "I will stay here for a week.",
        "difficulty": "A1"
    },
    {
        "english": "steady",
        "bengali": "স্থির",
        "meaning": "Firmly fixed, supported, or balanced; not shaking or moving.",
        "type": "adjective",
        "example": "The boat is steady now.",
        "difficulty": "B2"
    },
    {
        "english": "steal",
        "bengali": "চুরি করা",
        "meaning": "Take (another person's property) without permission or legal right and without intending to return it.",
        "type": "verb",
        "example": "Someone stole my wallet.",
        "difficulty": "B2"
    },
    {
        "english": "step",
        "bengali": "পদক্ষেপ",
        "meaning": "An act or movement of putting one leg in front of the other in walking or running.",
        "type": "noun, verb",
        "example": "Take one step forward.",
        "difficulty": "A2"
    },
    {
        "english": "stick",
        "bengali": "লাঠি",
        "meaning": "A thin piece of wood that has fallen or been cut from a tree.",
        "type": "noun, verb",
        "example": "The old man was walking with a stick.",
        "difficulty": "B1"
    },
    {
        "english": "sticky",
        "bengali": "আঠালো",
        "meaning": "Tending or designed to stick to things on contact.",
        "type": "adjective",
        "example": "My hands are sticky.",
        "difficulty": "B2"
    },
    {
        "english": "still",
        "bengali": "এখনো",
        "meaning": "Not moving or making a sound.",
        "type": "adjective, adverb",
        "example": "I am still waiting for you.",
        "difficulty": "A1"
    },
    {
        "english": "stomach",
        "bengali": "পেট",
        "meaning": "The internal organ in which the major part of the digestion of food occurs, being (in humans and many mammals) a pear-shaped enlargement of the alimentary canal linking the esophagus to the small intestine.",
        "type": "noun",
        "example": "I have a pain in my stomach.",
        "difficulty": "A2"
    },
    {
        "english": "stone",
        "bengali": "পাথর",
        "meaning": "Hard solid nonmetallic mineral matter of which rock is made, especially as a building material.",
        "type": "noun",
        "example": "The house is built of stone.",
        "difficulty": "A1"
    },
    {
        "english": "stop",
        "bengali": "থামা",
        "meaning": "(of an event, action, or process) come to an end; cease to happen.",
        "type": "verb, noun",
        "example": "Please stop talking.",
        "difficulty": "A1"
    },
    {
        "english": "store",
        "bengali": "দোকান",
        "meaning": "A place where things are sold.",
        "type": "noun, verb",
        "example": "I am going to the store.",
        "difficulty": "A1"
    },
    {
        "english": "storm",
        "bengali": "ঝড়",
        "meaning": "A violent disturbance of the atmosphere with strong winds and usually rain, thunder, lightning, or snow.",
        "type": "noun",
        "example": "There was a big storm last night.",
        "difficulty": "A2"
    },
    {
        "english": "story",
        "bengali": "গল্প",
        "meaning": "An account of imaginary or real people and events told for entertainment.",
        "type": "noun",
        "example": "Tell me a story.",
        "difficulty": "A1"
    },
    {
        "english": "straight",
        "bengali": "সোজা",
        "meaning": "Extending or moving uniformly in one direction only; without a curve or bend.",
        "type": "adjective, adverb",
        "example": "Go straight ahead.",
        "difficulty": "A2"
    },
    {
        "english": "strange",
        "bengali": "অদ্ভুত",
        "meaning": "Unusual or surprising in a way that is unsettling or difficult to understand.",
        "type": "adjective",
        "example": "That's a strange question.",
        "difficulty": "A2"
    },
    {
        "english": "stranger",
        "bengali": "অপরিচিত",
        "meaning": "A person whom one does not know or with whom one is not familiar.",
        "type": "noun",
        "example": "Don't talk to strangers.",
        "difficulty": "A2"
    },
    {
        "english": "strategy",
        "bengali": "কৌশল",
        "meaning": "A plan of action designed to achieve a long-term or overall aim.",
        "type": "noun",
        "example": "We need a new strategy to win the game.",
        "difficulty": "A2"
    },
    {
        "english": "stream",
        "bengali": "স্রোত",
        "meaning": "A small, narrow river.",
        "type": "noun",
        "example": "There is a small stream near my house.",
        "difficulty": "B1"
    },
    {
        "english": "street",
        "bengali": "রাস্তা",
        "meaning": "A public road in a city or town, typically with houses and buildings on one or both sides.",
        "type": "noun",
        "example": "I live on this street.",
        "difficulty": "A1"
    },
    {
        "english": "strength",
        "bengali": "শক্তি",
        "meaning": "The quality or state of being physically strong.",
        "type": "noun",
        "example": "He has great strength.",
        "difficulty": "B1"
    },
    {
        "english": "stress",
        "bengali": "চাপ",
        "meaning": "A state of mental or emotional strain or tension resulting from adverse or demanding circumstances.",
        "type": "noun, verb",
        "example": "I am under a lot of stress at work.",
        "difficulty": "A2"
    },
    {
        "english": "stretch",
        "bengali": "প্রসারিত করা",
        "meaning": "(of something soft or elastic) be made or be capable of being made longer or wider without tearing or breaking.",
        "type": "verb, noun",
        "example": "You should stretch before you exercise.",
        "difficulty": "B2"
    },
    {
        "english": "strike",
        "bengali": "ধর্মঘট",
        "meaning": "A refusal to work organized by a body of employees as a form of protest, typically in an attempt to gain a concession or concessions from their employer.",
        "type": "verb, noun",
        "example": "The workers are on strike.",
        "difficulty": "B2"
    },
    {
        "english": "string",
        "bengali": "দড়ি",
        "meaning": "Material consisting of threads of cotton, hemp, or other material twisted together to form a thin cord.",
        "type": "noun",
        "example": "I need a piece of string.",
        "difficulty": "B1"
    },
    {
        "english": "strong",
        "bengali": "শক্তিশালী",
        "meaning": "Having the power to move heavy weights or perform other physically demanding tasks.",
        "type": "adjective",
        "example": "He is a strong man.",
        "difficulty": "A1"
    },
    {
        "english": "strongly",
        "bengali": "দৃঢ়ভাবে",
        "meaning": "With great force or vigor.",
        "type": "adverb",
        "example": "I strongly disagree with you.",
        "difficulty": "B1"
    },
    {
        "english": "structure",
        "bengali": "গঠন",
        "meaning": "The arrangement of and relations between the parts or elements of something complex.",
        "type": "noun, verb",
        "example": "The structure of the building is very strong.",
        "difficulty": "A2"
    },
    {
        "english": "struggle",
        "bengali": "সংগ্রাম",
        "meaning": "Make forceful or violent efforts to get free of restraint or constriction.",
        "type": "noun, verb",
        "example": "He struggled to get free.",
        "difficulty": "B2"
    },
    {
        "english": "student",
        "bengali": "ছাত্র",
        "meaning": "A person who is studying at a school or college.",
        "type": "noun",
        "example": "I am a student.",
        "difficulty": "A1"
    },
    {
        "english": "studio",
        "bengali": "স্টুডিও",
        "meaning": "A room where an artist, photographer, sculptor, etc. works.",
        "type": "noun",
        "example": "The artist is working in his studio.",
        "difficulty": "A2"
    },
    {
        "english": "study",
        "bengali": "অধ্যয়ন করা",
        "meaning": "The devotion of time and attention to acquiring knowledge on an academic subject, especially by means of books.",
        "type": "noun, verb",
        "example": "I need to study for my exam.",
        "difficulty": "A1"
    },
    {
        "english": "stuff",
        "bengali": "জিনিসপত্র",
        "meaning": "Matter, material, articles, or activities of a specified or indeterminate kind that are being referred to, indicated, or implied.",
        "type": "noun",
        "example": "What is all this stuff?",
        "difficulty": "A2"
    },
    {
        "english": "stupid",
        "bengali": "বোকা",
        "meaning": "Having or showing a great lack of intelligence or common sense.",
        "type": "adjective",
        "example": "That was a stupid thing to do.",
        "difficulty": "A2"
    },
    {
        "english": "style",
        "bengali": "শৈলী",
        "meaning": "A manner of doing something.",
        "type": "noun",
        "example": "I like your style.",
        "difficulty": "A1"
    },
    {
        "english": "subject",
        "bengali": "বিষয়",
        "meaning": "A person or thing that is being discussed, described, or dealt with.",
        "type": "noun, adjective",
        "example": "What is your favorite subject?",
        "difficulty": "A1"
    },
    {
        "english": "submit",
        "bengali": "জমা দেওয়া",
        "meaning": "Accept or yield to a superior force or to the authority or will of another person.",
        "type": "verb",
        "example": "Please submit your application by Friday.",
        "difficulty": "B2"
    },
    {
        "english": "substance",
        "bengali": "পদার্থ",
        "meaning": "A particular kind of matter with uniform properties.",
        "type": "noun",
        "example": "This is a dangerous substance.",
        "difficulty": "B2"
    },
    {
        "english": "succeed",
        "bengali": "সফল হওয়া",
        "meaning": "Achieve the desired aim or result.",
        "type": "verb",
        "example": "He succeeded in passing the exam.",
        "difficulty": "A2"
    },
    {
        "english": "success",
        "bengali": "সাফল্য",
        "meaning": "The accomplishment of an aim or purpose.",
        "type": "noun",
        "example": "The project was a great success.",
        "difficulty": "A1"
    },
    {
        "english": "successful",
        "bengali": "সফল",
        "meaning": "Accomplishing a desired aim or result.",
        "type": "adjective",
        "example": "She is a successful businesswoman.",
        "difficulty": "A1"
    },
    {
        "english": "successfully",
        "bengali": "সফলভাবে",
        "meaning": "In a way that accomplishes a desired aim or result.",
        "type": "adverb",
        "example": "He successfully completed the project.",
        "difficulty": "A2"
    },
    {
        "english": "such",
        "bengali": "যেমন",
        "meaning": "Of the type previously mentioned.",
        "type": "determiner",
        "example": "I have never seen such a beautiful place.",
        "difficulty": "A2"
    },
    {
        "english": "sudden",
        "bengali": "আকস্মিক",
        "meaning": "Occurring or done quickly and unexpectedly or without warning.",
        "type": "adjective",
        "example": "It was a sudden change of plan.",
        "difficulty": "B2"
    },
    {
        "english": "suddenly",
        "bengali": "হঠাৎ",
        "meaning": "Quickly and unexpectedly.",
        "type": "adverb",
        "example": "Suddenly, it started to rain.",
        "difficulty": "A2"
    },
    {
        "english": "suffer",
        "bengali": "ভোগা",
        "meaning": "Experience or be subjected to (something bad or unpleasant).",
        "type": "verb",
        "example": "He is suffering from a long illness.",
        "difficulty": "B1"
    },
    {
        "english": "sugar",
        "bengali": "চিনি",
        "meaning": "A sweet crystalline substance obtained from various plants, especially sugar cane and sugar beet, consisting essentially of sucrose, and used as a sweetener in food and drink.",
        "type": "noun, verb",
        "example": "I like sugar in my tea.",
        "difficulty": "A1"
    },
    {
        "english": "suggest",
        "bengali": "পরামর্শ দেওয়া",
        "meaning": "Put forward for consideration.",
        "type": "verb",
        "example": "I suggest that we go to the cinema.",
        "difficulty": "A2"
    },
    {
        "english": "suggestion",
        "bengali": "পরামর্শ",
        "meaning": "An idea or plan put forward for consideration.",
        "type": "noun",
        "example": "Do you have any suggestions?",
        "difficulty": "A2"
    },
    {
        "english": "suit",
        "bengali": "স্যুট",
        "meaning": "A set of outer clothes made of the same fabric and designed to be worn together, typically consisting of a jacket and trousers or a jacket and skirt.",
        "type": "noun, verb",
        "example": "He is wearing a black suit.",
        "difficulty": "A1"
    },
    {
        "english": "suitable",
        "bengali": "উপযুক্ত",
        "meaning": "Right or appropriate for a particular person, purpose, or situation.",
        "type": "adjective",
        "example": "This is a suitable dress for the occasion.",
        "difficulty": "B1"
    },
    {
        "english": "summarize",
        "bengali": "সারসংক্ষেপ করা",
        "meaning": "Give a brief statement of the main points of (something).",
        "type": "verb",
        "example": "Please summarize the main points of the article.",
        "difficulty": "B1"
    },
    {
        "english": "summary",
        "bengali": "সারসংক্ষেপ",
        "meaning": "A brief statement or account of the main points of something.",
        "type": "noun",
        "example": "Please write a summary of the book.",
        "difficulty": "A1"
    },
    {
        "english": "summer",
        "bengali": "গ্রীষ্ম",
        "meaning": "The warmest season of the year, in the northern hemisphere from June to August and in the southern hemisphere from December to February.",
        "type": "noun",
        "example": "I love summer.",
        "difficulty": "A1"
    },
    {
        "english": "sun",
        "bengali": "সূর্য",
        "meaning": "The star around which the earth orbits.",
        "type": "noun",
        "example": "The sun is shining.",
        "difficulty": "A1"
    },
    {
        "english": "Sunday",
        "bengali": "রবিবার",
        "meaning": "The day of the week before Monday and following Saturday, observed by Christians as a day of rest and worship.",
        "type": "noun",
        "example": "I will see you on Sunday.",
        "difficulty": "A1"
    },
    {
        "english": "supply",
        "bengali": "সরবরাহ",
        "meaning": "A stock or amount of something supplied or available for use.",
        "type": "noun, verb",
        "example": "The company supplies us with electricity.",
        "difficulty": "B1"
    },
    {
        "english": "support",
        "bengali": "সমর্থন",
        "meaning": "Bear all or part of the weight of; hold up.",
        "type": "noun, verb",
        "example": "I need your support.",
        "difficulty": "A2"
    },
    {
        "english": "supporter",
        "bengali": "সমর্থক",
        "meaning": "A person who approves of and encourages someone or something (typically a public figure, a sports team, or a political party).",
        "type": "noun",
        "example": "He is a supporter of the local football team.",
        "difficulty": "B1"
    },
    {
        "english": "suppose",
        "bengali": "মনে করা",
        "meaning": "Think or assume that something is the case on the basis of evidence or probability but without proof or certain knowledge.",
        "type": "verb",
        "example": "I suppose you are right.",
        "difficulty": "A2"
    },
    {
        "english": "sure",
        "bengali": "নিশ্চিত",
        "meaning": "Completely confident that one is right.",
        "type": "adjective, adverb",
        "example": "Are you sure?",
        "difficulty": "A1"
    },
    {
        "english": "surely",
        "bengali": "অবশ্যই",
        "meaning": "Used to emphasize the speaker's firm belief that what they are saying is true and often their surprise that there is any doubt of this.",
        "type": "adverb",
        "example": "Surely you can't be serious.",
        "difficulty": "B2"
    },
    {
        "english": "surface",
        "bengali": "পৃষ্ঠ",
        "meaning": "The outside part or uppermost layer of something.",
        "type": "noun",
        "example": "The surface of the table is smooth.",
        "difficulty": "B1"
    },
    {
        "english": "surgery",
        "bengali": "অস্ত্রোপচার",
        "meaning": "The treatment of injuries or disorders of the body by incision or manipulation, especially with instruments.",
        "type": "noun",
        "example": "He had to have surgery on his knee.",
        "difficulty": "B2"
    },
    {
        "english": "surprise",
        "bengali": "বিস্ময়",
        "meaning": "An unexpected or astonishing event, fact, etc.",
        "type": "noun, verb",
        "example": "It was a big surprise to see him there.",
        "difficulty": "A2"
    },
    {
        "english": "surprised",
        "bengali": "বিস্মিত",
        "meaning": "Feeling or showing surprise.",
        "type": "adjective",
        "example": "I was surprised to see him there.",
        "difficulty": "A2"
    },
    {
        "english": "surprising",
        "bengali": "বিস্ময়কর",
        "meaning": "Causing surprise; unexpected.",
        "type": "adjective",
        "example": "It was a surprising result.",
        "difficulty": "A2"
    },
    {
        "english": "surround",
        "bengali": "ঘিরে থাকা",
        "meaning": "Be all around (someone or something).",
        "type": "verb",
        "example": "The house is surrounded by a high wall.",
        "difficulty": "B2"
    },
    {
        "english": "surrounding",
        "bengali": "পারিপার্শ্বিক",
        "meaning": "All around a particular place or thing.",
        "type": "adjective",
        "example": "The surrounding area is very beautiful.",
        "difficulty": "B2"
    },
    {
        "english": "survey",
        "bengali": "জরিপ",
        "meaning": "A general view, examination, or description of someone or something.",
        "type": "noun, verb",
        "example": "We need to conduct a survey.",
        "difficulty": "A2"
    },
    {
        "english": "survive",
        "bengali": "বেঁচে থাকা",
        "meaning": "Continue to live or exist, especially in spite of danger or hardship.",
        "type": "verb",
        "example": "He survived the accident.",
        "difficulty": "B2"
    },
    {
        "english": "swear",
        "bengali": "শপথ করা",
        "meaning": "Make a solemn statement or promise undertaking to do something or affirming that something is the case.",
        "type": "verb",
        "example": "I swear I will never do it again.",
        "difficulty": "B2"
    },
    {
        "english": "sweet",
        "bengali": "মিষ্টি",
        "meaning": "Having the pleasant taste characteristic of sugar or honey; not salty, sour, or bitter.",
        "type": "adjective, noun",
        "example": "This cake is very sweet.",
        "difficulty": "A2"
    },
    {
        "english": "swim",
        "bengali": "সাঁতার কাটা",
        "meaning": "Propel the body through water by using the limbs, or (in the case of a fish or other aquatic animal) by using the fins and tail.",
        "type": "verb",
        "example": "I can swim.",
        "difficulty": "A1"
    },
    {
        "english": "swimming",
        "bengali": "সাঁতার",
        "meaning": "The sport or activity of propelling oneself through water using the limbs.",
        "type": "noun",
        "example": "Swimming is a good exercise.",
        "difficulty": "A1"
    },
    {
        "english": "switch",
        "bengali": "সুইচ",
        "meaning": "A device for making and breaking the connection in an electric circuit.",
        "type": "noun, verb",
        "example": "Please turn on the light switch.",
        "difficulty": "B1"
    },
    {
        "english": "symbol",
        "bengali": "প্রতীক",
        "meaning": "A mark or character used as a conventional representation of an object, function, or process, e.g., the letter or letters standing for a chemical element or a character in musical notation.",
        "type": "noun",
        "example": "The dove is a symbol of peace.",
        "difficulty": "B1"
    },
    {
        "english": "sympathy",
        "bengali": "সহানুভূতি",
        "meaning": "Feelings of pity and sorrow for someone else's misfortune.",
        "type": "noun",
        "example": "I have a lot of sympathy for her.",
        "difficulty": "B1"
    },
    {
        "english": "symptom",
        "bengali": "উপসর্গ",
        "meaning": "A physical or mental feature that is regarded as indicating a condition of disease, particularly such a feature that is apparent to the patient.",
        "type": "noun",
        "example": "Fever is a symptom of many illnesses.",
        "difficulty": "B1"
    },
    {
        "english": "system",
        "bengali": "সিস্টেম",
        "meaning": "A set of things working together as parts of a mechanism or an interconnecting network.",
        "type": "noun",
        "example": "The computer system is not working.",
        "difficulty": "A2"
    },
    {
        "english": "table",
        "bengali": "টেবিল",
        "meaning": "A piece of furniture with a flat top and one or more legs, providing a level surface on which objects may be placed.",
        "type": "noun",
        "example": "The book is on the table.",
        "difficulty": "A1"
    },
    {
        "english": "tablet",
        "bengali": "ট্যাবলেট",
        "meaning": "A small, flat, portable computer with a touchscreen.",
        "type": "noun",
        "example": "I have a new tablet.",
        "difficulty": "A2"
    },
    {
        "english": "tail",
        "bengali": "লেজ",
        "meaning": "The hindmost part of an animal, especially when prolonged beyond the rest of the body, such as the flexible extension of the backbone in a vertebrate, the feathers at the hind end of a bird, or a terminal appendage in an insect.",
        "type": "noun",
        "example": "The dog is wagging its tail.",
        "difficulty": "B1"
    },
    {
        "english": "take",
        "bengali": "নেওয়া",
        "meaning": "Lay hold of (something) with one's hands; reach for and hold.",
        "type": "verb",
        "example": "Please take this book.",
        "difficulty": "A1"
    },
    {
        "english": "talent",
        "bengali": "প্রতিভা",
        "meaning": "Natural aptitude or skill.",
        "type": "noun",
        "example": "She has a great talent for music.",
        "difficulty": "B1"
    },
    {
        "english": "talk",
        "bengali": "কথা বলা",
        "meaning": "Speak in order to give information or express ideas or feelings; converse or communicate by spoken words.",
        "type": "verb, noun",
        "example": "Let's talk about it.",
        "difficulty": "A1"
    },
    {
        "english": "tall",
        "bengali": "লম্বা",
        "meaning": "Of great or more than average height, especially (with reference to an object) relative to width.",
        "type": "adjective",
        "example": "He is a tall man.",
        "difficulty": "A1"
    },
    {
        "english": "tank",
        "bengali": "ট্যাঙ্ক",
        "meaning": "A large container or storage unit, especially for liquid or gas.",
        "type": "noun",
        "example": "The car has a full tank of gas.",
        "difficulty": "B1"
    },
    {
        "english": "tape",
        "bengali": "টেপ",
        "meaning": "A narrow strip of material, typically used to hold or fasten something.",
        "type": "noun",
        "example": "I need some tape to fix this.",
        "difficulty": "A2"
    },
    {
        "english": "target",
        "bengali": "লক্ষ্য",
        "meaning": "A person, object, or place selected as the aim of an attack.",
        "type": "noun, verb",
        "example": "He is the target of the investigation.",
        "difficulty": "A2"
    },
    {
        "english": "task",
        "bengali": "কাজ",
        "meaning": "A piece of work to be done or undertaken.",
        "type": "noun",
        "example": "I have a difficult task to do.",
        "difficulty": "A1"
    },
    {
        "english": "taste",
        "bengali": "স্বাদ",
        "meaning": "The sensation of flavor perceived in the mouth and throat on contact with a substance.",
        "type": "noun, verb",
        "example": "This food has a good taste.",
        "difficulty": "A2"
    },
    {
        "english": "tax",
        "bengali": "কর",
        "meaning": "A compulsory contribution to state revenue, levied by the government on workers' income and business profits or added to the cost of some goods, services, and transactions.",
        "type": "noun, verb",
        "example": "I have to pay my taxes.",
        "difficulty": "A1"
    },
    {
        "english": "taxi",
        "bengali": "ট্যাক্সি",
        "meaning": "A motor vehicle licensed to transport passengers in return for payment of a fare and typically fitted with a taximeter.",
        "type": "noun",
        "example": "Let's take a taxi.",
        "difficulty": "A1"
    },
    {
        "english": "tea",
        "bengali": "চা",
        "meaning": "A hot drink made by infusing the dried crushed leaves of the tea plant in boiling water.",
        "type": "noun",
        "example": "I would like a cup of tea.",
        "difficulty": "A1"
    },
    {
        "english": "teach",
        "bengali": "শেখানো",
        "meaning": "Impart knowledge to or instruct (someone) as to how to do something.",
        "type": "verb",
        "example": "She teaches English at a school.",
        "difficulty": "A1"
    },
    {
        "english": "teacher",
        "bengali": "শিক্ষক",
        "meaning": "A person who teaches, especially in a school.",
        "type": "noun",
        "example": "My teacher is very nice.",
        "difficulty": "A1"
    },
    {
        "english": "teaching",
        "bengali": "শিক্ষকতা",
        "meaning": "The occupation, profession, or work of a teacher.",
        "type": "noun",
        "example": "Teaching is a noble profession.",
        "difficulty": "A1"
    },
    {
        "english": "team",
        "bengali": "দল",
        "meaning": "A group of players forming one side in a competitive game or sport.",
        "type": "noun",
        "example": "He plays for the local football team.",
        "difficulty": "A1"
    },
    {
        "english": "tear (drop of water)",
        "bengali": "অশ্রু",
        "meaning": "A drop of clear salty liquid secreted from the eyes when crying or when the eyes are irritated.",
        "type": "noun",
        "example": "There were tears in her eyes.",
        "difficulty": "B2"
    },
    {
        "english": "tear (to rip)",
        "bengali": "ছেঁড়া",
        "meaning": "Pull (paper, cloth, or other material) apart or to pieces with force.",
        "type": "verb",
        "example": "Be careful not to tear the paper.",
        "difficulty": "B2"
    },
    {
        "english": "technical",
        "bengali": "প্রযুক্তিগত",
        "meaning": "Relating to a particular subject, art, or craft, or its techniques.",
        "type": "adjective",
        "example": "This is a technical problem.",
        "difficulty": "B1"
    },
    {
        "english": "technique",
        "bengali": "কৌশল",
        "meaning": "A way of carrying out a particular task, especially the execution or performance of an artistic work or a scientific procedure.",
        "type": "noun",
        "example": "He has a good technique for playing the piano.",
        "difficulty": "B1"
    },
    {
        "english": "technology",
        "bengali": "প্রযুক্তি",
        "meaning": "The application of scientific knowledge for practical purposes, especially in industry.",
        "type": "noun",
        "example": "We live in an age of technology.",
        "difficulty": "A2"
    },
    {
        "english": "teenage",
        "bengali": "কৈশোর",
        "meaning": "Denoting a person between 13 and 19 years old.",
        "type": "adjective",
        "example": "She has a teenage son.",
        "difficulty": "A2"
    },
    {
        "english": "teenager",
        "bengali": "কিশোর",
        "meaning": "A person aged between 13 and 19 years.",
        "type": "noun",
        "example": "He is a typical teenager.",
        "difficulty": "A1"
    },
    {
        "english": "telephone",
        "bengali": "টেলিফোন",
        "meaning": "A system for transmitting voices over a distance using wire or radio, by converting acoustic vibrations to electrical signals.",
        "type": "noun, verb",
        "example": "I will call you on the telephone.",
        "difficulty": "A1"
    },
    {
        "english": "television",
        "bengali": "টেলিভিশন",
        "meaning": "A system for converting visual images (with sound) into electrical signals, transmitting them by radio or other means, and displaying them electronically on a screen.",
        "type": "noun",
        "example": "I am watching television.",
        "difficulty": "A1"
    },
    {
        "english": "tell",
        "bengali": "বলা",
        "meaning": "Communicate information, facts, or news to someone in spoken or written words.",
        "type": "verb",
        "example": "Please tell me the truth.",
        "difficulty": "A1"
    },
    {
        "english": "temperature",
        "bengali": "তাপমাত্রা",
        "meaning": "The degree or intensity of heat present in a substance or object, especially as expressed according to a comparative scale and shown by a thermometer or perceived by touch.",
        "type": "noun",
        "example": "What is the temperature today?",
        "difficulty": "A2"
    },
    {
        "english": "temporary",
        "bengali": "অস্থায়ী",
        "meaning": "Lasting for only a limited period of time; not permanent.",
        "type": "adjective",
        "example": "This is a temporary job.",
        "difficulty": "B1"
    },
    {
        "english": "ten",
        "bengali": "দশ",
        "meaning": "Equivalent to the product of two and five; one more than nine; 10.",
        "type": "number",
        "example": "I have ten fingers.",
        "difficulty": "A1"
    },
    {
        "english": "tend",
        "bengali": "প্রবণতা থাকা",
        "meaning": "Regularly or frequently behave in a particular way or have a certain characteristic.",
        "type": "verb",
        "example": "He tends to be late.",
        "difficulty": "B2"
    },
    {
        "english": "tennis",
        "bengali": "টেনিস",
        "meaning": "A game in which two or four players strike a ball with rackets over a net stretched across a court.",
        "type": "noun",
        "example": "I like to play tennis.",
        "difficulty": "A1"
    },
    {
        "english": "term",
        "bengali": "মেয়াদ",
        "meaning": "A word or phrase used to describe a thing or to express a concept, especially in a particular kind of language or branch of study.",
        "type": "noun",
        "example": "What is the meaning of this term?",
        "difficulty": "A2"
    },
    {
        "english": "terrible",
        "bengali": "ভয়ানক",
        "meaning": "Extremely bad or serious.",
        "type": "adjective",
        "example": "It was a terrible accident.",
        "difficulty": "A2"
    },
    {
        "english": "test",
        "bengali": "পরীক্ষা",
        "meaning": "A procedure intended to establish the quality, performance, or reliability of something, especially before it is taken into widespread use.",
        "type": "noun, verb",
        "example": "I have a test tomorrow.",
        "difficulty": "A1"
    },
    {
        "english": "text",
        "bengali": "পাঠ্য",
        "meaning": "A book or other written or printed work, regarded in terms of its content rather than its physical form.",
        "type": "noun, verb",
        "example": "Please read the text carefully.",
        "difficulty": "A1"
    },
    {
        "english": "than",
        "bengali": "চেয়ে",
        "meaning": "Introducing the second element in a comparison.",
        "type": "conjunction",
        "example": "He is taller than me.",
        "difficulty": "A1"
    },
    {
        "english": "thank",
        "bengali": "ধন্যবাদ",
        "meaning": "Express gratitude to (someone), especially by saying “Thank you”.",
        "type": "verb",
        "example": "Thank you for your help.",
        "difficulty": "A1"
    },
    {
        "english": "thanks",
        "bengali": "ধন্যবাদ",
        "meaning": "An expression of gratitude.",
        "type": "exclamation, noun",
        "example": "Thanks for everything.",
        "difficulty": "A1"
    },
    {
        "english": "that",
        "bengali": "যে",
        "meaning": "Used to identify a specific person or thing observed by the speaker.",
        "type": "determiner, pronoun, adverb, conjunction",
        "example": "That is my house.",
        "difficulty": "A1"
    },
    {
        "english": "the",
        "bengali": "টি",
        "meaning": "Denoting one or more people or things already mentioned or assumed to be common knowledge.",
        "type": "definite article",
        "example": "The dog is barking.",
        "difficulty": "A1"
    },
    {
        "english": "theater",
        "bengali": "থিয়েটার",
        "meaning": "A building or outdoor area in which plays and other dramatic performances are given.",
        "type": "noun",
        "example": "Let's go to the theater.",
        "difficulty": "A2"
    },
    {
        "english": "their",
        "bengali": "তাদের",
        "meaning": "Belonging to or associated with the people or things previously mentioned or easily identified.",
        "type": "determiner",
        "example": "This is their house.",
        "difficulty": "A1"
    },
    {
        "english": "them",
        "bengali": "তাদেরকে",
        "meaning": "Used as the object of a verb or preposition to refer to two or more people or things previously mentioned or easily identified.",
        "type": "pronoun",
        "example": "I saw them yesterday.",
        "difficulty": "A1"
    },
    {
        "english": "themselves",
        "bengali": "তারা নিজেরাই",
        "meaning": "Used as the object of a verb or preposition to refer to a group of people or things previously mentioned as the subject of the clause.",
        "type": "pronoun",
        "example": "They did it themselves.",
        "difficulty": "A2"
    },
    {
        "english": "then",
        "bengali": "তারপর",
        "meaning": "At that time; at the time in question.",
        "type": "adverb",
        "example": "I will go to the store and then come home.",
        "difficulty": "A1"
    },
    {
        "english": "theory",
        "bengali": "তত্ত্ব",
        "meaning": "A supposition or a system of ideas intended to explain something, especially one based on general principles independent of the thing to be explained.",
        "type": "noun",
        "example": "He has a new theory about the universe.",
        "difficulty": "A2"
    },
    {
        "english": "there",
        "bengali": "সেখানে",
        "meaning": "In, at, or to that place or position.",
        "type": "adverb",
        "example": "The book is over there.",
        "difficulty": "A1"
    },
    {
        "english": "therefore",
        "bengali": "অতএব",
        "meaning": "For that reason; consequently.",
        "type": "adverb",
        "example": "He is sick, therefore he is not here.",
        "difficulty": "B1"
    },
    {
        "english": "they",
        "bengali": "তারা",
        "meaning": "Used to refer to two or more people or things previously mentioned or easily identified.",
        "type": "pronoun",
        "example": "They are my friends.",
        "difficulty": "A1"
    },
    {
        "english": "thick",
        "bengali": "মোটা",
        "meaning": "With opposite surfaces or sides that are far apart.",
        "type": "adjective",
        "example": "This is a thick book.",
        "difficulty": "A2"
    },
    {
        "english": "thief",
        "bengali": "চোর",
        "meaning": "A person who steals another person's property, especially by stealth and without using force or violence.",
        "type": "noun",
        "example": "The police caught the thief.",
        "difficulty": "B2"
    },
    {
        "english": "thin",
        "bengali": "পাতলা",
        "meaning": "With opposite surfaces or sides that are close together.",
        "type": "adjective",
        "example": "This is a thin book.",
        "difficulty": "A2"
    },
    {
        "english": "thing",
        "bengali": "জিনিস",
        "meaning": "An object that one need not, cannot, or does not wish to give a specific name to.",
        "type": "noun",
        "example": "What is that thing?",
        "difficulty": "A1"
    },
    {
        "english": "think",
        "bengali": "চিন্তা করা",
        "meaning": "Have a particular opinion, belief, or idea about someone or something.",
        "type": "verb",
        "example": "What do you think about this?",
        "difficulty": "A1"
    },
    {
        "english": "thinking",
        "bengali": "চিন্তা",
        "meaning": "The process of using one's mind to consider or reason about something.",
        "type": "noun",
        "example": "I need some time for thinking.",
        "difficulty": "A2"
    },
    {
        "english": "third",
        "bengali": "তৃতীয়",
        "meaning": "Constituting number three in a sequence; 3rd.",
        "type": "number",
        "example": "This is the third time I have called you.",
        "difficulty": "A1"
    },
    {
        "english": "thirsty",
        "bengali": "তৃষ্ণার্ত",
        "meaning": "Feeling a need to drink.",
        "type": "adjective",
        "example": "I am thirsty.",
        "difficulty": "A1"
    },
    {
        "english": "thirteen",
        "bengali": "তেরো",
        "meaning": "Equivalent to the sum of ten and three; one more than twelve; 13.",
        "type": "number",
        "example": "She is thirteen years old.",
        "difficulty": "A1"
    },
    {
        "english": "thirty",
        "bengali": "ত্রিশ",
        "meaning": "The number equivalent to the product of three and ten; 30.",
        "type": "number",
        "example": "My father is thirty years old.",
        "difficulty": "A1"
    },
    {
        "english": "this",
        "bengali": "এই",
        "meaning": "Used to identify a specific person or thing close at hand or being indicated or experienced.",
        "type": "determiner, pronoun, adverb",
        "example": "This is my house.",
        "difficulty": "A1"
    },
    {
        "english": "thorough",
        "bengali": "পুঙ্খানুপুঙ্খ",
        "meaning": "Complete with regard to every detail; not superficial or partial.",
        "type": "adjective",
        "example": "The police conducted a thorough investigation.",
        "difficulty": "B2"
    },
    {
        "english": "thoroughly",
        "bengali": "সম্পূর্ণরূপে",
        "meaning": "In a thorough manner.",
        "type": "adverb",
        "example": "I thoroughly enjoyed the movie.",
        "difficulty": "B2"
    },
    {
        "english": "those",
        "bengali": "ঐগুলো",
        "meaning": "Plural form of that.",
        "type": "determiner, pronoun",
        "example": "Those are my books.",
        "difficulty": "A1"
    },
    {
        "english": "though",
        "bengali": "যদিও",
        "meaning": "Despite the fact that; although.",
        "type": "conjunction, adverb",
        "example": "Though it was raining, we went for a walk.",
        "difficulty": "A2"
    },
    {
        "english": "thought",
        "bengali": "চিন্তা",
        "meaning": "An idea or opinion produced by thinking or occurring suddenly in the mind.",
        "type": "noun",
        "example": "I have a thought.",
        "difficulty": "A1"
    },
    {
        "english": "thousand",
        "bengali": "হাজার",
        "meaning": "The number equivalent to the product of a hundred and ten; 1,000.",
        "type": "number",
        "example": "There are a thousand people here.",
        "difficulty": "A1"
    },
    {
        "english": "threat",
        "bengali": "হুমকি",
        "meaning": "A statement of an intention to inflict pain, injury, damage, or other hostile action on someone in retribution for something done or not done.",
        "type": "noun",
        "example": "He made a threat against my life.",
        "difficulty": "B2"
    },
    {
        "english": "threaten",
        "bengali": "হুমকি দেওয়া",
        "meaning": "State one's intention to take hostile action against someone in retribution for something done or not done.",
        "type": "verb",
        "example": "He threatened to kill me.",
        "difficulty": "B2"
    },
    {
        "english": "three",
        "bengali": "তিন",
        "meaning": "Equivalent to the sum of one and two; one more than two; 3.",
        "type": "number",
        "example": "I have three brothers.",
        "difficulty": "A1"
    },
    {
        "english": "throat",
        "bengali": "গলা",
        "meaning": "The passage which leads from the back of the mouth of a person or animal.",
        "type": "noun",
        "example": "I have a sore throat.",
        "difficulty": "B1"
    },
    {
        "english": "through",
        "bengali": "মাধ্যমে",
        "meaning": "Moving in one side and out of the other side of (an opening, channel, or location).",
        "type": "preposition, adverb",
        "example": "The train went through a tunnel.",
        "difficulty": "A1"
    },
    {
        "english": "throughout",
        "bengali": "পুরো",
        "meaning": "In every part of (a place or object).",
        "type": "preposition, adverb",
        "example": "He is famous throughout the world.",
        "difficulty": "B1"
    },
    {
        "english": "throw",
        "bengali": "নিক্ষেপ করা",
        "meaning": "Propel (something) with force through the air by a movement of the arm and hand.",
        "type": "verb",
        "example": "Please throw the ball to me.",
        "difficulty": "A2"
    },
    {
        "english": "Thursday",
        "bengali": "বৃহস্পতিবার",
        "meaning": "The day of the week before Friday and following Wednesday.",
        "type": "noun",
        "example": "I have a meeting on Thursday.",
        "difficulty": "A1"
    },
    {
        "english": "thus",
        "bengali": "এইভাবে",
        "meaning": "As a result or consequence of this; therefore.",
        "type": "adverb",
        "example": "He is sick, thus he is not here.",
        "difficulty": "B2"
    },
    {
        "english": "ticket",
        "bengali": "টিকেট",
        "meaning": "A piece of paper or small card that gives the holder a certain right, especially to enter a place, travel by public transport, or participate in an event.",
        "type": "noun",
        "example": "I need to buy a ticket for the train.",
        "difficulty": "A1"
    },
    {
        "english": "tie",
        "bengali": "টাই",
        "meaning": "A strip of material worn around the collar of a shirt, knotted at the front.",
        "type": "noun, verb",
        "example": "He is wearing a tie.",
        "difficulty": "B1"
    },
    {
        "english": "tight",
        "bengali": "আঁটসাঁট",
        "meaning": "Fixed, fastened, or closed firmly; hard to move, undo, or open.",
        "type": "adjective, adverb",
        "example": "This shirt is too tight.",
        "difficulty": "B1"
    },
    {
        "english": "till",
        "bengali": "পর্যন্ত",
        "meaning": "Up to (the point in time or the event mentioned); until.",
        "type": "preposition, conjunction",
        "example": "I will wait till you come back.",
        "difficulty": "B1"
    },
    {
        "english": "time",
        "bengali": "সময়",
        "meaning": "The indefinite continued progress of existence and events in the past, present, and future regarded as a whole.",
        "type": "noun",
        "example": "What time is it?",
        "difficulty": "A1"
    },
    {
        "english": "tiny",
        "bengali": "ক্ষুদ্র",
        "meaning": "Very small.",
        "type": "adjective",
        "example": "The baby has tiny feet.",
        "difficulty": "B1"
    },
    {
        "english": "tip",
        "bengali": "ডগা",
        "meaning": "The pointed or rounded end or extremity of something slender or tapering.",
        "type": "noun, verb",
        "example": "The tip of the iceberg.",
        "difficulty": "A2"
    },
    {
        "english": "tired",
        "bengali": "ক্লান্ত",
        "meaning": "In need of sleep or rest; weary.",
        "type": "adjective",
        "example": "I am tired.",
        "difficulty": "A1"
    },
    {
        "english": "title",
        "bengali": "শিরোনাম",
        "meaning": "The name of a book, composition, or other artistic work.",
        "type": "noun, verb",
        "example": "What is the title of the book?",
        "difficulty": "A2"
    },
    {
        "english": "to",
        "bengali": "প্রতি",
        "meaning": "Expressing motion in the direction of (a particular location).",
        "type": "preposition, infinitive marker",
        "example": "I am going to the store.",
        "difficulty": "A1"
    },
    {
        "english": "today",
        "bengali": "আজ",
        "meaning": "On or in the course of this present day.",
        "type": "adverb, noun",
        "example": "Today is my birthday.",
        "difficulty": "A1"
    },
    {
        "english": "together",
        "bengali": "একসাথে",
        "meaning": "With or in proximity to another person or people.",
        "type": "adverb",
        "example": "Let's go together.",
        "difficulty": "A1"
    },
    {
        "english": "toilet",
        "bengali": "শৌচাগার",
        "meaning": "A fixed receptacle with a water supply and a flushing mechanism, used for the disposal of human waste.",
        "type": "noun",
        "example": "Where is the toilet?",
        "difficulty": "A1"
    },
    {
        "english": "tomato",
        "bengali": "টমেটো",
        "meaning": "A glossy red, or occasionally yellow, pulpy edible fruit that is eaten as a vegetable or in salad.",
        "type": "noun",
        "example": "I like to eat tomatoes.",
        "difficulty": "A1"
    },
    {
        "english": "tomorrow",
        "bengali": "আগামীকাল",
        "meaning": "On the day after today.",
        "type": "adverb, noun",
        "example": "I will see you tomorrow.",
        "difficulty": "A1"
    },
    {
        "english": "tone",
        "bengali": "সুর",
        "meaning": "A musical or vocal sound with reference to its pitch, quality, and strength.",
        "type": "noun",
        "example": "He has a deep tone of voice.",
        "difficulty": "B2"
    },
    {
        "english": "tongue",
        "bengali": "জিহ্বা",
        "meaning": "The fleshy muscular organ in the mouth of a mammal, used for tasting, licking, swallowing, and (in humans) articulating speech.",
        "type": "noun",
        "example": "I bit my tongue.",
        "difficulty": "B1"
    },
    {
        "english": "tonight",
        "bengali": "আজ রাতে",
        "meaning": "On the present or approaching evening or night.",
        "type": "adverb, noun",
        "example": "Are you busy tonight?",
        "difficulty": "A1"
    },
    {
        "english": "too",
        "bengali": "খুব",
        "meaning": "To a higher degree than is desirable, permissible, or possible; excessively.",
        "type": "adverb",
        "example": "It's too hot.",
        "difficulty": "A1"
    },
    {
        "english": "tool",
        "bengali": "সরঞ্জাম",
        "meaning": "A device or implement, especially one held in the hand, used to carry out a particular function.",
        "type": "noun",
        "example": "I need the right tool for the job.",
        "difficulty": "A1"
    },
    {
        "english": "tooth",
        "bengali": "দাঁত",
        "meaning": "Each of a set of hard, bony enamel-coated structures in the jaws of most vertebrates, used for biting and chewing.",
        "type": "noun",
        "example": "I have a toothache.",
        "difficulty": "A1"
    },
    {
        "english": "top",
        "bengali": "শীর্ষ",
        "meaning": "The highest or uppermost point, part, or surface of something.",
        "type": "noun, adjective",
        "example": "The book is on top of the shelf.",
        "difficulty": "A1"
    },
    {
        "english": "topic",
        "bengali": "বিষয়",
        "meaning": "A matter dealt with in a text, discourse, or conversation; a subject.",
        "type": "noun",
        "example": "What is the topic of the discussion?",
        "difficulty": "A1"
    },
    {
        "english": "total",
        "bengali": "মোট",
        "meaning": "Comprising the whole number or amount.",
        "type": "adjective, noun",
        "example": "What is the total cost?",
        "difficulty": "A2"
    },
    {
        "english": "totally",
        "bengali": "সম্পূর্ণভাবে",
        "meaning": "Completely; absolutely.",
        "type": "adverb",
        "example": "I totally agree with you.",
        "difficulty": "B1"
    },
    {
        "english": "touch",
        "bengali": "স্পর্শ করা",
        "meaning": "Come into or be in contact with.",
        "type": "verb, noun",
        "example": "Don't touch that.",
        "difficulty": "A2"
    },
    {
        "english": "tough",
        "bengali": "কঠিন",
        "meaning": "Strong enough to withstand adverse conditions or rough or careless handling.",
        "type": "adjective",
        "example": "This is a tough problem.",
        "difficulty": "B2"
    },
    {
        "english": "tour",
        "bengali": "ভ্রমণ",
        "meaning": "A journey for pleasure in which several different places are visited.",
        "type": "noun, verb",
        "example": "We are going on a tour of Europe.",
        "difficulty": "A2"
    },
    {
        "english": "tourist",
        "bengali": "পর্যটক",
        "meaning": "A person who is traveling or visiting a place for pleasure.",
        "type": "noun",
        "example": "There are many tourists in this city.",
        "difficulty": "A1"
    },
    {
        "english": "toward",
        "bengali": "দিকে",
        "meaning": "In the direction of.",
        "type": "preposition",
        "example": "He is walking toward the station.",
        "difficulty": "A2"
    },
    {
        "english": "towel",
        "bengali": "তোয়ালে",
        "meaning": "A piece of thick absorbent cloth or paper used for drying oneself or wiping things dry.",
        "type": "noun",
        "example": "I need a towel.",
        "difficulty": "A2"
    },
    {
        "english": "tower",
        "bengali": "টাওয়ার",
        "meaning": "A tall, narrow building, either freestanding or forming part of a building such as a church or castle.",
        "type": "noun",
        "example": "The Eiffel Tower is a famous landmark.",
        "difficulty": "A2"
    },
    {
        "english": "town",
        "bengali": "শহর",
        "meaning": "A built-up area with a name, defined boundaries, and local government, that is larger than a village and generally smaller than a city.",
        "type": "noun",
        "example": "I live in a small town.",
        "difficulty": "A1"
    },
    {
        "english": "toy",
        "bengali": "খেলনা",
        "meaning": "An object for a child to play with, typically a model or miniature replica of something.",
        "type": "noun, adjective",
        "example": "The child is playing with a toy.",
        "difficulty": "A1"
    },
    {
        "english": "track",
        "bengali": "ট্র্যাক",
        "meaning": "A rough path or road, typically one made by the passage of people or vehicles.",
        "type": "noun, verb",
        "example": "Follow this track to the village.",
        "difficulty": "A2"
    },
    {
        "english": "trade",
        "bengali": "ব্যবসা",
        "meaning": "The action of buying and selling goods and services.",
        "type": "noun, verb",
        "example": "He is a successful trader.",
        "difficulty": "B1"
    },
    {
        "english": "tradition",
        "bengali": "ঐতিহ্য",
        "meaning": "The transmission of customs or beliefs from generation to generation, or the fact of being passed on in this way.",
        "type": "noun",
        "example": "It is a family tradition to have a big dinner on Christmas day.",
        "difficulty": "A2"
    },
    {
        "english": "traditional",
        "bengali": "ঐতিহ্যগত",
        "meaning": "Existing in or as part of a tradition; long-established.",
        "type": "adjective",
        "example": "This is a traditional dish.",
        "difficulty": "A2"
    },
    {
        "english": "traffic",
        "bengali": "ট্র্যাফিক",
        "meaning": "Vehicles moving on a road or public highway.",
        "type": "noun",
        "example": "There is a lot of traffic on the road.",
        "difficulty": "A1"
    },
    {
        "english": "train",
        "bengali": "ট্রেন",
        "meaning": "A series of connected railway carriages or wagons moved by a locomotive or by integral motors.",
        "type": "noun, verb",
        "example": "I am going to travel by train.",
        "difficulty": "A1"
    },
    {
        "english": "training",
        "bengali": "প্রশিক্ষণ",
        "meaning": "The action of teaching a person or animal a particular skill or type of behavior.",
        "type": "noun",
        "example": "I am going to a training course.",
        "difficulty": "A2"
    },
    {
        "english": "transfer",
        "bengali": "স্থানান্তর",
        "meaning": "Move from one place to another.",
        "type": "verb, noun",
        "example": "I need to transfer some money to another account.",
        "difficulty": "B2"
    },
    {
        "english": "transform",
        "bengali": "রূপান্তর করা",
        "meaning": "Make a thorough or dramatic change in the form, appearance, or character of.",
        "type": "verb",
        "example": "The new manager has transformed the company.",
        "difficulty": "B2"
    },
    {
        "english": "transition",
        "bengali": "স্থানান্তর",
        "meaning": "The process or a period of changing from one state or condition to another.",
        "type": "noun",
        "example": "The transition from school to work can be difficult.",
        "difficulty": "B2"
    },
    {
        "english": "translate",
        "bengali": "অনুবাদ করা",
        "meaning": "Express the sense of (words or text) in another language.",
        "type": "verb",
        "example": "Can you translate this for me?",
        "difficulty": "B1"
    },
    {
        "english": "translation",
        "bengali": "অনুবাদ",
        "meaning": "The process of translating words or text from one language into another.",
        "type": "noun",
        "example": "I need a translation of this document.",
        "difficulty": "B1"
    },
    {
        "english": "transport",
        "bengali": "পরিবহন",
        "meaning": "Take or carry (people or goods) from one place to another by means of a vehicle, aircraft, or ship.",
        "type": "noun, verb",
        "example": "Public transport is very good in this city.",
        "difficulty": "B1"
    },
    {
        "english": "transportation",
        "bengali": "পরিবহন",
        "meaning": "The movement of humans, animals, or goods from one location to another.",
        "type": "noun",
        "example": "What is the best means of transportation in this city?",
        "difficulty": "A2"
    },
    {
        "english": "travel",
        "bengali": "ভ্রমণ",
        "meaning": "Make a journey, typically of some length or abroad.",
        "type": "verb, noun",
        "example": "I like to travel.",
        "difficulty": "A1"
    },
    {
        "english": "treat",
        "bengali": "চিকিত্সা করা",
        "meaning": "Behave toward or deal with in a certain way.",
        "type": "verb",
        "example": "He treated me with respect.",
        "difficulty": "B1"
    },
    {
        "english": "treatment",
        "bengali": "চিকিৎসা",
        "meaning": "Medical care given to a patient for an illness or injury.",
        "type": "noun",
        "example": "He is receiving treatment for cancer.",
        "difficulty": "B1"
    },
    {
        "english": "tree",
        "bengali": "গাছ",
        "meaning": "A woody perennial plant, typically having a single stem or trunk growing to a considerable height and bearing lateral branches at some distance from the ground.",
        "type": "noun",
        "example": "There are many trees in the park.",
        "difficulty": "A1"
    },
    {
        "english": "trend",
        "bengali": "প্রবণতা",
        "meaning": "A general direction in which something is developing or changing.",
        "type": "noun",
        "example": "This is a new trend in fashion.",
        "difficulty": "B1"
    },
    {
        "english": "trial",
        "bengali": "বিচার",
        "meaning": "A formal examination of evidence before a judge, and typically before a jury, in order to decide guilt in a case of criminal or civil proceedings.",
        "type": "noun",
        "example": "He is on trial for murder.",
        "difficulty": "B2"
    },
    {
        "english": "trick",
        "bengali": "কৌশল",
        "meaning": "A cunning or skillful act or scheme intended to deceive or outwit someone.",
        "type": "noun, verb",
        "example": "He played a trick on me.",
        "difficulty": "B2"
    },
    {
        "english": "trip",
        "bengali": "ভ্রমণ",
        "meaning": "A journey or excursion, especially for pleasure.",
        "type": "noun, verb",
        "example": "We are going on a trip to Cox's Bazar.",
        "difficulty": "A1"
    },
    {
        "english": "trouble",
        "bengali": "সমস্যা",
        "meaning": "Difficulty or problems.",
        "type": "noun, verb",
        "example": "I am in trouble.",
        "difficulty": "A2"
    },
    {
        "english": "truck",
        "bengali": "ট্রাক",
        "meaning": "A large, heavy motor vehicle used for transporting goods, materials, or troops.",
        "type": "noun",
        "example": "The truck is carrying a heavy load.",
        "difficulty": "A2"
    },
    {
        "english": "truly",
        "bengali": "সত্যিই",
        "meaning": "In a truthful way.",
        "type": "adverb",
        "example": "I am truly sorry.",
        "difficulty": "B2"
    },
    {
        "english": "trust",
        "bengali": "বিশ্বাস",
        "meaning": "Firm belief in the reliability, truth, ability, or strength of someone or something.",
        "type": "noun, verb",
        "example": "I trust you.",
        "difficulty": "B2"
    },
    {
        "english": "truth",
        "bengali": "সত্য",
        "meaning": "That which is true or in accordance with fact or reality.",
        "type": "noun",
        "example": "Tell me the truth.",
        "difficulty": "B1"
    },
    {
        "english": "try",
        "bengali": "চেষ্টা করা",
        "meaning": "Make an attempt or effort to do something.",
        "type": "verb",
        "example": "I will try my best.",
        "difficulty": "A1"
    },
    {
        "english": "T-shirt",
        "bengali": "টি-শার্ট",
        "meaning": "A short-sleeved casual top, having the shape of a T when spread out flat.",
        "type": "noun",
        "example": "He is wearing a T-shirt.",
        "difficulty": "A1"
    },
    {
        "english": "Tuesday",
        "bengali": "মঙ্গলবার",
        "meaning": "The day of the week before Wednesday and following Monday.",
        "type": "noun",
        "example": "I have a meeting on Tuesday.",
        "difficulty": "A1"
    },
    {
        "english": "tunnel",
        "bengali": "টানেল",
        "meaning": "An artificial underground passage, especially one built through a hill or under a building, road, or river.",
        "type": "noun",
        "example": "The train went through a tunnel.",
        "difficulty": "B2"
    },
    {
        "english": "turn",
        "bengali": "ঘোরা",
        "meaning": "Move in a circular direction wholly or partly around an axis or point.",
        "type": "verb, noun",
        "example": "Please turn right.",
        "difficulty": "A1"
    },
    {
        "english": "twelve",
        "bengali": "বারো",
        "meaning": "Equivalent to the sum of ten and two; one more than eleven; 12.",
        "type": "number",
        "example": "There are twelve months in a year.",
        "difficulty": "A1"
    },
    {
        "english": "twenty",
        "bengali": "বিশ",
        "meaning": "The number equivalent to the product of two and ten; ten less than thirty; 20.",
        "type": "number",
        "example": "She is twenty years old.",
        "difficulty": "A1"
    },
    {
        "english": "twice",
        "bengali": "দুইবার",
        "meaning": "Two times; on two occasions.",
        "type": "adverb",
        "example": "I have seen this movie twice.",
        "difficulty": "A2"
    },
    {
        "english": "twin",
        "bengali": "যমজ",
        "meaning": "One of two children or animals born at the same birth.",
        "type": "noun, adjective",
        "example": "She has a twin sister.",
        "difficulty": "A2"
    },
    {
        "english": "two",
        "bengali": "দুই",
        "meaning": "Equivalent to the sum of one and one; one less than three; 2.",
        "type": "number",
        "example": "I have two brothers.",
        "difficulty": "A1"
    },
    {
        "english": "type",
        "bengali": "টাইপ",
        "meaning": "A category of people or things having common characteristics.",
        "type": "noun, verb",
        "example": "What type of music do you like?",
        "difficulty": "A1"
    },
    {
        "english": "typical",
        "bengali": "সাধারণ",
        "meaning": "Having the distinctive qualities of a particular type of person or thing.",
        "type": "adjective",
        "example": "This is a typical example of his work.",
        "difficulty": "A2"
    },
    {
        "english": "typically",
        "bengali": "সাধারণত",
        "meaning": "In most cases; usually.",
        "type": "adverb",
        "example": "I typically go to bed at 10 pm.",
        "difficulty": "A2"
    },
    {
        "english": "ugly",
        "bengali": "কুৎসিত",
        "meaning": "Unpleasant or repulsive, especially in appearance.",
        "type": "adjective",
        "example": "That is an ugly dog.",
        "difficulty": "B1"
    },
    {
        "english": "umbrella",
        "bengali": "ছাতা",
        "meaning": "A device consisting of a circular canopy of cloth on a folding metal frame supported by a central rod, used as protection against rain or sometimes sun.",
        "type": "noun",
        "example": "I need an umbrella.",
        "difficulty": "A1"
    },
    {
        "english": "uncomfortable",
        "bengali": "অস্বস্তিকর",
        "meaning": "Causing or feeling slight pain or physical discomfort.",
        "type": "adjective",
        "example": "This chair is very uncomfortable.",
        "difficulty": "B1"
    },
    {
        "english": "unconscious",
        "bengali": "অজ্ঞান",
        "meaning": "Not conscious.",
        "type": "adjective",
        "example": "He was unconscious for three days.",
        "difficulty": "B2"
    },
    {
        "english": "under",
        "bengali": "নিচে",
        "meaning": "Extending or directly below.",
        "type": "preposition, adverb",
        "example": "The cat is under the table.",
        "difficulty": "A1"
    },
    {
        "english": "underground",
        "bengali": "ভূগর্ভস্থ",
        "meaning": "Beneath the surface of the ground.",
        "type": "adjective, adverb",
        "example": "There is an underground railway in this city.",
        "difficulty": "B1"
    },
    {
        "english": "understand",
        "bengali": "বুঝতে পারা",
        "meaning": "Perceive the intended meaning of (words, a language, or a speaker).",
        "type": "verb",
        "example": "I understand what you are saying.",
        "difficulty": "A1"
    },
    {
        "english": "understanding",
        "bengali": "বোঝাপড়া",
        "meaning": "The ability to understand something; comprehension.",
        "type": "noun",
        "example": "He has a good understanding of the subject.",
        "difficulty": "B1"
    },
    {
        "english": "underwear",
        "bengali": "অন্তর্বাস",
        "meaning": "Clothing worn under other clothes, typically next to the skin.",
        "type": "noun",
        "example": "I need to buy some new underwear.",
        "difficulty": "B1"
    },
    {
        "english": "unemployed",
        "bengali": "বেকার",
        "meaning": "(of a person) without a paid job but available to work.",
        "type": "adjective",
        "example": "He is unemployed.",
        "difficulty": "B1"
    },
    {
        "english": "unemployment",
        "bengali": "বেকারত্ব",
        "meaning": "The state of being unemployed.",
        "type": "noun",
        "example": "Unemployment is a major problem in this country.",
        "difficulty": "B1"
    },
    {
        "english": "unexpected",
        "bengali": "অপ্রত্যাশিত",
        "meaning": "Not expected or regarded as likely to happen.",
        "type": "adjective",
        "example": "It was an unexpected result.",
        "difficulty": "B1"
    },
    {
        "english": "unfair",
        "bengali": "অন্যায়",
        "meaning": "Not based on or behaving according to the principles of equality and justice.",
        "type": "adjective",
        "example": "The decision was unfair.",
        "difficulty": "B1"
    },
    {
        "english": "unfortunately",
        "bengali": " দুর্ভাগ্যবশত",
        "meaning": "It is unfortunate that.",
        "type": "adverb",
        "example": "Unfortunately, I can't come to the party.",
        "difficulty": "A2"
    },
    {
        "english": "uniform",
        "bengali": "ইউনিফর্ম",
        "meaning": "The distinctive clothing worn by members of the same organization or body or by children attending certain schools.",
        "type": "noun",
        "example": "The students have to wear a uniform.",
        "difficulty": "B1"
    },
    {
        "english": "union",
        "bengali": "ইউনিয়ন",
        "meaning": "The action or fact of joining or being joined, especially in a political context.",
        "type": "noun",
        "example": "He is a member of the trade union.",
        "difficulty": "B2"
    },
    {
        "english": "unique",
        "bengali": "অনন্য",
        "meaning": "Being the only one of its kind; unlike anything else.",
        "type": "adjective",
        "example": "This is a unique opportunity.",
        "difficulty": "B2"
    },
    {
        "english": "unit",
        "bengali": "একক",
        "meaning": "An individual thing or person regarded as single and complete but which can also form an individual component of a larger or more complex whole.",
        "type": "noun",
        "example": "The family is the basic unit of society.",
        "difficulty": "A2"
    },
    {
        "english": "united",
        "bengali": "একত্রিত",
        "meaning": "Joined together politically, for a common purpose, or by common feelings.",
        "type": "adjective",
        "example": "We are united in our decision.",
        "difficulty": "A2"
    },
    {
        "english": "universe",
        "bengali": "মহাবিশ্ব",
        "meaning": "All existing matter and space considered as a whole; the cosmos.",
        "type": "noun",
        "example": "The universe is a vast and mysterious place.",
        "difficulty": "B1"
    },
    {
        "english": "university",
        "bengali": "বিশ্ববিদ্যালয়",
        "meaning": "A high-level educational institution in which students study for degrees and academic research is done.",
        "type": "noun",
        "example": "He is a student at Dhaka University.",
        "difficulty": "A1"
    },
    {
        "english": "unless",
        "bengali": "যদি না",
        "meaning": "Except if (used to introduce a case in which a statement being made is not true or valid).",
        "type": "conjunction",
        "example": "I will not go unless you come with me.",
        "difficulty": "B1"
    },
    {
        "english": "unlikely",
        "bengali": "অসম্ভাব্য",
        "meaning": "Not likely to happen, be done, or be true; improbable.",
        "type": "adjective",
        "example": "It is unlikely that he will come.",
        "difficulty": "B1"
    },
    {
        "english": "unnecessary",
        "bengali": "অপ্রয়োজনীয়",
        "meaning": "Not needed.",
        "type": "adjective",
        "example": "It is unnecessary to do that.",
        "difficulty": "B1"
    },
    {
        "english": "unpleasant",
        "bengali": "অপ্রীতিকর",
        "meaning": "Causing discomfort, unhappiness, or revulsion; disagreeable.",
        "type": "adjective",
        "example": "It was an unpleasant experience.",
        "difficulty": "B1"
    },
    {
        "english": "until",
        "bengali": "যতক্ষণ না",
        "meaning": "Up to (the point in time or the event mentioned).",
        "type": "conjunction, preposition",
        "example": "I will wait until you come back.",
        "difficulty": "A1"
    },
    {
        "english": "unusual",
        "bengali": "অস্বাভাবিক",
        "meaning": "Not habitually or commonly occurring or done.",
        "type": "adjective",
        "example": "It is unusual for him to be late.",
        "difficulty": "A2"
    },
    {
        "english": "up",
        "bengali": "উপরে",
        "meaning": "Toward a higher place or position.",
        "type": "adverb, preposition",
        "example": "Look up at the sky.",
        "difficulty": "A1"
    },
    {
        "english": "update",
        "bengali": "আপডেট",
        "meaning": "Make (something) more modern or up to date.",
        "type": "verb, noun",
        "example": "I need to update my software.",
        "difficulty": "B1"
    },
    {
        "english": "upon",
        "bengali": "উপর",
        "meaning": "More formal term for on.",
        "type": "preposition",
        "example": "He sat upon the throne.",
        "difficulty": "B1"
    },
    {
        "english": "upper",
        "bengali": "উপরের",
        "meaning": "Situated above another part.",
        "type": "adjective",
        "example": "The upper floor of the house is very nice.",
        "difficulty": "B1"
    },
    {
        "english": "upset",
        "bengali": "বিচলিত",
        "meaning": "Make (someone) unhappy, disappointed, or worried.",
        "type": "adjective",
        "example": "She was upset to hear the news.",
        "difficulty": "B1"
    },
    {
        "english": "upstairs",
        "bengali": "উপরের তলা",
        "meaning": "Up the stairs; on or to a higher floor.",
        "type": "adverb, adjective, noun",
        "example": "The bedroom is upstairs.",
        "difficulty": "A1"
    },
    {
        "english": "upward",
        "bengali": "ঊর্ধ্বগামী",
        "meaning": "Toward a higher place, point, or level.",
        "type": "adverb",
        "example": "The path leads upward to the mountain.",
        "difficulty": "B2"
    },
    {
        "english": "urge",
        "bengali": "অনুরোধ করা",
        "meaning": "A strong desire or impulse.",
        "type": "verb, noun",
        "example": "I have an urge to travel.",
        "difficulty": "B2"
    },
    {
        "english": "us",
        "bengali": "আমাদেরকে",
        "meaning": "Used by a speaker to refer to himself or herself and one or more other people as the object of a verb or preposition.",
        "type": "pronoun",
        "example": "He gave the book to us.",
        "difficulty": "A1"
    },
    {
        "english": "use",
        "bengali": "ব্যবহার করা",
        "meaning": "Take, hold, or deploy (something) as a means of accomplishing a purpose or achieving a result; employ.",
        "type": "verb, noun",
        "example": "Can I use your phone?",
        "difficulty": "A1"
    },
    {
        "english": "used",
        "bengali": "ব্যবহৃত",
        "meaning": "Having been used before.",
        "type": "adjective",
        "example": "This is a used car.",
        "difficulty": "B1"
    },
    {
        "english": "used to",
        "bengali": "অভ্যস্ত",
        "meaning": "Be accustomed to.",
        "type": "modal verb",
        "example": "I am used to getting up early.",
        "difficulty": "B1"
    },
    {
        "english": "useful",
        "bengali": "দরকারী",
        "meaning": "Able to be used for a practical purpose or in several ways.",
        "type": "adjective",
        "example": "This is a useful tool.",
        "difficulty": "A2"
    },
    {
        "english": "user",
        "bengali": "ব্যবহারকারী",
        "meaning": "A person who uses or operates something, especially a computer or other machine.",
        "type": "noun",
        "example": "The user manual is very helpful.",
        "difficulty": "A2"
    },
    {
        "english": "usual",
        "bengali": "সাধারণ",
        "meaning": "Habitually or typically occurring or done; customary.",
        "type": "adjective",
        "example": "This is my usual routine.",
        "difficulty": "A2"
    },
    {
        "english": "usually",
        "bengali": "সাধারণত",
        "meaning": "Under normal conditions; generally.",
        "type": "adverb",
        "example": "I usually go to bed at 10 pm.",
        "difficulty": "A1"
    },
    {
        "english": "vacation",
        "bengali": "ছুটি",
        "meaning": "An extended period of leisure and recreation, especially one spent away from home or in traveling.",
        "type": "noun",
        "example": "We are going on vacation next week.",
        "difficulty": "A1"
    },
    {
        "english": "valley",
        "bengali": "উপত্যকা",
        "meaning": "A low area of land between hills or mountains, typically with a river or stream flowing through it.",
        "type": "noun",
        "example": "The valley is very beautiful.",
        "difficulty": "B2"
    },
    {
        "english": "valuable",
        "bengali": "মূল্যবান",
        "meaning": "Worth a great deal of money.",
        "type": "adjective",
        "example": "This is a valuable painting.",
        "difficulty": "B1"
    },
    {
        "english": "value",
        "bengali": "মূল্য",
        "meaning": "The regard that something is held to deserve; the importance, worth, or usefulness of something.",
        "type": "noun, verb",
        "example": "What is the value of this car?",
        "difficulty": "B1"
    },
    {
        "english": "van",
        "bengali": "ভ্যান",
        "meaning": "A medium-sized motor vehicle, typically without side windows in the rear part, for transporting goods.",
        "type": "noun",
        "example": "The delivery van is here.",
        "difficulty": "A2"
    },
    {
        "english": "variety",
        "bengali": "বৈচিত্র্য",
        "meaning": "The quality or state of being different or diverse; the absence of uniformity, sameness, or monotony.",
        "type": "noun",
        "example": "There is a variety of food at the buffet.",
        "difficulty": "A2"
    },
    {
        "english": "various",
        "bengali": "বিভিন্ন",
        "meaning": "Different from one another; of different kinds or sorts.",
        "type": "adjective",
        "example": "There are various reasons for my decision.",
        "difficulty": "B1"
    },
    {
        "english": "vary",
        "bengali": "পরিবর্তিত হওয়া",
        "meaning": "Differ in size, amount, degree, or nature from something else of the same general class.",
        "type": "verb",
        "example": "The prices vary depending on the season.",
        "difficulty": "B2"
    },
    {
        "english": "vast",
        "bengali": "বিশাল",
        "meaning": "Of very great extent or quantity; immense.",
        "type": "adjective",
        "example": "The ocean is a vast expanse of water.",
        "difficulty": "B2"
    },
    {
        "english": "vegetable",
        "bengali": "সবজি",
        "meaning": "A plant or part of a plant used as food, such as a cabbage, potato, turnip, or bean.",
        "type": "noun",
        "example": "I like to eat vegetables.",
        "difficulty": "A1"
    },
    {
        "english": "vehicle",
        "bengali": "যানবাহন",
        "meaning": "A thing used for transporting people or goods, especially on land, such as a car, truck, or cart.",
        "type": "noun",
        "example": "This is a public vehicle.",
        "difficulty": "A2"
    },
    {
        "english": "version",
        "bengali": "সংস্করণ",
        "meaning": "A particular form of something differing in certain respects from an earlier form or other forms of the same type of thing.",
        "type": "noun",
        "example": "This is the latest version of the software.",
        "difficulty": "B1"
    },
    {
        "english": "very",
        "bengali": "খুব",
        "meaning": "In a high degree.",
        "type": "adverb",
        "example": "I am very tired.",
        "difficulty": "A1"
    },
    {
        "english": "via",
        "bengali": "মাধ্যমে",
        "meaning": "Traveling through (a place) en route to a destination.",
        "type": "preposition",
        "example": "We are flying to London via Dubai.",
        "difficulty": "B2"
    },
    {
        "english": "victim",
        "bengali": "শিকার",
        "meaning": "A person harmed, injured, or killed as a result of a crime, accident, or other event or action.",
        "type": "noun",
        "example": "He was the victim of a robbery.",
        "difficulty": "B1"
    },
    {
        "english": "victory",
        "bengali": "বিজয়",
        "meaning": "An act of defeating an enemy or opponent in a battle, game, or other competition.",
        "type": "noun",
        "example": "It was a great victory for our team.",
        "difficulty": "B2"
    },
    {
        "english": "video",
        "bengali": "ভিডিও",
        "meaning": "The recording, reproducing, or broadcasting of moving visual images.",
        "type": "noun",
        "example": "I watched a video last night.",
        "difficulty": "A1"
    },
    {
        "english": "view",
        "bengali": "দৃশ্য",
        "meaning": "The ability to see something or to be seen from a particular place.",
        "type": "noun, verb",
        "example": "The view from the top of the mountain is beautiful.",
        "difficulty": "A2"
    },
    {
        "english": "viewer",
        "bengali": "দর্শক",
        "meaning": "A person who looks at or watches something.",
        "type": "noun",
        "example": "The show has a lot of viewers.",
        "difficulty": "B1"
    },
    {
        "english": "village",
        "bengali": "গ্রাম",
        "meaning": "A group of houses and associated buildings, larger than a hamlet and smaller than a town, situated in a rural area.",
        "type": "noun",
        "example": "I live in a small village.",
        "difficulty": "A1"
    },
    {
        "english": "violence",
        "bengali": "সহিংসতা",
        "meaning": "Behavior involving physical force intended to hurt, damage, or kill someone or something.",
        "type": "noun",
        "example": "There is too much violence on television.",
        "difficulty": "B2"
    },
    {
        "english": "violent",
        "bengali": "হিংস্র",
        "meaning": "Using or involving physical force intended to hurt, damage, or kill someone or something.",
        "type": "adjective",
        "example": "He is a violent person.",
        "difficulty": "B2"
    },
    {
        "english": "virtual",
        "bengali": "ভার্চুয়াল",
        "meaning": "Not physically existing as such but made by software to appear to do so.",
        "type": "adjective",
        "example": "We had a virtual meeting.",
        "difficulty": "B2"
    },
    {
        "english": "virus",
        "bengali": "ভাইরাস",
        "meaning": "An infective agent that typically consists of a nucleic acid molecule in a protein coat, is too small to be seen by light microscopy, and is able to multiply only within the living cells of a host.",
        "type": "noun",
        "example": "The computer is infected with a virus.",
        "difficulty": "A2"
    },
    {
        "english": "vision",
        "bengali": "দৃষ্টি",
        "meaning": "The faculty or state of being able to see.",
        "type": "noun",
        "example": "He has good vision.",
        "difficulty": "B2"
    },
    {
        "english": "visit",
        "bengali": "পরিদর্শন করা",
        "meaning": "Go to see and spend time with (someone) socially.",
        "type": "verb, noun",
        "example": "I am going to visit my grandparents.",
        "difficulty": "A1"
    },
    {
        "english": "visitor",
        "bengali": "পরিদর্শক",
        "meaning": "A person visiting a person or place.",
        "type": "noun",
        "example": "We have a visitor.",
        "difficulty": "A1"
    },
    {
        "english": "vital",
        "bengali": "অপরিহার্য",
        "meaning": "Absolutely necessary or important; essential.",
        "type": "adjective",
        "example": "It is vital to get enough sleep.",
        "difficulty": "B2"
    },
    {
        "english": "vitamin",
        "bengali": "ভিটামিন",
        "meaning": "Any of a group of organic compounds that are essential for normal growth and nutrition and are required in small quantities in the diet because they cannot be synthesized by the body.",
        "type": "noun",
        "example": "Oranges are a good source of vitamin C.",
        "difficulty": "B1"
    },
    {
        "english": "voice",
        "bengali": "কণ্ঠস্বর",
        "meaning": "The sound produced in a person's larynx and uttered through the mouth, as speech or song.",
        "type": "noun",
        "example": "She has a beautiful voice.",
        "difficulty": "A2"
    },
    {
        "english": "volume",
        "bengali": "আয়তন",
        "meaning": "The amount of space that a substance or object occupies, or that is enclosed within a container, especially when great.",
        "type": "noun",
        "example": "Please turn down the volume.",
        "difficulty": "B2"
    },
    {
        "english": "vote",
        "bengali": "ভোট",
        "meaning": "A formal indication of a choice between two or more candidates or courses of action, expressed typically through a ballot or a show of hands or by voice.",
        "type": "noun, verb",
        "example": "I am going to vote in the election.",
        "difficulty": "B1"
    },
    {
        "english": "vulnerable",
        "bengali": "ঝুঁকিপূর্ণ",
        "meaning": "Exposed to the possibility of being attacked or harmed, either physically or emotionally.",
        "type": "adjective",
        "example": "The elderly are particularly vulnerable to this disease.",
        "difficulty": "B2"
    },
    {
        "english": "wage",
        "bengali": "মজুরি",
        "meaning": "A fixed regular payment, typically paid on a daily or weekly basis, made by an employer to an employee, especially to a manual or unskilled worker.",
        "type": "noun",
        "example": "He earns a good wage.",
        "difficulty": "B2"
    },
    {
        "english": "wait",
        "bengali": "অপেক্ষা করা",
        "meaning": "Stay where one is or delay action until a particular time or until something else happens.",
        "type": "verb",
        "example": "Please wait for me.",
        "difficulty": "A1"
    },
    {
        "english": "waiter",
        "bengali": "ওয়েটার",
        "meaning": "A man whose job is to serve customers at their tables in a restaurant.",
        "type": "noun",
        "example": "The waiter is very friendly.",
        "difficulty": "A1"
    },
    {
        "english": "wake",
        "bengali": "জেগে ওঠা",
        "meaning": "Emerge or cause to emerge from a state of sleep; stop sleeping.",
        "type": "verb",
        "example": "What time do you wake up?",
        "difficulty": "A1"
    },
    {
        "english": "walk",
        "bengali": "হাঁটা",
        "meaning": "Move at a regular pace by lifting and setting down each foot in turn, never having both feet off the ground at once.",
        "type": "verb, noun",
        "example": "I like to go for a walk in the evening.",
        "difficulty": "A1"
    },
    {
        "english": "wall",
        "bengali": "দেয়াল",
        "meaning": "A continuous vertical brick or stone structure that encloses or divides an area of land.",
        "type": "noun",
        "example": "The picture is on the wall.",
        "difficulty": "A1"
    },
    {
        "english": "want",
        "bengali": "চাওয়া",
        "meaning": "Have a desire to possess or do (something); wish for.",
        "type": "verb",
        "example": "What do you want?",
        "difficulty": "A1"
    },
    {
        "english": "war",
        "bengali": "যুদ্ধ",
        "meaning": "A state of armed conflict between different nations or states or different groups within a nation or state.",
        "type": "noun",
        "example": "The country is at war.",
        "difficulty": "A1"
    },
    {
        "english": "warm",
        "bengali": "উষ্ণ",
        "meaning": "Of or at a fairly or comfortably high temperature.",
        "type": "adjective, verb",
        "example": "It's a warm day.",
        "difficulty": "A1"
    },
    {
        "english": "warn",
        "bengali": "সতর্ক করা",
        "meaning": "Inform someone in advance of a possible danger, problem, or other unpleasant situation.",
        "type": "verb",
        "example": "I warned you not to do that.",
        "difficulty": "B1"
    },
    {
        "english": "warning",
        "bengali": "সতর্কতা",
        "meaning": "A statement or event that indicates a possible or impending danger, problem, or other unpleasant situation.",
        "type": "noun",
        "example": "This is a warning.",
        "difficulty": "B1"
    },
    {
        "english": "wash",
        "bengali": "ধোয়া",
        "meaning": "Clean with water and, typically, soap or detergent.",
        "type": "verb",
        "example": "I need to wash my hands.",
        "difficulty": "A1"
    },
    {
        "english": "washing",
        "bengali": "ধোয়া",
        "meaning": "The action of washing something.",
        "type": "noun",
        "example": "I need to do the washing.",
        "difficulty": "A2"
    },
    {
        "english": "waste",
        "bengali": "অপচয়",
        "meaning": "Use or expend carelessly, extravagantly, or to no purpose.",
        "type": "verb, noun",
        "example": "Don't waste your money.",
        "difficulty": "B1"
    },
    {
        "english": "watch",
        "bengali": "দেখা",
        "meaning": "Look at or observe attentively over a period of time.",
        "type": "verb, noun",
        "example": "I like to watch movies.",
        "difficulty": "A1"
    },
    {
        "english": "water",
        "bengali": "পানি",
        "meaning": "A colorless, transparent, odorless liquid that forms the seas, lakes, rivers, and rain and is the basis of the fluids of living organisms.",
        "type": "noun",
        "example": "I need a glass of water.",
        "difficulty": "A1"
    },
    {
        "english": "wave",
        "bengali": "ঢেউ",
        "meaning": "A long body of water curling into an arched form and breaking on the shore.",
        "type": "noun, verb",
        "example": "The waves are very high today.",
        "difficulty": "A1"
    },
    {
        "english": "way",
        "bengali": "পথ",
        "meaning": "A method, style, or manner of doing something.",
        "type": "noun",
        "example": "This is the best way to do it.",
        "difficulty": "A1"
    },
    {
        "english": "we",
        "bengali": "আমরা",
        "meaning": "Used by a speaker to refer to himself or herself and one or more other people considered together.",
        "type": "pronoun",
        "example": "We are friends.",
        "difficulty": "A1"
    },
    {
        "english": "weak",
        "bengali": "দুর্বল",
        "meaning": "Lacking the power to perform physically demanding tasks; lacking physical strength and energy.",
        "type": "adjective",
        "example": "He is too weak to work.",
        "difficulty": "A2"
    },
    {
        "english": "weakness",
        "bengali": "দুর্বলতা",
        "meaning": "The state or condition of lacking strength.",
        "type": "noun",
        "example": "His weakness is his love of money.",
        "difficulty": "B2"
    },
    {
        "english": "wealth",
        "bengali": "সম্পদ",
        "meaning": "An abundance of valuable possessions or money.",
        "type": "noun",
        "example": "He has great wealth.",
        "difficulty": "B2"
    },
    {
        "english": "wealthy",
        "bengali": "ধনী",
        "meaning": "Having a great deal of money, resources, or assets; rich.",
        "type": "adjective",
        "example": "He is a wealthy man.",
        "difficulty": "B2"
    },
    {
        "english": "weapon",
        "bengali": "অস্ত্র",
        "meaning": "A thing designed or used for inflicting bodily harm or physical damage.",
        "type": "noun",
        "example": "The police found a weapon at the scene of the crime.",
        "difficulty": "B1"
    },
    {
        "english": "wear",
        "bengali": "পরিধান করা",
        "meaning": "Have on one's body or a part of one's body as clothing, decoration, protection, or for some other purpose.",
        "type": "verb",
        "example": "What are you going to wear?",
        "difficulty": "A1"
    },
    {
        "english": "weather",
        "bengali": "আবহাওয়া",
        "meaning": "The state of the atmosphere at a place and time as regards heat, dryness, sunshine, wind, rain, etc.",
        "type": "noun",
        "example": "The weather is nice today.",
        "difficulty": "A1"
    },
    {
        "english": "web",
        "bengali": "ওয়েব",
        "meaning": "A network of fine threads constructed by a spider from fluid secreted by its spinnerets, used to catch its prey.",
        "type": "noun",
        "example": "The spider is spinning a web.",
        "difficulty": "A2"
    },
    {
        "english": "website",
        "bengali": "ওয়েবসাইট",
        "meaning": "A set of related web pages located under a single domain name, typically produced by a single person or organization.",
        "type": "noun",
        "example": "The company has a new website.",
        "difficulty": "A1"
    },
    {
        "english": "wedding",
        "bengali": "বিবাহ",
        "meaning": "A marriage ceremony, especially considered as including the associated celebrations.",
        "type": "noun",
        "example": "Are you going to the wedding?",
        "difficulty": "A1"
    },
    {
        "english": "Wednesday",
        "bengali": "বুধবার",
        "meaning": "The day of the week before Thursday and following Tuesday.",
        "type": "noun",
        "example": "I have a meeting on Wednesday.",
        "difficulty": "A1"
    },
    {
        "english": "week",
        "bengali": "সপ্তাহ",
        "meaning": "A period of seven days.",
        "type": "noun",
        "example": "I will be on holiday for a week.",
        "difficulty": "A1"
    },
    {
        "english": "weekend",
        "bengali": "সপ্তাহান্ত",
        "meaning": "Saturday and Sunday, or the period from Friday evening to Sunday evening, especially when regarded as a time for leisure.",
        "type": "noun",
        "example": "What are your plans for the weekend?",
        "difficulty": "A1"
    },
    {
        "english": "weigh",
        "bengali": "ওজন করা",
        "meaning": "Find out how heavy (someone or something) is, typically using scales.",
        "type": "verb",
        "example": "How much do you weigh?",
        "difficulty": "B1"
    },
    {
        "english": "weight",
        "bengali": "ওজন",
        "meaning": "The heaviness of a person or thing.",
        "type": "noun",
        "example": "What is your weight?",
        "difficulty": "A2"
    },
    {
        "english": "welcome",
        "bengali": "স্বাগতম",
        "meaning": "An instance or manner of greeting someone.",
        "type": "exclamation, verb, adjective, noun",
        "example": "Welcome to my house.",
        "difficulty": "A1"
    },
    {
        "english": "well",
        "bengali": "ভাল",
        "meaning": "In a good or satisfactory way.",
        "type": "exclamation, adverb, adjective, noun",
        "example": "He did the job well.",
        "difficulty": "A1"
    },
    {
        "english": "west",
        "bengali": "পশ্চিম",
        "meaning": "The direction toward the point of the horizon where the sun sets at the equinoxes, on the left-hand side of a person facing north, or the part of the horizon lying in this direction.",
        "type": "noun, adjective, adverb",
        "example": "The sun sets in the west.",
        "difficulty": "A1"
    },
    {
        "english": "western",
        "bengali": "পশ্চিমা",
        "meaning": "Situated in, directed toward, or facing the west.",
        "type": "adjective",
        "example": "He lives in the western part of the country.",
        "difficulty": "B1"
    },
    {
        "english": "wet",
        "bengali": "ভেজা",
        "meaning": "Covered or saturated with water or another liquid.",
        "type": "adjective",
        "example": "My clothes are wet.",
        "difficulty": "A1"
    },
    {
        "english": "what",
        "bengali": "কি",
        "meaning": "Asking for information specifying something.",
        "type": "determiner, pronoun, adverb",
        "example": "What is your name?",
        "difficulty": "A1"
    },
    {
        "english": "whatever",
        "bengali": "যা কিছু",
        "meaning": "It is not important what is; it makes no difference what (used to emphasize a lack of restriction in referring to any thing or amount, in a particular situation).",
        "type": "determiner, pronoun",
        "example": "Do whatever you want.",
        "difficulty": "B1"
    },
    {
        "english": "wheel",
        "bengali": "চাকা",
        "meaning": "A circular object that revolves on an axle and is fixed below a vehicle or other object to enable it to move easily over the ground.",
        "type": "noun",
        "example": "The car has four wheels.",
        "difficulty": "A2"
    },
    {
        "english": "when",
        "bengali": "কখন",
        "meaning": "At what time.",
        "type": "adverb, conjunction",
        "example": "When will you come?",
        "difficulty": "A1"
    },
    {
        "english": "whenever",
        "bengali": "যখনই",
        "meaning": "At whatever time; on whatever occasion (emphasizing a lack of restriction).",
        "type": "conjunction",
        "example": "Come whenever you like.",
        "difficulty": "B1"
    },
    {
        "english": "where",
        "bengali": "কোথায়",
        "meaning": "In or to what place or position.",
        "type": "adverb, conjunction",
        "example": "Where are you going?",
        "difficulty": "A1"
    },
    {
        "english": "whereas",
        "bengali": "যেখানে",
        "meaning": "In contrast or comparison with the fact that.",
        "type": "conjunction",
        "example": "He is rich, whereas his brother is poor.",
        "difficulty": "B2"
    },
    {
        "english": "wherever",
        "bengali": "যেখানেই",
        "meaning": "In or to whatever place (emphasizing a lack of restriction).",
        "type": "conjunction",
        "example": "Sit wherever you like.",
        "difficulty": "B1"
    },
    {
        "english": "whether",
        "bengali": "কিনা",
        "meaning": "Expressing a doubt or choice between alternatives.",
        "type": "conjunction",
        "example": "I don't know whether he will come.",
        "difficulty": "A2"
    },
    {
        "english": "which",
        "bengali": "কোনটি",
        "meaning": "Asking for information specifying one or more people or things from a definite set.",
        "type": "pronoun, determiner",
        "example": "Which book do you want?",
        "difficulty": "A1"
    },
    {
        "english": "while",
        "bengali": "যখন",
        "meaning": "During the time that; at the same time as.",
        "type": "conjunction, noun",
        "example": "I read a book while I was waiting.",
        "difficulty": "A1"
    },
    {
        "english": "white",
        "bengali": "সাদা",
        "meaning": "Of the color of milk or fresh snow, due to the reflection of all visible rays of light; the opposite of black.",
        "type": "adjective, noun",
        "example": "She is wearing a white dress.",
        "difficulty": "A1"
    },
    {
        "english": "who",
        "bengali": "কে",
        "meaning": "What or which person or people.",
        "type": "pronoun",
        "example": "Who is that man?",
        "difficulty": "A1"
    },
    {
        "english": "whole",
        "bengali": "পুরো",
        "meaning": "All of; entire.",
        "type": "adjective, noun",
        "example": "I ate the whole cake.",
        "difficulty": "A2"
    },
    {
        "english": "whom",
        "bengali": "কাকে",
        "meaning": "Used instead of ‘who’ as the object of a verb or preposition.",
        "type": "pronoun",
        "example": "To whom did you give the book?",
        "difficulty": "B2"
    },
    {
        "english": "whose",
        "bengali": "যার",
        "meaning": "Belonging to or associated with which person.",
        "type": "determiner, pronoun",
        "example": "Whose book is this?",
        "difficulty": "A2"
    },
    {
        "english": "why",
        "bengali": "কেন",
        "meaning": "For what reason or purpose.",
        "type": "adverb",
        "example": "Why are you late?",
        "difficulty": "A1"
    },
    {
        "english": "wide",
        "bengali": "প্রশস্ত",
        "meaning": "Of great or more than average width.",
        "type": "adjective",
        "example": "The river is very wide.",
        "difficulty": "A2"
    },
    {
        "english": "widely",
        "bengali": "ব্যাপকভাবে",
        "meaning": "Over a wide area or among a large number of people.",
        "type": "adverb",
        "example": "The book is widely read.",
        "difficulty": "B2"
    },
    {
        "english": "wife",
        "bengali": "স্ত্রী",
        "meaning": "A married woman considered in relation to her spouse.",
        "type": "noun",
        "example": "He loves his wife very much.",
        "difficulty": "A1"
    },
    {
        "english": "wild",
        "bengali": "বন্য",
        "meaning": "(of an animal or plant) living or growing in the natural environment; not domesticated or cultivated.",
        "type": "adjective",
        "example": "The lion is a wild animal.",
        "difficulty": "A2"
    },
    {
        "english": "wildlife",
        "bengali": "বন্যপ্রাণী",
        "meaning": "Wild animals collectively; the native fauna (and sometimes flora) of a region.",
        "type": "noun",
        "example": "We need to protect our wildlife.",
        "difficulty": "B2"
    },
    {
        "english": "will",
        "bengali": "করব",
        "meaning": "Expressing the future tense.",
        "type": "modal verb, noun",
        "example": "I will go there tomorrow.",
        "difficulty": "A1"
    },
    {
        "english": "willing",
        "bengali": "ইচ্ছুক",
        "meaning": "Ready, eager, or prepared to do something.",
        "type": "adjective",
        "example": "I am willing to help you.",
        "difficulty": "B2"
    },
    {
        "english": "win",
        "bengali": "জেতা",
        "meaning": "Be successful or victorious in (a contest or conflict).",
        "type": "verb",
        "example": "I want to win this game.",
        "difficulty": "A1"
    },
    {
        "english": "wind",
        "bengali": "বাতাস",
        "meaning": "The perceptible natural movement of the air, especially in the form of a current of air blowing from a particular direction.",
        "type": "noun",
        "example": "The wind is blowing.",
        "difficulty": "A1"
    },
    {
        "english": "window",
        "bengali": "জানালা",
        "meaning": "An opening in the wall or roof of a building or vehicle, fitted with glass or other transparent material in a frame to admit light or air and allow people to see out.",
        "type": "noun",
        "example": "Please open the window.",
        "difficulty": "A1"
    },
    {
        "english": "wine",
        "bengali": "ওয়াইন",
        "meaning": "An alcoholic drink made from fermented grape juice.",
        "type": "noun",
        "example": "I would like a glass of wine.",
        "difficulty": "A1"
    },
    {
        "english": "wing",
        "bengali": "ডানা",
        "meaning": "A modified forelimb of a bird, bat, or insect, used for flying.",
        "type": "noun",
        "example": "The bird has a broken wing.",
        "difficulty": "B1"
    },
    {
        "english": "winner",
        "bengali": "বিজয়ী",
        "meaning": "A person or thing that wins something.",
        "type": "noun",
        "example": "He is the winner of the competition.",
        "difficulty": "A1"
    },
    {
        "english": "winter",
        "bengali": "শীতকাল",
        "meaning": "The coldest season of the year, in the northern hemisphere from December to February and in the southern hemisphere from June to August.",
        "type": "noun",
        "example": "I love winter.",
        "difficulty": "A1"
    },
    {
        "english": "wire",
        "bengali": "তার",
        "meaning": "Metal drawn out into the form of a thin flexible thread or rod.",
        "type": "noun",
        "example": "The telephone wire is broken.",
        "difficulty": "B1"
    },
    {
        "english": "wise",
        "bengali": "জ্ঞানী",
        "meaning": "Having or showing experience, knowledge, and good judgment.",
        "type": "adjective",
        "example": "He is a wise man.",
        "difficulty": "B2"
    },
    {
        "english": "wish",
        "bengali": "ইচ্ছা",
        "meaning": "Feel or express a strong desire or hope for something that is not easily attainable; want something that cannot or probably will not happen.",
        "type": "verb, noun",
        "example": "I wish I could fly.",
        "difficulty": "A2"
    },
    {
        "english": "with",
        "bengali": "সাথে",
        "meaning": "Accompanied by (another person or thing).",
        "type": "preposition",
        "example": "I am with my friends.",
        "difficulty": "A1"
    },
    {
        "english": "within",
        "bengali": "ভিতরে",
        "meaning": "Inside (something).",
        "type": "preposition",
        "example": "The house is within the city limits.",
        "difficulty": "B1"
    },
    {
        "english": "without",
        "bengali": "ছাড়া",
        "meaning": "In the absence of.",
        "type": "preposition",
        "example": "I can't live without you.",
        "difficulty": "A1"
    },
    {
        "english": "witness",
        "bengali": "সাক্ষী",
        "meaning": "A person who sees an event, typically a crime or accident, take place.",
        "type": "noun",
        "example": "He was a witness to the accident.",
        "difficulty": "B1"
    },
    {
        "english": "woman",
        "bengali": "মহিলা",
        "meaning": "An adult human female.",
        "type": "noun",
        "example": "She is a beautiful woman.",
        "difficulty": "A1"
    },
    {
        "english": "wonder",
        "bengali": "আশ্চর্য",
        "meaning": "A feeling of surprise mingled with admiration, caused by something beautiful, unexpected, unfamiliar, or inexplicable.",
        "type": "noun, verb",
        "example": "I wonder what he is doing.",
        "difficulty": "A2"
    },
    {
        "english": "wonderful",
        "bengali": "চমৎকার",
        "meaning": "Inspiring delight, pleasure, or admiration; extremely good; marvelous.",
        "type": "adjective",
        "example": "We had a wonderful time.",
        "difficulty": "A1"
    },
    {
        "english": "wood",
        "bengali": "কাঠ",
        "meaning": "The hard fibrous material forming the main substance of the trunk or branches of a tree or shrub, used for fuel or timber.",
        "type": "noun",
        "example": "The table is made of wood.",
        "difficulty": "A1"
    },
    {
        "english": "wooden",
        "bengali": "কাঠের",
        "meaning": "Made of wood.",
        "type": "adjective",
        "example": "This is a wooden chair.",
        "difficulty": "A2"
    },
    {
        "english": "word",
        "bengali": "শব্দ",
        "meaning": "A single distinct meaningful element of speech or writing, used with others (or sometimes alone) to form a sentence and typically shown with a space on either side when written or printed.",
        "type": "noun",
        "example": "What does this word mean?",
        "difficulty": "A1"
    },
    {
        "english": "work",
        "bengali": "কাজ",
        "meaning": "Activity involving mental or physical effort done in order to achieve a purpose or result.",
        "type": "noun, verb",
        "example": "I have a lot of work to do.",
        "difficulty": "A1"
    },
    {
        "english": "worker",
        "bengali": "কর্মী",
        "meaning": "A person who does a specified type of work or who works in a specified way.",
        "type": "noun",
        "example": "He is a hard worker.",
        "difficulty": "A1"
    },
    {
        "english": "working",
        "bengali": "কাজ করা",
        "meaning": "Having a job.",
        "type": "adjective",
        "example": "She is a working mother.",
        "difficulty": "A2"
    },
    {
        "english": "world",
        "bengali": "বিশ্ব",
        "meaning": "The earth, together with all of its countries, peoples, and natural features.",
        "type": "noun",
        "example": "The world is a beautiful place.",
        "difficulty": "A1"
    },
    {
        "english": "worldwide",
        "bengali": "বিশ্বব্যাপী",
        "meaning": "Extending or reaching throughout the world.",
        "type": "adjective, adverb",
        "example": "This is a worldwide problem.",
        "difficulty": "B2"
    },
    {
        "english": "worried",
        "bengali": "উদ্বিগ্ন",
        "meaning": "Feeling, showing, or expressing anxiety or concern.",
        "type": "adjective",
        "example": "I am worried about you.",
        "difficulty": "A2"
    },
    {
        "english": "worry",
        "bengali": "চিন্তা করা",
        "meaning": "Feel or cause to feel anxious or troubled about actual or potential problems.",
        "type": "verb, noun",
        "example": "Don't worry about me.",
        "difficulty": "A2"
    },
    {
        "english": "worse",
        "bengali": "আরও খারাপ",
        "meaning": "Of poorer quality or lower standard; less good or desirable.",
        "type": "adjective, adverb, noun",
        "example": "The situation is getting worse.",
        "difficulty": "B1"
    },
    {
        "english": "worst",
        "bengali": "সবচেয়ে খারাপ",
        "meaning": "Of the poorest quality or lowest standard; least good or desirable.",
        "type": "adjective, adverb, noun",
        "example": "This is the worst day of my life.",
        "difficulty": "B1"
    },
    {
        "english": "worth",
        "bengali": "মূল্য",
        "meaning": "The level at which someone or something deserves to be valued or rated.",
        "type": "adjective, noun",
        "example": "This book is worth reading.",
        "difficulty": "B1"
    },
    {
        "english": "would",
        "bengali": "করতাম",
        "meaning": "Past of will, in various senses.",
        "type": "modal verb",
        "example": "I would like a cup of tea.",
        "difficulty": "A1"
    },
    {
        "english": "wound",
        "bengali": "ক্ষত",
        "meaning": "An injury to living tissue caused by a cut, blow, or other impact, typically one in which the skin is cut or broken.",
        "type": "noun, verb",
        "example": "He has a deep wound in his leg.",
        "difficulty": "B2"
    },
    {
        "english": "wrap",
        "bengali": "মোড়ানো",
        "meaning": "Cover (someone or something) in paper or soft material.",
        "type": "verb",
        "example": "Please wrap the gift.",
        "difficulty": "B2"
    },
    {
        "english": "write",
        "bengali": "লেখা",
        "meaning": "Mark (letters, words, or other symbols) on a surface, typically paper, with a pen, pencil, or similar implement.",
        "type": "verb",
        "example": "I am writing a letter.",
        "difficulty": "A1"
    },
    {
        "english": "writer",
        "bengali": "লেখক",
        "meaning": "A person who has written a particular text.",
        "type": "noun",
        "example": "He is a famous writer.",
        "difficulty": "A1"
    },
    {
        "english": "writing",
        "bengali": "লেখা",
        "meaning": "The activity or skill of marking coherent words on paper and composing text.",
        "type": "noun",
        "example": "Writing is my hobby.",
        "difficulty": "A1"
    },
    {
        "english": "written",
        "bengali": "লিখিত",
        "meaning": "Expressed in writing.",
        "type": "adjective",
        "example": "This is a written agreement.",
        "difficulty": "B1"
    },
    {
        "english": "wrong",
        "bengali": "ভুল",
        "meaning": "Not correct or true; incorrect.",
        "type": "adjective, adverb, noun",
        "example": "That is the wrong answer.",
        "difficulty": "A1"
    },
    {
        "english": "yard",
        "bengali": "উঠান",
        "meaning": "A unit of linear measure equal to 3 feet (0.9144 m).",
        "type": "noun",
        "example": "There is a big yard in front of the house.",
        "difficulty": "B1"
    },
    {
        "english": "yeah",
        "bengali": "হ্যাঁ",
        "meaning": "Yes.",
        "type": "exclamation",
        "example": "Yeah, I agree.",
        "difficulty": "A1"
    },
    {
        "english": "year",
        "bengali": "বছর",
        "meaning": "The time taken by the earth to make one revolution around the sun.",
        "type": "noun",
        "example": "I am twenty years old.",
        "difficulty": "A1"
    },
    {
        "english": "yellow",
        "bengali": "হলুদ",
        "meaning": "Of the color between green and orange in the spectrum, a primary subtractive color complementary to blue; colored like ripe lemons or egg yolks.",
        "type": "adjective, noun",
        "example": "The sun is yellow.",
        "difficulty": "A1"
    },
    {
        "english": "yes",
        "bengali": "হ্যাঁ",
        "meaning": "Used to give an affirmative response.",
        "type": "exclamation, noun",
        "example": "Yes, I will do it.",
        "difficulty": "A1"
    },
    {
        "english": "yesterday",
        "bengali": "গতকাল",
        "meaning": "On the day before today.",
        "type": "adverb, noun",
        "example": "I saw him yesterday.",
        "difficulty": "A1"
    },
    {
        "english": "yet",
        "bengali": "এখনো",
        "meaning": "Up until the present or a specified or implied time; by now or then.",
        "type": "adverb, conjunction",
        "example": "I haven't finished yet.",
        "difficulty": "A2"
    },
    {
        "english": "you",
        "bengali": "তুমি",
        "meaning": "Used to refer to the person or people that the speaker is addressing.",
        "type": "pronoun",
        "example": "You are my friend.",
        "difficulty": "A1"
    },
    {
        "english": "young",
        "bengali": "তরুণ",
        "meaning": "Having lived or existed for only a short time.",
        "type": "adjective",
        "example": "He is a young man.",
        "difficulty": "A1"
    },
    {
        "english": "your",
        "bengali": "তোমার",
        "meaning": "Belonging to or associated with the person or people that the speaker is addressing.",
        "type": "determiner",
        "example": "This is your book.",
        "difficulty": "A1"
    },
    {
        "english": "yours",
        "bengali": "তোমার",
        "meaning": "Used to refer to a thing or things belonging to or associated with the person or people that the speaker is addressing.",
        "type": "pronoun",
        "example": "This book is yours.",
        "difficulty": "A2"
    },
    {
        "english": "yourself",
        "bengali": "তুমি নিজেই",
        "meaning": "Used as the object of a verb or preposition to refer to the person being addressed.",
        "type": "pronoun",
        "example": "You should do it yourself.",
        "difficulty": "A1"
    },
    {
        "english": "youth",
        "bengali": "যৌবন",
        "meaning": "The period between childhood and adult age.",
        "type": "noun",
        "example": "He was a good athlete in his youth.",
        "difficulty": "B1"
    },
    {
        "english": "zero",
        "bengali": "শূন্য",
        "meaning": "No quantity or number; nought; the figure 0.",
        "type": "number",
        "example": "The temperature is zero degrees.",
        "difficulty": "A2"
    }
];


    }

    showLoading(message) {
        this.isLoading = true;
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loading);
    }

    hideLoading() {
        this.isLoading = false;
        const loading = document.querySelector('.loading-overlay');
        if (loading) {
            document.body.removeChild(loading);
        }
    }

    switchSection(sectionName) {
        const isFromWelcome = this.currentSection === 'welcome';
        
        // Hide all sections
        document.querySelectorAll('.section, #welcome-screen').forEach(section => {
            section.classList.add('hidden');
        });

        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected section
        if (sectionName === 'welcome') {
            document.getElementById('welcome-screen').classList.remove('hidden');
        } else {
            document.getElementById(`${sectionName}-section`).classList.remove('hidden');
            
            // Handle search container visibility for flashcards section
            if (sectionName === 'flashcards') {
                const searchContainer = document.querySelector('.search-container');
                if (searchContainer) {
                    // Hide search when coming from welcome screen
                    if (isFromWelcome) {
                        searchContainer.style.display = 'none';
                    } else {
                        // Show search when coming from other sections
                        searchContainer.style.display = '';
                    }
                }
            }
        }

        // Add active class to nav button
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        this.currentSection = sectionName;

        // Initialize section-specific functionality
        if (sectionName === 'flashcards') {
            this.initializeFlashcards();
        } else if (sectionName === 'quiz') {
            this.initializeQuiz();
        } else if (sectionName === 'progress') {
            this.updateProgressDisplay();
        }
    }

    initializeFlashcards() {
        const wordsPerSession = parseInt(document.getElementById('words-per-session')?.value || 10);
        this.currentSessionWords = this.getWordsForSession(wordsPerSession, this.flashcardDifficulty);
        this.currentCardIndex = 0;
        this.displayCurrentCard();
        this.updateCardCounter();
        this.updateProgressBar();
    }

    getWordsForSession(count, difficultyFilter = 'all') {
        // Get words based on user's progress and difficulty
        const knownWords = this.userProgress.knownWords || [];
        const unknownWords = this.userProgress.unknownWords || [];
        
        // Filter out words the user already knows well
        let availableWords = this.wordsData.filter(word => 
            !knownWords.includes(word.english) || Math.random() < 0.1
        );

        if (difficultyFilter !== 'all') {
            availableWords = availableWords.filter(w => (w.difficulty || '').toUpperCase() === difficultyFilter.toUpperCase());
        }

        // Shuffle and take the requested number
        return this.shuffleArray(availableWords).slice(0, count);
    }

    displayCurrentCard() {
        if (this.currentSessionWords.length === 0) {
            document.getElementById('english-word').textContent = 'No words available';
            document.getElementById('word-type').textContent = '';
            return;
        }

        const word = this.currentSessionWords[this.currentCardIndex];
        const flashcard = document.getElementById('flashcard');
        
        // Reset card state
        flashcard.classList.remove('flipped');
        document.querySelector('.card-back').classList.add('hidden');

        // Update front of card
        document.getElementById('english-word').textContent = word.english;
        document.getElementById('word-type').textContent = word.type;
        const diffBadge = document.getElementById('word-difficulty');
        if (diffBadge) {
            diffBadge.textContent = word.difficulty || '?';
        }

        // Update back of card
        document.getElementById('bengali-translation').textContent = word.bengali;
        document.getElementById('word-meaning').textContent = word.meaning;
        document.getElementById('example-text').textContent = word.example;
        const backDiff = document.getElementById('back-difficulty');
        if (backDiff) backDiff.textContent = word.difficulty || '?';
    }

    flipCard() {
        const flashcard = document.getElementById('flashcard');
        const cardBack = document.querySelector('.card-back');
        
        flashcard.classList.toggle('flipped');
        
        if (flashcard.classList.contains('flipped')) {
            cardBack.classList.remove('hidden');
        } else {
            cardBack.classList.add('hidden');
        }
    }

    previousCard() {
        if (this.currentCardIndex > 0) {
            this.currentCardIndex--;
            this.displayCurrentCard();
            this.updateCardCounter();
        }
    }

    nextCard() {
        if (this.currentCardIndex < this.currentSessionWords.length - 1) {
            this.currentCardIndex++;
            this.displayCurrentCard();
            this.updateCardCounter();
        }
    }

    markWordAsKnown() {
        const currentWord = this.currentSessionWords[this.currentCardIndex];
        if (!currentWord) return;

        // Update progress
        if (!this.userProgress.knownWords) this.userProgress.knownWords = [];
        if (!this.userProgress.unknownWords) this.userProgress.unknownWords = [];
        
        if (!this.userProgress.knownWords.includes(currentWord.english)) {
            this.userProgress.knownWords.push(currentWord.english);
        }
        
        // Remove from unknown words if present
        const unknownIndex = this.userProgress.unknownWords.indexOf(currentWord.english);
        if (unknownIndex > -1) {
            this.userProgress.unknownWords.splice(unknownIndex, 1);
        }

        this.saveProgress();
        
        // Add success animation
        const flashcard = document.querySelector('.flashcard');
        flashcard.classList.add('card-success-animation');
        
        // Remove animation class after it completes
        setTimeout(() => {
            flashcard.classList.remove('card-success-animation');
            this.nextCard();
        }, 600);
    }

    markWordAsUnknown() {
        const currentWord = this.currentSessionWords[this.currentCardIndex];
        if (!currentWord) return;

        // Update progress
        if (!this.userProgress.unknownWords) this.userProgress.unknownWords = [];
        if (!this.userProgress.knownWords) this.userProgress.knownWords = [];
        
        if (!this.userProgress.unknownWords.includes(currentWord.english)) {
            this.userProgress.unknownWords.push(currentWord.english);
        }

        this.saveProgress();
        this.nextCard();
    }

    updateCardCounter() {
        document.getElementById('card-counter').textContent = 
            `${this.currentCardIndex + 1} / ${this.currentSessionWords.length}`;
    }

    updateProgressBar() {
        const progress = (this.currentCardIndex / this.currentSessionWords.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
    }

    initializeQuiz() {
        const questionsPerQuiz = parseInt(document.getElementById('questions-per-quiz')?.value || 10);
        this.quizQuestions = this.generateQuizQuestions(questionsPerQuiz, this.quizDifficulty);
        this.currentQuizQuestion = 0;
        this.quizScore = 0;
        this.displayQuizQuestion();
        this.updateQuizStats();
    }

    generateQuizQuestions(count, difficultyFilter = 'all') {
        const questions = [];
        let filtered = [...this.wordsData];
        if (difficultyFilter !== 'all') {
            filtered = filtered.filter(w => (w.difficulty || '').toUpperCase() === difficultyFilter.toUpperCase());
        }
        const availableWords = this.shuffleArray(filtered);
        
        for (let i = 0; i < count && i < availableWords.length; i++) {
            const correctWord = availableWords[i];
            const options = this.generateQuizOptions(correctWord, availableWords);
            
            questions.push({
                word: correctWord,
                options: this.shuffleArray(options),
                correctAnswer: correctWord.bengali
            });
        }
        
        return questions;
    }

    generateQuizOptions(correctWord, allWords) {
        const options = [correctWord.bengali];
        
        // Get 3 random wrong answers
    const otherWords = allWords.filter(w => w.english !== correctWord.english);
        const shuffledOthers = this.shuffleArray(otherWords);
        
        for (let i = 0; i < 3 && i < shuffledOthers.length; i++) {
            options.push(shuffledOthers[i].bengali);
        }
        
        return options;
    }

    displayQuizQuestion() {
        if (this.currentQuizQuestion >= this.quizQuestions.length) {
            this.showQuizResults();
            return;
        }

        const question = this.quizQuestions[this.currentQuizQuestion];
        
        document.getElementById('question-word').textContent = question.word.english;
        document.getElementById('quiz-question').classList.remove('hidden');
        document.getElementById('quiz-options').classList.remove('hidden');
        document.getElementById('quiz-feedback').classList.add('hidden');

        // Update options
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach((btn, index) => {
            btn.textContent = question.options[index] || 'Option ' + (index + 1);
            btn.classList.remove('correct', 'incorrect');
            btn.disabled = false;
        });
    }

    selectQuizOption(optionIndex) {
        const question = this.quizQuestions[this.currentQuizQuestion];
        const selectedAnswer = question.options[optionIndex];
        const isCorrect = selectedAnswer === question.correctAnswer;

        if (isCorrect) {
            this.quizScore++;
        }

        // Show feedback
        this.showQuizFeedback(isCorrect, question);
    }

    showQuizFeedback(isCorrect, question) {
        const feedback = document.getElementById('quiz-feedback');
        const icon = document.getElementById('feedback-icon');
        const text = document.getElementById('feedback-text');
        const explanation = document.getElementById('feedback-explanation');

        icon.className = isCorrect ? 'fas fa-check' : 'fas fa-times';
        text.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
        explanation.textContent = `The correct answer is: ${question.correctAnswer}`;
        if (this.quizDifficulty !== 'all') {
            explanation.textContent += ` | Difficulty: ${question.word.difficulty || '?'}`;
        }

        // Disable all options
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === question.correctAnswer) {
                btn.classList.add('correct');
            } else if (btn.textContent === question.options[parseInt(btn.dataset.option)]) {
                btn.classList.add('incorrect');
            }
        });

        feedback.classList.remove('hidden');
    }

    nextQuizQuestion() {
        this.currentQuizQuestion++;
        this.updateQuizStats();
        this.displayQuizQuestion();
    }

    updateQuizStats() {
        document.getElementById('quiz-score').textContent = `Score: ${this.quizScore}`;
        document.getElementById('quiz-progress').textContent = 
            `Question: ${this.currentQuizQuestion + 1}/${this.quizQuestions.length}`;
    }

    showQuizResults() {
        const score = (this.quizScore / this.quizQuestions.length) * 100;
        
        document.getElementById('quiz-question').classList.add('hidden');
        document.getElementById('quiz-options').classList.add('hidden');
        
        const feedback = document.getElementById('quiz-feedback');
        const icon = document.getElementById('feedback-icon');
        const text = document.getElementById('feedback-text');
        const explanation = document.getElementById('feedback-explanation');
        const nextBtn = document.getElementById('next-question');

        icon.className = score >= 70 ? 'fas fa-trophy' : 'fas fa-graduation-cap';
        text.textContent = `Quiz Complete!`;
        explanation.textContent = `Your score: ${score.toFixed(1)}% (${this.quizScore}/${this.quizQuestions.length})`;
        nextBtn.textContent = 'Take Another Quiz';

        feedback.classList.remove('hidden');

        // Update progress
        this.userProgress.quizScores = this.userProgress.quizScores || [];
        this.userProgress.quizScores.push(score);
        this.saveProgress();
    }

    updateProgressDisplay() {
        const knownWords = this.userProgress.knownWords || [];
        const totalWords = this.wordsData.length;
        const progressPercentage = (knownWords.length / totalWords) * 100;
        
        // Update progress circle
        const circle = document.getElementById('overall-progress');
        if (circle) {
            const circumference = 2 * Math.PI * 50;
            const offset = circumference - (progressPercentage / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }
        
        if (document.getElementById('overall-percentage')) {
            document.getElementById('overall-percentage').textContent = `${progressPercentage.toFixed(1)}%`;
        }
        if (document.getElementById('words-learned')) {
            document.getElementById('words-learned').textContent = knownWords.length;
        }
        
        // Update average quiz score
        const quizScores = this.userProgress.quizScores || [];
        const averageScore = quizScores.length > 0 ? 
            (quizScores.reduce((a, b) => a + b, 0) / quizScores.length).toFixed(1) : 0;
        if (document.getElementById('average-score')) {
            document.getElementById('average-score').textContent = `${averageScore}%`;
        }
        
        // Update study streak
        const lastStudyDate = this.userProgress.lastStudyDate;
        const today = new Date().toDateString();
        let streak = this.userProgress.studyStreak || 0;
        
        if (lastStudyDate !== today) {
            if (lastStudyDate) {
                const lastDate = new Date(lastStudyDate);
                const daysDiff = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
                if (daysDiff === 1) {
                    streak++;
                } else if (daysDiff > 1) {
                    streak = 0;
                }
            }
            this.userProgress.lastStudyDate = today;
            this.userProgress.studyStreak = streak;
            this.saveProgress();
        }
        
        if (document.getElementById('study-streak')) {
            document.getElementById('study-streak').textContent = streak;
        }
        
        // Update activity list
        this.updateActivityList();
    }

    updateActivityList() {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;
        
        const activities = this.userProgress.activities || [];
        
        const isDark = document.body.classList.contains('dark');
        activityList.innerHTML = activities.length === 0 ? 
            `<p style="text-align: center; color: ${isDark ? '#9db2c5' : '#666'};">No recent activity</p>` : '';
        
        activities.slice(-5).reverse().forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            const isDark = document.body.classList.contains('dark');
            activityItem.style.padding = '1rem';
            activityItem.style.borderBottom = `1px solid ${isDark ? '#2a3f52' : '#f0f0f0'}`;
            activityItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${activity.action}</span>
                    <small style="color: ${isDark ? '#9db2c5' : '#666'};">${activity.date}</small>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }

    addActivity(action) {
        if (!this.userProgress.activities) this.userProgress.activities = [];
        
        this.userProgress.activities.push({
            action: action,
            date: new Date().toLocaleDateString()
        });
        
        // Keep only last 20 activities
        if (this.userProgress.activities.length > 20) {
            this.userProgress.activities = this.userProgress.activities.slice(-20);
        }
        
        this.saveProgress();
    }

    saveProgress() {
        localStorage.setItem('englishBengaliProgress', JSON.stringify(this.userProgress));
    }

    loadProgress() {
        const saved = localStorage.getItem('englishBengaliProgress');
        return saved ? JSON.parse(saved) : {
            knownWords: [],
            unknownWords: [],
            quizScores: [],
            activities: [],
            studyStreak: 0,
            lastStudyDate: null
        };
    }

    exportProgress() {
        const dataStr = JSON.stringify(this.userProgress, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'english-bengali-progress.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    importProgress() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedProgress = JSON.parse(e.target.result);
                        this.userProgress = { ...this.userProgress, ...importedProgress };
                        this.saveProgress();
                        this.updateProgressDisplay();
                        alert('Progress imported successfully!');
                    } catch (error) {
                        alert('Error importing progress. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
            this.userProgress = {
                knownWords: [],
                unknownWords: [],
                quizScores: [],
                activities: [],
                studyStreak: 0,
                lastStudyDate: null
            };
            this.saveProgress();
            this.updateProgressDisplay();
            alert('Progress reset successfully!');
        }
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Security helper methods
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.replace(/[<>"'&]/g, function(match) {
            const escapeMap = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return escapeMap[match];
        }).trim();
    }



    showError(message) {
        // Create a secure error display
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = this.sanitizeInput(message);
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    

        

    
    // Back to top functionality
    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;
        
        // Show button when user scrolls down
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Flip card with spacebar
            if (e.code === 'Space' && this.currentSection === 'flashcards') {
                e.preventDefault();
                this.flipCard();
            }
            
            // Next card with right arrow
            if (e.code === 'ArrowRight' && this.currentSection === 'flashcards') {
                this.nextCard();
            }
            
            // Previous card with left arrow
            if (e.code === 'ArrowLeft' && this.currentSection === 'flashcards') {
                this.previousCard();
            }
        });
    }

}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Create a single app instance and expose it globally
    if (!window.learningApp) {
        new LearningApp();
    }
});

// Add some sample activities when the app starts
setTimeout(() => {
    const app = window.learningApp;
    if (app) {
        app.addActivity('Started learning English-Bengali');
    }
}, 1000);
