# AI Learning Coach Frontend

This is the frontend application for the AI Learning Coach, a tool that helps users analyze their resumes and get personalized career guidance.

## Features

- Modern, responsive UI built with React and Tailwind CSS
- PDF resume upload and analysis
- Personalized career roadmap generation
- Interactive toggle options for different analysis types
- Resource links with visual indicators
- Mobile-friendly design

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router
- Heroicons

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-learning-coach.git
cd ai-learning-coach/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following:
```
VITE_API_URL=http://localhost:5000
```

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── LinkList.jsx
│   ├── pages/
│   │   └── ResumeCoach.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
