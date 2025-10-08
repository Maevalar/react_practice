/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const preparedproducts = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    item => item.id === product.categoryId,
  );

  const user = usersFromServer.find(item => item.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

const getFilteredProducts = (products, { user, search, categories }) => {
  let filteredProducts = [...products];

  if (user !== 'All') {
    filteredProducts = filteredProducts.filter(
      product => product.user.name === user,
    );
  }

  if (search) {
    const normalizedSearch = search.toLowerCase().trim();

    filteredProducts = filteredProducts.filter(product => {
      return product.name.toLowerCase().includes(normalizedSearch);
    });
  }

  if (categories.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      return categories.some(item => product.category.title === item.title);
    });
  }

  return filteredProducts;
};

export const App = () => {
  // eslint-disable-next-line no-unused-vars
  const [selectedUser, setSelectedUser] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleUserFilter = user => {
    setSelectedUser(user.name);
  };

  const handleResetFilters = () => {
    setSelectedUser('All');
    setSearch('');
    setSelectedCategories([]);
  };

  const handleCategoryFilter = category => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(currentSelectedCategory => {
        return currentSelectedCategory.filter(item => item.id !== category.id);
      });
    } else {
      setSelectedCategories(currentSelectedCategory => [
        ...currentSelectedCategory,
        category,
      ]);
    }
  };

  const filteredProducts = getFilteredProducts(preparedproducts, {
    user: selectedUser,
    search,
    categories: selectedCategories,
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => setSelectedUser('All')}
                className={cn({ 'is-active': selectedUser === 'All' })}
                data-cy="FilterAllUsers"
                href="#/"
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  onClick={() => {
                    handleUserFilter(user);
                  }}
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({ 'is-active': selectedUser === user.name })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={search}
                  onChange={event => setSearch(event.target.value.trimStart())}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {search && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearch('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                onClick={() => setSelectedCategories([])}
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': selectedCategories.length > 0,
                })}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  onClick={() => handleCategoryFilter(category)}
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedCategories.includes(category),
                  })}
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                onClick={handleResetFilters}
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => {
                  return (
                    <tr key={product.id} data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={cn({
                          'has-text-link': product.user.sex === 'm',
                          'has-text-danger': product.user.sex === 'f',
                        })}
                      >
                        {product.user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
