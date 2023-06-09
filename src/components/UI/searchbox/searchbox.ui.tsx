import React from 'react';
import Props from './searchbox.ui.type';
import { InputGroupbox } from '../input-groupbox/input-groupbox.ui';

/** 검색조건 박스 */
const Searchbox: React.FC<Props> = props => {
  const { searchItems } = props;

  if (!searchItems) return <></>;

  return (
    <InputGroupbox
      id={props.id}
      inputItems={searchItems}
      innerRef={props.innerRef}
      onSubmit={props.onSearch}
      title={props.title}
      buttonText="조회"
      type="search"
      boxShadow={props.boxShadow}
      validate={props.validate}
    />
  );
};

export default Searchbox;
