export const encryptedString = () => {
  const crypto = window.crypto;
  const unit32Array = new Uint32Array(1);

  return crypto.getRandomValues(unit32Array)[0].toString(16);
};

export const randomNumber = () => {
  const crypto = window.crypto;
  const unit32Array = new Uint32Array(1);

  return crypto.getRandomValues(unit32Array)[0];
};
