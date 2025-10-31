import '@testing-library/jest-dom';
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Inicializar o ambiente de teste do Angular
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Mock do process.env para testes
Object.defineProperty(global, 'process', {
  value: {
    env: {
      NG_APP_API_KEY: 'test-api-key',
    },
  },
});
