import React, {useEffect, useState} from "react";
import {Observable, Subscription} from "rxjs";
export default function usePoller<T>(service: any, dataFn: ()=>Observable<T>,
                                     initialValue: T,
                                  pollingInterval?: number):[T, (data: T)=>any] {
    const [data, setData] = useState<T>(initialValue);
    useEffect(() => {
        let intervalId:any;
        let subscription: Subscription;
        function poller () {
            if (!subscription || subscription.closed) {
                getData();
            }
        }
        intervalId = setInterval(poller, pollingInterval || 1000)
        function getData() {
            subscription = dataFn.call(service)
                .subscribe(data => setData(data));
        }
        getData();

        return () => {
            if (subscription && !subscription.closed) {
                subscription.unsubscribe();
            }
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [dataFn, pollingInterval, service])
    return [data, setData];
}
