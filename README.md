# Rental App

A modern, full-stack real estate rental application that allows users to browse properties, filter by location and amenities, view properties on an interactive map, and manage their favorite listings. Managers can also list and manage their properties.

## Features

- **Property Search & Filtering**: Advanced search using price range, beds, baths, property type, square footage, amenities, and location (with map integration).
- **Interactive Maps**: Uses Mapbox and PostGIS for location-based property mapping and radius searches.
- **User Authentication**: Secure user and manager authentication powered by AWS Cognito.
- **Property Management**: Managers can add new properties with image uploads directly to AWS S3.
- **Favorites**: Tenants can easily save their favorite properties.
- **Responsive Design**: Built with Next.js and Tailwind CSS for a seamless experience across all devices.

## Tech Stack

### Frontend (Client)
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit & RTK Query
- **Authentication**: AWS Amplify (Cognito)
- **Maps**: Mapbox GL

### Backend (Server)
- **Framework**: Node.js with Express
- **Database**: PostgreSQL with PostGIS extension (for geospatial queries)
- **ORM**: Prisma
- **Storage**: AWS S3 (for property images)

---

## Prerequisites

Before you begin, ensure you have the following installed and configured:
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** with the **PostGIS** extension installed.
- **AWS Account** (Set up an S3 Bucket and a Cognito User Pool).
- **Mapbox Account** (for generating a Mapbox Access Token).

---

## Installation & Setup

### 1. Database Setup
Ensure you have a PostgreSQL database running and install the PostGIS extension on it:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `server` directory and add the following:
   ```ini
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/realestate?schema=public
   PORT=3002
   S3_BUCKET_NAME=your-s3-bucket-name
   AWS_REGION=your-aws-region
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   ```
4. Generate Prisma Client and Sync Database Schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Seed the database with sample data:
   ```bash
   npm run seed
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```
   *The backend will run on http://localhost:3002 (or the port specified in your `.env`).*

### 3. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `client` directory and add the following:
   ```ini
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
   NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=your-cognito-pool-id
   NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID=your-cognito-client-id
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
   ```
4. Configure Next.js domains (if applicable):
   If you change the S3 bucket or want to use Unsplash images, ensure `next.config.ts` includes the necessary domains under `images.remotePatterns`.
5. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on http://localhost:3000.*

---

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Browse properties or sign up as a Tenant/Manager to test out role-specific features.
3. As a Manager, you can add properties and upload images.
4. As a Tenant, you can favorite properties and view them on your dashboard.
