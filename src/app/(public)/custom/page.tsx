import { CustomBraceletCreator } from "./custom-bracelet-creator";
import { Suspense } from 'react';
import { fetchCharms, fetchStrings } from './actions';

export default async function CustomPage() {
  const charms = await fetchCharms();
  const strings = await fetchStrings();

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <CustomBraceletCreator initialCharms={charms} initialStrings={strings} />
      </Suspense>
    </div>
  );
}