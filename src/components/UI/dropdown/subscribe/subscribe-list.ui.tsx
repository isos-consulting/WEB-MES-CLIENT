import React from 'react';
import ReactDOM from 'react-dom';

const SubscribeList = ({ setState }) => {
  const createSubscribeDropdown = button => {
    console.log(button);
    const dropdown =
      document.querySelector('.subscribe-menu-list') ??
      document.createElement('article');

    dropdown.className = 'subscribe-menu-list';

    document.querySelector('.subscribe-menu-list')
      ? null
      : document.body.appendChild(dropdown);

    ReactDOM.render(<SubscribeDropDown />, dropdown);
  };

  return (
    <>
      <button onClick={createSubscribeDropdown}>구독 목록</button>
    </>
  );
};

const SubscribeDropDown = () => {
  return (
    <>
      <div>1</div>
    </>
  );
};

export default SubscribeList;
