# Copilot Instructions

This document provides guidance for AI coding agents to effectively contribute to this project.

## Project Overview

This is an Angular application that displays movie information from The Movie Database (TMDB) API. The application allows users to view popular movies and search for specific movies.

## Architecture

The application follows a feature-based architecture. The core movie-related functionality is encapsulated within the `src/app/features/movies` directory.

### Architectural Guidance

The architecture of this application is inspired by the best practices for scalable Angular applications. The main principles are:

- **Layered Architecture**: The application is divided into three main layers:
    1.  **Presentation Layer**: Contains the Angular components responsible for the UI. These are "dumb" components that delegate user actions.
    2.  **Abstraction Layer (Facade)**: This layer, implemented by `MovieFacade`, decouples the presentation layer from the core business logic. It exposes streams of state and a simple API for components to call.
    3.  **Core Layer**: This includes the `MovieApiService` for external communication and `MovieStateService` for state management. It contains the core application logic.

- **Unidirectional Data Flow**: The application follows a reactive approach where data flows in a single direction.
    - State is managed in the `MovieStateService`.
    - The `MovieFacade` orchestrates state changes and exposes state as observable streams.
    - Components subscribe to these streams and are updated automatically when the state changes. User actions are delegated back to the facade to initiate state changes.

- **Smart and Dumb Components**:
    - **Smart Components** (e.g., `MovieListComponent`): These are container components that are aware of the application's state and interact with the facade.
    - **Dumb Components** (e.g., `MovieCardComponent`, `CarouselComponent`): These are presentational components that receive data via `@Input()` and emit events via `@Output()`. They are not aware of the application's state.

For more details, refer to the [Angular Architecture Best Practices](https://dev-academy.com/angular-architecture-best-practices/) guide.

### Key Architectural Patterns

- **Standalone Components:** The project uses Angular's standalone components. All components should be created as standalone and imported directly where needed.
- **Facade Pattern:** The `MovieFacade` (`src/app/features/movies/services/movie.facade.ts`) is used to abstract the complexities of the underlying API and state management. It provides a simple interface for the UI components to interact with.
- **State Management:** A simple, reactive state management solution is implemented using `BehaviorSubject` in `MovieStateService` (`src/app/features/movies/state/movie.state.ts`). This service holds the application state, and components subscribe to its observables to get real-time updates.

### Directory Structure

- `src/app/features/movies/api`: Contains the `MovieApiService` for making HTTP requests to the TMDB API.
- `src/app/features/movies/components`: Contains reusable UI components, such as `MovieCardComponent`.
- `src/app/features/movies/pages`: Contains the main view components, like `MovieListComponent`.
- `src/app/features/movies/services`: Contains the `MovieFacade`.
- `src/app/features/movies/state`: Contains the `MovieStateService`.
- `src/app/features/movies/types`: Contains the TypeScript interfaces for the movie data models.
- `src/app/shared/components`: Contains shared components that can be used across different features, such as the `CarouselComponent`.

## Developer Workflow

### Setup

1.  **Environment Variables:** The project requires a TMDB API key. Copy `.env.example` to `.env` and add your API key:
    `NG_APP_API_KEY=your_api_key_here`
2.  **Install Dependencies:** Run `npm install` to install the required packages.

### Running the Application

-   **Development Server:** Run `npm start` or `ng serve` to start the development server. The application will be available at `http://localhost:4200/`.
-   **Build:** Run `npm run build` or `ng build` to build the project.
-   **Tests:** Run `npm test` or `ng test` to execute the unit tests.

## Coding Conventions

-   **Components:** Create new components as standalone. Use the Angular CLI to generate new components: `ng generate component component-name`.
-   **Styling:** Use SCSS for styling. Each component has its own `.scss` file.
-   **State Management:** When adding new state, update the `MovieState` interface in `src/app/features/movies/state/movie.state.ts` and add corresponding methods in `MovieStateService`.
-   **API Interaction:** All interactions with the TMDB API should go through the `MovieApiService`.
-   **Facades:** Use the `MovieFacade` to orchestrate API calls and state updates. Components should primarily interact with the facade.
-   **Environment Variables:** Access environment variables through `process.env['VARIABLE_NAME']`. The configuration for this is in `angular.json` and the environment files.
