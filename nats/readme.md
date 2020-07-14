##### Keywords: 
  - Channel/Topic: TYPES of events that we will be listening to inside the services

*example*: If we make a new event, say ticket:updated, we will send that event using node-natstreaming library to the NAT Streaming server's "ticket:updated Channel".
Then NAT will publish that event to the other services(only the ones which are listening for that channel).

 - Subscription: The services which want to listen to the type of events need to subscribe to that Channel.

 - NAT Streaming Server State: NATS stores all the events in memory(default), flat files or in a MySQL/Postgres DB(separate).
