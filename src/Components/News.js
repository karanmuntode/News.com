import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";

export class News extends Component {

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      nextPage: null,
      prevPages: [],
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    await this.fetchNews(null);
    this.setState({ loading: false });
  }

  fetchNews = async (pageToken) => {
    const { category, searchQuery } = this.props;
    let url = '';
    if (searchQuery) {
      url = `https://newsdata.io/api/1/news?apikey=pub_97097bc6d16a41c5b78009e9ce41ce36&language=en&q=${searchQuery}`;
    } else {
      url = `https://newsdata.io/api/1/news?apikey=pub_97097bc6d16a41c5b78009e9ce41ce36&language=en&category=${category || 'business'}`;
    }
    if (pageToken) url += `&page=${pageToken}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.results || [],
      nextPage: parsedData.nextPage || null,
    });
  };

  handleNext = async () => {
    const { nextPage, prevPages } = this.state;
    if (nextPage) {
      this.setState({ loading: true, prevPages: [...prevPages, nextPage] });
      await this.fetchNews(nextPage);
      this.setState({ loading: false });
    }
  };

  handleBack = async () => {
    const { prevPages } = this.state;
    if (prevPages.length > 1) {
      const newPrev = [...prevPages];
      newPrev.pop();
      this.setState({ loading: true, prevPages: newPrev });
      await this.fetchNews(newPrev[newPrev.length - 1]);
      this.setState({ loading: false });
    } else {
      this.setState({ loading: true, prevPages: [] });
      await this.fetchNews(null);
      this.setState({ loading: false });
    }
  };

  getCategoryTitle = () => {
    const { category, searchQuery } = this.props;
    if (searchQuery) return `🔍 Results for "${searchQuery}"`;
    const titles = {
      business: '💼 Business News',
      entertainment: '🎬 Entertainment',
      world: '🌍 World Affairs',
      sports: '⚽ Sports',
      technology: '💻 Technology',
      environment: '🌾 Agriculture & Environment',
      health: '🏥 Health',
      science: '🔬 Science',
    };
    return titles[category] || '📰 Top Headlines';
  }

  render() {
    const { articles, loading, nextPage, prevPages } = this.state;
    return (
      <div className="container my-3">
        <h2 className="mb-4">{this.getCategoryTitle()}</h2>
        {loading && <Spinner />}
        <div className="row">
          {articles && articles.map((element) => (
            <div className="col-md-4 mb-3" key={element.link}>
              <NewsItem
                title={element.title ? element.title.slice(0, 50) + "..." : "No title"}
                description={element.description ? element.description.slice(0, 80) + "..." : "No description"}
                imageUrl={element.image_url}
                newsUrl={element.link}
              />
            </div>
          ))}
        </div>
        {!loading && articles.length === 0 &&
          <div className="text-center mt-5">
            <h4>No articles found</h4>
            <p className="text-muted">Try a different category or search term</p>
          </div>
        }
        <div className="container d-flex justify-content-between mt-3">
          <button type="button" className="btn btn-warning"
            onClick={this.handleBack} disabled={prevPages.length === 0}>
            &larr; Back
          </button>
          <button type="button" className="btn btn-warning"
            onClick={this.handleNext} disabled={!nextPage}>
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
