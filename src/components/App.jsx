import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { fetchImages } from './api/fetchImages';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';

export class App extends Component {
  state = {
    images: [],
    isLoading: false,
    error: null,
    currentSearch: '',
    pageNr: 1,
    modalOpen: false,
    modalImg: '',
    modalAlt: '',
  };
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentSearch !== this.state.currentSearch ||
      prevState.pageNr !== this.state.pageNr
    ) {
      this.setState({ isLoading: true });
      fetchImages(this.state.currentSearch, this.state.pageNr)
        .then(data =>
          this.setState(prev => ({ images: [...prev.images, ...data] }))
        )
        .catch(error => {
          this.setState({ error: error.message });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    const { inputForSearch } = e.target.elements;
    if (inputForSearch.value.trim() === '') {
      return;
    }
    if (this.state.currentSearch !== inputForSearch.value) {
      this.setState({
        images: [],
        isLoading: false,
        currentSearch: inputForSearch.value,
        pageNr: 1,
      });
    }
  };

  handleClickMore = () => {
    this.setState(prev => ({
      pageNr: prev.pageNr + 1,
    }));
  };

  handleImageClick = e => {
    this.setState({
      modalOpen: true,
      modalAlt: e.target.alt,
      modalImg: e.target.name,
    });
  };

  handleModalClose = e => {
    if (e.target.tagName === 'IMG') {
      return;
    }
    this.setState({
      modalOpen: false,
      modalImg: '',
      modalAlt: '',
    });
  };

  handleKeyDown = e => {
    if (e.code === 'Escape') {
      this.setState({ modalOpen: false });
    }
  };

  async componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  render() {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridGap: '16px',
          paddingBottom: '24px',
        }}
      >
        <>
          <Searchbar onSubmit={this.handleSubmit} />
          <ImageGallery
            onImageClick={this.handleImageClick}
            images={this.state.images}
          />
          {this.state.error && <span>An error occurred. Please try again</span>}
          {this.state.isLoading && <Loader />}
          {this.state.images.length > 0 ? (
            <Button onClick={this.handleClickMore} />
          ) : null}
        </>

        {this.state.modalOpen ? (
          <Modal
            src={this.state.modalImg}
            alt={this.state.modalAlt}
            handleClose={this.handleModalClose}
          />
        ) : null}
      </div>
    );
  }
}
