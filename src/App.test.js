import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { enableFetchMocks } from 'jest-fetch-mock';

import App from './App';

enableFetchMocks();

describe('App', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.doMock();
    fetch.mockResponseOnce(
      JSON.stringify({
        releases: [
          {
            id: 76035,
            basic_information: {
              master_id: 64128,
              title: 'Dirty Dancing',
              year: 2002,
              formats: [{ name: 'Vinyl' }],
              labels: [{ name: '!K7 Records' }],
              artists: [{ name: 'Swayzak' }],
            },
          },
        ],
      }),
    );
  });

  it('can add a shelf', async () => {
    const { asFragment } = render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText('Add Shelf'));
    fireEvent.change(screen.getByTestId('add-shelf'), {
      target: { value: 'first shelf' },
    });
    fireEvent.click(screen.getByText('Submit'));

    expect(asFragment()).toMatchSnapshot();
  });

  it('can remove a shelf', async () => {
    const { asFragment } = render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText('Add Shelf'));
    fireEvent.change(screen.getByTestId('add-shelf'), {
      target: { value: 'first shelf' },
    });
    fireEvent.click(screen.getByText('Submit'));

    fireEvent.click(screen.getByText('Remove'));
    expect(asFragment()).toMatchSnapshot();
  });

  it('can add a record to a shelf', async () => {
    const { asFragment } = render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText('Add Shelf'));
    fireEvent.change(screen.getByTestId('add-shelf'), {
      target: { value: 'first shelf' },
    });
    fireEvent.click(screen.getByText('Submit'));

    fireEvent.mouseDown(screen.getByLabelText('Add to shelf'));
    const options = within(screen.getByRole("listbox"));
    fireEvent.click(options.getByText('first shelf'));

    const shelf = screen.getByTestId("shelf");
    expect(shelf).toHaveTextContent("Dirty Dancing");
  });

  it('can only add the same record to the same shelf once', async () => {
    // TODO
  });
});
