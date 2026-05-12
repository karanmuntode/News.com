import './App.css';
import React, { Component } from 'react'
import Navbar from './Components/Navbar';
import News from './Components/News';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      category: 'business',
      searchQuery: '',
    };
  }

  setCategory = (category) => {
    this.setState({ category, searchQuery: '' });
  }

  setSearch = (query) => {
    this.setState({ searchQuery: query, category: '' });
  }

  render() {
    return (
      <div>
        <Navbar
          setCategory={this.setCategory}
          setSearch={this.setSearch}
        />
        <News
          key={this.state.category + this.state.searchQuery}
          category={this.state.category}
          searchQuery={this.state.searchQuery}
        />
      </div>
    )
  }
}
