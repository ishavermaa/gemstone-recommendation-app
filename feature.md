# Gemstone Recommendation App – Final Enhancement Requirements

## Existing Project

The application already contains:

* JWT Authentication
* User Dashboard
* Admin Dashboard
* Recommendation Engine
* Favorites System
* Recommendation History
* MongoDB Database
* React + Vite Frontend
* Express + Node Backend

The following enhancements must be implemented.

---

# Authentication System Updates

## Registration Form

Allow users to select their role during registration.

### Registration Fields

* Full Name
* Age
* Date of Birth
* Email
* Password
* Confirm Password
* Role Selection

### Role Options

* User
* Admin

### Password Field

Provide:

* Show Password button
* Hide Password button

### Validation

* Email uniqueness
* Password length validation
* Age must be valid
* Date of birth required
* Password and Confirm Password must match

---

## Login Form

### Login Fields

* Email
* Password

### Password Field

Provide:

* Show Password
* Hide Password

### Authentication

* JWT Token generation
* Role-based authorization
* Session persistence

---

# Feature 1: Admin Gemstone Management Panel

## Admin Capabilities

* View all gemstones
* Search gemstones
* Filter gemstones
* Add gemstones
* Edit gemstones
* Delete gemstones
* Upload gemstone images

## Gemstone Fields

* Name
* Description
* Benefits
* Planet
* Color
* Recommended Goals
* Wearing Instructions
* Suggested Metal
* Suggested Day
* Main Image
* Gallery Images

---

# Feature 2: User Profile Management

## User Capabilities

* View Profile
* Edit Name
* Edit Age
* Edit DOB
* Edit Email
* Upload Profile Image
* Change Password

## Profile Dashboard

Display:

* Name
* Age
* DOB
* Email
* Role
* Profile Image
* Total Recommendations
* Total Favorites

---

# Feature 3: Forgot Password & Reset Password

## Features

### Forgot Password

User enters email.

System sends reset email.

### Reset Password

User opens reset link.

User enters:

* New Password
* Confirm Password

### Security

* Token expiration
* One-time use token
* Hashed reset token

---

# Feature 5: Reviews & Ratings System

## User Features

* Rate Gemstones
* Add Review
* Edit Review
* Delete Review

## Rating

* 1 Star
* 2 Star
* 3 Star
* 4 Star
* 5 Star

## Display

Show:

* Average Rating
* Total Reviews
* Latest Reviews

## Database Model

Review

* User
* Gemstone
* Rating
* Comment
* CreatedAt

---

# Feature 7: Recommendation Comparison

## Features

Users can:

* Save Recommendations
* Compare Multiple Recommendations

## Comparison View

Display:

* Gemstone Name
* Match Percentage
* Benefits
* Planet
* Color
* Recommended Goals
* Wearing Method

---

# Feature 8: Advanced Analytics Dashboard

## Admin Analytics

Display:

### User Analytics

* Total Users
* New Users This Month
* Active Users

### Recommendation Analytics

* Daily Recommendations
* Weekly Recommendations
* Monthly Recommendations

### Gemstone Analytics

* Most Recommended Gemstones
* Most Favorited Gemstones
* Highest Rated Gemstones

### Charts

* Pie Charts
* Bar Charts
* Line Charts

Use Recharts.

---

# Feature 9: Enhanced Recommendation History

## User Features

* Search History
* Filter By Goal
* Filter By Date
* Sort By Latest
* Sort By Oldest

## Export

Allow export to:

* PDF

---

# Feature 14: Wishlist Collections

## Features

Users can create collections.

### Examples

* Career Gems
* Wealth Gems
* Future Purchases

### Collection Actions

* Create Collection
* Rename Collection
* Delete Collection
* Add Gemstone
* Remove Gemstone

---

# Feature 15: AI Chat Assistant

## Description

Create a chatbot for gemstone guidance.

## User Queries

Examples:

* Which gemstone is best for wealth?
* Which gemstone helps confidence?
* How should I wear Emerald?
* Which gemstone suits my zodiac sign?

## Features

* Chat Interface
* Chat History
* Suggested Questions
* Personalized Responses

## Backend

Create AI service layer.

## Frontend

Create dedicated Chat Assistant page.

Route:

/chat-assistant

---

# Database Updates

## User Schema

Add:

* name
* age
* dob
* email
* password
* role
* profileImage

## Review Schema

Add review collection.

## Wishlist Schema

Add collection support.

---

# Security Requirements

* JWT Authentication
* Password Hashing using bcrypt
* Protected Routes
* Admin-only Routes
* Input Validation
* Rate Limiting

---

# Final Deliverable

Build a production-ready MERN application with:

* Role-based Registration (User/Admin)
* Enhanced Authentication
* Admin Gemstone Management
* User Profile Management
* Password Recovery
* Reviews & Ratings
* Recommendation Comparison
* Advanced Analytics
* Recommendation History Filters
* Wishlist Collections
* AI Chat Assistant

while maintaining all existing functionality.
