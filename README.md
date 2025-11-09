[中文](./readme_cn.md) | English

## Development Introduction
An AI-powered app for exploring inner self and self-discovery. Supports both Android and iOS platforms.

## Development Notes
This project was developed almost entirely using the **KAT-Coder-Pro V1** model.


### Using **KAT-Coder-Pro V1** for Development

Through natural conversation with **KAT-Coder-Pro V1**, the entire project was completed.

#### 📋 PRD Design
Described the mental health app concept to AI, which organized a complete product framework, designed user flows and functional modules, and reminded about data privacy considerations.
[View detailed PRD document](./design/PRD.md)

#### 🎨 UI Design
Requested a clean and warm interface style, AI designed a complete UI from homepage to test pages, especially the gradient background and chart display on result pages, making psychological analysis results more intuitive.
[View UI design examples](./design/ui)

#### 🏗️ Architecture Design
Requested cross-platform support, AI recommended React Native + Expo solution, designed a clear MVC architecture, and planned SQLite database structure.
[View architecture design document](./design/architect.md)

#### Test Design
[View test design document](./design/试卷设计.md)

#### 💻 Code Development
Used conversational commands to let AI gradually implement all functions, from page components to routing systems, to database operations and AI interface integration. During the process, AI actively optimized code quality and error handling.
It feels like AI can **automatically** complete 80% of the code, while the remaining 20% still requires human correction. Clear problem descriptions and specific modification instructions are needed for AI to perform optimally.

### Project Technology Stack

#### Frontend Architecture
- **Framework**: React Native + Expo
- **Routing**: Expo Router (file-system based routing)
- **State Management**: React Context + Hooks
- **Type System**: TypeScript
- **UI Components**: React Native Elements + Custom Components

#### Cross-Platform Support
- **Platforms**: iOS, Android, Web
- **Build Tool**: Expo CLI
- **New Architecture**: Supports React Native New Architecture
- **Native Modules**: Native functionality integration (camera, photo library, haptics, etc.)

#### Data Storage
- **Local Database**: SQLite (Expo SQLite)
- **Data Persistence**: AsyncStorage
- **ORM**: TypeORM (lightweight object-relational mapping)
- **Data Models**: User data, test records, answer history

#### AI Service Integration
- **AI Model**: KwaiKAT (WanQing API)
- **Service Architecture**: RESTful API calls
- **Features**: Psychological analysis, test generation, personalized recommendations
- **Data Format**: Standardized JSON interaction

#### Development Tools
- **Code Standards**: ESLint + TypeScript ESLint
- **Testing Framework**: Jest + Expo Testing Library
- **Package Management**: npm
- **Environment Configuration**: Expo environment variable management
