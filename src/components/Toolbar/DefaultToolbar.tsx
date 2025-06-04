import ImageButton from './ImageButton';
import RectButton from './RectButton';
import SaveButton from './SaveButton';
import TextButton from './TextButton';

function DefaultToolbar() {
  return (
    <div className='flex items-center gap-2 p-2 bg-white'>
      <SaveButton />
      <TextButton />
      <RectButton />
      <ImageButton />
    </div>
  );
}

export default DefaultToolbar;
