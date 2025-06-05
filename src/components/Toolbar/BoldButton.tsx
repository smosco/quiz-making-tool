import { Bold } from 'lucide-react';

function BoldButton() {
  const handleFontWeight = () => {};

  return (
    <button type='button' onClick={handleFontWeight}>
      <Bold size={32} />
    </button>
  );
}

export default BoldButton;
