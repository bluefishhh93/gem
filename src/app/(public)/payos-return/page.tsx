

import { Suspense} from 'react';
import { LoadingFallback, PayosReturnContent} from './payos-return-content';


export default async function PayosReturnPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <PayosReturnContent />
        </Suspense>
    );
}



