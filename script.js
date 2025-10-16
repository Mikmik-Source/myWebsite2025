// GitHub API Integration
class GitHubAPI {
    constructor() {
        this.baseURL = 'https://api.github.com';
        this.username = '';
    }

    async fetchUserRepos(username) {
        try {
            const response = await fetch(`${this.baseURL}/users/${username}/repos?sort=updated&per_page=6`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('User not found. Please check the username.');
                } else if (response.status === 403) {
                    throw new Error('API rate limit exceeded.');
                } else {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
            }
            
            const repos = await response.json();
            return repos;
        } catch (error) {
            console.error('Error fetching repositories:', error);
            throw error;
        }
    }

    async fetchRepoLanguages(username, repoName) {
        try {
            const response = await fetch(`${this.baseURL}/repos/${username}/${repoName}/languages`);
            if (!response.ok) {
                return {};
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching languages:', error);
            return {};
        }
    }

    getPrimaryLanguage(languages) {
        if (!languages || Object.keys(languages).length === 0) {
            return 'Unknown';
        }
        
        const sortedLanguages = Object.entries(languages)
            .sort(([,a], [,b]) => b - a);
        
        return sortedLanguages[0][0];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    }

    formatDescription(description) {
        if (!description) {
            return 'No description available';
        }
        return description.length > 100 
            ? description.substring(0, 100) + '...'
            : description;
    }
}

// Project Card Component
class ProjectCard {
    constructor(repo, username, githubAPI) {
        this.repo = repo;
        this.username = username;
        this.githubAPI = githubAPI;
    }

    async render() {
        const languages = await this.githubAPI.fetchRepoLanguages(this.username, this.repo.name);
        const primaryLanguage = this.githubAPI.getPrimaryLanguage(languages);
        
        return `
            <div class="project-card">
                <div class="project-name">
                    <i class="fab fa-github"></i>
                    <a href="${this.repo.html_url}" target="_blank" rel="noopener noreferrer">
                        ${this.repo.name}
                    </a>
                </div>
                <div class="project-description">
                    ${this.githubAPI.formatDescription(this.repo.description)}
                </div>
                <div class="project-meta">
                    <div class="project-stats">
                        <div class="project-stat">
                            <i class="fas fa-star"></i>
                            <span>${this.repo.stargazers_count}</span>
                        </div>
                        <div class="project-stat">
                            <i class="fas fa-code-branch"></i>
                            <span>${this.repo.forks_count}</span>
                        </div>
                        <div class="project-stat">
                            <i class="fas fa-eye"></i>
                            <span>${this.repo.watchers_count}</span>
                        </div>
                    </div>
                    <div class="project-language">${primaryLanguage}</div>
                </div>
                <div class="project-updated">
                    <small>Updated ${this.githubAPI.formatDate(this.repo.updated_at)}</small>
                </div>
            </div>
        `;
    }
}

// Main Application
class ResumeApp {
    constructor() {
        this.githubAPI = new GitHubAPI();
        this.initializeEventListeners();
        this.loadDefaultProjects();
    }

    initializeEventListeners() {
        const loadButton = document.getElementById('load-projects');
        const usernameInput = document.getElementById('github-username');
        
        if (loadButton) {
            loadButton.addEventListener('click', () => this.loadProjects());
        }
        
        if (usernameInput) {
            usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.loadProjects();
                }
            });
        }
    }

    async loadDefaultProjects() {
        // Try to load projects with the default username
        const defaultUsername = document.getElementById('github-username').value;
        if (defaultUsername && defaultUsername !== 'yourusername') {
            await this.loadProjects();
        }
    }

    async loadProjects() {
        const usernameInput = document.getElementById('github-username');
        const projectsContainer = document.getElementById('projects-container');
        const loadButton = document.getElementById('load-projects');
        
        if (!usernameInput || !projectsContainer || !loadButton) {
            console.error('Required elements not found');
            return;
        }

        const username = usernameInput.value.trim();
        
        if (!username) {
            this.showError('Please enter a GitHub username');
            return;
        }

        // Update GitHub link
        const githubLink = document.getElementById('github-link');
        if (githubLink) {
            githubLink.href = `https://github.com/${username}`;
        }

        // Show loading state
        loadButton.disabled = true;
        loadButton.textContent = 'Loading...';
        projectsContainer.innerHTML = '<div class="loading-message">Loading projects...</div>';

        try {
            const repos = await this.githubAPI.fetchUserRepos(username);
            
            if (repos.length === 0) {
                projectsContainer.innerHTML = '<div class="loading-message">No public repositories found for this user.</div>';
                return;
            }

            // Create project cards
            const projectCards = await Promise.all(
                repos.map(repo => {
                    const projectCard = new ProjectCard(repo, username, this.githubAPI);
                    return projectCard.render();
                })
            );

            projectsContainer.innerHTML = projectCards.join('');
            
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showError(error.message);
        } finally {
            loadButton.disabled = false;
            loadButton.textContent = 'Load Projects';
        }
    }

    showError(message) {
        const projectsContainer = document.getElementById('projects-container');
        if (projectsContainer) {
            projectsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize animations on scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the main application
    new ResumeApp();
    
    // Initialize additional features
    initializeSmoothScrolling();
    initializeScrollAnimations();
    
    // Add some interactive enhancements
    addInteractiveEnhancements();
});

// Add interactive enhancements
function addInteractiveEnhancements() {
    // Add hover effects to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Add typing effect to the name
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const originalText = nameElement.textContent;
        nameElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                nameElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
}

// Utility function to copy contact information
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show a temporary notification
        const notification = document.createElement('div');
        notification.textContent = 'Copied to clipboard!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #2a5298;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-size: 14px;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Add copy functionality to contact items
document.addEventListener('DOMContentLoaded', () => {
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.textContent.trim();
            copyToClipboard(text);
        });
        
        // Add cursor pointer
        item.style.cursor = 'pointer';
    });
});
