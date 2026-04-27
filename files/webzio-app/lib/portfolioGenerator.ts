export function generatePortfolioHTML(data: any) {
    const { fullName, email, phone, location, bio, profileImage, sections, design } = data

    const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} - Portfolio</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Navigation -->
  <nav class="navbar">
    <div class="container">
      <div class="logo">${fullName}</div>
      <ul class="nav-links">
        ${sections.about?.enabled ? '<li><a href="#about">About</a></li>' : ''}
        ${sections.skills?.enabled ? '<li><a href="#skills">Skills</a></li>' : ''}
        ${sections.experience?.enabled ? '<li><a href="#experience">Experience</a></li>' : ''}
        ${sections.projects?.enabled ? '<li><a href="#projects">Projects</a></li>' : ''}
        ${sections.contact?.enabled ? '<li><a href="#contact">Contact</a></li>' : ''}
      </ul>
    </div>
  </nav>

  <!-- Hero Section -->
  ${sections.hero?.enabled ? `
  <section id="hero" class="hero">
    <div class="container">
      ${profileImage ? `<img src="${profileImage}" alt="${fullName}" class="profile-image">` : ''}
      <h1>${sections.hero?.title || fullName}</h1>
      <p class="subtitle">${sections.hero?.subtitle || bio}</p>
      <div class="cta-buttons">
        <a href="#projects" class="btn btn-primary">View My Work</a>
        <a href="#contact" class="btn btn-secondary">Get In Touch</a>
      </div>
    </div>
  </section>
  ` : ''}

  <!-- About Section -->
  ${sections.about?.enabled ? `
  <section id="about" class="about">
    <div class="container">
      <h2>About Me</h2>
      <p>${sections.about?.content || bio}</p>
    </div>
  </section>
  ` : ''}

  <!-- Skills Section -->
  ${sections.skills?.enabled && sections.skills?.items?.length ? `
  <section id="skills" class="skills">
    <div class="container">
      <h2>Skills</h2>
      <div class="skills-grid">
        ${sections.skills.items.map((skill: any) => `
          <div class="skill-card">
            <h3>${skill.name}</h3>
            <div class="skill-bar">
              <div class="skill-progress" style="width: ${skill.level === 'Expert' ? '90' : skill.level === 'Advanced' ? '75' : '60'}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Experience Section -->
  ${sections.experience?.enabled && sections.experience?.items?.length ? `
  <section id="experience" class="experience">
    <div class="container">
      <h2>Experience</h2>
      <div class="timeline">
        ${sections.experience.items.map((exp: any) => `
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h3>${exp.title}</h3>
              <p class="company">${exp.company}</p>
              <p class="duration">${exp.duration}</p>
              <p>${exp.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Projects Section -->
  ${sections.projects?.enabled && sections.projects?.items?.length ? `
  <section id="projects" class="projects">
    <div class="container">
      <h2>Projects</h2>
      <div class="projects-grid">
        ${sections.projects.items.map((project: any) => `
          <div class="project-card">
            ${project.image ? `<img src="${project.image}" alt="${project.name}">` : ''}
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            ${project.technologies?.length ? `
              <div class="technologies">
                ${project.technologies.map((tech: string) => `<span class="tech-tag">${tech}</span>`).join('')}
              </div>
            ` : ''}
            ${project.link ? `<a href="${project.link}" class="project-link">View Project →</a>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Contact Section -->
  ${sections.contact?.enabled ? `
  <section id="contact" class="contact">
    <div class="container">
      <h2>Get In Touch</h2>
      <div class="contact-info">
        ${email ? `<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>` : ''}
        ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
        ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
      </div>
      <div class="social-links">
        ${sections.contact?.social?.linkedin ? `<a href="${sections.contact.social.linkedin}" target="_blank">LinkedIn</a>` : ''}
        ${sections.contact?.social?.github ? `<a href="${sections.contact.social.github}" target="_blank">GitHub</a>` : ''}
        ${sections.contact?.social?.twitter ? `<a href="${sections.contact.social.twitter}" target="_blank">Twitter</a>` : ''}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <p>&copy; 2026 ${fullName}. All rights reserved.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`

    const cssCode = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: ${design?.colorScheme || '#4f46e5'};
  --accent-color: ${design?.accentColor || '#FF6B7A'};
  --text-color: #1a1a1a;
  --light-bg: #f9fafb;
  --border-color: #e5e7eb;
}

body {
  font-family: '${design?.font || 'Inter'}, sans-serif';
  color: var(--text-color);
  line-height: 1.6;
  background: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4%;
}

/* Navigation */
.navbar {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
  padding: 1rem 0;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary-color);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 600;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--primary-color);
}

/* Hero Section */
.hero {
  padding: 100px 0;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(255, 107, 122, 0.05));
  text-align: center;
}

.hero h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: 1rem;
  font-weight: 900;
}

.hero .subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 2rem;
  border: 4px solid var(--primary-color);
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-block;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
  background: rgba(79, 70, 229, 0.05);
}

/* Sections */
section {
  padding: 80px 0;
}

section h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
}

/* About */
.about {
  background: var(--light-bg);
}

.about p {
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.8;
}

/* Skills */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.skill-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.skill-card h3 {
  margin-bottom: 1rem;
}

.skill-bar {
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  transition: width 0.6s ease;
}

/* Experience */
.timeline {
  position: relative;
  padding: 2rem 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background: var(--border-color);
}

.timeline-item {
  margin-bottom: 3rem;
  position: relative;
}

.timeline-item:nth-child(odd) {
  margin-left: 0;
  margin-right: 50%;
  padding-right: 3rem;
  text-align: right;
}

.timeline-item:nth-child(even) {
  margin-left: 50%;
  margin-right: 0;
  padding-left: 3rem;
  text-align: left;
}

.timeline-marker {
  position: absolute;
  width: 16px;
  height: 16px;
  background: var(--primary-color);
  border: 4px solid white;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
}

.timeline-content h3 {
  margin-bottom: 0.5rem;
}

.timeline-content .company {
  color: var(--primary-color);
  font-weight: 600;
}

.timeline-content .duration {
  color: #9ca3af;
  font-size: 0.9rem;
}

/* Projects */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.project-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.project-card h3,
.project-card p {
  padding: 0 1.5rem;
}

.project-card h3 {
  padding-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 1.5rem;
  margin: 1rem 0;
}

.tech-tag {
  background: var(--light-bg);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--primary-color);
}

.project-link {
  display: inline-block;
  padding: 0 1.5rem 1.5rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.project-link:hover {
  color: var(--accent-color);
}

/* Contact */
.contact {
  background: var(--light-bg);
  text-align: center;
}

.contact-info {
  margin-bottom: 2rem;
}

.contact-info p {
  margin-bottom: 1rem;
}

.contact-info a {
  color: var(--primary-color);
  text-decoration: none;
}

.social-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.social-links a {
  padding: 10px 20px;
  background: white;
  border-radius: 8px;
  text-decoration: none;
  color: var(--primary-color);
  font-weight: 600;
  transition: all 0.3s;
}

.social-links a:hover {
  background: var(--primary-color);
  color: white;
}

/* Footer */
.footer {
  background: #1a1a1a;
  color: white;
  text-align: center;
  padding: 2rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    gap: 1rem;
    font-size: 0.9rem;
  }

  .timeline::before {
    left: 0;
  }

  .timeline-item,
  .timeline-item:nth-child(odd),
  .timeline-item:nth-child(even) {
    margin: 0;
    padding: 0 0 2rem 3rem;
    text-align: left;
  }

  .timeline-marker {
    left: 0;
  }

  section h2 {
    font-size: 1.8rem;
  }
}`

    const jsCode = `// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});`

    return { htmlCode, cssCode, jsCode }
}
