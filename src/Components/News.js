import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner"; 

export class News extends Component {
  constructor() {
    super();

    this.state = {
      articles: [],
      loading: false, 
      page: 1,
      totalResults: 0,
      articlesPerPage: 6,
    };
  }

  async componentDidMount() {
    this.setState({ loading: true }); 
    await this.fetchNews(); 
    this.setState({ loading: false }); 
  }

  fetchNews = async () => {
    const { page, articlesPerPage } = this.state;
    let url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=53d46e2ca7ba444c8d7aaaf038c51fcb&page=${page}&pageSize=${articlesPerPage};`
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
    });
  };

  handleBack = async () => {
    if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1, loading: true }, async () => {
        await this.fetchNews();
        this.setState({ loading: false });
      });
    }
  };

  handleNext = async () => {
    const { page, totalResults, articlesPerPage } = this.state;
    const totalPages = Math.ceil(totalResults / articlesPerPage);

    if (page < totalPages) {
      this.setState({ page: this.state.page + 1, loading: true }, async () => {
        await this.fetchNews();
        this.setState({ loading: false });
      });
    }
  };

  render() {
    const { articles, page, totalResults, articlesPerPage, loading } = this.state;
    const totalPages = Math.ceil(totalResults / articlesPerPage);

    return (
      <div className="container my-3">
        <h2>Top Headlines</h2>

       
        {loading && <Spinner />}

        <div className="row">
          {articles.map((element) => (
            <div className="col-md-4" key={element.url}>
              <NewsItem
                title={
                  element.title && element.title.length > 30
                    ? element.title.slice(0, 30) + "..."
                    : element.title
                }
                description={
                  element.description && element.description.length > 80
                    ? element.description.slice(0, 80) + "..."
                    : element.description
                }
                imageUrl={element.urlToImage}
                newsUrl={element.url}
              />
            </div>
          ))}
        </div>

        <div className="container d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-warning"
            onClick={this.handleBack}
            disabled={page === 1}
          >
            &larr; Back
          </button>
          <button
            type="button"
            className="btn btn-warning"
            onClick={this.handleNext}
            disabled={page === totalPages}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;