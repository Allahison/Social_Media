import React from 'react'
import './StorePage.css'
import Navbar from '../../components/Navbar/Navbar'
import { Helmet } from 'react-helmet'

const mockProducts = [
  {
    id: 1,
    title: 'iPhone 14 Pro Max - 256GB',
    price: 'Rs. 280,000',
    image: '/assets/store/iphone14.jpg',
    location: 'Faisalabad · 2 days ago',
  },
  {
    id: 2,
    title: 'Honda CG 125 Model 2022',
    price: 'Rs. 180,000',
    image: '/assets/store/honda125.jpg',
    location: 'Lahore · 1 day ago',
  },
  {
    id: 3,
    title: 'Gaming Chair - Adjustable',
    price: 'Rs. 45,000',
    image: '/assets/store/chair.jpg',
    location: 'Islamabad · 3 hours ago',
  },
  {
    id: 4,
    title: 'Used Laptop Dell i7 10th Gen',
    price: 'Rs. 120,000',
    image: '/assets/store/laptop.jpg',
    location: 'Karachi · 4 days ago',
  }
]

export default function StorePage() {
  return (
    <>
      <Helmet>
        <title>Marketplace | InterviewPrep</title>
      </Helmet>

      <Navbar />

      <div className="store-page">
        <aside className="store-sidebar">
          <h3>Marketplace</h3>
          <ul>
            <li>Browse All</li>
            <li>Your Listings</li>
            <li>Buying</li>
            <li>Saved</li>
            <li>Create New Listing</li>
          </ul>
        </aside>

        <main className="store-content">
          <h2>Today's Picks</h2>
          <div className="product-grid">
            {mockProducts.map(product => (
              <div className="product-card" key={product.id}>
                <img src={product.image} alt={product.title} className="product-image" />
                <div className="product-details">
                  <h4>{product.title}</h4>
                  <p className="price">{product.price}</p>
                  <p className="location">{product.location}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
