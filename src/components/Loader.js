import React from 'react';
import PropTypes from 'prop-types';
import theme from '../theme';
import './Loader.css';

const styles = {
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

const Loader = (props) => {
  const style = props.color ? {
    backgroundColor: theme.accent
  } : {};

  return (<div style={styles.wrapper}>
    <div className={'spinner'}>
      <div className={'rect1'} style={style} />
      <div className={'rect2'} style={style} />
      <div className={'rect3'} style={style} />
      <div className={'rect4'} style={style} />
      <div className={'rect5'} style={style} />
    </div>
  </div>);
};

Loader.propTypes = {
  color: PropTypes.string
};

Loader.defaultProps = {
  color: null
};

export default Loader;
