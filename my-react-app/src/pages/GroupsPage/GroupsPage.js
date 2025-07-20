import React from 'react'
import './GroupsPage.css'
import Navbar from '../../components/Navbar/Navbar'
import { Helmet } from 'react-helmet'

const mockGroups = [
  {
    id: 1,
    name: 'React Developers Pakistan',
    cover: '/assets/photos/group1.jpg',
    members: '12K members',
  },
  {
    id: 2,
    name: 'Freelancers Community',
    cover: '/assets/photos/group2.jpg',
    members: '35K members',
  },
  {
    id: 3,
    name: 'Women Who Code',
    cover: '/assets/photos/group3.jpg',
    members: '20K members',
  },
]

export default function GroupsPage() {
  return (
    <>
      <Helmet>
        <title>Groups | InterviewPrep</title>
      </Helmet>

      <Navbar />

      <div className="groups-page">
        <aside className="groups-sidebar">
          <h2>Groups</h2>
          <ul>
            <li>Your Feed</li>
            <li>Discover</li>
            <li>Groups You've Joined</li>
            <li>Create Group</li>
          </ul>
        </aside>

        <main className="groups-content">
          <h3>Suggested for You</h3>
          <div className="group-grid">
            {mockGroups.map(group => (
              <div key={group.id} className="group-card">
                <img src={group.cover} alt={group.name} className="group-cover" />
                <div className="group-details">
                  <h4>{group.name}</h4>
                  <p>{group.members}</p>
                  <button className="join-btn">Join Group</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
