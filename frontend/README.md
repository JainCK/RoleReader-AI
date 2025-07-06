# RoleReader AI Frontend

A modern React/Next.js frontend for the AI Resume Comparison API built with TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- 🎯 **Resume Analysis**: Compare resumes against job descriptions
- 📊 **Visual Results**: Beautiful charts and progress indicators
- 📝 **Detailed Feedback**: Skill matching, keyword analysis, and suggestions
- 📈 **History Tracking**: View past comparison results with trends
- ⚡ **Real-time Status**: API health monitoring
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Running FastAPI backend (http://localhost:8000)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Start the backend**: Make sure your FastAPI backend is running on port 8000
2. **Paste your resume**: Copy and paste your resume text into the first textarea
3. **Add job description**: Copy and paste the job description into the second textarea
4. **Analyze**: Click "Compare Resume" to get AI-powered insights
5. **Review results**: View match scores, skill analysis, and improvement suggestions
6. **Check history**: See past comparisons and track your progress

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Native Fetch API

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── lib/             # Utility functions and API client
└── types/           # TypeScript type definitions
```

## API Integration

The frontend connects to the FastAPI backend using a custom API client (`src/lib/api.ts`) that handles:

- Resume comparison requests
- Comparison history retrieval
- Health status monitoring
- Error handling and retry logic

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the RoleReader AI application suite.
