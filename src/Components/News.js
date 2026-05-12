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
      pageNum: 1,
      fadeIn: false,
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    await this.fetchNews(null);
    this.setState({ loading: false, fadeIn: true });
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

  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleNext = async () => {
    const { nextPage, prevPages, pageNum } = this.state;
    if (nextPage) {
      this.setState({ loading: true, fadeIn: false, prevPages: [...prevPages, nextPage], pageNum: pageNum + 1 });
      await this.fetchNews(nextPage);
      this.setState({ loading: false }, () => {
        this.scrollToTop();
        setTimeout(() => this.setState({ fadeIn: true }), 100);
      });
    }
  };

  handleBack = async () => {
    const { prevPages, pageNum } = this.state;
    this.setState({ fadeIn: false });
    if (prevPages.length > 1) {
      const newPrev = [...prevPages];
      newPrev.pop();
      this.setState({ loading: true, prevPages: newPrev, pageNum: pageNum - 1 });
      await this.fetchNews(newPrev[newPrev.length - 1]);
    } else {
      this.setState({ loading: true, prevPages: [], pageNum: 1 });
      await this.fetchNews(null);
    }
    this.setState({ loading: false }, () => {
      this.scrollToTop();
      setTimeout(() => this.setState({ fadeIn: true }), 100);
    });
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

  renderSkeletons = () => {
    return Array(6).fill(0).map((_, i) => (
      <div className="col-md-4 mb-4" key={i}>
        <div className="card border-0 shadow-sm h-100">
          <div className="skeleton skeleton-img"></div>
          <div className="card-body">
            <div className="skeleton skeleton-title mb-2"></div>
            <div className="skeleton skeleton-text mb-1"></div>
            <div className="skeleton skeleton-text mb-1"></div>
            <div className="skeleton skeleton-text-short"></div>
          </div>
        </div>
      </div>
    ));
  }

  render() {
    const { articles, loading, nextPage, prevPages, pageNum, fadeIn } = this.state;

    return (
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">{this.getCategoryTitle()}</h4>
          {!loading && articles.length > 0 && (
            <span className="badge bg-dark">Page {pageNum}</span>
          )}
        </div>

        <div className={`row news-grid ${fadeIn ? 'fade-in' : ''}`}>
          {loading ? this.renderSkeletons() : (
            articles.length > 0 ? articles.map((element) => (
              <div className="col-md-4 mb-4" key={element.link}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 60) + "..." : "No title"}
                  description={element.description ? element.description.slice(0, 100) + "..." : "No description"}
                  imageUrl={element.image_url}
                  newsUrl={element.link}
                  source={element.source_id}
                  publishedAt={element.pubDate}
                  category={element.category?.[0]}
                />
              </div>
            )) : (
              <div className="text-center mt-5 w-100">
                <h5>😔 No articles found</h5>
                <p className="text-muted">Try a different category or search term</p>
              </div>
            )
          )}
        </div>

        {!loading && articles.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-2 mb-5">
            <button className="btn btn-dark px-4"
              onClick={this.handleBack} disabled={prevPages.length === 0}>
              ← Previous
            </button>
            <span className="text-muted fw-semibold">Page {pageNum}</span>
            <button className="btn btn-dark px-4"
              onClick={this.handleNext} disabled={!nextPage}>
              Next →
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default News;
