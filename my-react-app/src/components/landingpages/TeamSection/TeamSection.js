// src/components/landingpages/TeamSection.jsx
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import './TeamSection.css';

const teamMembers = [
  {
    name: 'Muhammad Arslan',
    role: 'Frontend Developer',
    description: 'Crafts seamless user experiences in React for real-time social interaction.',
    image: '/assets/photos/team2.jpg',
    linkedin: 'https://linkedin.com/in/your-profile',
    github: 'https://github.com/your-profile',
  },
  {
    name: 'Ali Raza',
    role: 'Backend Developer',
    description: 'Builds reliable, scalable backend systems for high-performance social platforms.',
    image: '/assets/photos/be1.jpeg',
    linkedin: 'https://linkedin.com/in/ali-raza',
    github: 'https://github.com/ali-raza',
  },
  {
    name: 'Sara Khan',
    role: 'UI/UX Designer',
    description: 'Designs intuitive, beautiful interfaces that drive engagement and creativity.',
    image: '/assets/photos/girl1.jpeg',
    linkedin: 'https://linkedin.com/in/sara-khan',
    github: 'https://github.com/sara-khan',
  },
];

export default function TeamSection() {
  return (
    <section className="team-section">
      <div className="container">
        <h2 className="section-title">Meet the Makers of Social Sphere</h2>
        <p className="section-subtitle">
          The creative minds empowering digital connection.
        </p>

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
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                  <a href={member.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
