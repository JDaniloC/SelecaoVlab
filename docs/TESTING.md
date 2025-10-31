# Guia de Testes

Este documento descreve como executar e escrever testes neste projeto Angular.

## Visão Geral

O projeto utiliza duas ferramentas principais para testes:

- **Jest + Testing Library**: Para testes unitários e de integração
- **Cypress**: Para testes End-to-End (E2E)

## Status de Cobertura de Testes

### Testes Implementados ✅

#### Testes Unitários (Jest)
- ✅ **MovieApiService**: Testes completos para busca de filmes, paginação, filtros e tratamento de erros
- ✅ **MovieStateService**: Testes para gerenciamento de estado, atualização de filmes, gêneros, loading e erros
- ✅ **MovieFacade**: Testes para orquestração entre API e State, incluindo cenários de sucesso e falha
- ✅ **MovieCardComponent**: Testes de renderização e exibição de informações do filme
- ✅ **MovieListComponent**: Testes de listagem, filtros, ordenação e estados de loading/erro

#### Testes E2E (Cypress)
- ✅ **Carregamento e exibição da página**: Verificação de elementos principais
- ✅ **Busca de filmes**: Testes de busca por nome
- ✅ **Filtros**: Testes de filtros por gênero e ano
- ✅ **Ordenação**: Testes de ordenação por diferentes critérios
- ✅ **Tratamento de erros**: Testes de API failures e timeouts
- ✅ **Design responsivo**: Testes em diferentes viewports
- ✅ **Acessibilidade**: Testes básicos de a11y

### Funcionalidades Pendentes de Teste 🚧

> **Nota**: A funcionalidade de maratona (adicionar/remover filmes, calcular duração total) está planejada mas ainda não foi implementada. Os testes para essa funcionalidade estão documentados nos arquivos de teste como TODOs e devem ser descomentados e implementados quando a funcionalidade for adicionada.

#### Testes a Implementar Quando a Funcionalidade Estiver Pronta:
- ⏳ Adicionar filme à maratona
- ⏳ Remover filme da maratona
- ⏳ Calcular e exibir duração total da maratona
- ⏳ Atualizar contador de filmes na maratona
- ⏳ Persistir maratona no localStorage
- ⏳ Limpar todos os filmes da maratona

## Testes Unitários (Jest)

### Executar testes

```bash
# Executar todos os testes unitários
npm test

# Executar em modo watch (re-executa automaticamente ao salvar)
npm run test:watch

# Executar com relatório de cobertura
npm run test:coverage
```

### Estrutura dos testes

- Os testes unitários devem estar ao lado dos arquivos testados com a extensão `.spec.ts`
- Exemplo: `movie.facade.ts` → `movie.facade.spec.ts`

### Escrevendo testes unitários

#### Testando Serviços

```typescript
import { TestBed } from '@angular/core/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyService]
    });
    service = TestBed.inject(MyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return data', () => {
    const result = service.getData();
    expect(result).toEqual(expectedData);
  });
});
```

#### Testando Componentes com Testing Library

```typescript
import { render, screen } from '@testing-library/angular';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  it('should render correctly', async () => {
    await render(MyComponent, {
      componentInputs: { title: 'Test Title' }
    });

    expect(screen.getByText('Test Title')).toBeTruthy();
  });

  it('should handle user interaction', async () => {
    const { fixture } = await render(MyComponent);
    
    const button = screen.getByRole('button');
    button.click();
    
    expect(screen.getByText('Clicked')).toBeTruthy();
  });
});
```

#### Testando com Mocks

```typescript
describe('MovieFacade', () => {
  let facade: MovieFacade;
  let apiServiceMock: jest.Mocked<MovieApiService>;

  beforeEach(() => {
    apiServiceMock = {
      getPopularMovies: jest.fn(),
      searchMovies: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        MovieFacade,
        { provide: MovieApiService, useValue: apiServiceMock }
      ]
    });

    facade = TestBed.inject(MovieFacade);
  });

  it('should call API service', () => {
    apiServiceMock.getPopularMovies.mockReturnValue(of(mockData));
    
    facade.loadMovies();
    
    expect(apiServiceMock.getPopularMovies).toHaveBeenCalled();
  });
});
```

### Cobertura de Código

O relatório de cobertura é gerado na pasta `coverage/`. Você pode visualizar o relatório HTML abrindo `coverage/lcov-report/index.html` no navegador.

**Metas de cobertura configuradas**: 70% para branches, functions, lines e statements.

Para abrir o relatório de cobertura após executar os testes:

```bash
# No Linux/Mac
npm run test:coverage && open coverage/lcov-report/index.html

# No Windows
npm run test:coverage && start coverage/lcov-report/index.html
```

## Testes E2E (Cypress)

### Executar testes E2E

```bash
# Abrir interface do Cypress (modo interativo)
npm run e2e

# Executar em modo headless (sem interface)
npm run e2e:headless

# Executar no CI (inicia servidor + executa testes)
npm run e2e:ci
```

### Estrutura dos testes E2E

- Os testes E2E ficam em `cypress/e2e/`
- Cada arquivo deve ter a extensão `.cy.ts`
- Exemplo: `cypress/e2e/movies.cy.ts`

### Escrevendo testes E2E

