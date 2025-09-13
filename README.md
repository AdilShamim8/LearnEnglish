# English-Bengali Learning Platform

A beautiful, interactive web application designed to help Bengali speakers learn the 3000 most common English words with translations, meanings, and examples.

## Features

### Interactive Flashcards
- **Flip Cards**: Click on cards to see Bengali translations and meanings
- **Progress Tracking**: Mark words as known or unknown
- **Session Management**: Customize the number of words per session
- **Navigation**: Easy navigation between cards with previous/next buttons

### Quiz Mode
- **Multiple Choice**: Test your knowledge with Bengali translation options
- **Instant Feedback**: See correct answers and explanations
- **Score Tracking**: Monitor your quiz performance
- **Customizable**: Set the number of questions per quiz

### Progress Dashboard
- **Visual Progress**: Circular progress indicator
- **Statistics**: Track words learned, quiz scores, and study streaks
- **Activity Log**: View recent learning activities
- **Data Export/Import**: Save and restore your progress

### Settings & Customization
- **Learning Preferences**: Adjust words per session and auto-flip settings
- **Quiz Settings**: Configure questions per quiz and explanations
- **Data Management**: Export, import, or reset your progress

## Getting Started

1. **Open the Application**: Simply open `index.html` in your web browser
2. **Start Learning**: Click "Start Learning" to begin with flashcards
3. **Navigate Sections**: Use the navigation menu to switch between features
4. **Track Progress**: Monitor your learning journey in the Progress section

## Design Features

- **Modern UI**: Beautiful gradient backgrounds and smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, card flips, and smooth transitions
- **Bengali Typography**: Proper support for Bengali text display
- **Accessibility**: Keyboard navigation and screen reader friendly

## How to Use

### Flashcards
1. Navigate to the Flashcards section
2. Click on a card to flip and see the Bengali translation
3. Use the "I Know This" or "Need Practice" buttons to track progress
4. Use navigation arrows to move between cards

### Quiz Mode
1. Go to the Quiz section
2. Read the English word and select the correct Bengali translation
3. Review feedback and explanations
4. Continue to the next question

### Progress Tracking
1. Visit the Progress section to see your statistics
2. View your overall completion percentage
3. Check your quiz performance and study streak
4. Review recent learning activities

### Settings
1. Access the Settings section to customize your experience
2. Adjust learning preferences and quiz settings
3. Export your progress for backup
4. Import progress from previous sessions

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **No Dependencies**: Pure vanilla JavaScript - no frameworks required
- **Local Storage**: Progress is saved locally in your browser
- **Responsive**: CSS Grid and Flexbox for modern layouts
- **Animations**: CSS transitions and keyframe animations

## File Structure

```
BanglaEnglish/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
├── README.md           # This file
└── 3000 Most Common English Words.pdf  # Source material
```

##  Customization

### Adding More Words
To add more words from the PDF, modify the `loadWordsData()` function in `script.js`:

```JavaScript
this.wordsData.push({
    english: "your_word",
    bengali: "বাংলা_অনুবাদ",
    meaning: "Word meaning and explanation",
    type: "noun/verb/adjective",
    example: "Example sentence",
    difficulty: 1-3
});
```

### Styling Changes
Modify `styles.css` to customize colors, fonts, and layouts:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #4CAF50;
    --danger-color: #f44336;
}
```

##  Learning Tips

1. **Start with Flashcards**: Begin each session with flashcards to learn new words
2. **Take Regular Quizzes**: Test your knowledge frequently
3. **Review Progress**: Check your progress dashboard regularly
4. **Set Goals**: Aim for consistent daily practice
5. **Use Examples**: Pay attention to example sentences for context

##  Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

##  License

This project is open source and available under the MIT License.

##  Contributing

Feel free to contribute by:
- Adding more words from the PDF
- Improving the UI/UX
- Adding new features
- Fixing bugs
- Improving translations

##  Support

If you encounter any issues or have suggestions, please create an issue in the repository.

---

**Happy Learning!**

*Master the 3000 most common English words with beautiful Bengali translations and interactive learning tools.*




