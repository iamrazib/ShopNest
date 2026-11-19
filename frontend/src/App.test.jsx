
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import App from './App';

const testProducts = [
  {
    id: 1,
    name: 'Everyday Backpack',
    description: 'A durable backpack for work and travel.',
    price: 49.00,
    stock: 25,
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    description: 'Comfortable wireless headphones.',
    price: 89.00,
    stock: 18,
  },
];

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        products: testProducts,
      }),
    })
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('ShopNest frontend', () => {
  it('renders the main shopping interface', () => {
  render(<App />);

  const mainHeading = screen.getByRole('heading', {
    level: 1,
  });

  expect(mainHeading).toHaveTextContent(
    /find your everyday\s+essentials/i
  );

  expect(
    screen.getByRole('link', {
      name: /ShopNest/,
    })
  ).toBeInTheDocument();
});

  it('retrieves and displays products from the API', async () => {
    render(<App />);

    expect(
      await screen.findByRole('heading', {
        name: 'Everyday Backpack',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Wireless Headphones',
      })
    ).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledWith('/api/products');
  });

  it('updates the shopping cart when a product is added', async () => {
    render(<App />);

    await screen.findByRole('heading', {
      name: 'Everyday Backpack',
    });

    fireEvent.click(
      screen.getAllByRole('button', {
        name: 'Add to Cart',
      })[0]
    );

    expect(
      screen.getByRole('button', {
        name: 'Shopping cart, 1 items',
      })
    ).toBeInTheDocument();
  });

  it('displays an error when the API request fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<App />);

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('We could not load products');
  });
});
