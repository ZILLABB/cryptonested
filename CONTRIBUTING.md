# Contributing to CryptoNested

Thank you for your interest in contributing to CryptoNested! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- Git
- Supabase account (for backend features)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/cryptonested.git
   cd cryptonested
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   - Create a Supabase project
   - Run the SQL commands from `supabase/schema.sql`
   - Configure your environment variables

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📋 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker
- Provide detailed reproduction steps
- Include screenshots for UI issues
- Specify your environment (OS, browser, Node.js version)

### Suggesting Features
- Open an issue with the "feature request" label
- Describe the feature and its benefits
- Provide mockups or examples if applicable

### Code Contributions

#### Branch Naming Convention
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

#### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   npm run test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new staking feature"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

#### Commit Message Convention
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 🎨 Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use proper TypeScript interfaces
- Implement proper error boundaries

### CSS/Styling
- Use Tailwind CSS classes
- Follow the existing design system
- Ensure responsive design
- Test in both light and dark modes

### Database
- Follow the existing schema patterns
- Use proper foreign key relationships
- Implement Row Level Security (RLS)
- Add appropriate indexes

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Write unit tests for utility functions
- Write integration tests for API endpoints
- Write component tests for React components
- Aim for good test coverage

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions and classes
- Document complex algorithms and business logic
- Keep README.md updated with new features

### API Documentation
- Document all API endpoints
- Include request/response examples
- Document error codes and messages

## 🔍 Code Review Process

### For Contributors
- Ensure your code follows the style guidelines
- Write clear commit messages
- Respond to feedback promptly
- Update your PR based on review comments

### For Reviewers
- Be constructive and helpful
- Focus on code quality and maintainability
- Check for security issues
- Verify that tests pass

## 🚀 Release Process

### Versioning
We follow [Semantic Versioning](https://semver.org/):
- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality
- PATCH version for backwards-compatible bug fixes

### Release Checklist
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version number is bumped
- [ ] Release notes are prepared

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different opinions and approaches

### Communication
- Use GitHub issues for bug reports and feature requests
- Use GitHub discussions for general questions
- Be patient and helpful with responses
- Keep discussions focused and on-topic

## 📞 Getting Help

If you need help with contributing:
- Check the existing documentation
- Search through GitHub issues
- Create a new issue with the "question" label
- Join our community discussions

## 🙏 Recognition

Contributors will be recognized in:
- The project README.md
- Release notes for significant contributions
- The project's contributors page

Thank you for contributing to CryptoNested! 🚀
