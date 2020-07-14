The ts-node-dev library recently released a change that disables this restart behavior by default.  To enable it, you need to update the two scripts we added to the package.json file.  Update the two scripts to the following:
```
"scripts": {
  "publish": "ts-node-dev --rs --notify false src/publisher.ts",
  "listen": "ts-node-dev --rs --notify false src/listener.ts"
}
```
Just add in the --rs to each command.

#### In order to connect this test-nat project to running NAT pod: 
```
PS E:\Linux\TypeScriptApplication2> kubectl get pods
NAME                                 READY   STATUS    RESTARTS   AGE
auth-depl-c46dfc64b-rfn96            1/1     Running   0          42m
auth-mongo-depl-7677996995-wzl66     1/1     Running   0          42m
client-depl-79fffb557-pgn4c          1/1     Running   0          42m
nats-depl-564b696fcf-ff552           1/1     Running   0          42m
tickets-depl-7558cf84c4-4ntx5        1/1     Running   0          42m
tickets-mongo-depl-df8995469-466bl   1/1     Running   0          42m
PS E:\Linux\TypeScriptApplication2> kubectl port-forward nats-depl-564b696fcf-ff552 4222:4222
Forwarding from 127.0.0.1:4222 -> 4222
Forwarding from [::1]:4222 -> 4222
```
> npm run publish