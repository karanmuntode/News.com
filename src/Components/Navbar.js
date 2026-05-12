import React, { Component } from 'react'

export class Navbar extends Component {

  constructor() {
    super();
    this.state = { searchInput: '' };
  }

  handleSearch = (e) => {
    e.preventDefault();
    if (this.state.searchInput.trim()) {
      this.props.setSearch(this.state.searchInput.trim());
    }
  }

  render() {
    const categories = [
      { label: '🏠 Home', value: 'business' },
      { label: '🎬 Entertainment', value: 'entertainment' },
      { label: '🌍 World', value: 'world' },
      { label: '⚽ Sports', value: 'sports' },
      { label: '💻 Technology', value: 'technology' },
      { label: '🌾 Agriculture', value: 'environment' },
      { label: '🏥 Health', value: 'health' },
      { label: '🔬 Science', value: 'science' },
    ];

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold" href="/">📰 News.com</a>
            <button className="navbar-toggler" type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {categories.map(cat => (
                  <li className="nav-item" key={cat.value}>
                    <button
                      className="nav-link btn btn-link text-white text-decoration-none"
                      onClick={() => this.props.setCategory(cat.value)}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
              <form className="d-flex" onSubmit={this.handleSearch}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search news..."
                  value={this.state.searchInput}
                  onChange={(e) => this.setState({ searchInput: e.target.value })}
                />
                <button className="btn btn-warning" type="submit">🔍</button>
              </form>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default Navbar
