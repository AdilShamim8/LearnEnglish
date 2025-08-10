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
        
        // Ensure a single global instance
        window.learningApp = this;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadWordsData();
        this.updateProgressDisplay();
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
    }

    loadWordsData() {
        this.loadSampleWords();
    }


    loadSampleWords() {
        // Fallback sample data
        this.wordsData = [
    {
        "english": "a, an",
        "bengali": "একটি",
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
        this.currentSessionWords = this.getWordsForSession(wordsPerSession);
        this.currentCardIndex = 0;
        this.displayCurrentCard();
        this.updateCardCounter();
        this.updateProgressBar();
    }

    getWordsForSession(count) {
        // Get words based on user's progress and difficulty
        const knownWords = this.userProgress.knownWords || [];
        const unknownWords = this.userProgress.unknownWords || [];
        
        // Filter out words the user already knows well
        const availableWords = this.wordsData.filter(word => 
            !knownWords.includes(word.english) || 
            Math.random() < 0.1 // 10% chance to review known words
        );

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

        // Update back of card
        document.getElementById('bengali-translation').textContent = word.bengali;
        document.getElementById('word-meaning').textContent = word.meaning;
        document.getElementById('example-text').textContent = word.example;
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
        this.nextCard();
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
        this.quizQuestions = this.generateQuizQuestions(questionsPerQuiz);
        this.currentQuizQuestion = 0;
        this.quizScore = 0;
        this.displayQuizQuestion();
        this.updateQuizStats();
    }

    generateQuizQuestions(count) {
        const questions = [];
        const availableWords = this.shuffleArray([...this.wordsData]);
        
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
        
        activityList.innerHTML = activities.length === 0 ? 
            '<p style="text-align: center; color: #666;">No recent activity</p>' : '';
        
        activities.slice(-5).reverse().forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.style.padding = '1rem';
            activityItem.style.borderBottom = '1px solid #f0f0f0';
            activityItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${activity.action}</span>
                    <small style="color: #666;">${activity.date}</small>
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
