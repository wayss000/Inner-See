[中文](./readme_cn.md) | English

## Development Introduction
An AI-powered app for exploring inner self and self-discovery. Supports both Android and iOS platforms.

## Development Notes
This project was developed almost entirely using the **KAT-Coder-Pro V1** model.

### Application Demo Video

Watch our application demo video:

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=115531768205559&bvid=BV12LkyBuEHh&cid=33924710953&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

### Interface Showcase

Below are screenshots of our application interface:

<table>
  <tr>
    <td><img src="demo/1.jpg" width="200" alt="Interface screenshot 1"></td>
    <td><img src="demo/2.jpg" width="200" alt="Interface screenshot 2"></td>
    <td><img src="demo/3.jpg" width="200" alt="Interface screenshot 3"></td>
    <td><img src="demo/4.jpg" width="200" alt="Interface screenshot 4"></td>
    <td><img src="demo/5.jpg" width="200" alt="Interface screenshot 5"></td>
  </tr>
  <tr>
    <td align="center">Interface 1</td>
    <td align="center">Interface 2</td>
    <td align="center">Interface 3</td>
    <td align="center">Interface 4</td>
    <td align="center">Interface 5</td>
  </tr>
  <tr>
    <td><img src="demo/6.jpg" width="200" alt="Interface screenshot 6"></td>
    <td><img src="demo/7.jpg" width="200" alt="Interface screenshot 7"></td>
    <td><img src="demo/8.jpg" width="200" alt="Interface screenshot 8"></td>
    <td><img src="demo/9.jpg" width="200" alt="Interface screenshot 9"></td>
    <td><img src="demo/10.jpg" width="200" alt="Interface screenshot 10"></td>
  </tr>
  <tr>
    <td align="center">Interface 6</td>
    <td align="center">Interface 7</td>
    <td align="center">Interface 8</td>
    <td align="center">Interface 9</td>
    <td align="center">Interface 10</td>
  </tr>
  <tr>
    <td><img src="demo/11.jpg" width="200" alt="Interface screenshot 11"></td>
    <td><img src="demo/12.jpg" width="200" alt="Interface screenshot 12"></td>
    <td><img src="demo/13.jpg" width="200" alt="Interface screenshot 13"></td>
    <td><img src="demo/14.jpg" width="200" alt="Interface screenshot 14"></td>
    <td><img src="demo/15.jpg" width="200" alt="Interface screenshot 15"></td>
  </tr>
  <tr>
    <td align="center">Interface 11</td>
    <td align="center">Interface 12</td>
    <td align="center">Interface 13</td>
    <td align="center">Interface 14</td>
    <td align="center">Interface 15</td>
  </tr>
</table>


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
