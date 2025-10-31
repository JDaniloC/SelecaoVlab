import { render, screen, fireEvent } from '@testing-library/angular';
import { FilmographySearchComponent } from './filmography-search.component';

describe('FilmographySearchComponent', () => {
  it('should emit search event with trimmed value on submit', async () => {
    const { fixture } = await render(FilmographySearchComponent);
    const component = fixture.componentInstance;
    const searchSpy = jest.spyOn(component.search, 'emit');

    component.searchControl.setValue('  Christopher Nolan  ');
    component.onSubmit();

    expect(searchSpy).toHaveBeenCalledWith('Christopher Nolan');
  });

  it('should not emit search event when input is empty', async () => {
    const { fixture } = await render(FilmographySearchComponent);
    const component = fixture.componentInstance;
    const searchSpy = jest.spyOn(component.search, 'emit');

    component.searchControl.setValue('   ');
    component.onSubmit();

    expect(searchSpy).not.toHaveBeenCalled();
  });

  it('should emit clear event and reset control', async () => {
    const { fixture } = await render(FilmographySearchComponent);
    const component = fixture.componentInstance;
    const clearSpy = jest.spyOn(component.clear, 'emit');

    component.selectedPersonName = 'Christopher Nolan';
    fixture.detectChanges();

    const input = screen.getByPlaceholderText('Digite o nome de um diretor, ator ou profissional...');
    await fireEvent.input(input, { target: { value: 'Tenet' } });

    const clearButton = screen.getByRole('button', { name: /limpar/i });
    await fireEvent.click(clearButton);

    expect(clearSpy).toHaveBeenCalled();
    expect(component.searchControl.value).toBe('');
  });

  it('should disable actions while loading', async () => {
    const { fixture } = await render(FilmographySearchComponent, {
      componentProperties: {
        loading: true,
        selectedPersonName: 'Christopher Nolan'
      }
    });

    const component = fixture.componentInstance;

    const searchButton = screen.getByRole('button', { name: /buscar filmografia/i });
    const clearButton = screen.getByRole('button', { name: /limpar/i });
    const input = screen.getByPlaceholderText('Digite o nome de um diretor, ator ou profissional...');

    expect(searchButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
    expect(input).toBeDisabled();
    expect(component.searchControl.disabled).toBe(true);
  });
});
