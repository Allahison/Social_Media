// src/components/landingpages/TeamSection.jsx
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import './TeamSection.css'

const teamMembers = [
  {
    name: 'Muhammad Arslan',
    role: 'Frontend Developer',
    description: 'BS Software Engineering • 2+ years of experience building responsive React apps.',
    image: '/assets/photos/team2.jpg',
    linkedin: 'https://linkedin.com/in/your-profile',
    github: 'https://github.com/your-profile',
  },
  {
    name: 'Ali Raza',
    role: 'Backend Developer',
    description: 'Expert in Node.js & Firebase • Passionate about scalable backend systems.',
    image: '/assets/photos/be1.jpeg',
    linkedin: 'https://linkedin.com/in/ali-raza',
    github: 'https://github.com/ali-raza',
  },
  {
    name: 'Sara Khan',
    role: 'UI/UX Designer',
    description: 'Creative designer with 3+ years experience in Figma & Adobe XD.',
    image: '/assets/photos/girl1.jpeg',
    linkedin: 'https://linkedin.com/in/sara-khan',
    github: 'https://github.com/sara-khan',
  },
]

export default function TeamSection() {
  return (
    <section className="team-section">
      <div className="container">
        <h2 className="section-title">Brains Behind the Build</h2>
<p className="section-subtitle">Innovators. Creators. Collaborators.</p>

        <div className="card-grid">
          {teamMembers.map((member, idx) => (
            <div className="team-card" key={idx}>
              <div className="card-image">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="card-body">
                <h3>{member.name}</h3>
                <span className="role">{member.role}</span>
                <p className="description">{member.description}</p>
                <div className="social-icons">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                  <a href={member.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
