import React, { useState } from "react";

import { Picker } from "emoji-mart";

const EmojiPicker = ({ onSelect }) => {
  const [showPicker, setShowPicker] = useState(false);

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleSelect = (emoji) => {
    onSelect(emoji.native);
    togglePicker();
  };

  return (
    <div>
      <button onClick={togglePicker}>Toggle Emoji Picker</button>
      {showPicker && <Picker onSelect={handleSelect} />}
    </div>
  );
};

export default EmojiPicker;
