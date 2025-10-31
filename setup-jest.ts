import 'jest-preset-angular/setup-jest';
import '@testing-library/jest-dom';

// Mock do process.env para testes
Object.defineProperty(global, 'process', {
  value: {
    env: {
      NG_APP_API_KEY: 'test-api-key',
    },
  },
});
