# SelecaoVlab

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.0.

## Setup

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn package manager
- TMDB API Key (The Movie Database)

### Environment Configuration

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your TMDB API key:
   - Create an account at [The Movie Database](https://www.themoviedb.org/)
   - Navigate to [API Settings](https://www.themoviedb.org/settings/api)
   - Copy your API key

3. Update the `.env` file with your API key:
   ```
   NG_APP_API_KEY=your_actual_api_key_here
   ```

### Installation

Run `npm install` to install all dependencies.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
