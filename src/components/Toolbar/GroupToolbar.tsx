import GroupButton from './GroupButton';
import UngroupButton from './UnGroupButton';

type AlignType = 'left' | 'center' | 'right';

function GroupToolbar() {
  return (
    <div className='flex items-center gap-2 p-2 bg-white'>
      <GroupButton />
      <UngroupButton />
      {/* TODO(@한현): 정렬 버튼 추가 */}
    </div>
  );
}

export default GroupToolbar;
