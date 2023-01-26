import css from './Modal.module.css';
import PropTypes from 'prop-types';

export const Modal = ({ src, alt, handleClose }) => (
  <div className={css.Overlay} onClick={handleClose}>
    <div className={css.Modal}>
      <img src={src} alt={alt} />
    </div>
  </div>
);

Modal.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};
