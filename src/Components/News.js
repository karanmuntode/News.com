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
    let url = `https://newsdata.io/api/1/news?apikey=YOUR_NEWSDATA_KEY&language=en&category=business`;
    if (pageToken) url += `&page=${pageToken}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.results || [],
      nextPage: parsedData.nextPage || null,
    });
  };

  handleNext = async () => {
    const { nextPage, prevPages, articles } = this.state;
    if (nextPage) {
      this.setState({
        loading: true,
        prevPages: [...prevPages, nextPage],
      });
      await this.fetchNews(nextPage);
      this.setState({ loading: false });
    }
  };

  handleBack = async () => {
    const { prevPages } = this.state;
    if (prevPages.length > 1) {
      const newPrev = [...prevPages];
      newPrev.pop();
      const prevToken = newPrev[newPrev.length - 1];
      this.setState({ loading: true, prevPages: newPrev });
      await this.fetchNews(prevToken);
      this.setState({ loading: false });
    } else {
      this.setState({ loading: true, prevPages: [] });
      await this.fetchNews(null);
      this.setState({ loading: false });
    }
  };

  render() {
    const { articles, loading, nextPage, prevPages } = this.state;
    return (
      <div className="container my-3">
        <h2>Top Headlines</h2>
        {loading && <Spinner />}
        <div className="row">
          {articles && articles.map((element) => (
            <div className="col-md-4" key={element.link}>
              <NewsItem
                title={element.title ? element.title.slice(0, 50) + "..." : "No title"}
                description={element.description ? element.description.slice(0, 80) + "..." : "No description"}
                imageUrl={element.image_url}
                newsUrl={element.link}
              />
            </div>
          ))}
        </div>
        <div className="container d-flex justify-content-between">
          <button type="button" className="btn btn-warning" onClick={this.handleBack} disabled={prevPages.length === 0}>
            &larr; Back
          </button>
          <button type="button" className="btn btn-warning" onClick={this.handleNext} disabled={!nextPage}>
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
