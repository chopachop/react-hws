import React, {Component} from "react";
import SearchForm from "../components/SearchForm/SearchForm";
import newsApi from '../services/news-api';


class ArticlesView extends Component {
  state ={
    articles: [],
    currentPage: 1,
    searchQuery: '',
    isLoading: false,
    error: null,
  };

    componentDidUpdate(prevProps, prevState) {
        if(prevState.searchQuery !== this.state.searchQuery) {
            this.fetchArticles();
        }
    }

    onChangeQuery = query => {
      this.setState({
          searchQuery: query,
          currentPage: 1,
          articles: [] ,
          error: null,
    });
    };

  fetchArticles = () => {
      const {currentPage, searchQuery} = this.state;
      const options = { searchQuery, currentPage };

      this.setState({isLoading: true});

      newsApi.fetchArticles(options).then(articles => {
          this.setState(prevState => ({
                  articles: [...prevState.articles , ...articles],
                  currentPage: prevState.currentPage + 1,
              }));
      })
          .catch(error => this.setState({error}))
          .finally(() => this.setState({isLoading: false}))
  };


  render() {
    const {articles, isLoading, error} = this.state;
    const shouldLoadMoreButton = articles.length > 0 && !isLoading;

    return (
        <div>
          <h1>Articles</h1>
            {error && <h1>Oh fuck...</h1>}

          <SearchForm onSubmit={this.onChangeQuery}/>
            {isLoading && <p>Loading...</p>}

          <ul>
            {articles.map(({title, url}) =>
                <li key={url}>
                  <a href={url}>{title}</a>
                </li>)}
          </ul>

            {isLoading && <h1>Loading...</h1>}

          {shouldLoadMoreButton &&(
              <button
                  type='button'
                  onClick={this.fetchArticles}
              >
                  Load More
              </button>
          )}
        </div>
    )
  }
}

export default ArticlesView;

