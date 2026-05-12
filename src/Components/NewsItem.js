import React, { Component } from 'react'

export class NewsItem extends Component {
  render() {
    let { title, description, imageUrl, newsUrl, source, publishedAt, category } = this.props;
    const fallbackImage = "https://placehold.co/400x200/1a1a2e/ffffff?text=No+Image";
    
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
      <div className="news-card h-100">
        <div className="card h-100 border-0 shadow-sm">
          <div className="news-img-wrap">
            <img
              src={imageUrl || fallbackImage}
              className="card-img-top news-img"
              alt={title}
              onError={(e) => { e.target.src = fallbackImage; }}
            />
            {category && (
              <span className="category-badge">{category}</span>
            )}
          </div>
          <div className="card-body d-flex flex-column">
            {source && (
              <div className="news-source mb-1">
                <small className="text-primary fw-semibold">📰 {source}</small>
              </div>
            )}
            <h6 className="card-title news-title">{title}</h6>
            <p className="card-text news-desc text-muted small flex-grow-1">{description}</p>
            <div className="d-flex justify-content-between align-items-center mt-2">
              {publishedAt && (
                <small className="text-muted">📅 {formatDate(publishedAt)}</small>
              )}
              <a href={newsUrl} target="_blank" rel="noopener noreferrer"
                className="btn btn-sm btn-outline-dark ms-auto">
                Read More →
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default NewsItem
