# Modern Resume Website

A beautiful, minimalistic resume website with Harvard-inspired design and GitHub project integration.

## Features

- **Modern Design**: Clean, minimalistic layout with Harvard-inspired typography
- **Responsive**: Fully responsive design that works on all devices
- **GitHub Integration**: Automatically fetches and displays your GitHub projects
- **Interactive Elements**: Smooth animations and hover effects
- **Professional Layout**: Well-organized sections for education, experience, skills, and more

## Getting Started

1. **Open the website**: Simply open `index.html` in your web browser
2. **Customize your information**: Edit the HTML file to add your personal details
3. **Add your photo**: Replace the placeholder image with your actual photo
4. **Update GitHub username**: Enter your GitHub username to load your projects

## Customization Guide

### Personal Information
Edit the following sections in `index.html`:

```html
<!-- Update your name and title -->
<h1 class="name">Your Name</h1>
<p class="title">Software Developer & Engineer</p>

<!-- Update contact information -->
<div class="contact-item">
    <i class="fas fa-envelope"></i>
    <span>your.email@example.com</span>
</div>
```

### Profile Photo
Replace the placeholder image URL with your actual photo:
```html
<img src="path/to/your/photo.jpg" alt="Profile Photo" id="profile-photo">
```

### Education
Update the education section with your details:
```html
<h3 class="degree">Your Degree</h3>
<p class="institution">Your University</p>
<p class="gpa">Your GPA</p>
```

### Experience
Add your work experience:
```html
<div class="experience-item">
    <div class="experience-header">
        <h3 class="position">Your Position</h3>
        <span class="duration">2023 - Present</span>
    </div>
    <p class="company">Company Name</p>
    <ul class="achievements">
        <li>Your achievement 1</li>
        <li>Your achievement 2</li>
    </ul>
</div>
```

### Skills
Update the skills section with your technical skills:
```html
<span class="skill-tag">Your Skill</span>
```

### GitHub Projects
1. Enter your GitHub username in the input field
2. Click "Load Projects" to fetch your repositories
3. The website will automatically display your 6 most recently updated projects

## Color Scheme

The website uses a Harvard-inspired color palette:
- **Primary Blue**: #2a5298
- **Dark Blue**: #1e3c72
- **Light Blue**: #e8f4fd
- **Text**: #2c3e50
- **Background**: #fafafa

## Typography

- **Headings**: Crimson Text (serif) for a classic, academic feel
- **Body Text**: Inter (sans-serif) for modern readability

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## File Structure

```
MyWeb/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## GitHub API Integration

The website uses the GitHub REST API to fetch:
- Repository names and descriptions
- Star, fork, and watcher counts
- Primary programming language
- Last updated date

No API key is required for public repositories.

## Customization Tips

1. **Colors**: Modify the CSS variables in `styles.css` to change the color scheme
2. **Layout**: Adjust the grid layouts and spacing in the CSS
3. **Animations**: Customize the scroll animations and hover effects
4. **Content**: Add or remove sections as needed for your specific use case

## Deployment

You can deploy this website to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Simply upload all files to your hosting provider.

## License

This project is open source and available under the MIT License.

## Support

If you have any questions or need help customizing the website, feel free to reach out!