```typescript
describe('Feature Page', () => {
  beforeEach(() => {
    cy.visit('/feature');
  });

  it('should display the page', () => {
    cy.get('app-feature').should('exist');
  });

  it('should allow user interaction', () => {
    cy.get('input[type="search"]').type('search term');
    cy.get('button[type="submit"]').click();
    
    cy.get('.results').should('have.length.greaterThan', 0);
  });

  it('should navigate to details', () => {
    cy.get('.item').first().click();
    cy.url().should('include', '/details');
  });
});
```

### Comandos Customizados

Você pode adicionar comandos reutilizáveis em `cypress/support/commands.ts`:

```typescript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

export {};
```

Uso:
```typescript
cy.login('user@example.com', 'password123');
```

## Boas Práticas

### Gerais

1. **Teste comportamento, não implementação**: Foque no que o código faz, não em como ele faz
2. **Mantenha testes independentes**: Cada teste deve poder rodar isoladamente
3. **Use dados realistas**: Testes com dados reais são mais confiáveis
4. **Nomes descritivos**: Use nomes que descrevem claramente o que está sendo testado
5. **AAA Pattern**: Organize testes em Arrange (preparar), Act (agir), Assert (verificar)

### Testes Unitários

1. **Mock dependências externas**: Isole a unidade sendo testada
2. **Teste casos de erro**: Não teste apenas o caminho feliz
3. **Um conceito por teste**: Cada teste deve verificar apenas uma coisa
4. **Evite lógica nos testes**: Testes devem ser simples e diretos

### Testes E2E

1. **Teste fluxos de usuário**: Simule como usuários reais usariam a aplicação
2. **Use seletores semânticos**: Prefira `getByRole`, `getByText` ao invés de classes CSS
3. **Aguarde elementos**: Use `should('exist')` e timeouts apropriados
4. **Limpe estado entre testes**: Use `beforeEach` para garantir ambiente limpo

## Executando Testes no CI/CD

Os testes são executados automaticamente quando você:

- Faz push para `main` ou `develop`
- Abre um Pull Request

## Estrutura de Arquivos de Teste

```
src/
├── app/
│   ├── features/
│   │   └── movies/
│   │       ├── api/
│   │       │   ├── movie.api.ts
│   │       │   └── movie.api.spec.ts          # ✅ Teste do serviço de API
│   │       ├── components/
│   │       │   └── movie-card/
│   │       │       ├── movie-card.component.ts
│   │       │       └── movie-card.component.spec.ts  # ✅ Teste do componente
│   │       ├── pages/
│   │       │   └── movie-list/
│   │       │       ├── movie-list.component.ts
│   │       │       └── movie-list.component.spec.ts  # ✅ Teste da página
│   │       ├── services/
│   │       │   ├── movie.facade.ts
│   │       │   └── movie.facade.spec.ts       # ✅ Teste da facade
│   │       └── state/
│   │           ├── movie.state.ts
│   │           └── movie.state.spec.ts        # ✅ Teste do state service
cypress/
├── e2e/
│   └── movies.cy.ts                           # ✅ Testes E2E
├── support/
│   ├── commands.ts                            # Comandos customizados
│   └── e2e.ts                                 # Configuração E2E
```

## Debugging

### Jest

Para debugar testes do Jest:

```bash
# Executar apenas um arquivo de teste
npm test -- movie.facade.spec.ts

# Executar testes que correspondem a um padrão
npm test -- --testNamePattern="should load movies"

# Modo verbose para mais informações
npm test -- --verbose

# Limpar cache do Jest
npm test -- --clearCache
```

### Cypress

O Cypress fornece ferramentas visuais de debug:

1. Abra o Cypress em modo interativo: `npm run e2e`
2. Clique no teste que deseja debugar
3. Use o seletor de tempo (time-travel) para ver cada passo
4. Inspecione elementos e estado da aplicação

## Roadmap de Testes

### Próximas Implementações (quando a funcionalidade de maratona estiver pronta)

1. **Testes de Integração para Maratona**
   - Service para gerenciar filmes da maratona
   - Cálculo de duração total
   - Persistência em localStorage

2. **Testes de Componente**
   - Botão de adicionar/remover filme
   - Lista de filmes na maratona
   - Exibição de duração total

3. **Testes E2E**
   - Fluxo completo de adicionar filme
   - Persistência após reload
   - Remoção de filmes
   - Limpeza da maratona

## Recursos Adicionais

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Angular](https://testing-library.com/docs/angular-testing-library/intro)
- [Cypress Documentation](https://docs.cypress.io)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jest Preset Angular](https://github.com/thymikee/jest-preset-angular)

## Suporte

Se encontrar problemas com os testes:

1. Verifique se todas as dependências estão instaladas: `npm install`
2. Limpe o cache do Jest: `npm test -- --clearCache`
3. Verifique os logs de erro para mais detalhes
4. Consulte a documentação das ferramentas acima

## Contribuindo com Testes

Ao adicionar novas funcionalidades, sempre inclua testes:

1. **Testes Unitários**: Para serviços, facades e lógica de negócio
2. **Testes de Componente**: Para componentes Angular
3. **Testes E2E**: Para fluxos críticos do usuário

### Checklist para Pull Requests

- [ ] Testes unitários para nova funcionalidade
- [ ] Testes de componente (se aplicável)
- [ ] Testes E2E para fluxos do usuário (se aplicável)
- [ ] Cobertura de código acima de 70%
- [ ] Todos os testes passando localmente
- [ ] Documentação de testes atualizada
